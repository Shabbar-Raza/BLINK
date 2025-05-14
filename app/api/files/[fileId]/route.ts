import { NextResponse } from 'next/server';
import { MongoClient, GridFSBucket, ObjectId } from 'mongodb';
import { dbUtils } from '@/lib/db/mongodb';

export async function GET(
  request: Request,
  { params }: { params: { fileId: string } }
) {
  try {
    const fileId = new ObjectId(await Promise.resolve(params.fileId));
    const client = await dbUtils.getClient();
    const db = client.db();
    const bucket = new GridFSBucket(db);

    // Get file metadata
    const files = await bucket.find({ _id: fileId }).toArray();
    if (!files.length) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Get file data
    const chunks: Uint8Array[] = [];
    const downloadStream = bucket.openDownloadStream(fileId);

    try {
      const fileData = await new Promise<Buffer>((resolve, reject) => {
        downloadStream.on('data', (chunk) => chunks.push(new Uint8Array(chunk)));
        downloadStream.on('error', reject);
        downloadStream.on('end', () => {
          resolve(Buffer.concat(chunks));
        });
      });

      // Convert to base64 to avoid ByteString issues
      const base64Data = fileData.toString('base64');
      
      return new NextResponse(JSON.stringify({ 
        data: base64Data,
        contentType: files[0].contentType || 'application/octet-stream',
        filename: files[0].filename
      }), {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (streamError) {
      console.error('Error streaming file:', streamError);
      return NextResponse.json({ error: 'Error streaming file' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error retrieving file:', error);
    return NextResponse.json({ error: 'Failed to retrieve file' }, { status: 500 });
  }
} 
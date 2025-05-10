import { NextResponse } from 'next/server';
import { dbUtils } from '@/lib/db/mongodb';
import { GridFSBucket, ObjectId } from 'mongodb';

export async function GET(
  request: Request,
  { params }: { params: { fileId: string } }
) {
  try {
    const client = await dbUtils.getClient();
    const db = client.db();
    const bucket = new GridFSBucket(db);

    const fileId = new ObjectId(params.fileId);
    const file = await bucket.find({ _id: fileId }).next();

    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const downloadStream = bucket.openDownloadStream(fileId);
    const chunks: Uint8Array[] = [];

    await new Promise((resolve, reject) => {
      downloadStream.on('data', (chunk) => chunks.push(new Uint8Array(chunk)));
      downloadStream.on('error', reject);
      downloadStream.on('end', resolve);
    });

    const buffer = new Uint8Array(Buffer.concat(chunks));

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': file.contentType || 'application/octet-stream',
        'Content-Disposition': `inline; filename="${file.filename}"`,
      },
    });
  } catch (error) {
    console.error('Error serving file:', error);
    return NextResponse.json({ error: 'Failed to serve file' }, { status: 500 });
  }
} 
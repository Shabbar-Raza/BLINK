import { NextResponse } from 'next/server';
import { dbUtils } from '@/lib/db/mongodb';
import { cookies } from 'next/headers';
import { GridFSBucket, ObjectId } from 'mongodb';
import { extractTextFromDocument } from '@/lib/utils/documentParser';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const userEmail = cookieStore.get('userEmail')?.value;
    
    if (!userEmail) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { fileId } = await request.json();
    if (!fileId) {
      return NextResponse.json({ error: 'File ID is required' }, { status: 400 });
    }

    // Get MongoDB client and setup GridFS
    const client = await dbUtils.getClient();
    const db = client.db();
    const bucket = new GridFSBucket(db);

    // Find the file in GridFS
    const fileObjectId = new ObjectId(fileId);
    const file = await bucket.find({ _id: fileObjectId }).next();

    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Download the file content
    const chunks: Uint8Array[] = [];
    const downloadStream = bucket.openDownloadStream(fileObjectId);

    await new Promise((resolve, reject) => {
      downloadStream.on('data', (chunk) => chunks.push(new Uint8Array(chunk)));
      downloadStream.on('error', reject);
      downloadStream.on('end', resolve);
    });

    const buffer = Buffer.concat(chunks);
    
    // Extract text from the document
    const extractedText = await extractTextFromDocument(buffer, file.contentType || '');

    return NextResponse.json({ 
      success: true, 
      text: extractedText 
    });
  } catch (error) {
    console.error('Error extracting file content:', error);
    return NextResponse.json(
      { error: 'Failed to extract file content' }, 
      { status: 500 }
    );
  }
} 
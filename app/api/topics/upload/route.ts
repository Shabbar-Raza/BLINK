import { NextResponse } from 'next/server';
import { dbUtils } from '@/lib/db/mongodb';
import { cookies } from 'next/headers';
import { MongoClient, GridFSBucket } from 'mongodb';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const userEmail = cookieStore.get('userEmail')?.value;
    
    if (!userEmail) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const courseId = formData.get('courseId') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Get MongoDB client
    const client = await dbUtils.getClient();
    const db = client.db();
    const bucket = new GridFSBucket(db);

    // Create unique filename
    const timestamp = Date.now();
    const originalName = file.name;
    const fileName = `${timestamp}-${originalName}`;

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to GridFS
    const uploadStream = bucket.openUploadStream(fileName, {
      contentType: file.type,
    });

    // Write buffer to stream
    await new Promise((resolve, reject) => {
      uploadStream.write(buffer);
      uploadStream.end(() => resolve(uploadStream.id));
      uploadStream.on('error', reject);
    });

    // Create fileUrl that references the GridFS file
    const fileUrl = `/api/files/${uploadStream.id}`;

    // Create topic with file information
    const topicData = {
      title: originalName.replace(/\.[^/.]+$/, ""),
      fileType: originalName.split('.').pop(),
      fileUrl: `/api/files/${uploadStream.id.toString()}`,
      fileId: uploadStream.id.toString(),
      courseId,
      created_at: new Date()
    };
    console.log('Saving topic with data:', topicData);
    const result = await dbUtils.createTopic(courseId, topicData);

    if (!result) {
      throw new Error('Failed to create topic');
    }

    // Return the complete topic data
    return NextResponse.json({ 
      success: true, 
      topic: result
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
} 
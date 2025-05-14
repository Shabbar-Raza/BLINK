import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { dbUtils } from '@/lib/db/mongodb';
import { GridFSBucket } from 'mongodb';

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: { topicId: string } }
) {
  try {
    const cookieStore = await cookies();
    const userEmail = cookieStore.get('userEmail')?.value;
    
    if (!userEmail) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const topicId = await Promise.resolve(params.topicId);
    if (!topicId) {
      return NextResponse.json({ error: 'Topic ID is required' }, { status: 400 });
    }

    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: 'Invalid file format' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Please upload a PDF, DOCX, or TXT file' }, { status: 400 });
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size must be less than 10MB' }, { status: 400 });
    }

    // Convert Blob to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log('Processing file:', {
      type: file.type,
      size: file.size,
      topicId: topicId
    });

    // Send file to Python processing server
    const processingFormData = new FormData();
    processingFormData.append('file', file);
    processingFormData.append('fileType', file.type);

    const processingResponse = await fetch('http://localhost:8000', {
      method: 'POST',
      body: processingFormData
    });

    if (!processingResponse.ok) {
      const error = await processingResponse.json();
      throw new Error(error.error || 'Failed to process file');
    }

    const { text: content } = await processingResponse.json();
    console.log('Extracted content length:', content?.length || 0);
      
    if (!content || content.length === 0) {
      throw new Error('No text could be extracted from the document');
    }

    // Get MongoDB client
    const client = await dbUtils.getClient();
    const db = client.db();
    const bucket = new GridFSBucket(db);

    // Create unique filename
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name || 'document'}`;

    // Upload to GridFS
    const uploadStream = bucket.openUploadStream(fileName, {
      contentType: file.type,
    });

    // Write buffer to GridFS
    await new Promise<void>((resolve, reject) => {
      uploadStream.on('error', reject);
      uploadStream.on('finish', resolve);
      uploadStream.write(buffer);
      uploadStream.end();
    });

    // Update topic with file info and content
    const fileId = uploadStream.id;
    const fileUrl = `/api/files/${fileId}`;

    const updateData = {
      fileId: fileId.toString(),
      fileUrl,
      fileType: file.type,
      content: content,
      chatHistory: [{
        role: 'system',
        content: 'Document uploaded and processed. I am ready to help you with any questions about the content.',
        timestamp: new Date()
      }]
    };

    console.log('Updating topic with data:', {
      ...updateData,
      content: content.substring(0, 100) + '...' // Log just the first 100 chars of content
    });

    await dbUtils.updateTopic(topicId, updateData);

    const updatedTopic = await dbUtils.getTopicById(topicId);
    return NextResponse.json({ success: true, topic: updatedTopic });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload file' },
      { status: 500 }
    );
  }
} 
import { NextResponse } from 'next/server';
import { dbUtils } from '@/lib/db/mongodb';
import { cookies } from 'next/headers';

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

    // Create topic from file
    const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
    const fileType = file.name.split('.').pop();

    const result = await dbUtils.createTopic(courseId, {
      title: fileName,
      fileType: fileType,
      fileUrl: '', // You'll need to implement file storage
      created_at: new Date()
    });

    return NextResponse.json({ success: true, topic: result });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
} 
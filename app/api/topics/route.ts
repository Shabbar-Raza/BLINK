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

    const { courseId, title, subtopics } = await request.json();
    
    const result = await dbUtils.createTopic(courseId, {
      title,
      subtopics: subtopics || [],
      created_at: new Date()
    });

    return NextResponse.json({ success: true, topic: result });
  } catch (error) {
    console.error('Error creating topic:', error);
    return NextResponse.json({ error: 'Failed to create topic' }, { status: 500 });
  }
}
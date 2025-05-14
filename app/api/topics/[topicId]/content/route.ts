import { NextResponse } from 'next/server';
import { dbUtils } from '@/lib/db/mongodb';

export async function PUT(
  request: Request,
  { params }: { params: { topicId: string } }
) {
  try {
    const topicId = params.topicId;
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const result = await dbUtils.updateTopicContent(topicId, content);
    
    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating topic content:', error);
    return NextResponse.json(
      { error: 'Failed to update topic content' },
      { status: 500 }
    );
  }
} 
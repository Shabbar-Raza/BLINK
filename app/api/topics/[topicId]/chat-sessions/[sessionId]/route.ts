import { NextResponse } from 'next/server';
import { dbUtils } from '@/lib/db/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  request: Request,
  { params }: { params: { topicId: string; sessionId: string } }
) {
  try {
    const { topicId, sessionId } = params;
    
    const topic = await dbUtils.getTopicById(topicId);
    if (!topic) {
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
    }

    const session = topic.chatSessions?.find((s: { id: string }) => s.id === sessionId);
    if (!session) {
      return NextResponse.json({ error: 'Chat session not found' }, { status: 404 });
    }

    return NextResponse.json({ session });
  } catch (error) {
    console.error('Error fetching chat session:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat session' },
      { status: 500 }
    );
  }
} 
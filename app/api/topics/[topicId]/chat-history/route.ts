import { NextResponse } from 'next/server';
import { dbUtils } from '@/lib/db/mongodb';

export async function GET(
  request: Request,
  { params }: { params: { topicId: string } }
) {
  try {
    const topicId = await Promise.resolve(params.topicId);
    const { chatHistory, extractedText } = await dbUtils.getChatHistory(topicId);
    
    return NextResponse.json({ chatHistory, extractedText });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat history' },
      { status: 500 }
    );
  }
} 
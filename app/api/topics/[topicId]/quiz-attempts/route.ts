import { NextResponse } from 'next/server';
import { dbUtils } from '@/lib/db/mongodb';
import { ObjectId } from 'mongodb';
import { QuizAttempt } from '@/app/types';

export async function POST(
  request: Request,
  { params }: { params: { topicId: string } }
) {
  try {
    const topicId = params.topicId;
    const quizData = await request.json();
    
    const quizAttempt: QuizAttempt = {
      id: new ObjectId().toString(),
      topicId,
      timestamp: new Date(),
      ...quizData
    };

    const result = await dbUtils.saveQuizAttempt(topicId, quizAttempt);
    return NextResponse.json({ success: true, attempt: result });
  } catch (error) {
    console.error('Error saving quiz attempt:', error);
    return NextResponse.json(
      { error: 'Failed to save quiz attempt' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { topicId: string } }
) {
  try {
    const topicId = params.topicId;
    const attempts = await dbUtils.getQuizAttempts(topicId);
    return NextResponse.json({ attempts });
  } catch (error) {
    console.error('Error fetching quiz attempts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz attempts' },
      { status: 500 }
    );
  }
} 
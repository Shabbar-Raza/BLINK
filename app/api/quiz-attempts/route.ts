import { NextResponse } from 'next/server';
import { dbUtils } from '@/lib/db/mongodb';
import { cookies } from 'next/headers';
import { QuizAttempt } from '@/app/types';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userEmail = cookieStore.get('userEmail')?.value;
    
    if (!userEmail) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get all topics for the user
    const topics = await dbUtils.getAllTopics();
    
    // Collect all quiz attempts from all topics
    const allAttempts = [];
    for (const topic of topics) {
      if (topic.quizAttempts && topic.quizAttempts.length > 0) {
        allAttempts.push(...topic.quizAttempts.map((attempt: QuizAttempt) => ({
          ...attempt,
          topicTitle: topic.title
        })));
      }
    }

    // Sort attempts by timestamp, most recent first
    const sortedAttempts = allAttempts.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return NextResponse.json({ attempts: sortedAttempts });
  } catch (error) {
    console.error('Error fetching quiz attempts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz attempts' },
      { status: 500 }
    );
  }
} 
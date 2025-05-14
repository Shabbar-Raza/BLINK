import { NextResponse } from 'next/server';
import { dbUtils } from '@/lib/db/mongodb';
import { cookies } from 'next/headers';
import { QuizAttempt, Topic } from '@/app/types';
import { Document } from 'mongodb';

interface TopicWithAttempts extends Topic {
  quizAttempts?: QuizAttempt[];
}

// Helper function to convert MongoDB document to TopicWithAttempts
function convertToTopicWithAttempts(doc: Document): TopicWithAttempts {
  return {
    _id: doc._id.toString(),
    title: doc.title,
    courseId: doc.courseId,
    fileUrl: doc.fileUrl,
    fileType: doc.fileType,
    content: doc.content,
    generatedNotes: doc.generatedNotes,
    savedNotes: doc.savedNotes,
    quizAttempts: doc.quizAttempts,
    created_at: doc.created_at
  };
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userEmail = cookieStore.get('userEmail')?.value;
    
    if (!userEmail) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get all topics and courses for the user
    const rawTopics = await dbUtils.getAllTopics();
    const topics = rawTopics.map(convertToTopicWithAttempts);
    const courses = await dbUtils.getUserCourses(userEmail);

    // Calculate total files uploaded (from topics)
    const totalFiles = topics.reduce((acc, topic) => 
      acc + (topic.fileUrl ? 1 : 0), 0);

    // Calculate study streak (placeholder - you'll need to implement actual streak logic)
    const studyStreak = 0;

    // Get all quiz attempts and calculate statistics
    const allAttempts: (QuizAttempt & { topicTitle: string })[] = [];
    let totalScore = 0;
    let bestScore = 0;

    for (const topic of topics) {
      if (topic.quizAttempts && topic.quizAttempts.length > 0) {
        allAttempts.push(...topic.quizAttempts.map((attempt: QuizAttempt) => ({
          ...attempt,
          topicTitle: topic.title
        })));

        // Update statistics
        topic.quizAttempts.forEach((attempt: QuizAttempt) => {
          totalScore += attempt.score || 0;
          bestScore = Math.max(bestScore, attempt.score || 0);
        });
      }
    }

    // Sort attempts by timestamp, most recent first
    const sortedAttempts = allAttempts.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Calculate average score
    const averageScore = allAttempts.length > 0 
      ? totalScore / allAttempts.length 
      : 0;

    // Get recent activity (last 7 days)
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const recentActivity = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const attemptsOnDay = sortedAttempts.filter(attempt => {
        const attemptDate = new Date(attempt.timestamp);
        return attemptDate.toDateString() === date.toDateString();
      });
      
      return {
        date: date.toISOString().split('T')[0],
        value: attemptsOnDay.length
      };
    }).reverse();

    return NextResponse.json({
      statistics: {
        totalCourses: courses.length,
        totalFiles,
        totalTopics: topics.length,
        studyStreak,
        averageScore,
        bestScore,
        totalAttempts: allAttempts.length
      },
      recentActivity,
      recentAttempts: sortedAttempts.slice(0, 5)
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
} 
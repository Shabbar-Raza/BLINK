import { NextResponse } from 'next/server';
import { dbUtils } from '@/lib/db/mongodb';
import { cookies } from 'next/headers';

// Add these export configurations
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getUserId() {
  const cookieStore = await cookies();
  const userEmail = cookieStore.get('userEmail')?.value;
  
  if (!userEmail) {
    throw new Error('Not authenticated');
  }

  const user = await dbUtils.getUserByEmail(userEmail);
  if (!user?._id) {
    throw new Error('User not found');
  }

  return user._id.toString(); // Convert ObjectId to string
}

export async function GET(request: Request) {
  try {
    const userId = await getUserId();
    const courses = await dbUtils.getUserCourses(userId);
    console.log('Fetched courses:', courses); // Debug log
    return NextResponse.json({ courses });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getUserId();
    const body = await request.json();
    console.log('Creating course with data:', body); // Debug log

    const result = await dbUtils.createCourse(userId, {
      title: body.title,
      icon: body.icon || '📚',
      bgColor: body.bgColor || 'bg-emerald-500'
    });

    console.log('Course created:', result); // Debug log
    return NextResponse.json({ success: true, course: result });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json({ error: 'Failed to create course' }, { status: 401 });
  }
} 
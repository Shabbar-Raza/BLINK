import { NextResponse } from 'next/server';
import { dbUtils } from '@/lib/db/mongodb';

export async function PUT(
  request: Request,
  { params }: { params: { topicId: string } }
) {
  try {
    const { newTitle } = await request.json();
    
    if (!newTitle?.trim()) {
      return NextResponse.json({ error: 'New title is required' }, { status: 400 });
    }

    const result = await dbUtils.renameTopic(params.topicId, newTitle.trim());
    
    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error renaming topic:', error);
    return NextResponse.json({ error: 'Failed to rename topic' }, { status: 500 });
  }
} 
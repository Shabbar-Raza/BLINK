import { NextResponse } from 'next/server';
import { dbUtils } from '@/lib/db/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(
  request: Request,
  { params }: { params: { topicId: string } }
) {
  try {
    const topicId = params.topicId;
    const { notes } = await request.json();

    if (!notes) {
      return NextResponse.json({ error: 'Notes content is required' }, { status: 400 });
    }

    const savedNote = {
      id: new ObjectId().toString(),
      content: notes,
      timestamp: new Date()
    };

    const result = await dbUtils.saveGeneratedNotes(topicId, notes);
    
    if (!result.modifiedCount) {
      return NextResponse.json({ error: 'Failed to save notes' }, { status: 500 });
    }

    return NextResponse.json({ savedNote });
  } catch (error) {
    console.error('Error saving notes:', error);
    return NextResponse.json(
      { error: 'Failed to save notes' },
      { status: 500 }
    );
  }
} 
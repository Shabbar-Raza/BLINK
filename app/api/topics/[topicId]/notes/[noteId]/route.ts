import { NextResponse } from 'next/server';
import { dbUtils } from '@/lib/db/mongodb';

export async function DELETE(
  request: Request,
  { params }: { params: { topicId: string; noteId: string } }
) {
  try {
    const { topicId, noteId } = params;

    if (!topicId || !noteId) {
      return NextResponse.json(
        { error: 'Topic ID and Note ID are required' },
        { status: 400 }
      );
    }

    const result = await dbUtils.deleteNote(topicId, noteId);
    
    if (!result.modifiedCount) {
      return NextResponse.json(
        { error: 'Note not found or already deleted' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting note:', error);
    return NextResponse.json(
      { error: 'Failed to delete note' },
      { status: 500 }
    );
  }
} 
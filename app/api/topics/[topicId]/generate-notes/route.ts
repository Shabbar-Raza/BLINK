import { NextResponse } from 'next/server';
import { dbUtils } from '@/lib/db/mongodb';
import OpenAI from 'openai';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(
  request: Request,
  { params }: { params: { topicId: string } }
) {
  try {
    const topicId = await Promise.resolve(params.topicId);
    const { documentText } = await request.json();

    if (!documentText) {
      return NextResponse.json({ error: 'Document text is required' }, { status: 400 });
    }

    // Generate notes using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that creates well-structured study notes from given text. Format the notes using markdown with proper headings, bullet points, and emphasis where appropriate."
        },
        {
          role: "user",
          content: `Please create comprehensive study notes from the following text:\n\n${documentText}`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const notes = completion.choices[0].message.content || '';

    // Update the topic with the generated notes
    await dbUtils.updateTopicNotes(topicId, notes);

    return NextResponse.json({ notes });
  } catch (error) {
    console.error('Error generating notes:', error);
    return NextResponse.json(
      { error: 'Failed to generate notes' },
      { status: 500 }
    );
  }
} 
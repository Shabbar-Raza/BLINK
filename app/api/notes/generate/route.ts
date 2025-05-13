import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { documentText } = await req.json();
    console.log('Received document text:', documentText?.slice(0, 100)); // Log first 100 chars

    if (!documentText) {
      console.log('No document text provided');
      return NextResponse.json(
        { error: 'Document text is required' },
        { status: 400 }
      );
    }

    const systemPrompt = `You are a professional note-taking assistant. Create clear, concise, and well-structured notes from the provided document. 
    The notes should:
    1. Include main topics and key points
    2. Be organized with headings and subheadings
    3. Use bullet points for better readability
    4. Highlight important concepts`;

    console.log('Sending request to OpenAI...');
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Document content:\n${documentText.slice(0, 100000)}` }
      ],
    });

    const generatedNotes = response.choices[0].message.content;
    console.log('Generated notes:', generatedNotes?.slice(0, 100)); // Log first 100 chars

    return NextResponse.json({ notes: generatedNotes });
  } catch (error) {
    console.error('Error generating notes:', error);
    return NextResponse.json(
      { error: 'Failed to generate notes' },
      { status: 500 }
    );
  }
} 
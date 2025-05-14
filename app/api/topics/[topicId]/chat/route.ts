import { NextResponse } from 'next/server';
import { dbUtils } from '@/lib/db/mongodb';
import OpenAI from 'openai';
import { Message } from '@/app/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(
  request: Request,
  { params }: { params: { topicId: string } }
) {
  try {
    const topicId = await Promise.resolve(params.topicId);
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const topic = await dbUtils.getTopicById(topicId);
    if (!topic) {
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
    }

    if (!topic.content || topic.content === 'No content') {
      return NextResponse.json({ error: 'No document content available' }, { status: 400 });
    }

    const systemPrompt = `You are an AI assistant focused on analyzing and answering questions about the provided document.
    Important rules:
    1. Only answer questions directly related to this document's content
    2. If a question is not about the document, politely decline to answer
    3. Do not provide information from outside the document
    4. Base all responses strictly on the document's content
    5. If information isn't in the document, clearly state that`;

    const chatHistory = topic.chatHistory || [];
    const conversationContext = chatHistory
      .map((msg: Message) => `${msg.role}: ${msg.content}`)
      .join('\n');

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Document content:\n${topic.content.slice(0, 100000)}` },
        { role: "user", content: `Previous conversation:\n${conversationContext}` },
        { role: "user", content: `Question: ${message}` }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const aiResponse = response.choices[0].message.content;

    // Update chat history
    const updatedChatHistory = [
      ...chatHistory,
      { role: 'user', content: message, timestamp: new Date() },
      { role: 'assistant', content: aiResponse, timestamp: new Date() }
    ];

    await dbUtils.updateTopicChatHistory(topicId, updatedChatHistory);

    return NextResponse.json({ chatHistory: updatedChatHistory });
  } catch (error) {
    console.error('Error in chat:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
} 
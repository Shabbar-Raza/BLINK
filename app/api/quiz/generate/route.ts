import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { QuizQuestion } from '@/app/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `Generate a quiz with 10 multiple choice questions based on the provided content.
Format your response as a JSON object with a "questions" array. Each question should have:
- "question": the question text
- "options": array of 4 strings containing possible answers
- "correctAnswer": number (0-3) indicating the index of the correct option

Example format:
{
  "questions": [
    {
      "question": "What is...",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 2
    }
  ]
}`;

export async function POST(request: Request) {
  try {
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT
        },
        {
          role: "user",
          content: `Generate a quiz based on this content: ${content}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('Failed to generate quiz');
    }

    try {
      const parsedResponse = JSON.parse(response);
      if (!parsedResponse.questions || !Array.isArray(parsedResponse.questions)) {
        throw new Error('Invalid response format');
      }

      const questions: QuizQuestion[] = parsedResponse.questions.map((q: any, index: number) => {
        if (!q.question || !Array.isArray(q.options) || q.options.length !== 4 || typeof q.correctAnswer !== 'number') {
          throw new Error('Invalid question format');
        }
        return {
          id: `q${index + 1}`,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer
        };
      });

      return NextResponse.json({ questions });
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      throw new Error('Failed to parse quiz questions');
    }
  } catch (error) {
    console.error('Error generating quiz:', error);
    return NextResponse.json(
      { error: 'Failed to generate quiz' },
      { status: 500 }
    );
  }
} 
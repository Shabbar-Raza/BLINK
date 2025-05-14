import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function isQueryRelevantToContext(query: string, context: string): Promise<boolean> {
  // List of meta-questions that should be allowed
  const metaQuestions = [
    'what is this document about',
    'what does this document contain',
    'summarize this document',
    'what is the main topic',
    'what is the subject',
    'give me an overview',
    'tell me about the document',
    'what does this document discuss',
    'what is this text about',
    'what is the content about'
  ];

  // Check if the query is a meta-question about the document
  const normalizedQuery = query.toLowerCase().trim();
  if (metaQuestions.some(q => normalizedQuery.includes(q))) {
    return true;
  }

  try {
    const relevanceCheck = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a content relevance checker. Your task is to determine if a query is directly related to the given context.
          
          Rules:
          1. Respond with "true" if the query can be answered using information from the context
          2. Respond with "false" if the query requires information outside the context
          3. Respond with only "true" or "false", no other text
          4. Mathematical questions, general knowledge questions, or questions unrelated to the context should return "false"
          5. Questions about the document's content, even if broad, should return "true"
          
          Examples:
          - "What is 2+2?" -> "false"
          - "Who is the president?" -> "false"
          - "What's the weather?" -> "false"
          - "Tell me everything in the document" -> "true"
          - "What does this text discuss?" -> "true"`
        },
        {
          role: 'user',
          content: `Context: ${context}\n\nQuery: ${query}\n\nIs this query directly answerable using only the information in the context?`
        }
      ],
      temperature: 0,
      max_tokens: 10
    });

    const response = relevanceCheck.choices[0]?.message?.content?.toLowerCase().trim();
    return response === 'true';
  } catch (error) {
    console.error('Error checking relevance:', error);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const { query, context, history } = await request.json();

    // Check if query is relevant to the context
    const isRelevant = await isQueryRelevantToContext(query, context);

    if (!isRelevant) {
      return NextResponse.json({
        answer: "I can only discuss information from the provided document. Your question appears to be about something not covered in the document. Please ask questions related to the document's content."
      });
    }

    // Prepare conversation history
    const messages = [
      {
        role: 'system',
        content: `You are a document-specific AI assistant. Your knowledge is strictly limited to the content provided in the context below.
        
        IMPORTANT RULES:
        1. ONLY answer questions that can be directly answered using the provided context
        2. ONLY use information explicitly stated in the context
        3. DO NOT use any external knowledge or make assumptions
        4. For general questions about the document (like "what is this about?"), provide a focused summary of the main topics
        5. Keep responses focused and relevant to the document content
        6. If asked about topics not in the document, explain that you can only discuss what's in the document
        
        Context:
        ${context}`
      },
      ...history.map((msg: { role: string; content: string }) => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: 'user',
        content: query
      }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      temperature: 0.3,
      max_tokens: 500
    });

    const answer = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    return NextResponse.json({ answer });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
} 
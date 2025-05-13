import { NextResponse } from 'next/server';
import { dbUtils } from '@/lib/db/mongodb';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GridFSBucket, ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

// Initialize Gemini
const genAI = new GoogleGenerativeAI('AIzaSyAr7VGDkvs_m_94Ry1406NV5KS2j_tJzTA');

async function generateNotes(content: string) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `
      Create detailed, well-structured study notes from the following content. 
      Format the response in HTML with the following structure:
      
      1. Use <h2> for main topics
      2. Use <h3> for subtopics
      3. Use <ul> and <li> for bullet points
      4. Use <p> for paragraphs
      5. Use <strong> for important terms
      6. Use <em> for emphasis
      7. Use <div class="note-box"> for important notes or tips
      8. Use <div class="key-concept"> for key concepts
      
      Include:
      - Main topics and subtopics
      - Key concepts and definitions
      - Important points and examples
      - Summary of main ideas
      - Any relevant formulas or equations
      
      Make the notes visually appealing and easy to read.
      Content: ${content}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating notes:', error);
    return null;
  }
}

export async function GET(
  request: Request,
  context: { params: { topicId: string } }
) {
  try {
    const topicId = context.params.topicId;
    if (!topicId) {
      return NextResponse.json({ error: 'Topic ID is required' }, { status: 400 });
    }

    const topic = await dbUtils.getTopicById(topicId);
    if (!topic) {
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
    }

    // Log the topic data to debug
    console.log('Retrieved topic:', topic);

    // If notes haven't been generated yet and we have content
    if (!topic.generatedNotes && topic.content) {
      const notes = await generateNotes(topic.content);
      if (notes) {
        await dbUtils.updateTopicNotes(topicId, notes);
        topic.generatedNotes = notes;
      }
    }

    return NextResponse.json({ topic });
  } catch (error) {
    console.error('Error fetching topic:', error);
    return NextResponse.json({ error: 'Failed to fetch topic' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: { topicId: string } }
) {
  try {
    const topicId = context.params.topicId;
    await dbUtils.deleteTopic(topicId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting topic:', error);
    return NextResponse.json({ error: 'Failed to delete topic' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { topicId: string } }
) {
  try {
    const { generatedNotes } = await req.json();
    console.log('Updating topic with notes:', generatedNotes?.slice(0, 100));

    // Here you would typically update your database
    // For now, we'll just return a success response
    return NextResponse.json({ 
      success: true,
      topic: {
        _id: params.topicId,
        generatedNotes
      }
    });
  } catch (error) {
    console.error('Error updating topic:', error);
    return NextResponse.json(
      { error: 'Failed to update topic' },
      { status: 500 }
    );
  }
} 
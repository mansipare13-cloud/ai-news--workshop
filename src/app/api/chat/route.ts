import { NextResponse } from 'next/server';
import { setupDatabase } from '@/lib/database-setup';
import { generateChatbotResponse } from '@/lib/gemini';
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
  try {
    const { question, articleId, sessionId } = await request.json();

    if (!question || !articleId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Question and articleId are required'
        },
        { status: 400 }
      );
    }

    const { db } = await setupDatabase();

    // Fetch the article to get its content
    const article = await db.collection('articles').findOne({ 
      _id: new ObjectId(articleId) 
    });

    if (!article) {
      return NextResponse.json(
        {
          success: false,
          message: 'Article not found'
        },
        { status: 404 }
      );
    }

    // Generate AI response using Gemini
    const aiResponse = await generateChatbotResponse(
      question,
      `${article.title}\n\n${article.detailedSummary}\n\n${article.whyItMatters}`,
      article.title
    );

    // Store the chat message in the database
    const currentSessionId = sessionId || `session_${Date.now()}`;
    const newMessages = [
      {
        text: question,
        isUser: true,
        timestamp: new Date()
      },
      {
        text: aiResponse,
        isUser: false,
        timestamp: new Date()
      }
    ];

    // Insert or update chat session
    try {
      await db.collection('chats').updateOne(
        { sessionId: currentSessionId, articleId: articleId },
        { 
          $set: {
            articleTitle: article.title,
            updatedAt: new Date()
          },
          $push: {
            messages: {
              $each: newMessages
            }
          },
          $setOnInsert: {
            sessionId: currentSessionId,
            articleId: articleId,
            createdAt: new Date()
          }
        },
        { upsert: true }
      );
    } catch (dbError) {
      console.error('Database error:', dbError);
      // If database insert fails, still return the AI response
      console.log('Continuing without database storage...');
    }

    return NextResponse.json({
      success: true,
      data: {
        response: aiResponse,
        sessionId: currentSessionId
      }
    });

  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to process chat message'
      },
      { status: 500 }
    );
  }
}

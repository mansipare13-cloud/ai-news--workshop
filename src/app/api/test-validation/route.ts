import { NextResponse } from 'next/server';
import { setupDatabase } from '@/lib/database-setup';
import { ObjectId } from 'mongodb';

export async function POST() {
  try {
    const { db } = await setupDatabase();
    const results = {
      articles: { valid: false, invalid: false, errors: [] },
      chats: { valid: false, invalid: false, errors: [] }
    };

    // Test Articles Collection
    console.log('Testing articles collection validation...');

    // Valid article data
    const validArticle = {
      title: 'OpenAI Unveils GPT-5 with Revolutionary Reasoning Capabilities',
      coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
      publisherName: 'TechCrunch',
      publisherLogo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop',
      authorName: 'Sarah Chen',
      datePosted: new Date('2024-01-15T10:30:00Z'),
      quickSummary: 'OpenAI announces GPT-5 with advanced reasoning abilities, promising to revolutionize AI applications across industries.',
      detailedSummary: 'OpenAI has officially unveiled GPT-5, their most advanced language model to date, featuring unprecedented reasoning capabilities that allow it to solve complex problems across multiple domains. The new model demonstrates significant improvements in logical reasoning, mathematical problem-solving, and creative thinking compared to its predecessors.',
      whyItMatters: 'This breakthrough represents a quantum leap in AI capabilities, moving us closer to artificial general intelligence. For AI enthusiasts and learners, GPT-5\'s reasoning abilities open up new possibilities for human-AI collaboration.',
      sourceUrl: 'https://techcrunch.com/2024/01/15/openai-gpt-5-reasoning',
      category: 'AI',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Invalid article data (missing required fields)
    const invalidArticle = {
      title: 'Test Article',
      // Missing required fields: coverImage, publisherName, etc.
      category: 'InvalidCategory', // Invalid category
      createdAt: new Date()
    };

    // Test valid article insertion
    try {
      await db.collection('articles').insertOne(validArticle);
      results.articles.valid = true;
      console.log('✅ Valid article inserted successfully');
    } catch (error) {
      results.articles.errors.push(`Valid article failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Test invalid article insertion
    try {
      await db.collection('articles').insertOne(invalidArticle);
      results.articles.errors.push('Invalid article was inserted (validation failed)');
    } catch (error) {
      results.articles.invalid = true;
      console.log('✅ Invalid article correctly rejected:', error instanceof Error ? error.message : 'Unknown error');
    }

    // Test Chats Collection
    console.log('Testing chats collection validation...');

    // Valid chat data
    const validChat = {
      sessionId: 'session_12345_test',
      articleId: new ObjectId(),
      articleTitle: 'OpenAI Unveils GPT-5 with Revolutionary Reasoning Capabilities',
      messages: [
        {
          text: 'Hello, can you tell me about this article?',
          isUser: true,
          timestamp: new Date()
        },
        {
          text: 'I\'d be happy to help explain this article about GPT-5.',
          isUser: false,
          timestamp: new Date()
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Invalid chat data (missing required fields and invalid structure)
    const invalidChat = {
      sessionId: 'short', // Too short
      articleId: 'invalid-id', // Not ObjectId
      messages: [
        {
          text: 'Test message',
          // Missing isUser and timestamp
        }
      ],
      createdAt: new Date()
      // Missing updatedAt
    };

    // Test valid chat insertion
    try {
      await db.collection('chats').insertOne(validChat);
      results.chats.valid = true;
      console.log('✅ Valid chat inserted successfully');
    } catch (error) {
      results.chats.errors.push(`Valid chat failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Test invalid chat insertion
    try {
      await db.collection('chats').insertOne(invalidChat);
      results.chats.errors.push('Invalid chat was inserted (validation failed)');
    } catch (error) {
      results.chats.invalid = true;
      console.log('✅ Invalid chat correctly rejected:', error instanceof Error ? error.message : 'Unknown error');
    }

    return NextResponse.json({
      success: true,
      message: 'Validation testing completed',
      results,
      summary: {
        articlesValidation: results.articles.valid && results.articles.invalid ? 'PASS' : 'FAIL',
        chatsValidation: results.chats.valid && results.chats.invalid ? 'PASS' : 'FAIL',
        overallStatus: (results.articles.valid && results.articles.invalid && 
                      results.chats.valid && results.chats.invalid) ? 'PASS' : 'FAIL'
      }
    });

  } catch (error) {
    console.error('Validation testing error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to test validation rules'
      },
      { status: 500 }
    );
  }
}

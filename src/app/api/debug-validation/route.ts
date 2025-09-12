import { NextResponse } from 'next/server';
import { setupDatabase } from '@/lib/database-setup';
import { ObjectId } from 'mongodb';

export async function POST() {
  try {
    const { db } = await setupDatabase();
    
    // Test with minimal valid data
    const minimalArticle = {
      title: 'Test Article',
      coverImage: 'https://example.com/image.jpg',
      publisherName: 'Test Publisher',
      publisherLogo: 'https://example.com/logo.jpg',
      authorName: 'Test Author',
      datePosted: new Date(),
      quickSummary: 'This is a test summary that meets the minimum length requirement.',
      detailedSummary: 'This is a detailed summary that meets the minimum length requirement and provides more comprehensive information about the article content.',
      whyItMatters: 'This section explains why this article matters and provides context for AI enthusiasts and learners.',
      sourceUrl: 'https://example.com/article',
      category: 'AI',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('Testing minimal article insertion...');
    console.log('Article data:', JSON.stringify(minimalArticle, null, 2));

    try {
      const result = await db.collection('articles').insertOne(minimalArticle);
      console.log('✅ Minimal article inserted successfully:', result.insertedId);
      
      return NextResponse.json({
        success: true,
        message: 'Minimal article inserted successfully',
        insertedId: result.insertedId
      });
    } catch (error) {
      console.error('❌ Minimal article insertion failed:', error);
      
      // Try to get more detailed error information
      const errorDetails = {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : 'Unknown error',
        code: (error as any)?.code || 'Unknown',
        codeName: (error as any)?.codeName || 'Unknown'
      };
      
      return NextResponse.json({
        success: false,
        message: 'Minimal article insertion failed',
        error: errorDetails,
        articleData: minimalArticle
      });
    }

  } catch (error) {
    console.error('Debug validation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to debug validation'
      },
      { status: 500 }
    );
  }
}

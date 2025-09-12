import { NextResponse } from 'next/server';
import { createAllCollections } from '@/lib/database-setup';

export async function POST() {
  try {
    console.log('Setting up database collections...');
    
    await createAllCollections();
    
    return NextResponse.json({
      success: true,
      message: 'Database collections created successfully with native validation',
      collections: [
        {
          name: 'articles',
          validation: 'Strict validation enabled',
          fields: [
            'title', 'coverImage', 'publisherName', 'publisherLogo', 
            'authorName', 'datePosted', 'quickSummary', 'detailedSummary', 
            'whyItMatters', 'sourceUrl', 'category', 'createdAt', 'updatedAt'
          ]
        },
        {
          name: 'chats',
          validation: 'Strict validation enabled',
          fields: [
            'sessionId', 'articleId', 'articleTitle', 'messages', 
            'createdAt', 'updatedAt'
          ]
        }
      ]
    });
  } catch (error) {
    console.error('Database setup error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to create database collections'
      },
      { status: 500 }
    );
  }
}

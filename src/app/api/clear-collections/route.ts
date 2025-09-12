import { NextResponse } from 'next/server';
import { setupDatabase } from '@/lib/database-setup';

export async function POST() {
  try {
    const { db } = await setupDatabase();
    
    // Clear both collections
    await db.collection('articles').deleteMany({});
    await db.collection('chats').deleteMany({});
    
    // Get final counts
    const articlesCount = await db.collection('articles').countDocuments();
    const chatsCount = await db.collection('chats').countDocuments();
    
    return NextResponse.json({
      success: true,
      message: 'Collections cleared successfully',
      counts: {
        articles: articlesCount,
        chats: chatsCount
      }
    });

  } catch (error) {
    console.error('Clear collections error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to clear collections'
      },
      { status: 500 }
    );
  }
}

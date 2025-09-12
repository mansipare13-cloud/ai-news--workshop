import { NextResponse } from 'next/server';
import { setupDatabase } from '@/lib/database-setup';
import { ObjectId } from 'mongodb';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    // Await the params to handle Next.js 15 async dynamic routes
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: 'Article ID is required'
        },
        { status: 400 }
      );
    }

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid article ID format'
        },
        { status: 400 }
      );
    }

    const { db } = await setupDatabase();
    
    // Fetch the specific article
    const article = await db.collection('articles').findOne({ _id: new ObjectId(id) });

    if (!article) {
      return NextResponse.json(
        {
          success: false,
          message: 'Article not found'
        },
        { status: 404 }
      );
    }

    // Fetch related articles (same category, excluding current)
    const relatedArticles = await db.collection('articles')
      .find({ 
        category: article.category,
        _id: { $ne: new ObjectId(id) }
      })
      .sort({ createdAt: -1 })
      .limit(3)
      .toArray();

    return NextResponse.json({
      success: true,
      data: {
        article,
        relatedArticles
      }
    });

  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to fetch article'
      },
      { status: 500 }
    );
  }
}

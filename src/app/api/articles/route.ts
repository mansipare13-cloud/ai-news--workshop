import { NextResponse } from 'next/server';
import { setupDatabase } from '@/lib/database-setup';

export async function GET(request: Request) {
  try {
    const { db } = await setupDatabase();
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};
    if (category && category !== 'all') {
      query.category = category;
    }

    // Fetch articles with pagination
    const articles = await db.collection('articles')
      .find(query)
      .sort({ createdAt: -1 }) // Most recent first
      .skip(skip)
      .limit(limit)
      .toArray();

    // Get total count for pagination
    const totalCount = await db.collection('articles').countDocuments(query);

    // Get category distribution
    const categoryPipeline = [
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ];
    const categories = await db.collection('articles').aggregate(categoryPipeline).toArray();

    return NextResponse.json({
      success: true,
      data: {
        articles,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
          hasNextPage: page < Math.ceil(totalCount / limit),
          hasPrevPage: page > 1
        },
        categories: categories.reduce((acc: any, cat: any) => {
          acc[cat._id] = cat.count;
          return acc;
        }, {})
      }
    });

  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to fetch articles'
      },
      { status: 500 }
    );
  }
}

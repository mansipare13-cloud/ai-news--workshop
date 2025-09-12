import { NextResponse } from 'next/server';
import { dataPipeline } from '@/lib/data-pipeline';

export async function GET() {
  try {
    // Initialize pipeline
    await dataPipeline.initialize();
    
    // Get status
    const status = await dataPipeline.getStatus();
    
    return NextResponse.json({
      success: true,
      message: 'Pipeline status retrieved successfully',
      status
    });

  } catch (error) {
    console.error('Pipeline status error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to get pipeline status'
      },
      { status: 500 }
    );
  }
}

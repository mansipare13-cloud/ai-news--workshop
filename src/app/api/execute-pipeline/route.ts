import { NextResponse } from 'next/server';
import { dataPipeline } from '@/lib/data-pipeline';

export async function POST() {
  try {
    console.log('🚀 Starting data pipeline execution...');
    
    // Initialize pipeline
    await dataPipeline.initialize();
    
    // Execute pipeline
    const result = await dataPipeline.executePipeline();
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Data pipeline executed successfully',
        results: {
          processedCount: result.processedCount,
          savedCount: result.savedCount,
          errors: result.errors
        },
        summary: {
          status: 'SUCCESS',
          message: `Successfully processed ${result.processedCount} articles and saved ${result.savedCount} to database`
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Data pipeline execution failed',
        results: {
          processedCount: result.processedCount,
          savedCount: result.savedCount,
          errors: result.errors
        },
        summary: {
          status: 'FAILED',
          message: 'Pipeline execution failed. Check errors for details.'
        }
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Pipeline execution error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to execute data pipeline'
      },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import newsapi from '@/lib/news-api';
import model from '@/lib/gemini';

export async function GET() {
  const results = {
    timestamp: new Date().toISOString(),
    services: {
      mongodb: { status: 'unknown', message: '' },
      newsApi: { status: 'unknown', message: '' },
      gemini: { status: 'unknown', message: '' },
    },
    environment: {
      mongodbUri: process.env.MONGODB_URI ? 'Set' : 'Not Set',
      newsApiKey: process.env.NEWS_API_KEY ? 'Set' : 'Not Set',
      googleApiKey: process.env.GOOGLE_API_KEY ? 'Set' : 'Not Set',
    },
  };

  // Test MongoDB Connection
  try {
    await connectDB();
    results.services.mongodb = {
      status: 'success',
      message: 'Successfully connected to MongoDB',
    };
  } catch (error) {
    results.services.mongodb = {
      status: 'error',
      message: `MongoDB connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }

  // Test News API Connection
  try {
    // Test with a simple request
    const testResponse = await newsapi.sources({
      category: 'technology',
      language: 'en',
      country: 'us',
    });
    
    results.services.newsApi = {
      status: 'success',
      message: `News API connected successfully. Found ${testResponse.sources?.length || 0} sources.`,
    };
  } catch (error) {
    results.services.newsApi = {
      status: 'error',
      message: `News API connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }

  // Test Gemini API Connection
  try {
    // Test with a simple prompt
    const testPrompt = 'Hello, this is a test. Please respond with "Connection successful".';
    const result = await model.generateContent(testPrompt);
    const response = await result.response;
    const text = response.text();
    
    results.services.gemini = {
      status: 'success',
      message: `Gemini API connected successfully. Response: ${text.substring(0, 100)}...`,
    };
  } catch (error) {
    results.services.gemini = {
      status: 'error',
      message: `Gemini API connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }

  // Determine overall status
  const allServicesWorking = Object.values(results.services).every(
    service => service.status === 'success'
  );

  return NextResponse.json({
    ...results,
    overallStatus: allServicesWorking ? 'success' : 'partial_failure',
    message: allServicesWorking 
      ? 'All services are connected and working correctly!' 
      : 'Some services failed to connect. Check the individual service statuses.',
  });
}

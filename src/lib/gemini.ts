import { GoogleGenerativeAI } from '@google/generative-ai';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

if (!GOOGLE_API_KEY) {
  throw new Error('Please define the GOOGLE_API_KEY environment variable inside .env.local');
}

// Initialize Google GenAI client
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

// Use the gemini-2.0-flash-exp model as specified
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export default model;

// Helper function to generate article summary
export async function generateArticleSummary(articleContent: string, title: string) {
  try {
    const prompt = `Please provide a brief, AI-generated summary of the following article in 2-3 sentences. Focus on the key points and main takeaways:

Title: ${title}

Content: ${articleContent}

Summary:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating article summary:', error);
    throw error;
  }
}

// Helper function to generate detailed summary
export async function generateDetailedSummary(articleContent: string, title: string) {
  try {
    const prompt = `Please provide a detailed, AI-generated summary of the following article. Write it in two well-structured paragraphs that capture the main points and implications:

Title: ${title}

Content: ${articleContent}

Detailed Summary:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating detailed summary:', error);
    throw error;
  }
}

// Helper function to generate "Why it Matters" section
export async function generateWhyItMatters(articleContent: string, title: string) {
  try {
    const prompt = `Please write a "Why it Matters" section for the following article. This should be a single paragraph that rephrases the article's content in a way that resonates with AI enthusiasts and learners. Focus on the broader implications and significance:

Title: ${title}

Content: ${articleContent}

Why it Matters:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating why it matters section:', error);
    throw error;
  }
}

// Helper function for chatbot responses
export async function generateChatbotResponse(question: string, articleContent: string, articleTitle: string) {
  try {
    const prompt = `You are an AI assistant helping users understand the following article. Please provide a helpful and informative response to their question:

Article Title: ${articleTitle}
Article Content: ${articleContent}

User Question: ${question}

Response:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating chatbot response:', error);
    throw error;
  }
}

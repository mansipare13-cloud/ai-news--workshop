import { NextResponse } from 'next/server';
import { setupDatabase } from '@/lib/database-setup';
import { ObjectId } from 'mongodb';

export async function POST() {
  try {
    const { db } = await setupDatabase();
    
    // Sample articles data
    const sampleArticles = [
      {
        title: 'OpenAI Unveils GPT-5 with Revolutionary Reasoning Capabilities',
        coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
        publisherName: 'TechCrunch',
        publisherLogo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop',
        authorName: 'Sarah Chen',
        datePosted: new Date('2024-01-15T10:30:00Z'),
        quickSummary: 'OpenAI announces GPT-5 with advanced reasoning abilities, promising to revolutionize AI applications across industries.',
        detailedSummary: 'OpenAI has officially unveiled GPT-5, their most advanced language model to date, featuring unprecedented reasoning capabilities that allow it to solve complex problems across multiple domains. The new model demonstrates significant improvements in logical reasoning, mathematical problem-solving, and creative thinking compared to its predecessors.\n\nThe announcement comes after months of speculation and testing, with early users reporting remarkable improvements in code generation, scientific research assistance, and creative writing. GPT-5\'s enhanced reasoning abilities are expected to transform how businesses and researchers approach complex problem-solving tasks.',
        whyItMatters: 'This breakthrough represents a quantum leap in AI capabilities, moving us closer to artificial general intelligence. For AI enthusiasts and learners, GPT-5\'s reasoning abilities open up new possibilities for human-AI collaboration, potentially accelerating scientific discoveries and creative innovations.',
        sourceUrl: 'https://techcrunch.com/2024/01/15/openai-gpt-5-reasoning',
        category: 'AI',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Tesla\'s Full Self-Driving Beta Reaches 99.9% Safety Milestone',
        coverImage: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=400&fit=crop',
        publisherName: 'The Verge',
        publisherLogo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop',
        authorName: 'Marcus Johnson',
        datePosted: new Date('2024-01-14T14:20:00Z'),
        quickSummary: 'Tesla\'s autonomous driving system achieves unprecedented safety levels, marking a major milestone in self-driving technology.',
        detailedSummary: 'Tesla has announced that its Full Self-Driving (FSD) Beta has reached a 99.9% safety milestone, representing a significant advancement in autonomous vehicle technology. The achievement comes after extensive testing across millions of miles of real-world driving scenarios, with the system demonstrating remarkable improvements in handling complex traffic situations, weather conditions, and edge cases.\n\nThe milestone represents years of iterative development and machine learning optimization, with Tesla\'s neural networks processing vast amounts of driving data to improve decision-making capabilities. This breakthrough brings us closer to fully autonomous vehicles becoming a mainstream reality.',
        whyItMatters: 'This milestone represents a paradigm shift in transportation technology, bringing us closer to a future where autonomous vehicles are not just possible but demonstrably safer than human drivers. For technology enthusiasts, this achievement showcases the power of iterative AI development and real-world data collection in solving complex engineering challenges.',
        sourceUrl: 'https://theverge.com/2024/01/14/tesla-fsd-safety-milestone',
        category: 'Technology',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Anthropic Raises $2.8B Series C to Scale AI Safety Research',
        coverImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop',
        publisherName: 'Forbes',
        publisherLogo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop',
        authorName: 'Emily Rodriguez',
        datePosted: new Date('2024-01-13T09:15:00Z'),
        quickSummary: 'Anthropic secures massive funding round to accelerate AI safety research and responsible AI development.',
        detailedSummary: 'Anthropic, the AI safety company behind Claude, has raised $2.8 billion in Series C funding to accelerate its research into AI safety and alignment. The funding round was led by major tech investors and will be used to expand the company\'s research team, develop safer AI systems, and advance the field of AI alignment.\n\nThe investment reflects growing recognition of the importance of AI safety research as artificial intelligence systems become more powerful and widespread. Anthropic plans to use the funding to hire top researchers, expand computational resources, and develop new techniques for ensuring AI systems remain beneficial to humanity.',
        whyItMatters: 'This funding round highlights the critical importance of AI safety research in our rapidly advancing technological landscape. For AI enthusiasts, it demonstrates that responsible AI development is not just an academic concern but a business priority, ensuring that powerful AI systems are developed with human values and safety at their core.',
        sourceUrl: 'https://forbes.com/2024/01/13/anthropic-funding-ai-safety',
        category: 'Funding',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Sample chats data
    const sampleChats = [
      {
        sessionId: 'session_ai_article_001',
        articleId: new ObjectId(),
        articleTitle: 'OpenAI Unveils GPT-5 with Revolutionary Reasoning Capabilities',
        messages: [
          {
            text: 'Hi! I\'m your AI assistant for this article about GPT-5. Feel free to ask me any questions about the content, key points, or implications of this news.',
            isUser: false,
            timestamp: new Date('2024-01-15T10:35:00Z')
          },
          {
            text: 'What are the key improvements in GPT-5 compared to previous versions?',
            isUser: true,
            timestamp: new Date('2024-01-15T10:36:00Z')
          },
          {
            text: 'Based on the article, GPT-5 demonstrates significant improvements in logical reasoning, mathematical problem-solving, and creative thinking compared to its predecessors. The model features unprecedented reasoning capabilities that allow it to solve complex problems across multiple domains.',
            isUser: false,
            timestamp: new Date('2024-01-15T10:36:30Z')
          }
        ],
        createdAt: new Date('2024-01-15T10:35:00Z'),
        updatedAt: new Date('2024-01-15T10:36:30Z')
      },
      {
        sessionId: 'session_tech_article_002',
        articleId: new ObjectId(),
        articleTitle: 'Tesla\'s Full Self-Driving Beta Reaches 99.9% Safety Milestone',
        messages: [
          {
            text: 'Hello! I\'m here to help you understand this article about Tesla\'s FSD safety milestone. What would you like to know?',
            isUser: false,
            timestamp: new Date('2024-01-14T14:25:00Z')
          },
          {
            text: 'How did Tesla achieve this safety milestone?',
            isUser: true,
            timestamp: new Date('2024-01-14T14:26:00Z')
          },
          {
            text: 'According to the article, Tesla achieved this milestone through extensive testing across millions of miles of real-world driving scenarios. The system demonstrated remarkable improvements in handling complex traffic situations, weather conditions, and edge cases through years of iterative development and machine learning optimization.',
            isUser: false,
            timestamp: new Date('2024-01-14T14:26:45Z')
          }
        ],
        createdAt: new Date('2024-01-14T14:25:00Z'),
        updatedAt: new Date('2024-01-14T14:26:45Z')
      }
    ];

    // Insert sample data
    console.log('Inserting sample articles...');
    const articlesResult = await db.collection('articles').insertMany(sampleArticles);
    console.log(`✅ Inserted ${articlesResult.insertedCount} articles`);

    console.log('Inserting sample chats...');
    const chatsResult = await db.collection('chats').insertMany(sampleChats);
    console.log(`✅ Inserted ${chatsResult.insertedCount} chats`);

    // Get collection counts
    const articlesCount = await db.collection('articles').countDocuments();
    const chatsCount = await db.collection('chats').countDocuments();

    return NextResponse.json({
      success: true,
      message: 'Sample data inserted successfully',
      data: {
        articles: {
          inserted: articlesResult.insertedCount,
          total: articlesCount,
          ids: articlesResult.insertedIds
        },
        chats: {
          inserted: chatsResult.insertedCount,
          total: chatsCount,
          ids: chatsResult.insertedIds
        }
      }
    });

  } catch (error) {
    console.error('Sample data insertion error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to insert sample data'
      },
      { status: 500 }
    );
  }
}

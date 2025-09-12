import connectDB from './mongodb';

// Database setup and collection creation with native MongoDB validation
export async function setupDatabase() {
  try {
    const mongoose = await connectDB();
    const db = mongoose.connection.db;
    
    console.log('Connected to MongoDB Atlas');
    console.log('Database name:', db.databaseName);
    
    return { mongoose, db };
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}

// Create articles collection with native validation
export async function createArticlesCollection() {
  const { db } = await setupDatabase();
  
  const articlesValidation = {
    $jsonSchema: {
      bsonType: 'object',
      required: [
        'title',
        'coverImage', 
        'publisherName',
        'publisherLogo',
        'authorName',
        'datePosted',
        'quickSummary',
        'detailedSummary',
        'whyItMatters',
        'sourceUrl',
        'category',
        'createdAt',
        'updatedAt'
      ],
      properties: {
        title: {
          bsonType: 'string',
          minLength: 1,
          maxLength: 500,
          description: 'Article title must be a string between 1 and 500 characters'
        },
        coverImage: {
          bsonType: 'string',
          pattern: '^https?://',
          description: 'Cover image must be a valid URL'
        },
        publisherName: {
          bsonType: 'string',
          minLength: 1,
          maxLength: 100,
          description: 'Publisher name must be a string between 1 and 100 characters'
        },
        publisherLogo: {
          bsonType: 'string',
          pattern: '^https?://',
          description: 'Publisher logo must be a valid URL'
        },
        authorName: {
          bsonType: 'string',
          minLength: 1,
          maxLength: 100,
          description: 'Author name must be a string between 1 and 100 characters'
        },
        datePosted: {
          bsonType: 'date',
          description: 'Date posted must be a valid date'
        },
        quickSummary: {
          bsonType: 'string',
          minLength: 10,
          maxLength: 500,
          description: 'Quick summary must be a string between 10 and 500 characters'
        },
        detailedSummary: {
          bsonType: 'string',
          minLength: 50,
          maxLength: 2000,
          description: 'Detailed summary must be a string between 50 and 2000 characters'
        },
        whyItMatters: {
          bsonType: 'string',
          minLength: 50,
          maxLength: 1000,
          description: 'Why it matters must be a string between 50 and 1000 characters'
        },
        sourceUrl: {
          bsonType: 'string',
          pattern: '^https?://',
          description: 'Source URL must be a valid URL'
        },
        category: {
          bsonType: 'string',
          enum: ['AI', 'Technology', 'Startups', 'Funding', 'Machine Learning'],
          description: 'Category must be one of the allowed values'
        },
        createdAt: {
          bsonType: 'date',
          description: 'Created at must be a valid date'
        },
        updatedAt: {
          bsonType: 'date',
          description: 'Updated at must be a valid date'
        }
      },
      additionalProperties: true
    }
  };

  try {
    // Drop collection if it exists
    try {
      await db.collection('articles').drop();
      console.log('Dropped existing articles collection');
    } catch (error) {
      // Collection doesn't exist, that's fine
    }

    // Create collection with validation
    await db.createCollection('articles', {
      validator: articlesValidation,
      validationLevel: 'strict',
      validationAction: 'error'
    });

    // Create indexes for better performance (with error handling to avoid duplicates)
    try {
      await db.collection('articles').createIndex({ category: 1 });
    } catch (error) {
      // Index might already exist, ignore error
    }
    
    try {
      await db.collection('articles').createIndex({ datePosted: -1 });
    } catch (error) {
      // Index might already exist, ignore error
    }
    
    try {
      await db.collection('articles').createIndex({ sourceUrl: 1 }, { unique: true });
    } catch (error) {
      // Index might already exist, ignore error
    }
    
    try {
      await db.collection('articles').createIndex({ createdAt: -1 });
    } catch (error) {
      // Index might already exist, ignore error
    }

    console.log('✅ Articles collection created with validation rules');
    console.log('✅ Indexes created for articles collection');
    
    return true;
  } catch (error) {
    console.error('Error creating articles collection:', error);
    throw error;
  }
}

// Create chats collection with native validation
export async function createChatsCollection() {
  const { db } = await setupDatabase();
  
  const chatsValidation = {
    $jsonSchema: {
      bsonType: 'object',
      required: [
        'sessionId',
        'articleId',
        'articleTitle',
        'messages',
        'createdAt',
        'updatedAt'
      ],
      properties: {
        sessionId: {
          bsonType: 'string',
          minLength: 10,
          maxLength: 50,
          description: 'Session ID must be a string between 10 and 50 characters'
        },
        articleId: {
          bsonType: 'objectId',
          description: 'Article ID must be a valid ObjectId'
        },
        articleTitle: {
          bsonType: 'string',
          minLength: 1,
          maxLength: 500,
          description: 'Article title must be a string between 1 and 500 characters'
        },
        messages: {
          bsonType: 'array',
          minItems: 0,
          description: 'Messages must be an array',
          items: {
            bsonType: 'object',
            required: ['text', 'isUser', 'timestamp'],
            properties: {
              text: {
                bsonType: 'string',
                minLength: 1,
                maxLength: 2000,
                description: 'Message text must be a string between 1 and 2000 characters'
              },
              isUser: {
                bsonType: 'bool',
                description: 'isUser must be a boolean'
              },
              timestamp: {
                bsonType: 'date',
                description: 'Timestamp must be a valid date'
              }
            },
            additionalProperties: true
          }
        },
        createdAt: {
          bsonType: 'date',
          description: 'Created at must be a valid date'
        },
        updatedAt: {
          bsonType: 'date',
          description: 'Updated at must be a valid date'
        }
      },
      additionalProperties: true
    }
  };

  try {
    // Drop collection if it exists
    try {
      await db.collection('chats').drop();
      console.log('Dropped existing chats collection');
    } catch (error) {
      // Collection doesn't exist, that's fine
    }

    // Create collection with validation
    await db.createCollection('chats', {
      validator: chatsValidation,
      validationLevel: 'strict',
      validationAction: 'error'
    });

    // Create indexes for better performance (with error handling to avoid duplicates)
    try {
      await db.collection('chats').createIndex({ sessionId: 1 });
    } catch (error) {
      // Index might already exist, ignore error
    }
    
    try {
      await db.collection('chats').createIndex({ articleId: 1 });
    } catch (error) {
      // Index might already exist, ignore error
    }
    
    try {
      await db.collection('chats').createIndex({ createdAt: -1 });
    } catch (error) {
      // Index might already exist, ignore error
    }

    console.log('✅ Chats collection created with validation rules');
    console.log('✅ Indexes created for chats collection');
    
    return true;
  } catch (error) {
    console.error('Error creating chats collection:', error);
    throw error;
  }
}

// Create both collections
export async function createAllCollections() {
  try {
    console.log('🚀 Starting database setup...');
    
    await createArticlesCollection();
    await createChatsCollection();
    
    console.log('✅ All collections created successfully!');
    return true;
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    throw error;
  }
}

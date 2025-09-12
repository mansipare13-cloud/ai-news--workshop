import { NextResponse } from 'next/server';
import { setupDatabase } from '@/lib/database-setup';

export async function GET() {
  try {
    const { db } = await setupDatabase();
    
    // Get collection information
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    
    const verification = {
      collectionsExist: {
        articles: collectionNames.includes('articles'),
        chats: collectionNames.includes('chats')
      },
      collectionDetails: {},
      validationRules: {},
      indexes: {},
      documentCounts: {}
    };

    // Check articles collection
    if (verification.collectionsExist.articles) {
      const articlesCollection = db.collection('articles');
      
      // Get collection options (including validation)
      const articlesOptions = await db.listCollections({ name: 'articles' }).toArray();
      verification.collectionDetails.articles = articlesOptions[0]?.options || {};
      verification.validationRules.articles = articlesOptions[0]?.options?.validator || null;
      
      // Get indexes
      const articlesIndexes = await articlesCollection.indexes();
      verification.indexes.articles = articlesIndexes.map(idx => ({
        name: idx.name,
        key: idx.key,
        unique: idx.unique || false
      }));
      
      // Get document count
      verification.documentCounts.articles = await articlesCollection.countDocuments();
    }

    // Check chats collection
    if (verification.collectionsExist.chats) {
      const chatsCollection = db.collection('chats');
      
      // Get collection options (including validation)
      const chatsOptions = await db.listCollections({ name: 'chats' }).toArray();
      verification.collectionDetails.chats = chatsOptions[0]?.options || {};
      verification.validationRules.chats = chatsOptions[0]?.options?.validator || null;
      
      // Get indexes
      const chatsIndexes = await chatsCollection.indexes();
      verification.indexes.chats = chatsIndexes.map(idx => ({
        name: idx.name,
        key: idx.key,
        unique: idx.unique || false
      }));
      
      // Get document count
      verification.documentCounts.chats = await chatsCollection.countDocuments();
    }

    // Check if validation is properly configured
    const validationStatus = {
      articles: {
        hasValidation: !!verification.validationRules.articles,
        validationLevel: verification.collectionDetails.articles?.validationLevel || 'none',
        validationAction: verification.collectionDetails.articles?.validationAction || 'none'
      },
      chats: {
        hasValidation: !!verification.validationRules.chats,
        validationLevel: verification.collectionDetails.chats?.validationLevel || 'none',
        validationAction: verification.collectionDetails.chats?.validationAction || 'none'
      }
    };

    return NextResponse.json({
      success: true,
      message: 'Collection verification completed',
      verification,
      validationStatus,
      summary: {
        totalCollections: collections.length,
        targetCollectionsExist: verification.collectionsExist.articles && verification.collectionsExist.chats,
        validationConfigured: validationStatus.articles.hasValidation && validationStatus.chats.hasValidation,
        strictValidation: validationStatus.articles.validationLevel === 'strict' && validationStatus.chats.validationLevel === 'strict'
      }
    });

  } catch (error) {
    console.error('Collection verification error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to verify collections'
      },
      { status: 500 }
    );
  }
}

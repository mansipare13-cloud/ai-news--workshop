import { setupDatabase } from './database-setup';
import { fetchTopTechArticles, RawNewsArticle } from './news-fetcher';
import { aiProcessor, ProcessedNewsArticle } from './ai-processor';
import { ObjectId } from 'mongodb';

export class DataPipeline {
  private db: any;

  async initialize() {
    const { db } = await setupDatabase();
    this.db = db;
    console.log('✅ Data pipeline initialized');
  }

  // Check if article already exists (by sourceUrl)
  async articleExists(sourceUrl: string): Promise<boolean> {
    try {
      const existingArticle = await this.db.collection('articles').findOne({ sourceUrl });
      return !!existingArticle;
    } catch (error) {
      console.error('Error checking if article exists:', error);
      return false;
    }
  }

  // Save processed article to database
  async saveArticle(article: ProcessedNewsArticle): Promise<boolean> {
    try {
      // Check if article already exists
      const exists = await this.articleExists(article.sourceUrl);
      if (exists) {
        console.log(`Article already exists: ${article.title}`);
        return false;
      }

      // Insert new article
      const result = await this.db.collection('articles').insertOne(article);
      console.log(`✅ Saved article: ${article.title} (ID: ${result.insertedId})`);
      return true;

    } catch (error) {
      console.error(`Error saving article ${article.title}:`, error);
      return false;
    }
  }

  // Clear existing articles (for fresh start)
  async clearExistingArticles(): Promise<void> {
    try {
      const result = await this.db.collection('articles').deleteMany({});
      console.log(`🗑️ Cleared ${result.deletedCount} existing articles`);
    } catch (error) {
      console.error('Error clearing existing articles:', error);
      throw error;
    }
  }

  // Select best articles from the fetched ones
  selectBestArticles(articles: RawNewsArticle[]): RawNewsArticle[] {
    // Sort by quality indicators
    const scoredArticles = articles.map(article => {
      let score = 0;
      
      // Prefer articles with content
      if (article.content && article.content.length > 500) score += 10;
      
      // Prefer articles with good images
      if (article.urlToImage && article.urlToImage.includes('http')) score += 5;
      
      // Prefer articles with authors
      if (article.author) score += 3;
      
      // Prefer recent articles (within last 30 days)
      const daysSincePublished = (Date.now() - new Date(article.publishedAt).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSincePublished <= 30) score += 5;
      
      // Prefer articles from high-quality sources
      const highQualitySources = ['techcrunch', 'wired', 'the-verge', 'ars-technica', 'venturebeat'];
      if (highQualitySources.some(source => article.source.id?.toLowerCase().includes(source))) {
        score += 8;
      }
      
      return { article, score };
    });

    // Sort by score and return top 15 (to have more options)
    return scoredArticles
      .sort((a, b) => b.score - a.score)
      .slice(0, 15)
      .map(item => item.article);
  }

  // Main pipeline execution
  async executePipeline(): Promise<{
    success: boolean;
    processedCount: number;
    savedCount: number;
    errors: string[];
  }> {
    const errors: string[] = [];
    let processedCount = 0;
    let savedCount = 0;

    try {
      console.log('🚀 Starting data pipeline execution...');

      // Step 1: Clear existing articles
      console.log('Step 1: Clearing existing articles...');
      await this.clearExistingArticles();

      // Step 2: Fetch articles from News API
      console.log('Step 2: Fetching articles from News API...');
      const rawArticles = await fetchTopTechArticles();
      console.log(`Fetched ${rawArticles.length} raw articles`);

      if (rawArticles.length === 0) {
        throw new Error('No articles fetched from News API');
      }

      // Step 3: Select best articles
      console.log('Step 3: Selecting best articles...');
      const selectedArticles = this.selectBestArticles(rawArticles);
      console.log(`Selected ${selectedArticles.length} articles for processing`);

      // Step 4: Process articles with AI
      console.log('Step 4: Processing articles with AI...');
      const processedArticles = await aiProcessor.processArticles(selectedArticles);
      processedCount = processedArticles.length;
      console.log(`Processed ${processedCount} articles with AI`);

      // Step 5: Save to database
      console.log('Step 5: Saving articles to database...');
      for (const article of processedArticles) {
        try {
          const saved = await this.saveArticle(article);
          if (saved) {
            savedCount++;
          }
        } catch (error) {
          const errorMsg = `Failed to save article "${article.title}": ${error instanceof Error ? error.message : 'Unknown error'}`;
          errors.push(errorMsg);
          console.error(errorMsg);
        }
      }

      console.log(`✅ Pipeline completed: ${savedCount} articles saved to database`);

      return {
        success: savedCount > 0,
        processedCount,
        savedCount,
        errors
      };

    } catch (error) {
      const errorMsg = `Pipeline execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      errors.push(errorMsg);
      console.error(errorMsg);
      
      return {
        success: false,
        processedCount,
        savedCount,
        errors
      };
    }
  }

  // Get pipeline status
  async getStatus(): Promise<{
    totalArticles: number;
    categories: { [key: string]: number };
    recentArticles: ProcessedNewsArticle[];
  }> {
    try {
      const totalArticles = await this.db.collection('articles').countDocuments();
      
      // Get category distribution
      const categoryPipeline = [
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ];
      const categoryResults = await this.db.collection('articles').aggregate(categoryPipeline).toArray();
      const categories = categoryResults.reduce((acc: any, item: any) => {
        acc[item._id] = item.count;
        return acc;
      }, {});

      // Get recent articles
      const recentArticles = await this.db.collection('articles')
        .find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray();

      return {
        totalArticles,
        categories,
        recentArticles
      };

    } catch (error) {
      console.error('Error getting pipeline status:', error);
      throw error;
    }
  }
}

export const dataPipeline = new DataPipeline();

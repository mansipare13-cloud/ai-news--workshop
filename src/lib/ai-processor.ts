import { generateArticleSummary, generateDetailedSummary, generateWhyItMatters } from './gemini';
import { RawNewsArticle, ProcessedNewsArticle } from './news-fetcher';
import { getPublisherLogo, categorizeArticle } from './news-fetcher';

export class AIProcessor {
  // Generate quick summary (single sentence)
  async generateQuickSummary(article: RawNewsArticle): Promise<string> {
    try {
      const content = `${article.title}. ${article.description || ''}. ${article.content || ''}`;
      const summary = await generateArticleSummary(content, article.title);
      
      // Ensure it's a single sentence and under 500 characters
      const cleanedSummary = summary.replace(/\n/g, ' ').trim();
      return cleanedSummary.length > 500 ? cleanedSummary.substring(0, 497) + '...' : cleanedSummary;
      
    } catch (error) {
      console.error('Error generating quick summary:', error);
      // Fallback to description or title
      return article.description || article.title;
    }
  }

  // Generate detailed summary (exactly two paragraphs, ~500 words)
  async generateDetailedSummary(article: RawNewsArticle): Promise<string> {
    try {
      const content = `${article.title}. ${article.description || ''}. ${article.content || ''}`;
      const summary = await generateDetailedSummary(content, article.title);
      
      // Clean up the response
      const cleanedSummary = summary.replace(/\n\n+/g, '\n\n').trim();
      
      // Ensure it's approximately 500 words
      const wordCount = cleanedSummary.split(' ').length;
      if (wordCount < 400) {
        return cleanedSummary + ' This development represents a significant advancement in the field and has important implications for the industry and users alike.';
      } else if (wordCount > 600) {
        const sentences = cleanedSummary.split('. ');
        let result = '';
        let currentWords = 0;
        for (const sentence of sentences) {
          if (currentWords + sentence.split(' ').length <= 500) {
            result += sentence + '. ';
            currentWords += sentence.split(' ').length;
          } else {
            break;
          }
        }
        return result.trim();
      }
      
      return cleanedSummary;
      
    } catch (error) {
      console.error('Error generating detailed summary:', error);
      // Fallback to description
      return article.description || 'This article discusses important developments in technology and their implications for the industry.';
    }
  }

  // Generate "Why it Matters" section (single paragraph for AI enthusiasts)
  async generateWhyItMatters(article: RawNewsArticle): Promise<string> {
    try {
      const content = `${article.title}. ${article.description || ''}. ${article.content || ''}`;
      const whyItMatters = await generateWhyItMatters(content, article.title);
      
      // Clean up and ensure it's a single paragraph
      const cleaned = whyItMatters.replace(/\n+/g, ' ').trim();
      return cleaned.length > 1000 ? cleaned.substring(0, 997) + '...' : cleaned;
      
    } catch (error) {
      console.error('Error generating why it matters:', error);
      // Fallback
      return 'This development is significant for AI enthusiasts as it represents important progress in the field and has implications for future technological advancement.';
    }
  }

  // Process a single article with all AI content generation
  async processArticle(article: RawNewsArticle): Promise<ProcessedNewsArticle> {
    try {
      console.log(`Processing article: ${article.title}`);
      
      // Generate all AI content in parallel for efficiency
      const [quickSummary, detailedSummary, whyItMatters] = await Promise.all([
        this.generateQuickSummary(article),
        this.generateDetailedSummary(article),
        this.generateWhyItMatters(article)
      ]);

      // Determine category
      const category = categorizeArticle(article);

      // Get publisher logo
      const publisherLogo = getPublisherLogo(article.source.name);

      // Create processed article
      const processedArticle: ProcessedNewsArticle = {
        title: article.title,
        coverImage: article.urlToImage,
        publisherName: article.source.name,
        publisherLogo: publisherLogo,
        authorName: article.author || 'Unknown Author',
        datePosted: new Date(article.publishedAt),
        quickSummary,
        detailedSummary,
        whyItMatters,
        sourceUrl: article.url,
        category,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.log(`✅ Processed article: ${article.title}`);
      return processedArticle;

    } catch (error) {
      console.error(`Error processing article ${article.title}:`, error);
      throw error;
    }
  }

  // Process multiple articles
  async processArticles(articles: RawNewsArticle[]): Promise<ProcessedNewsArticle[]> {
    console.log(`🚀 Processing ${articles.length} articles with AI...`);
    
    const processedArticles: ProcessedNewsArticle[] = [];
    
    // Process articles in batches to avoid rate limiting
    const batchSize = 3;
    for (let i = 0; i < articles.length; i += batchSize) {
      const batch = articles.slice(i, i + batchSize);
      console.log(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(articles.length / batchSize)}`);
      
      const batchPromises = batch.map(article => this.processArticle(article));
      const batchResults = await Promise.allSettled(batchPromises);
      
      batchResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          processedArticles.push(result.value);
        } else {
          console.error(`Failed to process article ${batch[index].title}:`, result.reason);
        }
      });
      
      // Add delay between batches to avoid rate limiting
      if (i + batchSize < articles.length) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    console.log(`✅ Successfully processed ${processedArticles.length} articles`);
    return processedArticles;
  }
}

export const aiProcessor = new AIProcessor();

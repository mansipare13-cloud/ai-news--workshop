import newsapi from './news-api';

// Target sources for high-quality tech news
const TARGET_SOURCES = [
  'techcrunch',
  'wired',
  'the-verge', 
  'ars-technica',
  'venturebeat'
];

// Categories to focus on
const TARGET_CATEGORIES = [
  'AI',
  'Technology', 
  'Startups',
  'Funding',
  'Machine Learning'
];

// Keywords to exclude (politics, war, defense)
const EXCLUDE_KEYWORDS = [
  'politics',
  'political',
  'war',
  'military',
  'defense',
  'conflict',
  'election',
  'government',
  'policy'
];

export interface RawNewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    id: string;
    name: string;
  };
  author?: string;
  content?: string;
}

export interface ProcessedNewsArticle {
  title: string;
  coverImage: string;
  publisherName: string;
  publisherLogo: string;
  authorName: string;
  datePosted: Date;
  quickSummary: string;
  detailedSummary: string;
  whyItMatters: string;
  sourceUrl: string;
  category: 'AI' | 'Technology' | 'Startups' | 'Funding' | 'Machine Learning';
  createdAt: Date;
  updatedAt: Date;
}

// Fetch articles from specific sources
export async function fetchArticlesFromSources(): Promise<RawNewsArticle[]> {
  try {
    console.log('Fetching articles from target sources...');
    
    const response = await newsapi.everything({
      sources: TARGET_SOURCES.join(','),
      language: 'en',
      sortBy: 'publishedAt',
      pageSize: 20, // Fetch more to filter
      page: 1
    });

    if (!response.articles) {
      throw new Error('No articles found in response');
    }

    console.log(`Found ${response.articles.length} articles from sources`);
    return response.articles as RawNewsArticle[];

  } catch (error) {
    console.error('Error fetching articles from sources:', error);
    throw error;
  }
}

// Fetch articles by category keywords
export async function fetchArticlesByCategory(): Promise<RawNewsArticle[]> {
  try {
    console.log('Fetching articles by category keywords...');
    
    const allArticles: RawNewsArticle[] = [];
    
    for (const category of TARGET_CATEGORIES) {
      try {
        const response = await newsapi.everything({
          q: category,
          language: 'en',
          sortBy: 'publishedAt',
          pageSize: 5, // 5 per category
          page: 1
        });

        if (response.articles) {
          allArticles.push(...(response.articles as RawNewsArticle[]));
        }
      } catch (error) {
        console.warn(`Error fetching articles for category ${category}:`, error);
      }
    }

    console.log(`Found ${allArticles.length} articles by category`);
    return allArticles;

  } catch (error) {
    console.error('Error fetching articles by category:', error);
    throw error;
  }
}

// Filter articles to exclude unwanted content
export function filterArticles(articles: RawNewsArticle[]): RawNewsArticle[] {
  return articles.filter(article => {
    const title = article.title?.toLowerCase() || '';
    const description = article.description?.toLowerCase() || '';
    const content = article.content?.toLowerCase() || '';
    
    // Check if article contains excluded keywords
    const containsExcludedKeyword = EXCLUDE_KEYWORDS.some(keyword => 
      title.includes(keyword) || 
      description.includes(keyword) || 
      content.includes(keyword)
    );

    // Must have required fields
    const hasRequiredFields = article.title && 
                             article.url && 
                             article.urlToImage && 
                             article.source?.name;

    return !containsExcludedKeyword && hasRequiredFields;
  });
}

// Categorize article based on content
export function categorizeArticle(article: RawNewsArticle): 'AI' | 'Technology' | 'Startups' | 'Funding' | 'Machine Learning' {
  const title = article.title.toLowerCase();
  const description = article.description?.toLowerCase() || '';
  const content = article.content?.toLowerCase() || '';
  const text = `${title} ${description} ${content}`;

  // AI keywords
  if (text.includes('ai') || text.includes('artificial intelligence') || 
      text.includes('machine learning') || text.includes('neural network') ||
      text.includes('deep learning') || text.includes('gpt') || 
      text.includes('chatbot') || text.includes('automation')) {
    return 'AI';
  }

  // Machine Learning specific
  if (text.includes('machine learning') || text.includes('ml model') ||
      text.includes('algorithm') || text.includes('data science') ||
      text.includes('predictive') || text.includes('training model')) {
    return 'Machine Learning';
  }

  // Funding keywords
  if (text.includes('funding') || text.includes('investment') || 
      text.includes('series a') || text.includes('series b') ||
      text.includes('series c') || text.includes('venture capital') ||
      text.includes('raised') || text.includes('valuation') ||
      text.includes('ipo') || text.includes('acquisition')) {
    return 'Funding';
  }

  // Startup keywords
  if (text.includes('startup') || text.includes('unicorn') ||
      text.includes('founder') || text.includes('co-founder') ||
      text.includes('launch') || text.includes('new company') ||
      text.includes('entrepreneur') || text.includes('incubator')) {
    return 'Startups';
  }

  // Default to Technology
  return 'Technology';
}

// Get publisher logo based on source name
export function getPublisherLogo(sourceName: string): string {
  const logoMap: { [key: string]: string } = {
    'TechCrunch': 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop',
    'WIRED': 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop',
    'The Verge': 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop',
    'Ars Technica': 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop',
    'VentureBeat': 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop',
    'Engadget': 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop',
    'Mashable': 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop',
    'Recode': 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop',
    'Fast Company': 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop',
    'MIT Technology Review': 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop'
  };

  return logoMap[sourceName] || 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop';
}

// Main function to fetch and filter articles
export async function fetchTopTechArticles(): Promise<RawNewsArticle[]> {
  try {
    console.log('🚀 Starting to fetch top tech articles...');
    
    // Fetch from both sources and categories
    const [sourceArticles, categoryArticles] = await Promise.all([
      fetchArticlesFromSources(),
      fetchArticlesByCategory()
    ]);

    // Combine and deduplicate
    const allArticles = [...sourceArticles, ...categoryArticles];
    const uniqueArticles = allArticles.filter((article, index, self) => 
      index === self.findIndex(a => a.url === article.url)
    );

    console.log(`Found ${uniqueArticles.length} unique articles`);

    // Filter out unwanted content
    const filteredArticles = filterArticles(uniqueArticles);
    console.log(`After filtering: ${filteredArticles.length} articles`);

    // Sort by published date (most recent first)
    const sortedArticles = filteredArticles.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    // Return top 15 for processing (we'll select best 10)
    return sortedArticles.slice(0, 15);

  } catch (error) {
    console.error('Error fetching top tech articles:', error);
    throw error;
  }
}

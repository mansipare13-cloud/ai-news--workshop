const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

if (!NEWS_API_KEY) {
  throw new Error('Please define the NEWS_API_KEY environment variable inside .env.local');
}

// Simple HTTP client for News API
class NewsAPIClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = NEWS_API_BASE_URL;
  }

  async request(endpoint: string, params: Record<string, string | number> = {}) {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    url.searchParams.append('apiKey', this.apiKey);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString());
      }
    });

    // Use node-fetch for better compatibility
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`News API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async everything(params: {
    q?: string;
    sources?: string;
    language?: string;
    sortBy?: string;
    pageSize?: number;
    page?: number;
  }) {
    return this.request('/everything', params);
  }

  async sources(params: {
    category?: string;
    language?: string;
    country?: string;
  }) {
    return this.request('/sources', params);
  }
}

// Initialize News API client
const newsapi = new NewsAPIClient(NEWS_API_KEY);

export default newsapi;

// Helper function to fetch news by category
export async function fetchNewsByCategory(category: string, pageSize: number = 20) {
  try {
    const response = await newsapi.everything({
      q: category,
      language: 'en',
      sortBy: 'publishedAt',
      pageSize: pageSize,
    });
    
    return response;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
}

// Helper function to fetch news from specific sources
export async function fetchNewsFromSources(sources: string[], pageSize: number = 20) {
  try {
    const response = await newsapi.everything({
      sources: sources.join(','),
      language: 'en',
      sortBy: 'publishedAt',
      pageSize: pageSize,
    });
    
    return response;
  } catch (error) {
    console.error('Error fetching news from sources:', error);
    throw error;
  }
}

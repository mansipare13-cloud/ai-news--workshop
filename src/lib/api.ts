// API utility functions for fetching data from the backend

export interface Article {
  _id: string;
  title: string;
  coverImage: string;
  publisherName: string;
  publisherLogo: string;
  authorName: string;
  datePosted: string;
  quickSummary: string;
  detailedSummary: string;
  whyItMatters: string;
  sourceUrl: string;
  category: 'AI' | 'Technology' | 'Startups' | 'Funding' | 'Machine Learning';
  createdAt: string;
  updatedAt: string;
}

export interface ArticlesResponse {
  success: boolean;
  data: {
    articles: Article[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
    categories: { [key: string]: number };
  };
}

export interface ArticleResponse {
  success: boolean;
  data: {
    article: Article;
    relatedArticles: Article[];
  };
}

// Fetch articles with optional filtering and pagination
export async function fetchArticles(params: {
  category?: string;
  page?: number;
  limit?: number;
} = {}): Promise<ArticlesResponse> {
  const searchParams = new URLSearchParams();
  
  if (params.category && params.category !== 'all') {
    searchParams.set('category', params.category);
  }
  if (params.page) {
    searchParams.set('page', params.page.toString());
  }
  if (params.limit) {
    searchParams.set('limit', params.limit.toString());
  }

  const url = `/api/articles${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch articles: ${response.statusText}`);
  }
  
  return response.json();
}

// Fetch a single article by ID
export async function fetchArticle(id: string): Promise<ArticleResponse> {
  const response = await fetch(`/api/articles/${id}`);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Article not found');
    }
    throw new Error(`Failed to fetch article: ${response.statusText}`);
  }
  
  return response.json();
}

// Fetch articles by category
export async function fetchArticlesByCategory(category: string): Promise<ArticlesResponse> {
  return fetchArticles({ category });
}

// Fetch latest articles
export async function fetchLatestArticles(limit: number = 20): Promise<ArticlesResponse> {
  return fetchArticles({ limit });
}

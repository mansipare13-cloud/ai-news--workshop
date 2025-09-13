'use client';

import { useState, useEffect } from 'react';
import { NewsCard } from '@/components/news/NewsCard';
import { fetchArticles, Article } from '@/lib/api';

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<{ [key: string]: number }>({});

  // Fetch articles on component mount and when category changes
  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchArticles({ 
          category: selectedCategory === 'all' ? undefined : selectedCategory,
          limit: 20 
        });
        
        if (response.success) {
          setArticles(response.data.articles);
          setCategories(response.data.categories);
        } else {
          setError('Failed to load articles');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, [selectedCategory]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="dark-header shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <h1 className="text-xl font-bold text-foreground">AI News Hub</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <button 
                onClick={() => handleCategoryChange('all')}
                className={`font-medium transition-colors ${
                  selectedCategory === 'all' 
                    ? 'text-blue-400' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                All ({Object.values(categories).reduce((a, b) => a + b, 0)})
              </button>
              {Object.entries(categories).map(([category, count]) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`font-medium transition-colors ${
                    selectedCategory === category 
                      ? 'text-blue-400' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {category} ({count})
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Latest in AI & Technology
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Stay updated with the most important developments in artificial intelligence, 
            technology, startups, and funding across the industry.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">Failed to load articles</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* News Grid */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {articles.map((article) => (
                <NewsCard key={article._id} article={article} />
              ))}
            </div>

            {/* No Articles State */}
            {articles.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">No articles found</h3>
                <p className="text-muted-foreground">
                  {selectedCategory === 'all' 
                    ? 'No articles are available at the moment.' 
                    : `No articles found in the ${selectedCategory} category.`
                  }
                </p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="dark-header border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 AI News Hub. Built with Next.js and shadcn/ui.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
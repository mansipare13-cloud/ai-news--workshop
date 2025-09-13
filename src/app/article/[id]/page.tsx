'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AIChatbot } from '@/components/chat/AIChatbot';
import { fetchArticle, Article } from '@/lib/api';
import { format } from 'date-fns';
import { ArrowLeft, ExternalLink } from 'lucide-react';

interface ArticlePageProps {
  params: Promise<{ id: string }>;
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [articleId, setArticleId] = useState<string | null>(null);
  const router = useRouter();

  // Handle async params for Next.js 15
  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setArticleId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  // Fetch article when ID is available
  useEffect(() => {
    if (!articleId) return;

    const loadArticle = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchArticle(articleId);
        
        if (response.success) {
          setArticle(response.data.article);
        } else {
          setError('Article not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load article');
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [articleId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">Article not found</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => router.push('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to News
          </Button>
        </div>
      </div>
    );
  }

  const categoryColors = {
    'AI': 'bg-purple-100 text-purple-800',
    'Technology': 'bg-blue-100 text-blue-800',
    'Startups': 'bg-green-100 text-green-800',
    'Funding': 'bg-orange-100 text-orange-800',
    'Machine Learning': 'bg-pink-100 text-pink-800',
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="dark-header shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              href="/" 
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to News</span>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">AI News Hub</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Article Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Badge className={`${categoryColors[article.category]} border-0 font-medium`}>
              {article.category}
            </Badge>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-6">
            {article.title}
          </h1>
        </div>

        {/* Cover Image */}
        <div className="relative aspect-[16/9] mb-8 rounded-lg overflow-hidden shadow-lg">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          />
        </div>

        {/* Article Meta */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Image
                src={article.publisherLogo}
                alt={article.publisherName}
                width={48}
                height={48}
                className="rounded-full"
              />
              <div>
                <h3 className="font-semibold text-gray-900">{article.publisherName}</h3>
                <p className="text-sm text-gray-600">By {article.authorName}</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {format(new Date(article.datePosted), 'MMMM d, yyyy')}
            </div>
          </div>
        </div>

        {/* AI-Generated Summary */}
        <div className="bg-white rounded-lg p-8 mb-8 shadow-sm border">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Article Summary</h2>
          <div className="prose prose-lg max-w-none">
            {article.detailedSummary.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-gray-700 leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Why It Matters Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 mb-8 border border-blue-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
            Why It Matters
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            {article.whyItMatters}
          </p>
        </div>

        {/* Read Original Button */}
        <div className="text-center">
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
            <a 
              href={article.sourceUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2"
            >
              <ExternalLink className="w-5 h-5" />
              <span>Read Original Article</span>
            </a>
          </Button>
        </div>
      </main>

      {/* AI Chatbot */}
      <AIChatbot articleId={article._id} articleTitle={article.title} />
    </div>
  );
}

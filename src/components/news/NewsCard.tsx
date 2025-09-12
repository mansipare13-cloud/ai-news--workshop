'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Article } from '@/lib/api';
import { format } from 'date-fns';

interface NewsCardProps {
  article: Article;
}

export function NewsCard({ article }: NewsCardProps) {
  const categoryColors = {
    'AI': 'bg-purple-100 text-purple-800 hover:bg-purple-200',
    'Technology': 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    'Startups': 'bg-green-100 text-green-800 hover:bg-green-200',
    'Funding': 'bg-orange-100 text-orange-800 hover:bg-orange-200',
    'Machine Learning': 'bg-pink-100 text-pink-800 hover:bg-pink-200',
  };

  return (
    <Link href={`/article/${article._id}`} className="block h-full">
      <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-3 left-3">
            <Badge 
              className={`${categoryColors[article.category]} border-0 font-medium`}
            >
              {article.category}
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-4 space-y-3">
          <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
            {article.title}
          </h3>
          
          <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
            {article.quickSummary}
          </p>
          
          <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
            <div className="flex items-center space-x-2">
              <Image
                src={article.publisherLogo}
                alt={article.publisherName}
                width={16}
                height={16}
                className="rounded-full"
              />
              <span className="font-medium">{article.publisherName}</span>
            </div>
            <span>{format(new Date(article.datePosted), 'MMM d')}</span>
          </div>
          
          <div className="text-xs text-gray-400">
            By {article.authorName}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

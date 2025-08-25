import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ExternalLink } from 'lucide-react';
import type { Article } from '@/lib/supabase';

// Cache for blog insights to improve performance
const CACHE_DURATION = 3600000; // 1 hour in milliseconds
let cachedInsights: { data: Article[], timestamp: number } | null = null;

interface BlogCardProps {
  article: Article;
}

const BlogCard: React.FC<BlogCardProps> = ({ article }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Extract author name from the authors relation
  const authorName = typeof article.authors === 'object' && article.authors 
    ? (article.authors as any).name 
    : 'Unknown Author';

  // Use the category field directly
  const categoryName = article.category || 'Uncategorized';

  return (
    <Card className="blog-card h-full">
      <div className="relative overflow-hidden">
        <img
          src={article.featured_image_url || '/images/article-placeholder.jpg'}
          alt={article.title}
          className="blog-card-image"
        />
        <div className="absolute top-4 left-4">
          <Badge className="bg-white/90 text-gray-900 hover:bg-white">
            {categoryName}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="space-y-4">
          <h3 className="text-white text-lg font-semibold leading-tight line-clamp-2">
            {article.title}
          </h3>
          
          <p className="text-white/70 text-sm leading-relaxed line-clamp-3">
            {article.excerpt || article.meta_description || 'Read this insightful article about trading and market analysis.'}
          </p>
          
          <div className="flex items-center justify-between text-xs text-white/60">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <User className="w-3 h-3" />
                <span>{authorName}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(article.published_at || new Date().toISOString())}</span>
              </div>
            </div>
          </div>
          
          <Link href={`/blog/${article.slug}`}>
            <Button 
              size="sm" 
              className="cta-secondary w-full"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Read Article
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

interface BlogInsightsSSRProps {
  articles: Article[];
}

export const BlogInsightsSSR: React.FC<BlogInsightsSSRProps> = ({ articles }) => {
  return (
    <section className="section-spacing">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-heading-lg text-gradient mb-4">Latest Market Insights</h2>
          <p className="text-body-lg text-white/70 max-w-2xl mx-auto">
            Stay informed with expert analysis, market trends, and trading strategies from our research team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <BlogCard key={article.id} article={article} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/blog">
            <Button className="cta-primary">
              View All Insights
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ExternalLink } from 'lucide-react';
import { ArticleService } from '@/lib/services/articleService';
import { Article } from '@/lib/types';

interface BlogCardProps {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: Date;
  image_url: string;
  category: string;
}

const BlogCard: React.FC<BlogCardProps> = ({
  id,
  title,
  excerpt,
  author,
  date,
  image_url,
  category
}) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <Card className="blog-card h-full">
      <div className="relative overflow-hidden">
        <img 
          src={image_url} 
          alt={title}
          className="blog-card-image"
        />
        <div className="absolute top-4 left-4">
          <Badge className="bg-white/90 text-gray-900 hover:bg-white">
            {category}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="space-y-4">
          <h3 className="text-white text-lg font-semibold leading-tight line-clamp-2">
            {title}
          </h3>
          
          <p className="text-white/70 text-sm leading-relaxed line-clamp-3">
            {excerpt}
          </p>
          
          <div className="flex items-center justify-between text-xs text-white/60">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <User className="w-3 h-3" />
                <span>{author}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(date)}</span>
              </div>
            </div>
          </div>
          
          <Button 
            size="sm" 
            className="cta-secondary w-full"
            onClick={() => window.open(`/blog/${id}`, '_blank')}
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            Read Article
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const BlogInsights: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        // Sample blog insights for Brokeranalysis
        const sampleArticles: Article[] = [
          {
            id: '1',
            title: 'Federal Reserve Rate Decision Impact on Forex Markets',
            excerpt: 'Analysis of how the latest Fed rate decision affects major currency pairs and what traders should watch for in the coming weeks.',
            author: 'Sarah Mitchell',
            published_date: new Date('2024-01-15'),
            image_url: '/images/blog/fed-rate-decision.jpg',
            category: 'Market Analysis',
            slug: 'fed-rate-decision-forex-impact',
            content: '',
            reading_time: 5,
            featured: true
          },
          {
            id: '2',
            title: 'Top 5 Risk Management Strategies for New Forex Traders',
            excerpt: 'Essential risk management techniques every beginner should master before starting their forex trading journey.',
            author: 'Michael Chen',
            published_date: new Date('2024-01-12'),
            image_url: '/images/blog/risk-management.jpg',
            category: 'Education',
            slug: 'risk-management-strategies-forex',
            content: '',
            reading_time: 7,
            featured: true
          },
          {
            id: '3',
            title: 'Cryptocurrency Regulation Updates: What Traders Need to Know',
            excerpt: 'Latest regulatory developments in crypto trading and their implications for retail and institutional traders.',
            author: 'David Rodriguez',
            published_date: new Date('2024-01-10'),
            image_url: '/images/blog/crypto-regulation.jpg',
            category: 'Regulation',
            slug: 'crypto-regulation-updates-2024',
            content: '',
            reading_time: 6,
            featured: true
          },
          {
            id: '4',
            title: 'ECB Policy Changes and EUR Trading Opportunities',
            excerpt: 'How recent European Central Bank policy shifts create new trading opportunities in EUR pairs.',
            author: 'Emma Thompson',
            published_date: new Date('2024-01-08'),
            image_url: '/images/blog/ecb-policy.jpg',
            category: 'Market Analysis',
            slug: 'ecb-policy-eur-trading',
            content: '',
            reading_time: 4,
            featured: true
          },
          {
            id: '5',
            title: 'Algorithmic Trading: Pros and Cons for Retail Traders',
            excerpt: 'Comprehensive guide to algorithmic trading platforms and whether they\'re suitable for individual traders.',
            author: 'James Wilson',
            published_date: new Date('2024-01-05'),
            image_url: '/images/blog/algorithmic-trading.jpg',
            category: 'Technology',
            slug: 'algorithmic-trading-retail-guide',
            content: '',
            reading_time: 8,
            featured: true
          },
          {
            id: '6',
            title: 'Gold vs Bitcoin: Safe Haven Assets in 2024',
            excerpt: 'Comparative analysis of traditional and digital safe haven assets during market uncertainty.',
            author: 'Lisa Park',
            published_date: new Date('2024-01-03'),
            image_url: '/images/blog/gold-vs-bitcoin.jpg',
            category: 'Investment',
            slug: 'gold-vs-bitcoin-safe-haven-2024',
            content: '',
            reading_time: 6,
            featured: true
          }
        ];
        
        setArticles(sampleArticles);
      } catch (error) {
        console.error('Error fetching articles:', error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

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
          {loading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="blog-card h-full animate-pulse">
                <div className="relative overflow-hidden">
                  <div className="w-full h-48 bg-white/20"></div>
                  <div className="absolute top-4 left-4">
                    <div className="w-16 h-6 bg-white/20 rounded"></div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="w-3/4 h-6 bg-white/20 rounded"></div>
                    <div className="space-y-2">
                      <div className="w-full h-4 bg-white/20 rounded"></div>
                      <div className="w-2/3 h-4 bg-white/20 rounded"></div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-3 bg-white/20 rounded"></div>
                      <div className="w-16 h-3 bg-white/20 rounded"></div>
                    </div>
                    <div className="w-full h-8 bg-white/20 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            articles.map((article) => (
              <BlogCard 
                key={article.id} 
                id={article.id}
                title={article.title}
                excerpt={article.excerpt}
                author={article.author}
                date={article.published_date}
                image_url={article.image_url}
                category={article.category}
              />
            ))
          )}
        </div>

        <div className="text-center mt-12">
          <Button className="cta-primary">
            View All Insights
          </Button>
        </div>
      </div>
    </section>
  );
};
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { ArticleService } from '@/lib/services/articleService';
import { Article } from '@/lib/types';
import OrbitalElement from './OrbitalElement';

export const BlogInsightsSection: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const fetchedArticles = await ArticleService.getFeaturedArticles(3);
        setArticles(fetchedArticles);
      } catch (error) {
        console.error('Error fetching articles:', error);
        // Set fallback articles if needed
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <section className="section-spacing relative overflow-hidden">
        <div className="container mx-auto px-6">
          {/* Background Elements */}
          <OrbitalElement 
            size="lg" 
            variant="secondary" 
            className="absolute top-20 right-20 opacity-20" 
          />
          <OrbitalElement 
            size="md" 
            variant="accent" 
            className="absolute bottom-10 left-20 opacity-25" 
          />

          {/* Section Header */}
          <div className="text-center mb-16 relative z-10">
            <div className="inline-flex items-center px-4 py-2 rounded-full glass-card mb-6">
              <BookOpen className="w-4 h-4 mr-2 text-white/80" />
              <span className="text-sm text-white/80">Latest Insights</span>
            </div>
            <h2 className="text-heading-lg text-white mb-4">
              Blog & Market Insights
            </h2>
            <p className="text-body text-white/70 max-w-2xl mx-auto">
              Stay informed with expert analysis, market trends, and broker industry insights
            </p>
          </div>

          {/* Loading Skeleton */}
          <div className="grid lg:grid-cols-3 gap-8 relative z-10">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="modern-card-hover overflow-hidden animate-pulse">
                <div className="bg-gray-700 h-48 w-full"></div>
                <CardHeader>
                  <div className="bg-gray-700 h-6 w-3/4 rounded mb-2"></div>
                  <div className="bg-gray-700 h-4 w-1/2 rounded"></div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-700 h-4 w-full rounded mb-2"></div>
                  <div className="bg-gray-700 h-4 w-2/3 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-spacing relative overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Background Elements */}
        <OrbitalElement 
          size="lg" 
          variant="secondary" 
          className="absolute top-20 right-20 opacity-20" 
        />
        <OrbitalElement 
          size="md" 
          variant="accent" 
          className="absolute bottom-10 left-20 opacity-25" 
        />

        {/* Section Header */}
        <div className="text-center mb-16 relative z-10">
          <div className="inline-flex items-center px-4 py-2 rounded-full glass-card mb-6">
            <BookOpen className="w-4 h-4 mr-2 text-white/80" />
            <span className="text-sm text-white/80">Latest Insights</span>
          </div>
          <h2 className="text-heading-lg text-white mb-4">
            Blog & Market Insights
          </h2>
          <p className="text-body text-white/70 max-w-2xl mx-auto">
            Stay informed with expert analysis, market trends, and broker industry insights
          </p>
        </div>

        {/* Blog Articles Grid */}
        <div className="grid lg:grid-cols-3 gap-8 relative z-10">
          {articles.map((article, index) => (
            <Card 
              key={article.id} 
              className={`modern-card-hover overflow-hidden ${
                index === 0 ? 'lg:row-span-2' : ''
              }`}
            >
              {/* Article Image */}
              <div className="relative overflow-hidden">
                <img 
                  src={article.featured_image || '/images/default-article.jpg'}
                  alt={`${article.title} - ${article.category?.name || 'Article'} article`}
                  className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                  style={{ width: '100%', height: '192px' }}
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-white/90 text-gray-900">
                    {article.category?.name || 'General'}
                  </Badge>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-white text-lg leading-tight hover:text-gradient transition-colors duration-200">
                  {article.title}
                </CardTitle>
                
                {/* Article Meta */}
                <div className="flex items-center space-x-4 text-white/60 text-sm">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(article.published_at || article.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{article.reading_time || '5 min read'}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-white/70 leading-relaxed mb-4">
                  {article.excerpt || article.meta_description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="text-white/60 text-sm">
                    By {article.author?.name || 'Brokeranalysis Team'}
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-white hover:bg-white/10 group"
                    onClick={() => window.location.href = `/blog/${article.slug}`}
                  >
                    Read More
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12 relative z-10">
          <Button size="lg" className="btn-gradient">
            View All Articles
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogInsightsSection;
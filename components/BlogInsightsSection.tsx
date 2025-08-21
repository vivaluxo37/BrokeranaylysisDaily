import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { mockBlogArticles } from '@/app/brokerAnalysisMockData';
import OrbitalElement from './OrbitalElement';

export const BlogInsightsSection: React.FC = () => {
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
          {mockBlogArticles.map((article, index) => (
            <Card 
              key={article.id} 
              className={`modern-card-hover overflow-hidden ${
                index === 0 ? 'lg:row-span-2' : ''
              }`}
            >
              {/* Article Image */}
              <div className="relative overflow-hidden">
                <img 
                  src={article.image}
                  alt={`${article.title} - ${article.category} article`}
                  className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                  style={{ width: '100%', height: '192px' }}
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-white/90 text-gray-900">
                    {article.category}
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
                    <span>{new Date(article.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{article.readTime}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-white/70 leading-relaxed mb-4">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="text-white/60 text-sm">
                    By {article.author}
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-white hover:bg-white/10 group"
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
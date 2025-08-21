import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ExternalLink } from 'lucide-react';
import { mockQuery } from '@/app/homepageMockData';

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
          {mockQuery.blogInsights.map((post) => (
            <BlogCard key={post.id} {...post} />
          ))}
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
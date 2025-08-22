import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Settings, Navigation, Clock10, Search, Shield, BarChart3, Users } from 'lucide-react';
import OrbitalElement from './OrbitalElement';
import { DataService } from '@/lib/services/dataService';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const iconMap = {
  TrendingUp,
  Settings,
  Navigation,
  Clock10,
  Search,
  Shield,
  BarChart3,
  Users
};

export const FeaturesGrid: React.FC = () => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        // Sample features data for Brokeranalysis platform
        const platformFeatures: Feature[] = [
          {
            id: '1',
            title: 'AI-Powered Recommendations',
            description: 'Get personalized broker recommendations based on your trading style, capital, and preferences using advanced AI algorithms.',
            icon: 'Search'
          },
          {
            id: '2',
            title: 'Trust Score Analysis',
            description: 'Comprehensive 0-100 trust ratings evaluating broker reliability, regulation compliance, and market reputation.',
            icon: 'Shield'
          },
          {
            id: '3',
            title: 'Real-Time Market Data',
            description: 'Access live spreads, market conditions, and trading costs to make informed decisions about your broker choice.',
            icon: 'BarChart3'
          },
          {
            id: '4',
            title: 'Community Reviews',
            description: 'Read verified trader reviews and experiences to understand real-world broker performance and service quality.',
            icon: 'Users'
          }
        ];
        
        setFeatures(platformFeatures);
      } catch (error) {
        console.error('Error fetching features:', error);
        setFeatures([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatures();
  }, []);

  return (
    <section className="section-spacing relative">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full glass-card mb-6">
            <span className="text-sm text-white/80">Platform Features</span>
          </div>
          <h2 className="text-heading-lg text-white mb-4">
            Built for Smart Trading Decisions
          </h2>
        </div>

        {/* Features Grid with Central Orbital */}
        <div className="relative">
          {/* Central Orbital Element */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0">
            <OrbitalElement size="lg" variant="primary" className="opacity-40" />
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 relative z-10">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, index) => (
                <Card key={index} className="modern-card-hover animate-pulse">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-white/20 mb-4"></div>
                    <div className="w-32 h-6 bg-white/20 rounded mb-2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="w-full h-4 bg-white/20 rounded"></div>
                      <div className="w-3/4 h-4 bg-white/20 rounded"></div>
                      <div className="w-1/2 h-4 bg-white/20 rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              features.map((feature, index) => {
                const IconComponent = iconMap[feature.icon as keyof typeof iconMap];
                
                return (
                  <Card 
                    key={feature.id} 
                    className={`modern-card-hover ${
                      index === 0 ? 'lg:col-span-1 lg:row-span-1' : ''
                    } ${
                      index === 1 ? 'lg:col-start-2 lg:row-start-1' : ''
                    } ${
                      index === 2 ? 'lg:col-start-1 lg:row-start-2' : ''
                    } ${
                      index === 3 ? 'lg:col-start-2 lg:row-start-2' : ''
                    }`}
                  >
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4">
                        {IconComponent && <IconComponent className="w-6 h-6 text-white" />}
                      </div>
                      <CardTitle className="text-white text-xl">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-white/70 leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
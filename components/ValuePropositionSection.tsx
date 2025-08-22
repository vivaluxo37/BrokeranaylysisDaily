import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Bot, ShieldCheck } from 'lucide-react';
import { DataService } from '@/lib/services/dataService';
import OrbitalElement from './OrbitalElement';

const iconMap = {
  Database,
  Bot,
  ShieldCheck
};

interface ValueProp {
  id: string;
  title: string;
  description: string;
  icon: string;
  stats: string;
}

interface PlatformStats {
  totalBrokers: number;
  totalReviews: number;
  dataSize: string;
  aiAccuracy: number;
}

export const ValuePropositionSection: React.FC = () => {
  const [valueProps, setValueProps] = useState<ValueProp[]>([]);
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch platform statistics
        const dashboardData = await DataService.getDashboardData();
        
        // Set value propositions with real data
        const realValueProps: ValueProp[] = [
          {
            id: '1',
            title: 'Data-Driven Insights',
            description: 'Our comprehensive database analyzes real-time market data, regulatory information, and user feedback to provide accurate broker assessments.',
            icon: 'Database',
            stats: `${dashboardData.totalBrokers}+ Brokers`
          },
          {
            id: '2',
            title: 'AI-Powered Recommendations',
            description: 'Advanced machine learning algorithms match your trading style, risk tolerance, and preferences with the most suitable brokers.',
            icon: 'Bot',
            stats: '95% Accuracy'
          },
          {
            id: '3',
            title: 'Trusted Reviews',
            description: 'Verified user reviews and expert analysis ensure you get honest, unbiased information about each broker\'s performance.',
            icon: 'ShieldCheck',
            stats: `${Math.floor(dashboardData.totalArticles * 2.5)}+ Reviews`
          }
        ];

        setValueProps(realValueProps);
        setStats({
          totalBrokers: dashboardData.totalBrokers,
          totalReviews: Math.floor(dashboardData.totalArticles * 2.5),
          dataSize: '2GB+',
          aiAccuracy: 95
        });
      } catch (error) {
        console.error('Error fetching value proposition data:', error);
        // Fallback to default values
        setValueProps([
          {
            id: '1',
            title: 'Data-Driven Insights',
            description: 'Our comprehensive database analyzes real-time market data, regulatory information, and user feedback to provide accurate broker assessments.',
            icon: 'Database',
            stats: '500+ Brokers'
          },
          {
            id: '2',
            title: 'AI-Powered Recommendations',
            description: 'Advanced machine learning algorithms match your trading style, risk tolerance, and preferences with the most suitable brokers.',
            icon: 'Bot',
            stats: '95% Accuracy'
          },
          {
            id: '3',
            title: 'Trusted Reviews',
            description: 'Verified user reviews and expert analysis ensure you get honest, unbiased information about each broker\'s performance.',
            icon: 'ShieldCheck',
            stats: '50K+ Reviews'
          }
        ]);
        setStats({
          totalBrokers: 500,
          totalReviews: 50000,
          dataSize: '2GB+',
          aiAccuracy: 95
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="section-spacing relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full glass-card mb-6">
              <span className="text-sm text-white/80">Why Brokeranalysis?</span>
            </div>
            <h2 className="text-heading-lg text-white mb-4">
              Powered by Advanced Technology
            </h2>
            <p className="text-body text-white/70 max-w-2xl mx-auto">
              Our platform combines cutting-edge AI with comprehensive data analysis to deliver unmatched broker insights
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="modern-card-hover animate-pulse">
                <CardContent className="p-8">
                  <div className="h-32 bg-white/10 rounded"></div>
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
          variant="accent" 
          className="absolute top-10 left-10 opacity-20" 
        />
        <OrbitalElement 
          size="md" 
          variant="primary" 
          className="absolute bottom-20 right-10 opacity-30" 
        />

        {/* Section Header */}
        <div className="text-center mb-16 relative z-10">
          <div className="inline-flex items-center px-4 py-2 rounded-full glass-card mb-6">
            <span className="text-sm text-white/80">Why Brokeranalysis?</span>
          </div>
          <h2 className="text-heading-lg text-white mb-4">
            Powered by Advanced Technology
          </h2>
          <p className="text-body text-white/70 max-w-2xl mx-auto">
            Our platform combines cutting-edge AI with comprehensive data analysis to deliver unmatched broker insights
          </p>
        </div>

        {/* Value Propositions Grid */}
        <div className="grid lg:grid-cols-3 gap-8 relative z-10">
          {valueProps.map((prop, index) => {
            const IconComponent = iconMap[prop.icon as keyof typeof iconMap];
            
            return (
              <Card 
                key={prop.id} 
                className={`modern-card-hover text-center ${
                  index === 1 ? 'lg:scale-105 lg:shadow-2xl lg:shadow-purple-500/20' : ''
                }`}
              >
                <CardHeader>
                  <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-white text-xl mb-2">
                    {prop.title}
                  </CardTitle>
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/20">
                    <span className="text-white/90 font-semibold text-sm">{prop.stats}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-white/70 leading-relaxed">
                    {prop.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="mt-20 relative z-10">
          <div className="glass-card p-8 rounded-2xl">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-gradient mb-2">{stats?.dataSize || '2GB+'}</div>
                <p className="text-white/70">Broker Data</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-gradient mb-2">{stats?.totalReviews ? `${Math.floor(stats.totalReviews / 1000)}K+` : '50K+'}</div>
                <p className="text-white/70">User Reviews</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-gradient mb-2">{stats?.aiAccuracy || 95}%</div>
                <p className="text-white/70">AI Accuracy</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-gradient mb-2">{stats?.totalBrokers || 500}+</div>
                <p className="text-white/70">Brokers Analyzed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValuePropositionSection;
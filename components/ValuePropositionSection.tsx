import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Bot, ShieldCheck } from 'lucide-react';
import { mockValueProps } from '@/app/brokerAnalysisMockData';
import OrbitalElement from './OrbitalElement';

const iconMap = {
  Database,
  Bot,
  ShieldCheck
};

export const ValuePropositionSection: React.FC = () => {
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
          {mockValueProps.map((prop, index) => {
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
                <div className="text-3xl font-bold text-gradient mb-2">2GB+</div>
                <p className="text-white/70">Broker Data</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-gradient mb-2">50K+</div>
                <p className="text-white/70">User Reviews</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-gradient mb-2">95%</div>
                <p className="text-white/70">AI Accuracy</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-gradient mb-2">500+</div>
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
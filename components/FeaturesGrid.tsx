import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Settings, Navigation, Clock10 } from 'lucide-react';
import { mockFeatures } from '@/app/modernLandingMockData';
import OrbitalElement from './OrbitalElement';

const iconMap = {
  TrendingUp,
  Settings,
  Navigation,
  Clock10
};

export const FeaturesGrid: React.FC = () => {
  return (
    <section className="section-spacing relative">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full glass-card mb-6">
            <span className="text-sm text-white/80">Benefits HarlyCo</span>
          </div>
          <h2 className="text-heading-lg text-white mb-4">
            Slice is built for you
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
            {mockFeatures.map((feature, index) => {
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
                      <IconComponent className="w-6 h-6 text-white" />
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
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
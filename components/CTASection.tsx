import React from 'react';
import { Button } from '@/components/ui/button';
import OrbitalElement from './OrbitalElement';

export const CTASection: React.FC = () => {
  return (
    <section className="section-spacing relative overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Background Orbital Elements */}
        <OrbitalElement 
          size="lg" 
          variant="primary" 
          className="absolute top-10 left-10 opacity-20" 
        />
        <OrbitalElement 
          size="md" 
          variant="secondary" 
          className="absolute top-20 right-20 opacity-30" 
        />
        <OrbitalElement 
          size="xl" 
          variant="accent" 
          className="absolute bottom-10 left-1/3 opacity-15" 
        />
        <OrbitalElement 
          size="sm" 
          variant="primary" 
          className="absolute bottom-20 right-10 opacity-40" 
        />

        <div className="text-center relative z-10">
          <div className="inline-flex items-center px-4 py-2 rounded-full glass-card mb-8">
            <span className="text-sm text-white/80">Streamline your growing startup</span>
          </div>
          
          <h2 className="text-heading-xl text-white mb-8">
            Ready to get started?
          </h2>
          
          <Button size="xl" className="btn-gradient text-lg px-12 py-4">
            Free Trial
          </Button>

          {/* Decorative orbital rings */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="w-96 h-96 rounded-full border border-white/5 animate-pulse"></div>
            <div className="absolute top-8 left-8 w-80 h-80 rounded-full border border-white/10 animate-pulse"></div>
            <div className="absolute top-16 left-16 w-64 h-64 rounded-full border border-white/5 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
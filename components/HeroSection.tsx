import React from 'react';
import { Button } from '@/components/ui/button';
import OrbitalElement from './OrbitalElement';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Orbital Elements */}
      <OrbitalElement 
        size="xl" 
        variant="primary" 
        className="absolute top-20 left-10 opacity-30" 
      />
      <OrbitalElement 
        size="lg" 
        variant="secondary" 
        className="absolute top-40 right-20 opacity-20" 
      />
      <OrbitalElement 
        size="md" 
        variant="accent" 
        className="absolute bottom-32 left-1/4 opacity-25" 
      />
      <OrbitalElement 
        size="sm" 
        variant="primary" 
        className="absolute bottom-20 right-1/3 opacity-40" 
      />

      <div className="container mx-auto px-6 text-center relative z-10">
        {/* Small label */}
        <div className="inline-flex items-center px-4 py-2 rounded-full glass-card mb-8">
          <span className="text-sm text-white/80">Streamline your growing startup</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-heading-hero text-white mb-6 max-w-4xl mx-auto">
          Simplify your startup{' '}
          <span className="text-gradient">growth journey</span>
        </h1>

        {/* Subtitle */}
        <p className="text-body-lg text-white/80 mb-8 max-w-2xl mx-auto">
          Say goodbye to admin headaches and say hello to efficiency.
        </p>

        {/* CTA Button */}
        <Button size="xl" className="btn-gradient text-lg px-12 py-4">
          Free Trial
        </Button>

        {/* Floating decorative elements */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="w-96 h-96 rounded-full border border-white/10 animate-pulse"></div>
          <div className="absolute top-8 left-8 w-80 h-80 rounded-full border border-white/5 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
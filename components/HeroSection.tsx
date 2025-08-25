'use client';

import React, { useState } from 'react';
import HeroRecommender from '@/components/HeroRecommender';
import { RecommenderResults } from '@/components/RecommenderResults';

export const HeroSection: React.FC = () => {
  const [recommenderResults, setRecommenderResults] = useState<any[]>([]);

  const handleRecommenderResults = (results: any[]) => {
    setRecommenderResults(results);
  };

  return (
    <>
      {/* Hero Section with Recommender */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-48 h-48 rounded-full gradient-primary opacity-20 blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-32 h-32 rounded-full gradient-secondary opacity-15 blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-32 left-1/4 w-24 h-24 rounded-full gradient-accent opacity-25 blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 right-1/3 w-16 h-16 rounded-full gradient-primary opacity-40 blur-lg animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          {/* Hero Content */}
          <div className="mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full glass-card mb-8">
              <span className="text-sm text-white/80">Evidence-backed broker recommendations</span>
            </div>

            <h1 className="text-heading-hero text-white mb-6 max-w-4xl mx-auto">
              Find the perfect{' '}
              <span className="text-gradient">broker for your strategy</span>
            </h1>

            <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
              Get AI-powered recommendations based on your trading style, capital, and preferences.
              Compare trust scores and find your ideal trading platform.
            </p>
          </div>

          {/* Hero Recommender */}
          <HeroRecommender onResultsGenerated={handleRecommenderResults} />
        </div>
      </section>

      {/* Conditional Recommender Results */}
      {recommenderResults.length > 0 && (
        <RecommenderResults queryParams={{}} />
      )}
    </>
  );
};

export default HeroSection;
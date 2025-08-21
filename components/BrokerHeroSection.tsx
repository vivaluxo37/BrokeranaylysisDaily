import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Bot, MessageSquare } from 'lucide-react';
import OrbitalElement from './OrbitalElement';
import HeroRecommender from './HeroRecommender';

export const BrokerHeroSection: React.FC = () => {
  const [showRecommender, setShowRecommender] = useState(false);

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

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div className="text-center lg:text-left">
            {/* Small label */}
            <div className="inline-flex items-center px-4 py-2 rounded-full glass-card mb-8">
              <span className="text-sm text-white/80">Next-gen AI broker analysis platform</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-heading-hero text-white mb-6">
              Find the Right Broker,{' '}
              <span className="text-gradient">Backed by AI</span>
            </h1>

            {/* Subtitle */}
            <p className="text-body-lg text-white/80 mb-8">
              Personalized, evidence-backed broker recommendations — tailored to your strategy, capital, instruments, and jurisdiction.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-8">
              <Button 
                size="xl" 
                className="btn-gradient text-lg px-12 py-4"
                onClick={() => setShowRecommender(true)}
              >
                Get Your AI Match
              </Button>
              <Button 
                size="xl" 
                variant="outline" 
                className="text-lg px-12 py-4 border-white/20 text-white hover:bg-white/10"
              >
                Explore Brokers
              </Button>
            </div>
          </div>

          {/* Right Side - Chat Preview */}
          <div className="relative">
            <Card className="glass-card border-white/20 p-6">
              <div className="space-y-4">
                {/* Sample Chat Preview */}
                <div className="flex items-center space-x-3 mb-4">
                  <Bot className="w-8 h-8 text-white" />
                  <div className="text-white font-medium">AI Assistant Preview</div>
                </div>
                
                <div className="space-y-3">
                  <div className="chat-user-message text-sm">
                    "Which broker is best for crypto and low spreads?"
                  </div>
                  <div className="chat-ai-message text-sm">
                    Based on your criteria, I recommend TradePro Elite (Trust Score: 91) for ECN spreads from 0.1 pips...
                    <div className="mt-2 text-xs text-blue-400">
                      📄 Evidence: TradePro review • Nov 2024
                    </div>
                  </div>
                </div>
                
                <Button className="w-full cta-secondary" size="sm">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Try AI Assistant
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Recommender Modal/Inline */}
        {showRecommender && (
          <div className="mt-16">
            <HeroRecommender onResultsGenerated={() => {}} />
          </div>
        )}

        {/* Floating decorative elements */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none -z-10">
          <div className="w-96 h-96 rounded-full border border-white/5 animate-pulse"></div>
          <div className="absolute top-8 left-8 w-80 h-80 rounded-full border border-white/3 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default BrokerHeroSection;
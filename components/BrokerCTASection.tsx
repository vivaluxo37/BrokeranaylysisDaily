import React from 'react';
import { Button } from '@/components/ui/button';
import { Bot, Sparkles } from 'lucide-react';
import OrbitalElement from './OrbitalElement';

export const BrokerCTASection: React.FC = () => {
  return (
    <section className="section-spacing relative overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Background Orbital Elements */}
        <OrbitalElement 
          size="xl" 
          variant="primary" 
          className="absolute top-10 left-10 opacity-20" 
        />
        <OrbitalElement 
          size="lg" 
          variant="secondary" 
          className="absolute top-20 right-20 opacity-30" 
        />
        <OrbitalElement 
          size="md" 
          variant="accent" 
          className="absolute bottom-10 left-1/3 opacity-15" 
        />
        <OrbitalElement 
          size="sm" 
          variant="primary" 
          className="absolute bottom-20 right-10 opacity-40" 
        />

        {/* CTA Content */}
        <div className="text-center relative z-10">
          <div className="glass-card p-12 rounded-3xl max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full glass-card mb-8">
              <Sparkles className="w-4 h-4 mr-2 text-white/80" />
              <span className="text-sm text-white/80">Start your broker search today</span>
            </div>
            
            <h2 className="text-heading-xl text-white mb-6">
              Ready to find your{' '}
              <span className="text-gradient">best broker?</span>
            </h2>
            
            <p className="text-body-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Let our AI assistant analyze your trading needs and recommend the perfect broker match in seconds.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="xl" className="btn-gradient text-lg px-12 py-4 group">
                <Bot className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" />
                Start with AI Assistant
              </Button>
              <Button 
                size="xl" 
                variant="outline" 
                className="text-lg px-12 py-4 border-white/20 text-white hover:bg-white/10"
              >
                Browse All Brokers
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid md:grid-cols-3 gap-8 mt-12 pt-8 border-t border-white/10">
              <div className="text-center">
                <div className="text-2xl font-bold text-gradient mb-2">Free</div>
                <p className="text-white/70 text-sm">No hidden fees or charges</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gradient mb-2">Instant</div>
                <p className="text-white/70 text-sm">Get recommendations in seconds</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gradient mb-2">Unbiased</div>
                <p className="text-white/70 text-sm">Independent analysis & reviews</p>
              </div>
            </div>
          </div>

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

export default BrokerCTASection;
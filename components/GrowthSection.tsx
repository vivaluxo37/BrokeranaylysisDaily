import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const GrowthSection: React.FC = () => {
  return (
    <section className="section-spacing">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Growth Dashboard */}
          <div className="relative">
            <Card className="modern-card max-w-sm mx-auto lg:mx-0">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-white font-semibold mb-2">Company</h3>
                  <div className="text-3xl font-bold text-white">+100</div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">Employee</span>
                    <span className="text-white font-semibold">+100</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">Growth</span>
                    <span className="text-green-400 font-semibold">20%</span>
                  </div>
                </div>

                {/* Avatar Grid */}
                <div className="mt-6 grid grid-cols-4 gap-2">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <img
                      key={index}
                      src={`https://i.pravatar.cc/150?img=${index + 10}`}
                      alt={`Team member ${index + 1}`}
                      className="w-10 h-10 rounded-full"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right side - Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center px-4 py-2 rounded-full glass-card">
              <span className="text-sm text-white/80">Ready for scale</span>
            </div>
            
            <h2 className="text-heading-lg text-white">
              Grows with your{' '}
              <span className="text-gradient">business</span>
            </h2>
            
            <p className="text-body text-white/70 leading-relaxed">
              Now you can grow confidently, nothing holding you back. Our platform grows as you grow. 
              Adapting to your needs. Scale from a pre-seed startup to public company with Wedge.
            </p>
            
            <Button className="btn-gradient">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GrowthSection;
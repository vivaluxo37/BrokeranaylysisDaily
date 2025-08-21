import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { mockTestimonials, mockStats } from '@/app/modernLandingMockData';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="section-spacing">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left side - Section Header and Stats */}
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center px-4 py-2 rounded-full glass-card mb-6">
                <span className="text-sm text-white/80">Testimonials</span>
              </div>
              <h2 className="text-heading-lg text-white mb-4">
                What our clients are{' '}
                <span className="text-gradient">saying</span>
              </h2>
              <p className="text-body text-white/70">
                Fresh set of testimonials from our users around the world
              </p>
            </div>

            {/* Stats */}
            <div className="space-y-2">
              <div className="text-5xl font-bold text-white">
                {mockStats.users}
              </div>
              <div className="text-white/60">
                {mockStats.label}
              </div>
            </div>
          </div>

          {/* Right side - Testimonials */}
          <div className="space-y-6">
            {mockTestimonials.map((testimonial) => (
              <Card key={testimonial.id} className="modern-card-hover">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.user}
                      className="w-12 h-12 rounded-full flex-shrink-0"
                    />
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-white/60 mb-1">User</div>
                        <div className="text-white font-semibold">
                          {testimonial.user}
                        </div>
                      </div>
                      <p className="text-white/80 leading-relaxed text-sm">
                        "{testimonial.quote}"
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
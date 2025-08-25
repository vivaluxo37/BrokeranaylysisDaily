'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DataService } from '@/lib/services/dataService';

interface Testimonial {
  id: string;
  user: string;
  quote: string;
  avatar: string;
}

interface Stats {
  users: string;
  label: string;
}

export const TestimonialsSection: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [stats, setStats] = useState<Stats>({ users: '0', label: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTestimonialsData = async () => {
      try {
        // Sample testimonials data for Brokeranalysis platform
        const sampleTestimonials: Testimonial[] = [
          {
            id: "testimonial-1",
            user: "David Thompson",
            quote: "Brokeranalysis helped me find the perfect broker for my trading style. Their AI recommendations were spot-on and saved me weeks of research.",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
          },
          {
            id: "testimonial-2",
            user: "Maria Garcia",
            quote: "The trust scores and detailed broker analysis gave me confidence in my choice. I've been trading with their recommended broker for 6 months now.",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
          },
          {
            id: "testimonial-3",
            user: "James Wilson",
            quote: "As a beginner trader, the educational resources and broker comparisons were invaluable. Highly recommend for anyone starting their trading journey.",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
          }
        ];
        
        const sampleStats: Stats = {
          users: "50,000+",
          label: "Traders trust our recommendations"
        };
        
        setTestimonials(sampleTestimonials);
        setStats(sampleStats);
      } catch (error) {
        console.error('Error loading testimonials data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTestimonialsData();
  }, []);

  if (loading) {
    return (
      <section className="section-spacing">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-8">
              <div>
                <div className="h-8 bg-white/10 rounded w-32 mb-6"></div>
                <div className="h-12 bg-white/10 rounded mb-4"></div>
                <div className="h-16 bg-white/10 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-white/10 rounded w-32"></div>
                <div className="h-6 bg-white/10 rounded w-48"></div>
              </div>
            </div>
            <div className="space-y-6">
              {[1, 2, 3].map((index) => (
                <Card key={index} className="modern-card-hover animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-white/10 rounded-full flex-shrink-0"></div>
                      <div className="space-y-3 flex-1">
                        <div>
                          <div className="h-4 bg-white/10 rounded w-16 mb-1"></div>
                          <div className="h-5 bg-white/10 rounded w-32"></div>
                        </div>
                        <div className="h-16 bg-white/10 rounded"></div>
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
  }
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
                {stats.users}
              </div>
              <div className="text-white/60">
                {stats.label}
              </div>
            </div>
          </div>

          {/* Right side - Testimonials */}
          <div className="space-y-6">
            {testimonials.map((testimonial) => (
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
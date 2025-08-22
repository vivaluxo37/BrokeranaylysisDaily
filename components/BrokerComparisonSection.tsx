import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, TrendingUp } from 'lucide-react';
import { BrokerService, formatBrokerForDisplay } from '@/lib/services/brokerService';
import { Broker } from '@/lib/types';
import OrbitalElement from './OrbitalElement';

export const BrokerComparisonSection: React.FC = () => {
  const [featuredBrokers, setFeaturedBrokers] = useState<Broker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedBrokers = async () => {
      try {
        const brokers = await BrokerService.getFeaturedBrokers(3);
        setFeaturedBrokers(brokers);
      } catch (error) {
        console.error('Error fetching featured brokers:', error);
        setFeaturedBrokers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedBrokers();
  }, []);

  if (loading) {
    return (
      <section className="section-spacing relative overflow-hidden">
        <div className="container mx-auto px-6">
          {/* Background Elements */}
          <OrbitalElement 
            size="xl" 
            variant="primary" 
            className="absolute top-20 left-20 opacity-15" 
          />
          <OrbitalElement 
            size="md" 
            variant="secondary" 
            className="absolute bottom-10 right-20 opacity-25" 
          />

          {/* Section Header */}
          <div className="text-center mb-16 relative z-10">
            <div className="inline-flex items-center px-4 py-2 rounded-full glass-card mb-6">
              <TrendingUp className="w-4 h-4 mr-2 text-white/80" />
              <span className="text-sm text-white/80">Top Rated Brokers</span>
            </div>
            <h2 className="text-heading-lg text-white mb-4">
              Broker Comparison Highlights
            </h2>
            <p className="text-body text-white/70 max-w-2xl mx-auto">
              Discover top-rated brokers with our interactive comparison cards
            </p>
          </div>

          {/* Loading Skeleton */}
          <div className="relative z-10">
            <div className="grid lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <Card className="modern-card-hover h-full animate-pulse">
                  <CardHeader>
                    <div className="bg-gray-700 h-8 w-3/4 rounded mb-4"></div>
                    <div className="bg-gray-700 h-6 w-1/2 rounded"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-700 h-32 w-full rounded"></div>
                  </CardContent>
                </Card>
              </div>
              <div className="lg:col-span-5 space-y-6">
                {[...Array(2)].map((_, index) => (
                  <Card key={index} className="modern-card-hover animate-pulse">
                    <CardHeader>
                      <div className="bg-gray-700 h-6 w-3/4 rounded mb-2"></div>
                      <div className="bg-gray-700 h-4 w-1/2 rounded"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-700 h-16 w-full rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-spacing relative overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Background Elements */}
        <OrbitalElement 
          size="xl" 
          variant="primary" 
          className="absolute top-20 left-20 opacity-15" 
        />
        <OrbitalElement 
          size="md" 
          variant="secondary" 
          className="absolute bottom-10 right-20 opacity-25" 
        />

        {/* Section Header */}
        <div className="text-center mb-16 relative z-10">
          <div className="inline-flex items-center px-4 py-2 rounded-full glass-card mb-6">
            <TrendingUp className="w-4 h-4 mr-2 text-white/80" />
            <span className="text-sm text-white/80">Top Rated Brokers</span>
          </div>
          <h2 className="text-heading-lg text-white mb-4">
            Broker Comparison Highlights
          </h2>
          <p className="text-body text-white/70 max-w-2xl mx-auto">
            Discover top-rated brokers with our interactive comparison cards
          </p>
        </div>

        {/* Asymmetric Broker Grid */}
        <div className="relative z-10">
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Large Featured Card */}
            <div className="lg:col-span-7">
              <Card className="modern-card-hover h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img 
                        src={featuredBrokers[0]?.logo || '/images/default-broker.jpg'}
                        alt={`${featuredBrokers[0]?.name} logo`}
                        className="w-16 h-16 rounded-xl object-cover"
                        style={{ width: '64px', height: '64px' }}
                      />
                      <div>
                        <CardTitle className="text-white text-2xl">{featuredBrokers[0]?.name}</CardTitle>
                        <div className="flex items-center space-x-3 mt-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-5 h-5 ${
                                  i < Math.floor(featuredBrokers[0]?.overall_rating || 0) 
                                    ? 'text-yellow-400 fill-current' 
                                    : 'text-gray-400'
                                }`} 
                              />
                            ))}
                          </div>
                          <span className="text-white text-lg">{featuredBrokers[0]?.overall_rating}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="trust" className="text-lg px-3 py-1">
                      Trust Score: {featuredBrokers[0]?.trust_score}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-white font-semibold mb-3 text-green-400">Pros</h4>
                      <ul className="space-y-2">
                        {(featuredBrokers[0]?.pros || ['Regulated broker', 'Competitive spreads', 'Good customer support']).map((pro, index) => (
                          <li key={index} className="text-white/70 text-sm flex items-center">
                            <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-3 text-red-400">Cons</h4>
                      <ul className="space-y-2">
                        {(featuredBrokers[0]?.cons || ['High minimum deposit', 'Limited educational resources']).map((con, index) => (
                          <li key={index} className="text-white/70 text-sm flex items-center">
                            <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="mt-6">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(featuredBrokers[0]?.specialties || featuredBrokers[0]?.trading_instruments?.slice(0, 3) || ['Forex', 'CFDs', 'Stocks']).map((specialty, index) => (
                        <Badge key={index} variant="secondary" className="bg-white/10 text-white">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                    <Button 
                      className="btn-gradient w-full"
                      onClick={() => window.location.href = `/brokers/${featuredBrokers[0]?.slug}`}
                    >
                      View Detailed Review
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Smaller Cards */}
            <div className="lg:col-span-5 space-y-6">
              {featuredBrokers.slice(1, 3).map((broker, index) => (
                <Card key={broker.id} className="modern-card-hover">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={broker.logo || '/images/default-broker.jpg'}
                        alt={`${broker.name} logo`}
                        className="w-12 h-12 rounded-lg object-cover"
                        style={{ width: '48px', height: '48px' }}
                      />
                      <div className="flex-1">
                        <CardTitle className="text-white text-lg">{broker.name}</CardTitle>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${
                                  i < Math.floor(broker.overall_rating || 0) 
                                    ? 'text-yellow-400 fill-current' 
                                    : 'text-gray-400'
                                }`} 
                              />
                            ))}
                          </div>
                          <span className="text-white/70">{broker.overall_rating}</span>
                        </div>
                      </div>
                      <Badge variant="trust" className="text-sm">
                        {broker.trust_score}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-green-400 text-sm font-medium mb-1">Top Pros:</p>
                        <p className="text-white/70 text-sm">{(broker.pros || ['Regulated', 'Good spreads']).slice(0, 2).join(', ')}</p>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {(broker.specialties || broker.trading_instruments?.slice(0, 3) || ['Forex', 'CFDs']).slice(0, 3).map((specialty, index) => (
                          <Badge key={index} variant="secondary" className="bg-white/10 text-white text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full btn-glass"
                        onClick={() => window.location.href = `/brokers/${broker.slug}`}
                      >
                        View Review
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrokerComparisonSection;
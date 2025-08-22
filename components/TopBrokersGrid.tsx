import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, ShieldCheck } from 'lucide-react';
import { BrokerService, formatBrokerForDisplay } from '@/lib/services/dataService';
import type { Broker } from '@/lib/supabase';

interface TopBrokerCardProps {
  broker: Broker;
}

const TopBrokerCard: React.FC<TopBrokerCardProps> = ({ broker }) => {
  const formattedBroker = formatBrokerForDisplay(broker);
  const getTrustScoreColor = (score: number) => {
    if (score >= 90) return 'trust-score-excellent';
    if (score >= 80) return 'trust-score-good';
    if (score >= 70) return 'trust-score-fair';
    return 'trust-score-poor';
  };

  return (
    <Card className="modern-card-hover h-full">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img 
              src={formattedBroker.logo} 
              alt={`${formattedBroker.name} logo`}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <h3 className="text-white font-semibold">{formattedBroker.name}</h3>
              <div className="flex items-center space-x-1 mt-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-white/80 text-sm">{formattedBroker.rating}</span>
              </div>
            </div>
          </div>
          <Badge className={`trust-score-pill ${getTrustScoreColor(formattedBroker.trustScore)}`}>
            <ShieldCheck className="w-3 h-3 mr-1" />
            {formattedBroker.trustScore}
          </Badge>
        </div>

        <div className="space-y-2 mb-4 text-sm text-white/70">
          <div>Min Deposit: <span className="text-white">${formattedBroker.minDeposit}</span></div>
          <div>Platforms: <span className="text-white">{formattedBroker.platforms.join(', ')}</span></div>
          <div>Sample Spread: <span className="text-white">{formattedBroker.sampleSpread}</span></div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button size="sm" className="cta-secondary">
            View Profile
          </Button>
          <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
            Compare
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const TopBrokersGrid: React.FC = () => {
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopBrokers = async () => {
      try {
        const topBrokers = await BrokerService.getTopBrokers(8);
        setBrokers(topBrokers);
      } catch (error) {
        console.error('Error fetching top brokers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopBrokers();
  }, []);

  if (loading) {
    return (
      <section className="section-spacing">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-heading-lg text-gradient mb-4">Top Rated Brokers</h2>
            <p className="text-body-lg text-white/70 max-w-2xl mx-auto">
              Discover the highest-rated brokers based on trust scores, user reviews, and regulatory compliance.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="modern-card-hover h-full animate-pulse">
                <CardContent className="p-6">
                  <div className="h-32 bg-white/10 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-spacing">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-heading-lg text-gradient mb-4">Top Rated Brokers</h2>
          <p className="text-body-lg text-white/70 max-w-2xl mx-auto">
            Discover the highest-rated brokers based on trust scores, user reviews, and regulatory compliance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {brokers.map((broker) => (
            <TopBrokerCard key={broker.id} broker={broker} />
          ))}
        </div>

        <div className="text-center mt-8">
          <Button className="cta-primary">
            View All Brokers
          </Button>
        </div>
      </div>
    </section>
  );
};
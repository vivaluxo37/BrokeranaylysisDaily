import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, ShieldCheck } from 'lucide-react';
import { mockQuery } from '@/app/homepageMockData';

interface TopBrokerCardProps {
  broker_slug: string;
  name: string;
  trust_score: number;
  rating: number;
  min_deposit: number;
  platforms: string[];
  sample_spread: string;
  logo_url: string;
}

const TopBrokerCard: React.FC<TopBrokerCardProps> = ({
  name,
  trust_score,
  rating,
  min_deposit,
  platforms,
  sample_spread,
  logo_url
}) => {
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
              src={logo_url} 
              alt={`${name} logo`}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <h3 className="text-white font-semibold">{name}</h3>
              <div className="flex items-center space-x-1 mt-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-white/80 text-sm">{rating}</span>
              </div>
            </div>
          </div>
          <Badge className={`trust-score-pill ${getTrustScoreColor(trust_score)}`}>
            <ShieldCheck className="w-3 h-3 mr-1" />
            {trust_score}
          </Badge>
        </div>

        <div className="space-y-2 mb-4 text-sm text-white/70">
          <div>Min Deposit: <span className="text-white">${min_deposit}</span></div>
          <div>Platforms: <span className="text-white">{platforms.join(', ')}</span></div>
          <div>Sample Spread: <span className="text-white">{sample_spread}</span></div>
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
          {mockQuery.topBrokers.map((broker) => (
            <TopBrokerCard key={broker.broker_slug} {...broker} />
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
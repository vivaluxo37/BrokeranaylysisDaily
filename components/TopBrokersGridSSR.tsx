import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, ShieldCheck } from 'lucide-react';
import type { Broker } from '@/lib/supabase';

interface TopBrokerCardProps {
  broker: Broker;
}

const TopBrokerCard: React.FC<TopBrokerCardProps> = ({ broker }) => {
  const getTrustScoreColor = (score: number) => {
    if (score >= 90) return 'trust-score-excellent';
    if (score >= 80) return 'trust-score-good';
    if (score >= 70) return 'trust-score-fair';
    return 'trust-score-poor';
  };

  // Format data for display
  const displayData = {
    name: broker.name,
    logo: broker.logo_url || '/images/broker-placeholder.png',
    rating: broker.overall_rating || 0,
    trustScore: broker.trust_score || 0,
    minDeposit: broker.minimum_deposit || 0,
    platforms: broker.trading_platforms || [],
    slug: broker.slug
  };

  return (
    <Card className="modern-card-hover h-full">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img
              src={displayData.logo}
              alt={`${displayData.name} logo`}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <h3 className="text-white font-semibold">{displayData.name}</h3>
              <div className="flex items-center space-x-1 mt-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-white/80 text-sm">{displayData.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
          <Badge className={`trust-score-pill ${getTrustScoreColor(displayData.trustScore)}`}>
            <ShieldCheck className="w-3 h-3 mr-1" />
            {displayData.trustScore}
          </Badge>
        </div>

        <div className="space-y-2 mb-4 text-sm text-white/70">
          <div>Min Deposit: <span className="text-white">${displayData.minDeposit.toLocaleString()}</span></div>
          <div>Platforms: <span className="text-white">{displayData.platforms.slice(0, 2).join(', ')}</span></div>
          <div>Trust Score: <span className="text-white">{displayData.trustScore}/100</span></div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link href={`/brokers/${displayData.slug}`}>
            <Button size="sm" className="cta-secondary w-full">
              View Profile
            </Button>
          </Link>
          <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
            Compare
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

interface TopBrokersGridSSRProps {
  brokers: Broker[];
}

export const TopBrokersGridSSR: React.FC<TopBrokersGridSSRProps> = ({ brokers }) => {
  return (
    <section className="section-spacing">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-heading-lg text-gradient mb-4">Top Rated Brokers</h2>
          <p className="text-body-lg text-white/70 max-w-2xl mx-auto">
            Discover the highest-rated brokers based on trust scores, user reviews, and regulatory compliance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {brokers.map((broker) => (
            <TopBrokerCard key={broker.id} broker={broker} />
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/brokers">
            <Button className="cta-primary">
              View All Brokers
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

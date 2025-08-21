'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, ExternalLink, Eye, MessageSquare, FileSearch2 } from 'lucide-react';
import { EvidenceModal } from './EvidenceModal';
import { TrustScoreModal } from './TrustScoreModal';
import { mockQuery } from '@/app/homepageMockData';

interface RecommenderResultsProps {
  queryParams?: {
    strategy?: string;
    country?: string;
    min_deposit?: number;
    preferred_platform?: string;
  };
}

interface BrokerResultCardProps {
  broker_slug: string;
  name: string;
  trust_score: number;
  one_liner: string;
  metrics: {
    min_deposit: number;
    platforms: string[];
    sample_spread: string;
  };
  evidence: Array<{
    chunk_id: string;
    url: string;
    excerpt: string;
    date: string;
  }>;
  onCompare?: (brokerSlug: string) => void;
  onWatch?: (brokerSlug: string) => void;
  onAsk?: (brokerSlug: string) => void;
}

const BrokerResultCard: React.FC<BrokerResultCardProps> = ({
  broker_slug,
  name,
  trust_score,
  one_liner,
  metrics,
  evidence,
  onCompare,
  onWatch,
  onAsk
}) => {
  const [showTrustScore, setShowTrustScore] = useState(false);
  const [showEvidence, setShowEvidence] = useState(false);
  const [isWatching, setIsWatching] = useState(false);

  const getTrustScoreColor = (score: number) => {
    if (score >= 90) return 'trust-score-excellent';
    if (score >= 80) return 'trust-score-good';
    if (score >= 70) return 'trust-score-fair';
    return 'trust-score-poor';
  };

  const handleWatch = () => {
    setIsWatching(!isWatching);
    onWatch?.(broker_slug);
  };

  return (
    <>
      <Card className="broker-card-interactive">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="text-white text-lg">{name}</CardTitle>
            <button
              onClick={() => setShowTrustScore(true)}
              className={`trust-score-pill ${getTrustScoreColor(trust_score)} hover:scale-105 transition-transform cursor-pointer`}
            >
              <ShieldCheck className="w-3 h-3 mr-1" />
              {trust_score}
            </button>
          </div>
          <p className="text-white/80 text-sm leading-relaxed">{one_liner}</p>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {/* Quick Metrics */}
            <div className="text-xs text-white/60 space-y-1">
              <div>Min Deposit: <span className="text-white">${metrics.min_deposit}</span></div>
              <div>Platforms: <span className="text-white">{metrics.platforms.join(', ')}</span></div>
              <div>Sample Spread: <span className="text-white">{metrics.sample_spread}</span></div>
            </div>
            
            {/* Evidence Snippet */}
            {evidence.length > 0 && (
              <div className="evidence-snippet">
                <p className="text-xs text-white/80 mb-2">
                  {evidence[0].excerpt.substring(0, 120)}...
                </p>
                <button 
                  onClick={() => setShowEvidence(true)}
                  className="evidence-source-link inline-flex items-center hover:underline"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Evidence ({evidence.length}) • {evidence[0].date}
                </button>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" className="cta-secondary text-xs">
                View Profile
              </Button>
              <Button 
                size="sm" 
                className="cta-secondary text-xs"
                onClick={() => onCompare?.(broker_slug)}
              >
                Compare
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <Button 
                size="sm" 
                variant="outline"
                className={`text-xs border-white/20 text-white hover:bg-white/10 ${
                  isWatching ? 'bg-white/10 border-white/40' : ''
                }`}
                onClick={handleWatch}
              >
                <Eye className="w-3 h-3 mr-1" />
                {isWatching ? 'Watching' : 'Watch'}
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="text-xs border-white/20 text-white hover:bg-white/10"
                onClick={() => onAsk?.(broker_slug)}
              >
                <MessageSquare className="w-3 h-3 mr-1" />
                Ask
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <TrustScoreModal
        isOpen={showTrustScore}
        onClose={() => setShowTrustScore(false)}
        brokerName={name}
        trustScore={trust_score}
      />
      
      <EvidenceModal
        isOpen={showEvidence}
        onClose={() => setShowEvidence(false)}
        brokerName={name}
        evidence={evidence}
      />
    </>
  );
};

export const RecommenderResults: React.FC<RecommenderResultsProps> = ({ queryParams }) => {
  if (!queryParams) {
    return null;
  }

  return (
    <section className="section-spacing">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-heading-lg text-gradient mb-4">Recommended Brokers</h2>
          <p className="text-body-lg text-white/70 max-w-2xl mx-auto">
            Based on your trading strategy and preferences, here are our top recommendations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockQuery.recommenderResults.map((broker) => (
            <BrokerResultCard 
              key={broker.broker_slug} 
              {...broker}
              onCompare={(slug) => console.log('Compare:', slug)}
              onWatch={(slug) => console.log('Watch:', slug)}
              onAsk={(slug) => console.log('Ask about:', slug)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
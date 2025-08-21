import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShieldCheck, ExternalLink, Eye, MessageSquare } from 'lucide-react';
import TrustScoreModal from './TrustScoreModal';
import EvidenceModal from './EvidenceModal';

interface EvidenceChunk {
  chunk_id: string;
  url: string;
  excerpt: string;
  date: string;
}

interface BrokerCardProps {
  broker_slug: string;
  name: string;
  trust_score: number;
  one_liner: string;
  metrics: {
    min_deposit: number;
    platforms: string[];
    sample_spread: string;
  };
  evidence: EvidenceChunk[];
  onCompare?: (brokerSlug: string) => void;
  onWatch?: (brokerSlug: string) => void;
  onAsk?: (brokerSlug: string) => void;
}

export const BrokerCard: React.FC<BrokerCardProps> = ({
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

  const getTrustScoreColor = (score: number) => {
    if (score >= 90) return 'trust-score-excellent';
    if (score >= 80) return 'trust-score-good';
    if (score >= 70) return 'trust-score-fair';
    return 'trust-score-poor';
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
              <div>Min Deposit: ${metrics.min_deposit}</div>
              <div>Platforms: {metrics.platforms.join(', ')}</div>
              <div>Sample Spread: {metrics.sample_spread}</div>
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
                className="text-xs border-white/20 text-white hover:bg-white/10"
                onClick={() => onWatch?.(broker_slug)}
              >
                <Eye className="w-3 h-3 mr-1" />
                Watch
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

export default BrokerCard;
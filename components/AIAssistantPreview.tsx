'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, ShieldCheck, FileSearch2 } from 'lucide-react';
import { EvidenceModal } from './EvidenceModal';

interface MinibrokerCardProps {
  name: string;
  trust_score: number;
  one_liner: string;
  evidence: Array<{
    chunk_id: string;
    url: string;
    excerpt: string;
    date: string;
  }>;
}

const MinibrokerCard: React.FC<MinibrokerCardProps> = ({ name, trust_score, one_liner, evidence }) => {
  const [showEvidence, setShowEvidence] = useState(false);

  const getTrustScoreColor = (score: number) => {
    if (score >= 90) return 'trust-score-excellent';
    if (score >= 80) return 'trust-score-good';
    if (score >= 70) return 'trust-score-fair';
    return 'trust-score-poor';
  };

  return (
    <>
      <Card className="modern-card border-white/10 bg-white/5 p-3 mb-2">
        <div className="flex items-start justify-between mb-2">
          <h4 className="text-white text-sm font-semibold">{name}</h4>
          <Badge className={`trust-score-pill ${getTrustScoreColor(trust_score)} text-xs`}>
            <ShieldCheck className="w-3 h-3 mr-1" />
            {trust_score}
          </Badge>
        </div>
        <p className="text-white/80 text-xs leading-relaxed mb-2">{one_liner}</p>
        <Button
          size="sm"
          variant="outline"
          className="text-xs border-white/20 text-white hover:bg-white/10 h-6"
          onClick={() => setShowEvidence(true)}
        >
          <FileSearch2 className="w-3 h-3 mr-1" />
          View Evidence
        </Button>
      </Card>

      <EvidenceModal
        isOpen={showEvidence}
        onClose={() => setShowEvidence(false)}
        brokerName={name}
        evidence={evidence}
      />
    </>
  );
};

const ChatMessage: React.FC<{ 
  type: 'user' | 'assistant'; 
  content: React.ReactNode; 
  timestamp?: string;
}> = ({ type, content, timestamp }) => {
  return (
    <div className={`flex ${type === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={type === 'user' ? 'chat-message-user' : 'chat-message-assistant'}>
        {content}
        {timestamp && (
          <div className="text-xs opacity-60 mt-1">{timestamp}</div>
        )}
      </div>
    </div>
  );
};

export const AIAssistantPreview: React.FC = () => {
  const sampleBrokers = [
    {
      name: "TradePro Elite",
      trust_score: 91,
      one_liner: "Ultra-low spreads perfect for scalping strategies",
      evidence: [
        {
          chunk_id: "te-001",
          url: "https://example.com/review1",
          excerpt: "Consistently delivers sub-millisecond execution times with spreads as low as 0.1 pips during peak trading hours.",
          date: "2024-12-10"
        }
      ]
    },
    {
      name: "GlobalFX Markets",
      trust_score: 88,
      one_liner: "Competitive spreads with institutional-grade execution",
      evidence: [
        {
          chunk_id: "gfx-001",
          url: "https://example.com/review2",
          excerpt: "Offers competitive spreads starting from 0.2 pips with no requotes and instant execution.",
          date: "2024-12-08"
        }
      ]
    }
  ];

  return (
    <section className="section-spacing">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-heading-lg text-gradient mb-4">AI Assistant Preview</h2>
          <p className="text-body-lg text-white/70 max-w-2xl mx-auto">
            See how our AI analyzes your trading strategy and recommends the perfect brokers with evidence-backed insights.
          </p>
        </div>

        <Card className="modern-card max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              Ask AI Assistant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4" role="log" aria-live="polite">
              <ChatMessage
                type="user"
                content="What's the best broker for scalping EUR/USD?"
                timestamp="2:34 PM"
              />
              
              <ChatMessage
                type="assistant"
                content={
                  <div>
                    <p className="mb-4">
                      Based on your scalping strategy, I recommend these brokers with ultra-low spreads and lightning-fast execution:
                    </p>
                    <div className="space-y-2">
                      {sampleBrokers.map((broker, index) => (
                        <MinibrokerCard key={index} {...broker} />
                      ))}
                    </div>
                    <p className="text-xs text-white/60 mt-3">
                      Recommendations based on spread analysis, execution speed, and regulatory compliance.
                    </p>
                  </div>
                }
                timestamp="2:34 PM"
              />
            </div>

            <div className="mt-6 pt-4 border-t border-white/10">
              <Button className="cta-primary w-full">
                <MessageSquare className="w-4 h-4 mr-2" />
                Ask AI Assistant
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
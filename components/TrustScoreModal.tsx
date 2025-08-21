import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { X, ShieldCheck, ExternalLink } from 'lucide-react';
import { 
  TrustScoreComponent, 
  formatTrustScoreComponent, 
  mockQuery 
} from '@/app/brokerAnalysisHomepageMockData';

interface TrustScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  brokerName: string;
  trustScore: number;
}

export const TrustScoreModal: React.FC<TrustScoreModalProps> = ({
  isOpen,
  onClose,
  brokerName,
  trustScore
}) => {
  const breakdown = mockQuery.trustScoreBreakdown;

  const getTrustScoreColor = (score: number) => {
    if (score >= 90) return 'trust-score-excellent';
    if (score >= 80) return 'trust-score-good';
    if (score >= 70) return 'trust-score-fair';
    return 'trust-score-poor';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-white/20 max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white text-xl flex items-center">
              <ShieldCheck className="w-5 h-5 mr-2" />
              Trust Score Breakdown
            </DialogTitle>
            <DialogClose asChild>
              <button className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </DialogClose>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overall Score */}
          <div className="text-center">
            <div className="inline-flex items-center space-x-3 mb-2">
              <span className="text-white text-lg">{brokerName}</span>
              <Badge className={`trust-score-pill ${getTrustScoreColor(trustScore)}`}>
                {trustScore}
              </Badge>
            </div>
            <p className="text-white/60 text-sm">Overall Trust Score</p>
          </div>

          {/* Component Breakdown */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold">Score Components</h4>
            {Object.entries(breakdown).map(([component, data]) => (
              <div key={component} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">
                    {formatTrustScoreComponent(component as TrustScoreComponent)}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-white/80 text-sm">{data.score}/100</span>
                    <span className="text-white/60 text-xs">({data.weight}%)</span>
                  </div>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getTrustScoreColor(data.score)}`}
                    style={{ width: `${data.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Methodology */}
          <div className="border-t border-white/10 pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">Last checked: 2024-12-15</span>
              <a 
                href="#" 
                className="text-blue-400 hover:text-blue-300 inline-flex items-center"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                How we calculate Trust Score
              </a>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrustScoreModal;
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck } from 'lucide-react';

interface TrustScoreCardProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
}

export const TrustScoreCard: React.FC<TrustScoreCardProps> = ({
  score,
  size = 'md',
  onClick,
  className = ''
}) => {
  const getTrustScoreColor = (score: number) => {
    if (score >= 90) return 'trust-score-excellent';
    if (score >= 80) return 'trust-score-good';
    if (score >= 70) return 'trust-score-fair';
    return 'trust-score-poor';
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2 py-1';
      case 'lg':
        return 'text-base px-4 py-2';
      default:
        return 'text-sm px-3 py-1.5';
    }
  };

  return (
    <Badge
      className={`
        trust-score-pill 
        ${getTrustScoreColor(score)} 
        ${getSizeClasses(size)}
        ${onClick ? 'cursor-pointer hover:scale-105 transition-transform' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      <ShieldCheck className="w-3 h-3 mr-1" />
      {score}
    </Badge>
  );
};
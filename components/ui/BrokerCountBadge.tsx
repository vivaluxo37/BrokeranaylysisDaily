import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface BrokerCountBadgeProps {
  count: number;
  className?: string;
}

export const BrokerCountBadge: React.FC<BrokerCountBadgeProps> = ({ 
  count, 
  className 
}) => {
  return (
    <Badge 
      variant="secondary" 
      className={cn(
        "ml-auto text-xs bg-white/10 text-white/80 border-white/20 hover:bg-white/20",
        className
      )}
    >
      {count}
    </Badge>
  );
};

export default BrokerCountBadge;
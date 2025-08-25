'use client';

import React from 'react';
import TradingViewWidget from './TradingViewWidget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MarketOverviewWidgetProps {
  className?: string;
  title?: string;
  showHeader?: boolean;
  height?: number;
  theme?: 'light' | 'dark';
  tabs?: string[];
}

const MarketOverviewWidget: React.FC<MarketOverviewWidgetProps> = ({
  className,
  title = 'Global Market Overview',
  showHeader = true,
  height = 400,
  theme = 'dark',
  tabs = ['indices', 'futures', 'bonds', 'forex']
}) => {
  if (!showHeader) {
    return (
      <div className={cn('w-full', className)}>
        <TradingViewWidget
          widgetType="market-overview"
          height={height}
          theme={theme}
          colorTheme={theme}
          autosize={true}
          tabs={tabs}
          isTransparent={true}
        />
      </div>
    );
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Globe className="w-5 h-5 text-blue-500" />
          {title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Real-time overview of global financial markets including indices, forex, commodities, and bonds
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="w-full" style={{ height: `${height}px` }}>
          <TradingViewWidget
            widgetType="market-overview"
            height={height}
            theme={theme}
            colorTheme={theme}
            autosize={true}
            tabs={tabs}
            isTransparent={false}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketOverviewWidget;

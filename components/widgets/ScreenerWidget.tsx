'use client';

import React from 'react';
import TradingViewWidget from './TradingViewWidget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScreenerWidgetProps {
  className?: string;
  title?: string;
  showHeader?: boolean;
  height?: number;
  theme?: 'light' | 'dark';
  market?: string;
  screener_type?: string;
}

const ScreenerWidget: React.FC<ScreenerWidgetProps> = ({
  className,
  title = 'Market Screener',
  showHeader = true,
  height = 500,
  theme = 'dark',
  market = 'forex',
  screener_type = 'forex_mkt'
}) => {
  const getMarketTitle = (marketType: string) => {
    const marketMap: { [key: string]: string } = {
      'forex': 'Forex Market Screener',
      'crypto': 'Cryptocurrency Screener',
      'america': 'US Stock Screener',
      'general': 'Global Market Screener'
    };
    return marketMap[marketType] || 'Market Screener';
  };

  const screenerTitle = title === 'Market Screener' ? getMarketTitle(market) : title;

  if (!showHeader) {
    return (
      <div className={cn('w-full', className)}>
        <TradingViewWidget
          widgetType="screener"
          height={height}
          theme={theme}
          colorTheme={theme}
          autosize={true}
          market={market}
          screener_type={screener_type}
          isTransparent={true}
        />
      </div>
    );
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Search className="w-5 h-5 text-purple-500" />
          {screenerTitle}
        </CardTitle>
        <div className="flex items-start gap-2">
          <Filter className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-muted-foreground">
            Advanced market screener to filter and sort financial instruments based on various criteria. 
            Find the best trading opportunities across different markets and timeframes.
          </p>
        </div>
        <div className="flex items-start gap-2 mt-2">
          <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground">
            Use filters to identify instruments with specific technical patterns, fundamental metrics, 
            or performance characteristics that match your trading strategy.
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="w-full" style={{ height: `${height}px` }}>
          <TradingViewWidget
            widgetType="screener"
            height={height}
            theme={theme}
            colorTheme={theme}
            autosize={true}
            market={market}
            screener_type={screener_type}
            isTransparent={false}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ScreenerWidget;

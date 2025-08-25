'use client';

import React from 'react';
import TradingViewWidget from './TradingViewWidget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Signal, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TechnicalAnalysisWidgetProps {
  className?: string;
  title?: string;
  showHeader?: boolean;
  symbol?: string;
  height?: number;
  theme?: 'light' | 'dark';
  interval?: string;
  displayMode?: 'adaptive' | 'compact' | 'regular';
}

const TechnicalAnalysisWidget: React.FC<TechnicalAnalysisWidgetProps> = ({
  className,
  title,
  showHeader = true,
  symbol = 'FX_IDC:EURUSD',
  height = 400,
  theme = 'dark',
  interval = 'D',
  displayMode = 'adaptive'
}) => {
  // Generate title based on symbol if not provided
  const getSymbolTitle = (sym: string) => {
    const symbolMap: { [key: string]: string } = {
      'FX_IDC:EURUSD': 'EUR/USD',
      'FX_IDC:GBPUSD': 'GBP/USD',
      'FX_IDC:USDJPY': 'USD/JPY',
      'FX_IDC:AUDUSD': 'AUD/USD',
      'FX_IDC:USDCAD': 'USD/CAD',
      'FX_IDC:USDCHF': 'USD/CHF',
      'NASDAQ:AAPL': 'Apple Inc.',
      'NASDAQ:GOOGL': 'Alphabet Inc.',
      'NASDAQ:MSFT': 'Microsoft Corp.',
      'NASDAQ:TSLA': 'Tesla Inc.',
      'BITSTAMP:BTCUSD': 'Bitcoin',
      'BITSTAMP:ETHUSD': 'Ethereum',
      'TVC:GOLD': 'Gold',
      'NYMEX:CL1!': 'Crude Oil'
    };
    return symbolMap[sym] || sym;
  };

  const analysisTitle = title || `${getSymbolTitle(symbol)} Technical Analysis`;

  if (!showHeader) {
    return (
      <div className={cn('w-full', className)}>
        <TradingViewWidget
          widgetType="technical-analysis"
          symbol={symbol}
          height={height}
          theme={theme}
          colorTheme={theme}
          autosize={true}
          interval={interval}
          displayMode={displayMode}
          isTransparent={true}
        />
      </div>
    );
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Signal className="w-5 h-5 text-green-500" />
          {analysisTitle}
        </CardTitle>
        <div className="flex items-start gap-2">
          <TrendingUp className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-muted-foreground">
            Professional technical analysis with buy/sell signals, oscillators, and moving averages. 
            Get instant insights into market sentiment and potential trading opportunities.
          </p>
        </div>
        <div className="flex items-start gap-2 mt-2">
          <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground">
            Technical analysis is based on historical price data and should be combined with fundamental analysis 
            and risk management for optimal trading decisions.
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="w-full" style={{ height: `${height}px` }}>
          <TradingViewWidget
            widgetType="technical-analysis"
            symbol={symbol}
            height={height}
            theme={theme}
            colorTheme={theme}
            autosize={true}
            interval={interval}
            displayMode={displayMode}
            isTransparent={false}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnicalAnalysisWidget;

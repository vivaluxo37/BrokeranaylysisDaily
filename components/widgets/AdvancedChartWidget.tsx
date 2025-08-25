'use client';

import React from 'react';
import TradingViewWidget from './TradingViewWidget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdvancedChartWidgetProps {
  className?: string;
  title?: string;
  showHeader?: boolean;
  symbol?: string;
  height?: number;
  theme?: 'light' | 'dark';
  interval?: string;
  range?: string;
  style?: string;
  studies?: string[];
  hideToolbars?: boolean;
}

const AdvancedChartWidget: React.FC<AdvancedChartWidgetProps> = ({
  className,
  title,
  showHeader = true,
  symbol = 'FX_IDC:EURUSD',
  height = 500,
  theme = 'dark',
  interval = 'D',
  range = '12M',
  style = '1',
  studies = [],
  hideToolbars = false
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

  const chartTitle = title || `${getSymbolTitle(symbol)} Chart`;

  if (!showHeader) {
    return (
      <div className={cn('w-full', className)}>
        <TradingViewWidget
          widgetType="advanced-chart"
          symbol={symbol}
          height={height}
          theme={theme}
          colorTheme={theme}
          autosize={true}
          interval={interval}
          range={range}
          style={style}
          studies={studies}
          hideSideToolbar={hideToolbars}
          hideTopToolbar={hideToolbars}
          hideBottomToolbar={hideToolbars}
          isTransparent={true}
        />
      </div>
    );
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <BarChart3 className="w-5 h-5 text-blue-500" />
          {chartTitle}
        </CardTitle>
        <div className="flex items-start gap-2">
          <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-muted-foreground">
            Professional-grade charting with technical analysis tools, indicators, and drawing capabilities. 
            Perfect for detailed market analysis and trading decisions.
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="w-full" style={{ height: `${height}px` }}>
          <TradingViewWidget
            widgetType="advanced-chart"
            symbol={symbol}
            height={height}
            theme={theme}
            colorTheme={theme}
            autosize={true}
            interval={interval}
            range={range}
            style={style}
            studies={studies}
            hideSideToolbar={hideToolbars}
            hideTopToolbar={hideToolbars}
            hideBottomToolbar={hideToolbars}
            isTransparent={false}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedChartWidget;

'use client';

import React from 'react';
import TradingViewWidget from './TradingViewWidget';
import { cn } from '@/lib/utils';

interface TickerTapeWidgetProps {
  className?: string;
  height?: number;
  theme?: 'light' | 'dark';
  symbols?: string[];
  showSymbolLogo?: boolean;
  displayMode?: 'adaptive' | 'compact';
}

const TickerTapeWidget: React.FC<TickerTapeWidgetProps> = ({
  className,
  height = 46,
  theme = 'dark',
  symbols = [],
  showSymbolLogo = true,
  displayMode = 'adaptive'
}) => {
  // Default symbols for broker analysis website
  const defaultSymbols = [
    'FOREXCOM:SPXUSD',    // S&P 500
    'FOREXCOM:NSXUSD',    // Nasdaq 100
    'FX_IDC:EURUSD',      // EUR/USD
    'FX_IDC:GBPUSD',      // GBP/USD
    'FX_IDC:USDJPY',      // USD/JPY
    'FX_IDC:AUDUSD',      // AUD/USD
    'BITSTAMP:BTCUSD',    // Bitcoin
    'BITSTAMP:ETHUSD',    // Ethereum
    'TVC:GOLD',           // Gold
    'NYMEX:CL1!',         // Crude Oil
    'TVC:DXY',            // US Dollar Index
    'TVC:VIX'             // Volatility Index
  ];

  const symbolsToUse = symbols.length > 0 ? symbols : defaultSymbols;

  return (
    <div className={cn('w-full overflow-hidden', className)}>
      <TradingViewWidget
        widgetType="ticker-tape"
        height={height}
        theme={theme}
        colorTheme={theme}
        autosize={true}
        symbols={symbolsToUse}
        showSymbolLogo={showSymbolLogo}
        displayMode_ticker={displayMode}
        isTransparent={true}
      />
    </div>
  );
};

export default TickerTapeWidget;

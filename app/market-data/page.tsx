import React from 'react';
import { Metadata } from 'next';
import MarketDataPageClient from './MarketDataPageClient';

export const metadata: Metadata = {
  title: 'Real-Time Market Data | Brokeranalysis',
  description: 'Access real-time currency pairs, economic calendar, market signals, and commodity prices. Live market data feeds for informed trading decisions.',
  keywords: 'real-time market data, currency pairs, economic calendar, market signals, commodity prices, forex data, trading data',
  openGraph: {
    title: 'Real-Time Market Data | Brokeranalysis',
    description: 'Access real-time currency pairs, economic calendar, market signals, and commodity prices. Live market data feeds for informed trading decisions.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Real-Time Market Data | Brokeranalysis',
    description: 'Access real-time currency pairs, economic calendar, market signals, and commodity prices.',
  },
};

export default function MarketDataPage() {
  return <MarketDataPageClient />;
}
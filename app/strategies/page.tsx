import { Metadata } from 'next';
import { Suspense } from 'react';
import StrategiesPageClient from './StrategiesPageClient';

export const metadata: Metadata = {
  title: 'Trading Strategies & Country-Specific Broker Guides | Brokeranalysis',
  description: 'Explore comprehensive trading strategy guides with country-specific broker recommendations. Find the best brokers for scalping, swing trading, day trading, and position trading worldwide.',
  keywords: 'trading strategies, forex strategies, broker recommendations by country, scalping brokers, swing trading brokers, day trading platforms',
  openGraph: {
    title: 'Trading Strategies & Country-Specific Broker Guides',
    description: 'Expert trading strategy guides with tailored broker recommendations for every country and trading style.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trading Strategies & Country-Specific Broker Guides',
    description: 'Expert trading strategy guides with tailored broker recommendations.',
  },
  alternates: {
    canonical: 'https://brokeranalysis.com/strategies',
  },
};

export default function StrategiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      }>
        <StrategiesPageClient />
      </Suspense>
    </div>
  );
}
import { Metadata } from 'next';
import { Suspense } from 'react';
import StrategyCountryPageClient from './StrategyCountryPageClient';
import MegaMenuHeader from '@/components/MegaMenuHeader';
import Footer from '@/components/Footer';
import ChatBubble from '@/components/ChatBubble';

interface PageProps {
  params: Promise<{
    strategy: string;
    country: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { strategy, country } = await params;
  
  const strategyTitle = strategy.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
  
  const countryTitle = country.toUpperCase();
  
  return {
    title: `Best ${strategyTitle} Brokers in ${countryTitle} 2024 | Brokeranalysis`,
    description: `Find the top-rated brokers for ${strategyTitle} trading in ${countryTitle}. Compare spreads, leverage, and regulations. Expert reviews and AI-powered recommendations.`,
    keywords: `${strategyTitle} brokers ${countryTitle}, best ${strategy} trading platforms, ${countryTitle} forex brokers, ${strategy} trading strategy`,
    openGraph: {
      title: `Best ${strategyTitle} Brokers in ${countryTitle} 2024`,
      description: `Expert-reviewed ${strategyTitle} brokers for ${countryTitle} traders. Compare features, costs, and regulations.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Best ${strategyTitle} Brokers in ${countryTitle} 2024`,
      description: `Expert-reviewed ${strategyTitle} brokers for ${countryTitle} traders.`,
    },
    alternates: {
      canonical: `https://brokeranalysis.com/strategies/${strategy}/${country}`,
    },
  };
}

export default async function StrategyCountryPage({ params }: PageProps) {
  const { strategy, country } = await params;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header with Mega Menu */}
      <MegaMenuHeader />
      
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      }>        <StrategyCountryPageClient strategy={strategy} country={country} />      </Suspense>      
      {/* Footer */}
      <Footer />
      
      {/* Chat Bubble */}
      <ChatBubble />    </div>  );
}
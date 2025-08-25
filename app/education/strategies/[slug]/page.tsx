import { Metadata } from 'next';
import { Suspense } from 'react';
import StrategyPageClient from './StrategyPageClient';
import MegaMenuHeader from '@/components/MegaMenuHeader';
import Footer from '@/components/Footer';
import ChatBubble from '@/components/ChatBubble';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  const strategyTitle = slug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
  
  return {
    title: `${strategyTitle} Trading Strategies 2024 | Brokeranalysis`,
    description: `Complete guide to ${strategyTitle.toLowerCase()} strategies. Learn proven techniques, entry points, and risk management for successful trading.`,
    keywords: `${strategyTitle} strategies, trading strategies, forex strategies, day trading, swing trading`,
    openGraph: {
      title: `${strategyTitle} Trading Strategies 2024`,
      description: `Expert guide to ${strategyTitle.toLowerCase()} techniques. Improve your trading performance with proven strategies.`,
      type: 'article',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${strategyTitle} Trading Strategies 2024`,
      description: `Learn effective ${strategyTitle.toLowerCase()} techniques for better trading results.`,
    },
    alternates: {
      canonical: `https://brokeranalysis.com/education/strategies/${slug}`,
    },
  };
}

export default async function StrategyPage({ params }: PageProps) {
  const { slug } = await params;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header with Mega Menu */}
      <MegaMenuHeader />
      
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      }>
        <StrategyPageClient slug={slug} />
      </Suspense>
      
      {/* Footer */}
      <Footer />
      
      {/* Chat Bubble */}
      <ChatBubble />
    </div>
  );
}
import { Metadata } from 'next';
import { Suspense } from 'react';
import BrokersInCountryPageClient from './BrokersInCountryPageClient';
import MegaMenuHeader from '@/components/MegaMenuHeader';
import Footer from '@/components/Footer';
import ChatBubble from '@/components/ChatBubble';

interface PageProps {
  params: Promise<{
    country: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { country } = await params;
  
  const countryTitle = country.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
  
  return {
    title: `Best Forex Brokers in ${countryTitle} 2024 | Brokeranalysis`,
    description: `Find the top-rated forex brokers in ${countryTitle}. Compare spreads, leverage, regulations, and trading conditions. Expert reviews and AI-powered recommendations.`,
    keywords: `forex brokers ${countryTitle}, best brokers in ${country}, ${countryTitle} trading platforms, regulated brokers ${countryTitle}`,
    openGraph: {
      title: `Best Forex Brokers in ${countryTitle} 2024`,
      description: `Expert-reviewed forex brokers for ${countryTitle} traders. Compare features, costs, and regulations.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Best Forex Brokers in ${countryTitle} 2024`,
      description: `Expert-reviewed forex brokers for ${countryTitle} traders.`,
    },
    alternates: {
      canonical: `https://brokeranalysis.com/brokers-in/${country}`,
    },
  };
}

export default async function BrokersInCountryPage({ params }: PageProps) {
  const { country } = await params;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header with Mega Menu */}
      <MegaMenuHeader />
      
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      }>
        <BrokersInCountryPageClient country={country} />
      </Suspense>
      
      {/* Footer */}
      <Footer />
      
      {/* Chat Bubble */}
      <ChatBubble />
    </div>
  );
}
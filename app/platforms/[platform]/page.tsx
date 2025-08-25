import { Metadata } from 'next';
import { Suspense } from 'react';
import PlatformPageClient from './PlatformPageClient';
import MegaMenuHeader from '@/components/MegaMenuHeader';
import Footer from '@/components/Footer';
import ChatBubble from '@/components/ChatBubble';

interface PageProps {
  params: Promise<{
    platform: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { platform } = await params;
  
  const platformTitle = platform.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
  
  return {
    title: `${platformTitle} Trading Platform Review 2024 | Brokeranalysis`,
    description: `Complete guide to ${platformTitle} trading platform. Features, pricing, supported brokers, and expert analysis. Find the best brokers offering ${platformTitle}.`,
    keywords: `${platformTitle} platform, ${platformTitle} brokers, ${platformTitle} review, trading platforms, forex platforms`,
    openGraph: {
      title: `${platformTitle} Trading Platform Review 2024`,
      description: `Expert review of ${platformTitle} platform. Compare features, brokers, and trading conditions.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${platformTitle} Trading Platform Review 2024`,
      description: `Expert review of ${platformTitle} platform. Compare features and brokers.`,
    },
    alternates: {
      canonical: `https://brokeranalysis.com/platforms/${platform}`,
    },
  };
}

export default async function PlatformPage({ params }: PageProps) {
  const { platform } = await params;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header with Mega Menu */}
      <MegaMenuHeader />
      
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      }>
        <PlatformPageClient platform={platform} />
      </Suspense>
      
      {/* Footer */}
      <Footer />
      
      {/* Chat Bubble */}
      <ChatBubble />
    </div>
  );
}
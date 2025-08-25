import { Metadata } from 'next';
import { Suspense } from 'react';
import BeginnerGuidePageClient from './BeginnerGuidePageClient';
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
  
  const guideTitle = slug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
  
  return {
    title: `${guideTitle} Guide for Beginners 2024 | Brokeranalysis`,
    description: `Complete beginner's guide to ${guideTitle.toLowerCase()}. Learn the basics, key concepts, and how to get started with trading.`,
    keywords: `${guideTitle} guide, ${guideTitle} for beginners, trading education, forex basics, crypto basics`,
    openGraph: {
      title: `${guideTitle} Guide for Beginners 2024`,
      description: `Comprehensive beginner's guide to ${guideTitle.toLowerCase()}. Learn essential concepts and start your trading journey.`,
      type: 'article',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${guideTitle} Guide for Beginners 2024`,
      description: `Learn ${guideTitle.toLowerCase()} with our complete beginner's guide.`,
    },
    alternates: {
      canonical: `https://brokeranalysis.com/education/beginner-guides/${slug}`,
    },
  };
}

export default async function BeginnerGuidePage({ params }: PageProps) {
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
        <BeginnerGuidePageClient slug={slug} />
      </Suspense>
      
      {/* Footer */}
      <Footer />
      
      {/* Chat Bubble */}
      <ChatBubble />
    </div>
  );
}
import type { Metadata } from 'next';
import MegaMenuHeader from '@/components/MegaMenuHeader';
import MethodologyPageClient from './MethodologyPageClient';
import Footer from '@/components/Footer';
import ChatBubble from '@/components/ChatBubble';

export const metadata: Metadata = {
  title: 'Our Methodology | Brokeranalysis - How We Score and Evaluate Brokers',
  description: 'Learn about our comprehensive broker evaluation methodology, trust scoring system, and the rigorous process we use to analyze trading platforms for transparency and accuracy.',
  keywords: [
    'broker evaluation methodology',
    'trust score calculation',
    'broker analysis process',
    'trading platform scoring',
    'broker review criteria',
    'financial platform evaluation',
    'broker rating system',
    'transparent broker analysis',
    'broker comparison methodology',
    'trading platform assessment'
  ],
  openGraph: {
    title: 'Our Methodology | Brokeranalysis - How We Score and Evaluate Brokers',
    description: 'Discover our transparent, evidence-based methodology for evaluating brokers and calculating trust scores. Learn how we ensure accurate, unbiased broker analysis.',
    url: 'https://brokeranalysis.com/methodology',
    siteName: 'Brokeranalysis',
    images: [
      {
        url: 'https://brokeranalysis.com/images/methodology-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Brokeranalysis Methodology - Transparent Broker Evaluation Process',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Methodology | Brokeranalysis - How We Score and Evaluate Brokers',
    description: 'Discover our transparent, evidence-based methodology for evaluating brokers and calculating trust scores.',
    images: ['https://brokeranalysis.com/images/methodology-twitter.jpg'],
    creator: '@brokeranalysis',
  },
  alternates: {
    canonical: 'https://brokeranalysis.com/methodology',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function MethodologyPage() {
  return (
    <>
      <MegaMenuHeader />
      <main>
        <MethodologyPageClient />
      </main>
      <Footer />
      <ChatBubble />
    </>
  );
}
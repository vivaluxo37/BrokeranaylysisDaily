import { Metadata } from 'next';
import { Suspense } from 'react';
import AboutPageClient from './AboutPageClient';
import MegaMenuHeader from '@/components/MegaMenuHeader';
import Footer from '@/components/Footer';
import ChatBubble from '@/components/ChatBubble';

export const metadata: Metadata = {
  title: 'About Brokeranalysis | AI-Powered Broker Recommendations',
  description: 'Learn about Brokeranalysis mission to provide transparent, AI-powered broker recommendations. Discover our methodology, team, and commitment to helping traders find the best platforms.',
  keywords: [
    'about brokeranalysis',
    'broker recommendation platform',
    'AI trading platform',
    'transparent broker reviews',
    'trading platform comparison',
    'financial technology',
    'broker analysis methodology',
    'trust score system',
    'trading education',
    'broker selection'
  ],
  authors: [{ name: 'Brokeranalysis Team' }],
  creator: 'Brokeranalysis',
  publisher: 'Brokeranalysis',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://brokeranalysis.com'),
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Brokeranalysis | AI-Powered Broker Recommendations',
    description: 'Learn about Brokeranalysis mission to provide transparent, AI-powered broker recommendations and help traders find the best platforms.',
    url: '/about',
    siteName: 'Brokeranalysis',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://brokeranalysis.com/images/about-og.jpg',
        width: 1200,
        height: 630,
        alt: 'About Brokeranalysis - AI-Powered Broker Recommendations',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Brokeranalysis | AI-Powered Broker Recommendations',
    description: 'Learn about Brokeranalysis mission to provide transparent, AI-powered broker recommendations.',
    images: ['https://brokeranalysis.com/images/about-twitter.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <MegaMenuHeader />
      <Suspense fallback={<div className="pt-20 min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div></div>}>
        <AboutPageClient />
      </Suspense>
      <Footer />
      <ChatBubble />
    </div>
  );
}
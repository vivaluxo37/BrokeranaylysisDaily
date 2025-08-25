import type { Metadata } from 'next';
import MegaMenuHeader from '@/components/MegaMenuHeader';
import Footer from '@/components/Footer';
import ChatBubble from '@/components/ChatBubble';

export const metadata: Metadata = {
  title: 'Sitemap | Brokeranalysis - Complete Site Navigation',
  description: 'Navigate through all pages and sections of Brokeranalysis. Find broker reviews, comparisons, educational content, and tools to help you choose the best trading platform.',
  keywords: [
    'sitemap',
    'site navigation',
    'broker reviews',
    'trading platforms',
    'forex brokers',
    'broker comparison',
    'financial education',
    'trading tools',
    'broker analysis',
    'investment platforms'
  ],
  openGraph: {
    title: 'Sitemap | Brokeranalysis - Complete Site Navigation',
    description: 'Navigate through all pages and sections of Brokeranalysis. Find broker reviews, comparisons, educational content, and tools.',
    url: 'https://brokeranalysis.com/sitemap',
    siteName: 'Brokeranalysis',
    images: [
      {
        url: 'https://brokeranalysis.com/images/sitemap-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Brokeranalysis Sitemap - Complete Site Navigation'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sitemap | Brokeranalysis - Complete Site Navigation',
    description: 'Navigate through all pages and sections of Brokeranalysis. Find broker reviews, comparisons, and educational content.',
    images: ['https://brokeranalysis.com/images/sitemap-twitter.jpg'],
    creator: '@brokeranalysis'
  },
  alternates: {
    canonical: 'https://brokeranalysis.com/sitemap'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }
};

export default function SitemapPage() {
  return (
    <>
      <MegaMenuHeader />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Sitemap</h1>
          <p className="text-gray-600 mb-8">
            Navigate through all pages and sections of Brokeranalysis.
          </p>
          {/* TODO: Add sitemap content */}
        </div>
      </main>
      <Footer />
      <ChatBubble />
    </>
  );
}
import type { Metadata } from 'next';
import MegaMenuHeader from '@/components/MegaMenuHeader';
import CareersPageClient from './CareersPageClient';
import Footer from '@/components/Footer';
import ChatBubble from '@/components/ChatBubble';

export const metadata: Metadata = {
  title: 'Careers at Brokeranalysis | Join Our Financial Technology Team',
  description: 'Join Brokeranalysis and help shape the future of broker recommendations. Explore career opportunities in fintech, AI, data analysis, and more. Build your career with us.',
  keywords: [
    'brokeranalysis careers',
    'fintech jobs',
    'financial technology careers',
    'AI jobs finance',
    'data analyst jobs',
    'remote fintech jobs',
    'broker analysis careers',
    'trading platform jobs',
    'financial services careers',
    'startup jobs finance'
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
    canonical: '/careers',
  },
  openGraph: {
    title: 'Careers at Brokeranalysis | Join Our Financial Technology Team',
    description: 'Join Brokeranalysis and help shape the future of broker recommendations. Explore career opportunities in fintech, AI, data analysis, and more.',
    url: '/careers',
    siteName: 'Brokeranalysis',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/images/careers-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Careers at Brokeranalysis - Join Our Team',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Careers at Brokeranalysis | Join Our Financial Technology Team',
    description: 'Join Brokeranalysis and help shape the future of broker recommendations. Explore career opportunities in fintech, AI, data analysis, and more.',
    images: ['/images/careers-twitter.jpg'],
    creator: '@brokeranalysis',
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
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function CareersPage() {
  return (
    <>
      <MegaMenuHeader />
      <main>
        <CareersPageClient />
      </main>
      <Footer />
      <ChatBubble />
    </>
  );
}
import { Metadata } from 'next';
import { Suspense } from 'react';
import DisclaimerPageClient from './DisclaimerPageClient';

export const metadata: Metadata = {
  title: 'Disclaimer | Brokeranalysis - Important Legal Information',
  description: 'Important disclaimer and legal information for Brokeranalysis platform. Understand the risks, limitations, and legal considerations before using our broker recommendation services.',
  keywords: [
    'disclaimer',
    'legal information',
    'risk disclosure',
    'trading risks',
    'broker analysis disclaimer',
    'financial disclaimer',
    'investment risks',
    'legal notice',
    'terms and conditions',
    'liability limitations'
  ],
  authors: [{ name: 'Brokeranalysis Legal Team' }],
  creator: 'Brokeranalysis',
  publisher: 'Brokeranalysis',
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
  openGraph: {
    title: 'Disclaimer | Brokeranalysis - Important Legal Information',
    description: 'Important disclaimer and legal information for Brokeranalysis platform. Understand the risks, limitations, and legal considerations before using our services.',
    url: 'https://brokeranalysis.com/disclaimer',
    siteName: 'Brokeranalysis',
    images: [
      {
        url: 'https://brokeranalysis.com/og-disclaimer.jpg',
        width: 1200,
        height: 630,
        alt: 'Brokeranalysis Disclaimer - Legal Information',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Disclaimer | Brokeranalysis - Important Legal Information',
    description: 'Important disclaimer and legal information for Brokeranalysis platform. Understand the risks and limitations.',
    images: ['https://brokeranalysis.com/twitter-disclaimer.jpg'],
    creator: '@brokeranalysis',
  },
  alternates: {
    canonical: 'https://brokeranalysis.com/disclaimer',
  },
};

export default function DisclaimerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading disclaimer...</p>
        </div>
      </div>
    }>
      <DisclaimerPageClient />
    </Suspense>
  );
}
import { Metadata } from 'next';
import { Suspense } from 'react';
import TermsOfServicePageClient from './TermsOfServicePageClient';

export const metadata: Metadata = {
  title: 'Terms of Service | Brokeranalysis - Legal Terms and Conditions',
  description: 'Read our comprehensive terms of service and legal conditions for using Brokeranalysis platform. Understand your rights and responsibilities when using our broker recommendation services.',
  keywords: [
    'terms of service',
    'legal terms',
    'user agreement',
    'broker platform terms',
    'trading platform legal',
    'Brokeranalysis terms',
    'service conditions',
    'user responsibilities',
    'platform rules',
    'legal agreement'
  ],
  authors: [{ name: 'Brokeranalysis Legal Team' }],
  creator: 'Brokeranalysis',
  publisher: 'Brokeranalysis',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://brokeranalysis.com'),
  alternates: {
    canonical: '/terms-of-service',
  },
  openGraph: {
    title: 'Terms of Service | Brokeranalysis',
    description: 'Read our comprehensive terms of service and legal conditions for using Brokeranalysis platform.',
    url: '/terms-of-service',
    siteName: 'Brokeranalysis',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-terms-of-service.jpg',
        width: 1200,
        height: 630,
        alt: 'Brokeranalysis Terms of Service',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service | Brokeranalysis',
    description: 'Read our comprehensive terms of service and legal conditions for using Brokeranalysis platform.',
    images: ['/og-terms-of-service.jpg'],
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

export default function TermsOfServicePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Terms of Service...</p>
        </div>
      </div>
    }>
      <TermsOfServicePageClient />
    </Suspense>
  );
}
import React, { Suspense } from 'react';
import { Metadata } from 'next';
import ApiDocsPageClient from './ApiDocsPageClient';

export const metadata: Metadata = {
  title: 'API Documentation - Brokeranalysis Developer Resources',
  description: 'Comprehensive API documentation for Brokeranalysis platform. Access broker data, trust scores, comparisons, and trading insights through our RESTful API.',
  keywords: [
    'Brokeranalysis API',
    'broker data API',
    'trading platform API',
    'financial data API',
    'trust score API',
    'broker comparison API',
    'REST API documentation',
    'developer resources',
    'API endpoints',
    'authentication',
    'rate limiting',
    'API reference'
  ],
  openGraph: {
    title: 'API Documentation - Brokeranalysis Developer Resources',
    description: 'Comprehensive API documentation for Brokeranalysis platform. Access broker data, trust scores, comparisons, and trading insights through our RESTful API.',
    type: 'website',
    url: 'https://brokeranalysis.com/api-docs',
    siteName: 'Brokeranalysis',
    images: [
      {
        url: 'https://brokeranalysis.com/images/api-docs-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Brokeranalysis API Documentation'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'API Documentation - Brokeranalysis Developer Resources',
    description: 'Comprehensive API documentation for Brokeranalysis platform. Access broker data, trust scores, comparisons, and trading insights through our RESTful API.',
    images: ['https://brokeranalysis.com/images/api-docs-twitter.jpg']
  },
  alternates: {
    canonical: 'https://brokeranalysis.com/api-docs'
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

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      }>
        <ApiDocsPageClient />
      </Suspense>
    </div>
  );
}
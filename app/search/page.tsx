import { Suspense } from 'react';
import { Metadata } from 'next';
import SearchPageClient from './SearchPageClient';

// Server component for metadata generation
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Search Results | Brokeranalysis - Find the Best Trading Platforms',
    description: 'Search through our comprehensive database of forex brokers, educational articles, and market analysis to find exactly what you need for successful trading.',
    keywords: 'broker search, forex broker finder, trading platform search, broker comparison, financial education',
    openGraph: {
      title: 'Search Brokeranalysis - Find Your Perfect Trading Platform',
      description: 'Discover the best forex brokers, educational content, and market insights with our advanced search functionality.',
      type: 'website',
      url: 'https://brokeranalysis.com/search',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Search Brokeranalysis - Find Your Perfect Trading Platform',
      description: 'Discover the best forex brokers, educational content, and market insights with our advanced search functionality.',
    },
    alternates: {
      canonical: 'https://brokeranalysis.com/search',
    },
  };
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPageClient />
    </Suspense>
  );
}
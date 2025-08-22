import { Suspense } from 'react';
import { Metadata } from 'next';
import ChatPageClient from './ChatPageClient';

// Server component for metadata generation
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'AI Chat Assistant | Brokeranalysis',
    description: 'Get personalized broker recommendations and trading advice from our AI-powered chat assistant. Ask questions about forex brokers, trading strategies, and market analysis.',
    keywords: [
      'AI chat assistant',
      'broker recommendations',
      'trading advice',
      'forex chat bot',
      'trading assistant',
      'broker analysis AI',
      'personalized recommendations',
      'trading questions'
    ],
    openGraph: {
      title: 'AI Chat Assistant | Brokeranalysis',
      description: 'Get personalized broker recommendations and trading advice from our AI-powered chat assistant.',
      type: 'website',
      url: 'https://brokeranalysis.com/chat',
      siteName: 'Brokeranalysis',
      images: [
        {
          url: '/images/chat-assistant-og.jpg',
          width: 1200,
          height: 630,
          alt: 'Brokeranalysis AI Chat Assistant'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AI Chat Assistant | Brokeranalysis',
      description: 'Get personalized broker recommendations and trading advice from our AI-powered chat assistant.',
      images: ['/images/chat-assistant-twitter.jpg']
    },
    alternates: {
      canonical: 'https://brokeranalysis.com/chat'
    }
  };
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading AI Chat Assistant...</p>
        </div>
      </div>
    }>
      <ChatPageClient />
    </Suspense>
  );
}
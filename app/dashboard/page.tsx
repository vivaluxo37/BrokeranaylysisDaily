import { Metadata } from 'next';
import { Suspense } from 'react';
import DashboardPageClient from './DashboardPageClient';
import MegaMenuHeader from '@/components/MegaMenuHeader';
import Footer from '@/components/Footer';
import ChatBubble from '@/components/ChatBubble';

export const metadata: Metadata = {
  title: 'User Dashboard - Brokeranalysis',
  description: 'Manage your saved brokers, comparison history, and get personalized trading recommendations on Brokeranalysis.',
  keywords: 'user dashboard, saved brokers, trading history, broker recommendations, portfolio management',
  openGraph: {
    title: 'User Dashboard - Brokeranalysis',
    description: 'Manage your saved brokers, comparison history, and get personalized trading recommendations.',
    type: 'website',
    url: 'https://brokeranalysis.com/dashboard',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'User Dashboard - Brokeranalysis',
    description: 'Manage your saved brokers, comparison history, and get personalized trading recommendations.',
  },
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <MegaMenuHeader />
      <Suspense fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      }>
        <DashboardPageClient />
      </Suspense>
      <Footer />
      <ChatBubble />
    </div>
  );
}
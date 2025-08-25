import { Metadata } from 'next';
import { Suspense } from 'react';
import AccountTypePageClient from './AccountTypePageClient';
import MegaMenuHeader from '@/components/MegaMenuHeader';
import Footer from '@/components/Footer';
import ChatBubble from '@/components/ChatBubble';

interface PageProps {
  params: Promise<{
    type: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { type } = await params;
  
  const typeTitle = type.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
  
  return {
    title: `Best ${typeTitle} Brokers 2024 | Compare ${typeTitle} Accounts`,
    description: `Complete guide to ${typeTitle} trading accounts. Compare features, minimum deposits, and find the best brokers offering ${typeTitle} accounts.`,
    keywords: `${typeTitle} account, ${typeTitle} brokers, trading accounts, forex accounts, compare brokers`,
    openGraph: {
      title: `Best ${typeTitle} Brokers 2024 | Compare ${typeTitle} Accounts`,
      description: `Expert comparison of ${typeTitle} trading accounts. Find the best brokers and account features for your needs.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Best ${typeTitle} Brokers 2024`,
      description: `Compare ${typeTitle} accounts and find the best brokers for your trading style.`,
    },
    alternates: {
      canonical: `https://brokeranalysis.com/account-types/${type}`,
    },
  };
}

export default async function AccountTypePage({ params }: PageProps) {
  const { type } = await params;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header with Mega Menu */}
      <MegaMenuHeader />
      
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      }>
        <AccountTypePageClient type={type} />
      </Suspense>
      
      {/* Footer */}
      <Footer />
      
      {/* Chat Bubble */}
      <ChatBubble />
    </div>
  );
}
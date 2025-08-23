import { Metadata } from 'next';
import { Suspense } from 'react';
import PrivacyPolicyPageClient from './PrivacyPolicyPageClient';
import MegaMenuHeader from '@/components/MegaMenuHeader';
import Footer from '@/components/Footer';
import ChatBubble from '@/components/ChatBubble';

export const metadata: Metadata = {
  title: 'Privacy Policy | Brokeranalysis - Your Data Protection Rights',
  description: 'Learn how Brokeranalysis protects your personal information, data collection practices, and your privacy rights. Transparent privacy policy for our broker recommendation platform.',
  keywords: [
    'privacy policy',
    'data protection',
    'personal information',
    'GDPR compliance',
    'data collection',
    'user privacy',
    'Brokeranalysis privacy',
    'financial data security',
    'trading platform privacy',
    'broker data protection'
  ],
  authors: [{ name: 'Brokeranalysis Team' }],
  creator: 'Brokeranalysis',
  publisher: 'Brokeranalysis',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    title: 'Privacy Policy | Brokeranalysis',
    description: 'Learn how Brokeranalysis protects your personal information and data privacy rights.',
    url: 'https://brokeranalysis.com/privacy-policy',
    siteName: 'Brokeranalysis',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://brokeranalysis.com/images/privacy-policy-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Brokeranalysis Privacy Policy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy | Brokeranalysis',
    description: 'Learn how Brokeranalysis protects your personal information and data privacy rights.',
    images: ['https://brokeranalysis.com/images/privacy-policy-twitter.jpg'],
    creator: '@brokeranalysis',
    site: '@brokeranalysis',
  },
  alternates: {
    canonical: 'https://brokeranalysis.com/privacy-policy',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <MegaMenuHeader />
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      }>
        <PrivacyPolicyPageClient />
      </Suspense>
      <Footer />
      <ChatBubble />
    </div>
  );
}
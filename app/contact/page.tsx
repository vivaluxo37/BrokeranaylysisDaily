import { Metadata } from 'next';
import MegaMenuHeader from '@/components/MegaMenuHeader';
import ContactPageClient from './ContactPageClient';
import Footer from '@/components/Footer';
import ChatBubble from '@/components/ChatBubble';

export const metadata: Metadata = {
  title: 'Contact Us - Brokeranalysis | Get Expert Trading Support',
  description: 'Contact Brokeranalysis for expert trading advice, broker recommendations, and platform support. Our team of financial experts is here to help you succeed.',
  keywords: [
    'contact brokeranalysis',
    'trading support',
    'broker help',
    'financial advice',
    'customer service',
    'trading questions',
    'broker recommendations',
    'expert consultation',
    'trading platform support',
    'financial guidance'
  ],
  openGraph: {
    title: 'Contact Us - Brokeranalysis | Get Expert Trading Support',
    description: 'Contact Brokeranalysis for expert trading advice, broker recommendations, and platform support. Our team of financial experts is here to help you succeed.',
    url: 'https://brokeranalysis.com/contact',
    siteName: 'Brokeranalysis',
    images: [
      {
        url: 'https://brokeranalysis.com/images/contact-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Contact Brokeranalysis - Expert Trading Support'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us - Brokeranalysis | Get Expert Trading Support',
    description: 'Contact Brokeranalysis for expert trading advice, broker recommendations, and platform support. Our team of financial experts is here to help you succeed.',
    images: ['https://brokeranalysis.com/images/contact-twitter.jpg']
  },
  alternates: {
    canonical: 'https://brokeranalysis.com/contact'
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

export default function ContactPage() {
  return (
    <>
      <MegaMenuHeader />
      <ContactPageClient />
      <Footer />
      <ChatBubble />
    </>
  );
}
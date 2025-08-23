import { Metadata } from 'next'
import ScalpingBrokersClient from './ScalpingBrokersClient'
import MegaMenuHeader from '@/components/MegaMenuHeader'
import Footer from '@/components/Footer'
import ChatBubble from '@/components/ChatBubble'

export const metadata: Metadata = {
  title: 'Best Scalping Brokers Comparison 2025 | Low Spreads & Fast Execution',
  description: 'Compare the best scalping brokers with ultra-low spreads, fast execution, and minimal slippage. Find ECN brokers perfect for scalping strategies with our comprehensive analysis.',
  keywords: [
    'scalping brokers',
    'best scalping brokers 2025',
    'low spread brokers',
    'ECN brokers',
    'fast execution brokers',
    'scalping forex brokers',
    'minimal slippage brokers',
    'high frequency trading',
    'scalping comparison',
    'broker spreads comparison'
  ],
  authors: [{ name: 'Brokeranalysis Trading Team' }],
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
    type: 'article',
    locale: 'en_US',
    url: 'https://brokeranalysis.com/program/scalping-brokers-comparison',
    siteName: 'Brokeranalysis',
    title: 'Best Scalping Brokers Comparison 2025 | Ultra-Low Spreads',
    description: 'Discover the top scalping brokers with the lowest spreads, fastest execution, and best conditions for high-frequency trading strategies.',
    images: [
      {
        url: '/og-scalping-brokers.jpg',
        width: 1200,
        height: 630,
        alt: 'Best Scalping Brokers Comparison 2025',
      },
    ],
    publishedTime: new Date().toISOString(),
    modifiedTime: new Date().toISOString(),
    section: 'Trading Programs',
    tags: ['Scalping', 'Brokers', 'Trading', 'Forex', 'ECN'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Scalping Brokers 2025 | Low Spreads & Fast Execution',
    description: 'Compare top scalping brokers with ultra-low spreads and lightning-fast execution for profitable scalping strategies.',
    images: ['/twitter-scalping-brokers.jpg'],
    creator: '@brokeranalysis',
  },
  alternates: {
    canonical: 'https://brokeranalysis.com/program/scalping-brokers-comparison',
  },
}

export default function ScalpingBrokersComparisonPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <MegaMenuHeader />
      {/* Structured Data for Scalping Brokers Comparison */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Best Scalping Brokers Comparison 2025',
            description: 'Comprehensive comparison of the best scalping brokers with ultra-low spreads, fast execution, and optimal trading conditions.',
            image: 'https://brokeranalysis.com/og-scalping-brokers.jpg',
            author: {
              '@type': 'Organization',
              name: 'Brokeranalysis',
              url: 'https://brokeranalysis.com'
            },
            publisher: {
              '@type': 'Organization',
              name: 'Brokeranalysis',
              logo: {
                '@type': 'ImageObject',
                url: 'https://brokeranalysis.com/logo.png'
              },
              address: {
                '@type': 'PostalAddress',
                streetAddress: '30 N Gould St Ste R',
                addressLocality: 'Sheridan',
                addressRegion: 'WY',
                postalCode: '82801',
                addressCountry: 'US'
              }
            },
            datePublished: new Date().toISOString(),
            dateModified: new Date().toISOString(),
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': 'https://brokeranalysis.com/program/scalping-brokers-comparison'
            },
            about: {
              '@type': 'Thing',
              name: 'Scalping Trading Strategy',
              description: 'High-frequency trading strategy that involves making numerous trades to profit from small price movements'
            },
            mentions: [
              {
                '@type': 'FinancialProduct',
                name: 'ECN Trading Account',
                description: 'Electronic Communication Network accounts with direct market access'
              },
              {
                '@type': 'FinancialProduct',
                name: 'Forex Trading',
                description: 'Foreign exchange trading with major and minor currency pairs'
              }
            ]
          })
        }}
      />
      
      {/* FAQ Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'What makes a broker good for scalping?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'The best scalping brokers offer ultra-low spreads (typically 0-1 pip), fast execution speeds (under 50ms), ECN/STP execution, minimal slippage, and allow scalping strategies without restrictions.'
                }
              },
              {
                '@type': 'Question',
                name: 'Which brokers have the lowest spreads for scalping?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Top scalping brokers typically offer spreads from 0.0 pips on major pairs like EUR/USD, with commission-based pricing models that provide better overall costs for high-frequency trading.'
                }
              },
              {
                '@type': 'Question',
                name: 'Is scalping allowed by all brokers?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Not all brokers allow scalping. Many market makers restrict or prohibit scalping strategies. ECN and STP brokers are generally more scalping-friendly as they profit from commissions rather than spreads.'
                }
              }
            ]
          })
        }}
      />
      
      <ScalpingBrokersClient />
      <Footer />
      <ChatBubble />
    </div>
  )
}
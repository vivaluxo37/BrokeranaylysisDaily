import { Metadata } from 'next'
import { ReactNode } from 'react'
import MegaMenuHeader from '@/components/MegaMenuHeader'
import Footer from '@/components/Footer'
import { ChatBubble } from '@/components/ChatBubble'

export const metadata: Metadata = {
  title: {
    template: '%s | Brokeranalysis Program',
    default: 'Trading Programs & Strategies | Brokeranalysis'
  },
  description: 'Comprehensive trading programs and broker comparisons for specific strategies. Find the best brokers for scalping, swing trading, day trading, and more.',
  keywords: [
    'trading programs',
    'broker comparison',
    'scalping brokers',
    'day trading brokers',
    'swing trading',
    'forex brokers',
    'trading strategies',
    'broker analysis',
    'trust scores',
    'trading platforms'
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
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://brokeranalysis.com/program',
    siteName: 'Brokeranalysis',
    title: 'Trading Programs & Broker Comparisons | Brokeranalysis',
    description: 'Discover the best brokers for your trading strategy. Compare platforms, trust scores, and features for scalping, day trading, and more.',
    images: [
      {
        url: '/og-program.jpg',
        width: 1200,
        height: 630,
        alt: 'Brokeranalysis Trading Programs',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trading Programs & Broker Comparisons | Brokeranalysis',
    description: 'Find the best brokers for your trading strategy with our comprehensive comparison tools.',
    images: ['/twitter-program.jpg'],
    creator: '@brokeranalysis',
  },
  alternates: {
    canonical: 'https://brokeranalysis.com/program',
  },
}

interface ProgramLayoutProps {
  children: ReactNode
}

export default function ProgramLayout({ children }: ProgramLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Structured Data for Trading Programs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Brokeranalysis Trading Programs',
            url: 'https://brokeranalysis.com/program',
            description: 'Comprehensive trading programs and broker comparisons for specific strategies',
            publisher: {
              '@type': 'Organization',
              name: 'Brokeranalysis',
              url: 'https://brokeranalysis.com',
              address: {
                '@type': 'PostalAddress',
                streetAddress: '30 N Gould St Ste R',
                addressLocality: 'Sheridan',
                addressRegion: 'WY',
                postalCode: '82801',
                addressCountry: 'US'
              },
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+1-801-893-2577',
                contactType: 'customer service'
              }
            },
            potentialAction: {
              '@type': 'SearchAction',
              target: 'https://brokeranalysis.com/search?q={search_term_string}',
              'query-input': 'required name=search_term_string'
            }
          })
        }}
      />
      
      {/* Header with Mega Menu */}
      <MegaMenuHeader />
      
      {/* Program Content */}
      <main className="container mx-auto px-4 py-8 pt-24">
        {children}
      </main>
      
      {/* Footer */}
      <Footer />
      
      {/* Floating Chat Bubble */}
      <ChatBubble />
    </div>
  )
}
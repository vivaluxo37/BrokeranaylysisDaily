import type { Metadata } from 'next'
import './globals.css'
import { LocationProvider } from '@/lib/contexts/LocationContext'
import { AuthProvider } from '@/lib/contexts/AuthContext'
import { PerformanceProvider, PerformanceDebugger } from '@/components/providers/performance-provider'
import { ServiceWorkerRegistration } from '../components/service-worker-registration'

export const metadata: Metadata = {
  title: 'Brokeranalysis — Find the best broker for your strategy',
  description: 'Evidence-backed broker recommendations powered by AI. Compare brokers, get trust scores, and find the perfect trading platform for your strategy.',
  keywords: 'broker comparison, trading platform, forex broker, stock broker, broker reviews, trust score',
  authors: [{ name: 'Brokeranalysis' }],
  creator: 'Brokeranalysis',
  publisher: 'Brokeranalysis',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://brokeranalysis.com',
    title: 'Brokeranalysis — Find the best broker for your strategy',
    description: 'Evidence-backed broker recommendations powered by AI. Compare brokers, get trust scores, and find the perfect trading platform for your strategy.',
    siteName: 'Brokeranalysis',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Brokeranalysis — Find the best broker for your strategy',
    description: 'Evidence-backed broker recommendations powered by AI. Compare brokers, get trust scores, and find the perfect trading platform for your strategy.',
    creator: '@brokeranalysis',
  },
  alternates: {
    canonical: 'https://brokeranalysis.com',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Brokeranalysis",
              "url": "https://brokeranalysis.com",
              "description": "Evidence-backed broker recommendations powered by AI",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://brokeranalysis.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "How does Brokeranalysis recommend brokers?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "We use AI to analyze thousands of data points including regulatory status, user reviews, trading costs, platform features, and market reputation to provide evidence-backed broker recommendations tailored to your trading strategy."
                  }
                },
                {
                  "@type": "Question", 
                  "name": "What is a Trust Score?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Our Trust Score is a comprehensive rating from 0-100 that evaluates broker reliability based on regulation, financial stability, user feedback, transparency, and historical performance. Higher scores indicate more trustworthy brokers."
                  }
                }
              ]
            })
          }}
        />
      </head>
      <body className="antialiased">
        <PerformanceProvider>
          <AuthProvider>
            <LocationProvider autoDetect={true}>
              {children}
              <PerformanceDebugger />
              <ServiceWorkerRegistration />
            </LocationProvider>
          </AuthProvider>
        </PerformanceProvider>
      </body>
    </html>
  )
}
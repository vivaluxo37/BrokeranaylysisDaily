import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { getBrokerBySlug } from '@/lib/supabase'
import MegaMenuHeader from '@/components/MegaMenuHeader'
import Footer from '@/components/Footer'
import { ChatBubble } from '@/components/ChatBubble'
import BrokerProfileHeader from '@/components/broker/BrokerProfileHeader'
import BrokerTrustScore from '@/components/broker/BrokerTrustScore'
import BrokerTradingConditions from '@/components/broker/BrokerTradingConditions'
import BrokerRegulationInfo from '@/components/broker/BrokerRegulationInfo'
import BrokerReviews from '@/components/broker/BrokerReviews'
import BrokerComparison from '@/components/broker/BrokerComparison'
import BrokerFAQ from '@/components/broker/BrokerFAQ'
import { ArrowUp } from 'lucide-react'
import { TickerTapeWidget, ForexHeatmapWidget, AdvancedChartWidget, TechnicalAnalysisWidget } from '@/components/widgets'

interface BrokerPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: BrokerPageProps): Promise<Metadata> {
  const { slug } = await params
  const broker = await getBrokerBySlug(slug)
  
  if (!broker) {
    return {
      title: 'Broker Not Found | Brokeranalysis',
      description: 'The requested broker profile could not be found.'
    }
  }

  const currentYear = new Date().getFullYear()
  const trustScore = broker.trust_score ?? 0
  const trustScoreLabel = trustScore >= 80 ? 'Excellent' : trustScore >= 60 ? 'Good' : 'Poor'

  return {
    title: `${broker.name} Review ${currentYear} | Trust Score ${trustScore}/100 ${trustScoreLabel} | Brokeranalysis`,
    description: `Comprehensive ${broker.name} review ${currentYear} with trust score ${trustScore}/100 (${trustScoreLabel}). Detailed analysis of trading conditions, regulation, safety, user reviews, and comparison with other brokers. Min deposit $${broker.minimum_deposit}, leverage ${broker.maximum_leverage}.`,
    keywords: [
      `${broker.name} review ${currentYear}`,
      `${broker.name} broker`,
      `${broker.name} trust score`,
      `${broker.name} regulation`,
      `${broker.name} trading conditions`,
      'forex broker review',
      'broker comparison',
      'trading platform review',
      'broker safety',
      'regulated broker'
    ],
    openGraph: {
      title: `${broker.name} Review ${currentYear} | Trust Score ${broker.trust_score}/100 ${trustScoreLabel}`,
      description: `Comprehensive ${broker.name} review with trust score ${broker.trust_score}/100, trading conditions analysis, regulation info, and user reviews. Min deposit $${broker.minimum_deposit}.`,
      type: 'article',
      url: `https://brokeranalysis.com/brokers/${broker.slug}`,
      images: [
        {
          url: broker.logo_url || '/images/default-broker-logo.png',
          width: 1200,
          height: 630,
          alt: `${broker.name} broker review ${currentYear} - Trust Score ${trustScore}/100`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${broker.name} Review ${currentYear} | Trust Score ${broker.trust_score}/100`,
      description: `Comprehensive ${broker.name} review with trust score ${broker.trust_score}/100, trading conditions, and user reviews.`,
      images: [broker.logo_url || '/images/default-broker-logo.png']
    },
    alternates: {
      canonical: `https://brokeranalysis.com/brokers/${broker.slug}`
    }
  }
}

export default async function BrokerPage({ params }: BrokerPageProps) {
  const { slug } = await params
  const broker = await getBrokerBySlug(slug)
  
  if (!broker) {
    notFound()
  }

  const currentYear = new Date().getFullYear()
  const trustScore = broker.trust_score ?? 0
  const trustScoreLabel = trustScore >= 80 ? 'Excellent' : trustScore >= 60 ? 'Good' : 'Poor'

  // Enhanced structured data for SEO
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    name: broker.name,
    description: broker.description || `${broker.name} is a regulated forex and CFD broker offering trading services with competitive conditions.`,
    url: `https://brokeranalysis.com/brokers/${broker.slug}`,
    logo: broker.logo_url,
    foundingDate: broker.founded_year ? `${broker.founded_year}-01-01` : undefined,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: broker.overall_rating,
      bestRating: 5,
      worstRating: 1,
      ratingCount: broker.user_reviews_count ?? 0
    },
    offers: {
      '@type': 'Offer',
      description: `Trading services with minimum deposit of $${broker.minimum_deposit}`,
      priceSpecification: {
        '@type': 'PriceSpecification',
        price: broker.minimum_deposit,
        priceCurrency: 'USD'
      }
    },
    serviceType: 'Financial Trading Platform',
    areaServed: 'Global',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Trading Instruments',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Forex Trading',
            description: 'Currency pair trading with competitive spreads'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'CFD Trading',
            description: 'Contracts for difference on stocks, indices, and commodities'
          }
        }
      ]
    }
  }

  const reviewSchema = {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'FinancialService',
      name: broker.name
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: (trustScore || 0) / 20, // Convert to 5-star scale
      bestRating: 5,
      worstRating: 1
    },
    author: {
      '@type': 'Organization',
      name: 'Brokeranalysis'
    },
    reviewBody: `Comprehensive review of ${broker.name} with trust score ${broker.trust_score}/100. Analysis covers regulation, trading conditions, safety measures, and user feedback.`,
    datePublished: new Date().toISOString()
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
      />
      
      <div id="top" className="min-h-screen bg-gray-50">
        {/* Header with Mega Menu */}
        <MegaMenuHeader />

        {/* Live Market Ticker */}
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
          <TickerTapeWidget
            height={46}
            theme="light"
            displayMode="adaptive"
            className="w-full"
          />
        </div>

        {/* Broker Profile Header */}
        <BrokerProfileHeader broker={broker} />
        
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content Column */}
            <div className="lg:col-span-3 space-y-12">
              {/* Trust Score Section */}
              <BrokerTrustScore broker={broker} />
              
              {/* Trading Conditions */}
              <BrokerTradingConditions broker={broker} />
              
              {/* Regulation Information */}
              <BrokerRegulationInfo broker={broker} />
              
              {/* User Reviews */}
              <BrokerReviews broker={broker} />
              
              {/* FAQ Section */}
              <BrokerFAQ broker={broker} />

              {/* Market Analysis Section */}
              <section className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Live Market Analysis</h2>
                <p className="text-gray-600 mb-8">
                  Stay informed with real-time market data and professional charting tools.
                  Perfect for analyzing market conditions before making trading decisions with {broker.name}.
                </p>

                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                  {/* Forex Heatmap */}
                  <ForexHeatmapWidget
                    height={400}
                    theme="light"
                    title="Currency Strength Analysis"
                    className="shadow-sm"
                  />

                  {/* Advanced Chart */}
                  <AdvancedChartWidget
                    symbol="FX_IDC:EURUSD"
                    height={400}
                    theme="light"
                    title="EUR/USD Live Chart"
                    className="shadow-sm"
                  />
                </div>

                {/* Technical Analysis */}
                <div className="mb-8">
                  <TechnicalAnalysisWidget
                    symbol="FX_IDC:EURUSD"
                    height={400}
                    theme="light"
                    title="EUR/USD Technical Signals"
                    className="shadow-sm"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 text-sm">
                    <strong>Trading Tip:</strong> Use these professional tools to analyze market conditions
                    and identify potential trading opportunities. Remember that {broker.name} offers
                    competitive spreads and leverage up to {broker.maximum_leverage} for your trading strategies.
                  </p>
                </div>
              </section>
            </div>
            
            {/* Sidebar */}
            <div className="lg:sticky lg:top-24 lg:self-start space-y-6">
              {/* Quick Comparison */}
              <BrokerComparison broker={broker} />
              
              {/* Key Information Card */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Facts</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Trust Score</span>
                    <span className={`font-bold px-2 py-1 rounded-lg text-sm ${
                      trustScore >= 80 ? 'text-green-600 bg-green-100' :
                      trustScore >= 60 ? 'text-yellow-600 bg-yellow-100' :
                      'text-red-600 bg-red-100'
                    }`}>
                      {trustScore}/100
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Overall Rating</span>
                    <span className="font-semibold">{broker.overall_rating}/5 ⭐</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Min Deposit</span>
                    <span className="font-semibold">${broker.minimum_deposit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Max Leverage</span>
                    <span className="font-semibold">{broker.maximum_leverage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Founded</span>
                    <span className="font-semibold">{broker.founded_year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Regulation</span>
                    <span className="font-semibold text-green-600">✓ Multi-regulated</span>
                  </div>
                </div>
                
                <div className="mt-6 space-y-3">
                  <a
                    href={broker.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center block"
                  >
                    Visit {broker.name}
                  </a>
                  <button className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                    Compare Brokers
                  </button>
                </div>
              </div>
              
              {/* Alternative Brokers */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h4 className="font-bold text-blue-900 mb-3">Looking for Alternatives?</h4>
                <p className="text-blue-800 text-sm mb-4">
                  Explore other highly-rated brokers with excellent trust scores and competitive conditions.
                </p>
                <Link
                  href="/brokers"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Browse All Brokers
                </Link>
              </div>

              {/* Risk Warning */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <h4 className="text-sm font-bold text-amber-800 mb-2">⚠️ Risk Warning</h4>
                <p className="text-xs text-amber-700 leading-relaxed">
                  Trading involves substantial risk and may result in the loss of your invested capital. 
                  You should not invest more than you can afford to lose and should ensure that you 
                  fully understand the risks involved. Past performance is not indicative of future results.
                </p>
              </div>
            </div>
          </div>
        </main>
        
        {/* Back to Top Button - Using anchor link instead of onClick */}
        <a
          href="#top"
          className="fixed bottom-6 left-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </a>
        
        {/* Footer */}
        <Footer />
        
        {/* Floating Chat Bubble */}
        <ChatBubble />
      </div>
    </>
  )
}

// Generate static params for popular brokers
export async function generateStaticParams() {
  // This would typically fetch from your database
  // For now, return empty array to enable ISR
  return []
}
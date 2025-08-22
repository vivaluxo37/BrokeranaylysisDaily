import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getBrokerBySlug } from '@/lib/supabase'
import BrokerProfileHeader from '@/components/broker/BrokerProfileHeader'
import BrokerTrustScore from '@/components/broker/BrokerTrustScore'
import BrokerTradingConditions from '@/components/broker/BrokerTradingConditions'
import BrokerRegulationInfo from '@/components/broker/BrokerRegulationInfo'
import BrokerReviews from '@/components/broker/BrokerReviews'
import BrokerComparison from '@/components/broker/BrokerComparison'
import BrokerFAQ from '@/components/broker/BrokerFAQ'

interface BrokerPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: BrokerPageProps): Promise<Metadata> {
  const broker = await getBrokerBySlug(params.slug)
  
  if (!broker) {
    return {
      title: 'Broker Not Found | Brokeranalysis',
      description: 'The requested broker profile could not be found.'
    }
  }

  return {
    title: `${broker.name} Review ${new Date().getFullYear()} | Trust Score ${broker.trust_score}/100 | Brokeranalysis`,
    description: `Comprehensive ${broker.name} review with trust score ${broker.trust_score}/100, trading conditions, regulation info, and user reviews. Find out if ${broker.name} is right for you.`,
    keywords: [
      broker.name,
      `${broker.name} review`,
      `${broker.name} broker`,
      'forex broker',
      'trading platform',
      'broker comparison',
      'trust score',
      'regulation'
    ],
    openGraph: {
      title: `${broker.name} Review ${new Date().getFullYear()} | Trust Score ${broker.trust_score}/100`,
      description: `Comprehensive ${broker.name} review with trust score ${broker.trust_score}/100, trading conditions, and user reviews.`,
      type: 'article',
      url: `https://brokeranalysis.com/brokers/${broker.slug}`,
      images: [
        {
          url: broker.logo_url || '/images/default-broker-logo.png',
          width: 1200,
          height: 630,
          alt: `${broker.name} logo`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${broker.name} Review ${new Date().getFullYear()} | Trust Score ${broker.trust_score}/100`,
      description: `Comprehensive ${broker.name} review with trust score ${broker.trust_score}/100, trading conditions, and user reviews.`,
      images: [broker.logo_url || '/images/default-broker-logo.png']
    },
    alternates: {
      canonical: `https://brokeranalysis.com/brokers/${broker.slug}`
    }
  }
}

export default async function BrokerPage({ params }: BrokerPageProps) {
  const broker = await getBrokerBySlug(params.slug)
  
  if (!broker) {
    notFound()
  }

  // Generate structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    name: broker.name,
    description: broker.description,
    url: `https://brokeranalysis.com/brokers/${broker.slug}`,
    logo: broker.logo_url,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: broker.overall_rating,
      bestRating: 5,
      worstRating: 1,
      ratingCount: broker.review_count || 0
    },
    offers: {
      '@type': 'Offer',
      description: `Trading services with minimum deposit of ${broker.minimum_deposit}`,
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
            name: 'Forex Trading'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'CFD Trading'
          }
        }
      ]
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="min-h-screen bg-gray-50">
        {/* Broker Profile Header */}
        <BrokerProfileHeader broker={broker} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Trust Score Section */}
              <BrokerTrustScore broker={broker} />
              
              {/* Trading Conditions */}
              <BrokerTradingConditions broker={broker} />
              
              {/* Regulation Information */}
              <BrokerRegulationInfo broker={broker} />
              
              {/* User Reviews */}
              <BrokerReviews brokerId={broker.id} />
              
              {/* FAQ Section */}
              <BrokerFAQ broker={broker} />
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Comparison */}
              <BrokerComparison currentBroker={broker} />
              
              {/* Key Information Card */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Facts</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trust Score</span>
                    <span className="font-semibold text-blue-600">{broker.trust_score}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Overall Rating</span>
                    <span className="font-semibold">{broker.overall_rating}/5</span>
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
                </div>
                
                <div className="mt-6">
                  <a
                    href={broker.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center block"
                  >
                    Visit {broker.name}
                  </a>
                </div>
              </div>
              
              {/* Risk Warning */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-amber-800 mb-2">Risk Warning</h4>
                <p className="text-xs text-amber-700">
                  Trading involves substantial risk and may result in the loss of your invested capital. 
                  You should not invest more than you can afford to lose and should ensure that you 
                  fully understand the risks involved.
                </p>
              </div>
            </div>
          </div>
        </div>
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
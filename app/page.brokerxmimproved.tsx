'use client'

import { notFound } from 'next/navigation'
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

// Mock broker data for XM
const mockBroker = {
  id: '1',
  name: 'XM',
  slug: 'xm',
  description: 'XM is a leading online forex and CFD broker, regulated by multiple tier-1 authorities. Established in 2009, XM serves over 5 million clients worldwide with competitive trading conditions, comprehensive educational resources, and professional customer support.',
  logo_url: '/images/brokers/xm-logo.png',
  website_url: 'https://www.xm.com',
  trust_score: 45, // Poor score to demonstrate the improvements
  overall_rating: 3.2,
  review_count: 1247,
  minimum_deposit: 5,
  maximum_leverage: 888,
  spread_type: 'Variable',
  execution_speed: '< 1ms',
  founded_year: 2009,
  platforms_count: 4,
  forex_pairs: '55+',
  indices_count: '24+',
  commodities_count: '18+',
  crypto_count: '31+',
  stocks_count: '1400+',
  etfs_count: '120+',
  mt4_available: true,
  mt5_available: true,
  webtrader_available: true,
  mobile_app_available: true,
  ctrader_available: false,
  proprietary_platform: false
}

export default function BrokerXMImprovedPreview() {
  const currentYear = new Date().getFullYear()
  const trustScoreLabel = mockBroker.trust_score >= 80 ? 'Excellent' : mockBroker.trust_score >= 60 ? 'Good' : 'Poor'

  // Enhanced structured data for SEO
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    name: mockBroker.name,
    description: mockBroker.description,
    url: `https://brokeranalysis.com/brokers/${mockBroker.slug}`,
    logo: mockBroker.logo_url,
    foundingDate: `${mockBroker.founded_year}-01-01`,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: mockBroker.overall_rating,
      bestRating: 5,
      worstRating: 1,
      ratingCount: mockBroker.review_count
    },
    offers: {
      '@type': 'Offer',
      description: `Trading services with minimum deposit of $${mockBroker.minimum_deposit}`,
      priceSpecification: {
        '@type': 'PriceSpecification',
        price: mockBroker.minimum_deposit,
        priceCurrency: 'USD'
      }
    },
    serviceType: 'Financial Trading Platform',
    areaServed: 'Global'
  }

  const reviewSchema = {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'FinancialService',
      name: mockBroker.name
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: mockBroker.trust_score / 20,
      bestRating: 5,
      worstRating: 1
    },
    author: {
      '@type': 'Organization',
      name: 'Brokeranalysis'
    },
    reviewBody: `Comprehensive review of ${mockBroker.name} with trust score ${mockBroker.trust_score}/100. Analysis covers regulation, trading conditions, safety measures, and user feedback.`,
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
      
      <div className="min-h-screen bg-gray-50">
        {/* Header with Mega Menu */}
        <MegaMenuHeader />
        
        {/* Broker Profile Header */}
        <BrokerProfileHeader broker={mockBroker} />
        
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content Column */}
            <div className="lg:col-span-3 space-y-12">
              {/* Trust Score Section */}
              <BrokerTrustScore broker={mockBroker} />
              
              {/* Trading Conditions */}
              <BrokerTradingConditions broker={mockBroker} />
              
              {/* Regulation Information */}
              <BrokerRegulationInfo broker={mockBroker} />
              
              {/* User Reviews */}
              <BrokerReviews broker={mockBroker} />
              
              {/* FAQ Section */}
              <BrokerFAQ broker={mockBroker} />
            </div>
            
            {/* Sidebar */}
            <div className="lg:sticky lg:top-24 lg:self-start space-y-6">
              {/* Quick Comparison */}
              <BrokerComparison broker={mockBroker} />
              
              {/* Key Information Card */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Facts</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Trust Score</span>
                    <span className={`font-bold px-2 py-1 rounded-lg text-sm ${
                      mockBroker.trust_score >= 80 ? 'text-green-600 bg-green-100' :
                      mockBroker.trust_score >= 60 ? 'text-yellow-600 bg-yellow-100' :
                      'text-red-600 bg-red-100'
                    }`}>
                      {mockBroker.trust_score}/100
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Overall Rating</span>
                    <span className="font-semibold">{mockBroker.overall_rating}/5 ⭐</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Min Deposit</span>
                    <span className="font-semibold">${mockBroker.minimum_deposit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Max Leverage</span>
                    <span className="font-semibold">1:{mockBroker.maximum_leverage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Founded</span>
                    <span className="font-semibold">{mockBroker.founded_year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Regulation</span>
                    <span className="font-semibold text-green-600">✓ Multi-regulated</span>
                  </div>
                </div>
                
                <div className="mt-6 space-y-3">
                  <a
                    href={mockBroker.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center block"
                  >
                    Visit {mockBroker.name}
                  </a>
                  <button className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                    Compare Brokers
                  </button>
                </div>
              </div>
              
              {/* Alternative Brokers */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h4 className="font-bold text-blue-900 mb-3">Looking for Safer Alternatives?</h4>
                <p className="text-blue-800 text-sm mb-4">
                  Based on XM's low trust score, consider exploring other brokers with higher safety ratings and better regulatory compliance.
                </p>
                <a
                  href="/brokers"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Find Safer Brokers
                </a>
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
        
        {/* Back to Top Button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 left-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
        
        {/* Footer */}
        <Footer />
        
        {/* Floating Chat Bubble */}
        <ChatBubble />
      </div>
    </>
  )
}
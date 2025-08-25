import { Metadata } from 'next'
import { Suspense } from 'react'
import { Star, TrendingUp, Shield, Award, Users, Globe } from 'lucide-react'
import MegaMenuHeader from '@/components/MegaMenuHeader'
import Footer from '@/components/Footer'
import ChatBubble from '@/components/ChatBubble'
import { BrokerService } from '@/lib/services/brokerService'
import Link from 'next/link'
import Image from 'next/image'

// Enable static generation with revalidation
export const revalidate = 3600 // Revalidate every hour

export const metadata: Metadata = {
  title: 'Forex Broker Reviews 2024 - Expert Analysis & Ratings | Brokeranalysis',
  description: 'Read comprehensive forex broker reviews with expert analysis, user ratings, and detailed comparisons. Find the most trusted and reliable brokers.',
  keywords: 'forex broker reviews, broker ratings, expert analysis, broker comparison, trading reviews, regulated brokers',
  openGraph: {
    title: 'Forex Broker Reviews 2024 - Expert Analysis & Ratings',
    description: 'Read comprehensive forex broker reviews with expert analysis, user ratings, and detailed comparisons.',
    type: 'website',
    url: '/brokers/reviews',
    siteName: 'Brokeranalysis',
    images: [
      {
        url: '/images/brokers/reviews-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Forex Broker Reviews 2024'
      }
    ]
  }
}

// Get all brokers for reviews
async function getAllBrokers() {
  try {
    const brokers = await BrokerService.getBrokers(100, 0) // Get top 100 brokers
    
    // Sort by overall rating and trust score
    return brokers.sort((a, b) => {
      const aScore = (a.overall_rating || 0) + (a.trust_score || 0) / 20
      const bScore = (b.overall_rating || 0) + (b.trust_score || 0) / 20
      return bScore - aScore
    })
  } catch (error) {
    console.error('Error fetching brokers for reviews:', error)
    return []
  }
}

function ReviewCard({ broker }: { broker: any }) {
  const formatRating = (rating: number | null) => {
    if (!rating) return 'N/A'
    return rating.toFixed(1)
  }

  const formatTrustScore = (score: number | null) => {
    if (!score) return 'N/A'
    return `${score}/100`
  }

  const getRatingColor = (rating: number | null) => {
    if (!rating) return 'text-gray-500'
    if (rating >= 4.5) return 'text-green-600'
    if (rating >= 4.0) return 'text-blue-600'
    if (rating >= 3.5) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getTrustScoreColor = (score: number | null) => {
    if (!score) return 'text-gray-500'
    if (score >= 80) return 'text-green-600'
    if (score >= 70) return 'text-blue-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="p-6">
        {/* Broker Header */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
            {broker.logo_url ? (
              <Image
                src={broker.logo_url}
                alt={`${broker.name} logo`}
                width={48}
                height={48}
                className="object-contain"
              />
            ) : (
              <span className="text-lg font-bold text-gray-600">
                {broker.name.charAt(0)}
              </span>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1">{broker.name}</h3>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className={`font-semibold ${getRatingColor(broker.overall_rating)}`}>
                  {formatRating(broker.overall_rating)}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Shield className="w-4 h-4 text-green-500" />
                <span className={`font-semibold ${getTrustScoreColor(broker.trust_score)}`}>
                  {formatTrustScore(broker.trust_score)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Review Summary */}
        <div className="mb-4">
          <p className="text-gray-600 text-sm line-clamp-3">
            {broker.description || `${broker.name} is a regulated forex broker offering competitive trading conditions and professional services for traders worldwide.`}
          </p>
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div>
            <span className="text-gray-500">Regulation:</span>
            <span className="ml-2 font-medium">{broker.regulation || 'Multiple'}</span>
          </div>
          <div>
            <span className="text-gray-500">Min Deposit:</span>
            <span className="ml-2 font-medium">
              {broker.minimum_deposit ? `$${broker.minimum_deposit.toLocaleString()}` : 'No minimum'}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Platforms:</span>
            <span className="ml-2 font-medium">{broker.platforms || 'MT4, MT5'}</span>
          </div>
          <div>
            <span className="text-gray-500">Spreads:</span>
            <span className="ml-2 font-medium">From {broker.min_spread || '0.0'} pips</span>
          </div>
        </div>

        {/* Review Highlights */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-2">Review Highlights</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Regulated and licensed broker</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Competitive trading conditions</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Professional customer support</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Link
            href={`/brokers/${broker.slug}`}
            className="flex-1 bg-blue-600 text-white text-center py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Read Full Review
          </Link>
          <Link
            href={`/compare?brokers=${broker.slug}`}
            className="flex-1 bg-gray-100 text-gray-900 text-center py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Compare
          </Link>
        </div>
      </div>
    </div>
  )
}

function ReviewStats({ brokers }: { brokers: any[] }) {
  const avgRating = brokers.reduce((sum, broker) => sum + (broker.overall_rating || 0), 0) / brokers.length
  const avgTrustScore = brokers.reduce((sum, broker) => sum + (broker.trust_score || 0), 0) / brokers.length
  const regulatedBrokers = brokers.filter(broker => broker.regulation).length
  const topRatedBrokers = brokers.filter(broker => (broker.overall_rating || 0) >= 4.0).length

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
      <div className="text-center">
        <div className="text-3xl font-bold text-blue-600 mb-2">{brokers.length}</div>
        <div className="text-sm text-gray-600">Brokers Reviewed</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-green-600 mb-2">{avgRating.toFixed(1)}</div>
        <div className="text-sm text-gray-600">Average Rating</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-purple-600 mb-2">{avgTrustScore.toFixed(0)}</div>
        <div className="text-sm text-gray-600">Avg Trust Score</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-orange-600 mb-2">{regulatedBrokers}</div>
        <div className="text-sm text-gray-600">Regulated Brokers</div>
      </div>
    </div>
  )
}

export default async function BrokerReviewsPage() {
  const brokers = await getAllBrokers()

  return (
    <>
      <MegaMenuHeader />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Forex Broker Reviews 2024
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Read comprehensive, unbiased reviews of the world's leading forex brokers. 
                Our expert analysis helps you choose the right broker for your trading needs.
              </p>
              
              <div className="flex items-center justify-center space-x-8 text-sm">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  <span>Expert Analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-green-400" />
                  <span>Unbiased Reviews</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-300" />
                  <span>User Ratings</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-6">
            {/* Review Statistics */}
            <ReviewStats brokers={brokers} />

            {/* Reviews Grid */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                All Broker Reviews ({brokers.length})
              </h2>
              
              {brokers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {brokers.map((broker) => (
                    <ReviewCard key={broker.id} broker={broker} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-500 text-lg mb-4">
                    No broker reviews available at the moment.
                  </div>
                  <Link
                    href="/brokers"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View all brokers
                  </Link>
                </div>
              )}
            </div>

            {/* Review Methodology */}
            <div className="bg-white rounded-lg shadow-md p-8 mt-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Review Methodology</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Regulation & Safety</h4>
                  <p className="text-sm text-gray-600">We verify regulatory licenses and fund protection measures.</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Trading Conditions</h4>
                  <p className="text-sm text-gray-600">Analysis of spreads, commissions, and execution quality.</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-8 h-8 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Platform & Tools</h4>
                  <p className="text-sm text-gray-600">Evaluation of trading platforms and available tools.</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-orange-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Customer Service</h4>
                  <p className="text-sm text-gray-600">Testing support quality and response times.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ChatBubble />
    </>
  )
}

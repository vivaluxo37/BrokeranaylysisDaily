'use client'

import { Broker } from '@/lib/supabase'
import { Star, ThumbsUp, ThumbsDown, MessageSquare, Filter, ChevronDown } from 'lucide-react'
import { useState } from 'react'

interface BrokerReviewsProps {
  broker: Broker
}

interface Review {
  id: string
  author: string
  rating: number
  title: string
  content: string
  date: string
  verified: boolean
  helpful: number
  notHelpful: number
  tradingExperience: string
  accountType: string
  pros: string[]
  cons: string[]
}

interface RatingBreakdown {
  rating: number
  count: number
  percentage: number
}

export default function BrokerReviews({ broker }: BrokerReviewsProps) {
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  // In a real implementation, this would come from the database
  const reviews: Review[] = [
    {
      id: '1',
      author: 'TradingPro2024',
      rating: 5,
      title: 'Excellent spreads and execution',
      content: 'Been trading with this broker for over 2 years. The spreads are consistently tight, especially on major pairs. Execution is fast and I\'ve never experienced any slippage during normal market conditions. Customer support is responsive and knowledgeable.',
      date: '2024-01-15',
      verified: true,
      helpful: 23,
      notHelpful: 2,
      tradingExperience: '5+ years',
      accountType: 'ECN',
      pros: ['Tight spreads', 'Fast execution', 'Good customer support'],
      cons: ['Limited educational resources']
    },
    {
      id: '2',
      author: 'ForexNewbie',
      rating: 4,
      title: 'Good for beginners',
      content: 'Started my trading journey with this broker 6 months ago. The platform is user-friendly and the demo account helped me learn. Spreads are reasonable for a beginner account. Would like to see more educational content.',
      date: '2024-01-10',
      verified: true,
      helpful: 15,
      notHelpful: 1,
      tradingExperience: '< 1 year',
      accountType: 'Standard',
      pros: ['User-friendly platform', 'Good demo account', 'Reasonable spreads'],
      cons: ['Limited educational content', 'Higher spreads on exotic pairs']
    },
    {
      id: '3',
      author: 'ScalpingMaster',
      rating: 3,
      title: 'Mixed experience',
      content: 'The platform is decent but I\'ve experienced some issues during high volatility periods. Spreads can widen significantly during news events. Customer support took a while to respond to my queries.',
      date: '2024-01-05',
      verified: false,
      helpful: 8,
      notHelpful: 5,
      tradingExperience: '2-5 years',
      accountType: 'Standard',
      pros: ['Decent platform', 'Multiple payment methods'],
      cons: ['Spreads widen during news', 'Slow customer support']
    }
  ]

  const ratingBreakdown: RatingBreakdown[] = [
    { rating: 5, count: 156, percentage: 45 },
    { rating: 4, count: 98, percentage: 28 },
    { rating: 3, count: 52, percentage: 15 },
    { rating: 2, count: 28, percentage: 8 },
    { rating: 1, count: 14, percentage: 4 }
  ]

  const totalReviews = ratingBreakdown.reduce((sum, item) => sum + item.count, 0)
  const averageRating = ratingBreakdown.reduce((sum, item) => sum + (item.rating * item.count), 0) / totalReviews

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'w-3 h-3',
      md: 'w-4 h-4',
      lg: 'w-5 h-5'
    }

    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  const filteredReviews = reviews.filter(review => {
    if (selectedFilter === 'all') return true
    if (selectedFilter === 'verified') return review.verified
    if (selectedFilter === 'high') return review.rating >= 4
    if (selectedFilter === 'low') return review.rating <= 2
    return true
  })

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center space-x-3 mb-6">
        <MessageSquare className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">User Reviews</h2>
      </div>

      {/* Rating Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Average Rating */}
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900 mb-2">
            {averageRating.toFixed(1)}
          </div>
          {renderStars(Math.round(averageRating), 'lg')}
          <div className="text-sm text-gray-600 mt-2">
            Based on {totalReviews} reviews
          </div>
        </div>

        {/* Rating Breakdown */}
        <div className="lg:col-span-2">
          <div className="space-y-2">
            {ratingBreakdown.map((item) => (
              <div key={item.rating} className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 w-12">
                  <span className="text-sm font-medium">{item.rating}</span>
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <div className="text-sm text-gray-600 w-12 text-right">
                  {item.count}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters and Sorting */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter:</span>
          </div>
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Reviews</option>
            <option value="verified">Verified Only</option>
            <option value="high">4+ Stars</option>
            <option value="low">2 Stars or Less</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {filteredReviews.map((review) => (
          <div key={review.id} className="border border-gray-200 rounded-lg p-6">
            {/* Review Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">
                    {review.author.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-900">{review.author}</span>
                    {review.verified && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <span>{review.tradingExperience} experience</span>
                    <span>•</span>
                    <span>{review.accountType} Account</span>
                    <span>•</span>
                    <span>{review.date}</span>
                  </div>
                </div>
              </div>
              {renderStars(review.rating)}
            </div>

            {/* Review Content */}
            <h3 className="font-semibold text-gray-900 mb-2">{review.title}</h3>
            <p className="text-gray-700 mb-4">{review.content}</p>

            {/* Pros and Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-medium text-green-700 mb-2">Pros:</h4>
                <ul className="space-y-1">
                  {review.pros.map((pro, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                      <ThumbsUp className="w-3 h-3 text-green-600" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-red-700 mb-2">Cons:</h4>
                <ul className="space-y-1">
                  {review.cons.map((con, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                      <ThumbsDown className="w-3 h-3 text-red-600" />
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Review Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-green-600">
                  <ThumbsUp className="w-4 h-4" />
                  <span>Helpful ({review.helpful})</span>
                </button>
                <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-red-600">
                  <ThumbsDown className="w-4 h-4" />
                  <span>Not Helpful ({review.notHelpful})</span>
                </button>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-800">
                Report Review
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <div className="text-center mt-8">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Load More Reviews
        </button>
      </div>

      {/* Write Review CTA */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
        <h3 className="font-semibold text-blue-900 mb-2">Share Your Experience</h3>
        <p className="text-blue-800 mb-4">
          Help other traders by sharing your experience with {broker.name}
        </p>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Write a Review
        </button>
      </div>
    </div>
  )
}
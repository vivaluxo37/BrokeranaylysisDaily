'use client'

import { useState } from 'react'
import { ExternalLink, Star, Shield, TrendingUp, Users, ArrowRight } from 'lucide-react'
import { Broker } from '@/lib/types'

interface BrokerComparisonCTAProps {
  brokers: Broker[]
}

export default function BrokerComparisonCTA({ brokers }: BrokerComparisonCTAProps) {
  const [selectedBroker, setSelectedBroker] = useState<string | null>(null)

  // Find the broker with the highest trust score
  const topBroker = brokers.reduce((prev, current) => 
    (prev.trust_score > current.trust_score) ? prev : current
  )

  const handleBrokerSelect = (brokerId: string) => {
    setSelectedBroker(brokerId)
  }

  const getBrokerRank = (broker: Broker) => {
    const sorted = [...brokers].sort((a, b) => b.trust_score - a.trust_score)
    return sorted.findIndex(b => b.id === broker.id) + 1
  }

  const getRankSuffix = (rank: number) => {
    if (rank === 1) return 'st'
    if (rank === 2) return 'nd'
    if (rank === 3) return 'rd'
    return 'th'
  }

  return (
    <div className="space-y-8">
      {/* Winner Announcement */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <Star className="h-6 w-6 text-green-600 fill-current" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-green-900">Recommended Choice</h3>
            <p className="text-green-700">Based on our comprehensive analysis</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold text-blue-600">
                  {topBroker.name.charAt(0)}
                </span>
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900">{topBroker.name}</h4>
                <div className="flex items-center space-x-4 mt-1">
                  <div className="flex items-center space-x-1">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-600">
                      Trust Score: {topBroker.trust_score}/100
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium text-gray-600">
                      {topBroker.overall_rating} Rating
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">Winner</div>
              <div className="text-sm text-green-700">Best Overall Choice</div>
            </div>
          </div>
        </div>
      </div>

      {/* Individual Broker CTAs */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {brokers.map((broker) => {
          const rank = getBrokerRank(broker)
          const isSelected = selectedBroker === broker.id
          const isWinner = broker.id === topBroker.id
          
          return (
            <div
              key={broker.id}
              className={`relative bg-white rounded-lg border-2 p-6 transition-all duration-200 hover:shadow-lg ${
                isSelected ? 'border-blue-500 shadow-lg' : 'border-gray-200'
              } ${isWinner ? 'ring-2 ring-green-500 ring-opacity-50' : ''}`}
            >
              {isWinner && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    RECOMMENDED
                  </div>
                </div>
              )}
              
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-blue-600">
                    {broker.name.charAt(0)}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{broker.name}</h3>
                <p className="text-sm text-gray-600">
                  {rank}{getRankSuffix(rank)} place in comparison
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Trust Score</span>
                  <div className="flex items-center space-x-1">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="font-semibold text-green-600">{broker.trust_score}/100</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Rating</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="font-semibold">{broker.overall_rating}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Min. Deposit</span>
                  <span className="font-semibold">${broker.minimum_deposit}</span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => handleBrokerSelect(broker.id)}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                    isWinner
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  Choose {broker.name}
                </button>
                
                <div className="flex space-x-2">
                  <a
                    href={`/brokers/${broker.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="flex-1 py-2 px-3 border border-gray-300 rounded-lg text-center text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Full Review
                  </a>
                  <a
                    href={broker.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 border border-gray-300 rounded-lg text-center text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center space-x-1"
                  >
                    <span>Visit</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Next Steps */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Next?</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Open Demo Account</h4>
              <p className="text-sm text-gray-600 mt-1">
                Test the platform with virtual funds before committing real money.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Users className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Read User Reviews</h4>
              <p className="text-sm text-gray-600 mt-1">
                Check what other traders say about their experience with these brokers.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <ArrowRight className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Start Trading</h4>
              <p className="text-sm text-gray-600 mt-1">
                Fund your account and begin your trading journey with confidence.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Risk Warning:</strong> Trading involves substantial risk and may result in the loss of your invested capital. 
          You should not invest more than you can afford to lose and should ensure that you fully understand the risks involved. 
          Past performance is not indicative of future results.
        </p>
      </div>
    </div>
  )
}
'use client'

import { Trophy, Shield, DollarSign, Star, TrendingUp, Users } from 'lucide-react'
import { Broker } from '@/lib/types'

interface BrokerComparisonSummaryProps {
  brokers: Broker[]
}

export default function BrokerComparisonSummary({ brokers }: BrokerComparisonSummaryProps) {
  // Calculate winners in different categories
  const getWinner = (category: keyof Broker, isHigherBetter: boolean = true) => {
    return brokers.reduce((winner, current) => {
      const winnerValue = winner[category] as number
      const currentValue = current[category] as number
      
      if (isHigherBetter) {
        return currentValue > winnerValue ? current : winner
      } else {
        return currentValue < winnerValue ? current : winner
      }
    })
  }

  const trustScoreWinner = getWinner('trust_score')
  const ratingWinner = getWinner('overall_rating')
  const minDepositWinner = getWinner('minimum_deposit', false)
  
  // Calculate average scores
  const avgTrustScore = (brokers.reduce((sum, broker) => sum + broker.trust_score, 0) / brokers.length).toFixed(1)
  const avgRating = (brokers.reduce((sum, broker) => sum + parseFloat(broker.overall_rating.toString()), 0) / brokers.length).toFixed(1)
  const avgMinDeposit = Math.round(brokers.reduce((sum, broker) => sum + broker.minimum_deposit, 0) / brokers.length)

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Comparison Summary</h2>
      
      {/* Category Winners */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <Trophy className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
          <h3 className="font-semibold text-gray-900 mb-1">Highest Trust Score</h3>
          <p className="text-lg font-bold text-yellow-600">{trustScoreWinner.name}</p>
          <p className="text-sm text-gray-600">{trustScoreWinner.trust_score}/100</p>
        </div>
        
        <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
          <Star className="h-8 w-8 text-green-600 mx-auto mb-2 fill-current" />
          <h3 className="font-semibold text-gray-900 mb-1">Best Overall Rating</h3>
          <p className="text-lg font-bold text-green-600">{ratingWinner.name}</p>
          <p className="text-sm text-gray-600">{ratingWinner.overall_rating}/5 stars</p>
        </div>
        
        <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
          <DollarSign className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <h3 className="font-semibold text-gray-900 mb-1">Lowest Min Deposit</h3>
          <p className="text-lg font-bold text-blue-600">{minDepositWinner.name}</p>
          <p className="text-sm text-gray-600">${minDepositWinner.minimum_deposit}</p>
        </div>
      </div>
      
      {/* Quick Comparison Stats */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <Shield className="h-6 w-6 text-gray-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Avg Trust Score</p>
            <p className="text-xl font-bold text-gray-900">{avgTrustScore}</p>
          </div>
          
          <div className="text-center">
            <Star className="h-6 w-6 text-gray-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Avg Rating</p>
            <p className="text-xl font-bold text-gray-900">{avgRating}</p>
          </div>
          
          <div className="text-center">
            <DollarSign className="h-6 w-6 text-gray-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Avg Min Deposit</p>
            <p className="text-xl font-bold text-gray-900">${avgMinDeposit}</p>
          </div>
          
          <div className="text-center">
            <Users className="h-6 w-6 text-gray-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Brokers Compared</p>
            <p className="text-xl font-bold text-gray-900">{brokers.length}</p>
          </div>
        </div>
      </div>
      
      {/* Key Insights */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">Key Insights</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• {trustScoreWinner.name} leads in trust and reliability with a {trustScoreWinner.trust_score}/100 trust score</li>
          <li>• {ratingWinner.name} has the highest user satisfaction rating at {ratingWinner.overall_rating}/5 stars</li>
          <li>• {minDepositWinner.name} offers the most accessible entry point with a ${minDepositWinner.minimum_deposit} minimum deposit</li>
          {brokers.length === 3 && (
            <li>• All three brokers offer competitive trading conditions suitable for different trader profiles</li>
          )}
        </ul>
      </div>
    </div>
  )
}
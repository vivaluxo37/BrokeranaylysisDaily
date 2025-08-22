'use client'

import { Broker } from '@/lib/supabase'
import { Shield, CheckCircle, AlertTriangle, Info } from 'lucide-react'

interface BrokerTrustScoreProps {
  broker: Broker
}

interface TrustScoreCategory {
  name: string
  score: number
  maxScore: number
  description: string
  icon: React.ReactNode
  color: string
}

export default function BrokerTrustScore({ broker }: BrokerTrustScoreProps) {
  // Calculate individual category scores based on trust score
  // In a real implementation, these would come from the database
  const regulationScore = Math.min(25, Math.round(broker.trust_score * 0.25))
  const securityScore = Math.min(20, Math.round(broker.trust_score * 0.20))
  const transparencyScore = Math.min(20, Math.round(broker.trust_score * 0.20))
  const reputationScore = Math.min(15, Math.round(broker.trust_score * 0.15))
  const serviceScore = Math.min(20, Math.round(broker.trust_score * 0.20))

  const categories: TrustScoreCategory[] = [
    {
      name: 'Regulation & Licensing',
      score: regulationScore,
      maxScore: 25,
      description: 'Regulatory oversight and licensing compliance',
      icon: <Shield className="w-5 h-5" />,
      color: regulationScore >= 20 ? 'text-green-600' : regulationScore >= 15 ? 'text-yellow-600' : 'text-red-600'
    },
    {
      name: 'Security & Safety',
      score: securityScore,
      maxScore: 20,
      description: 'Client fund protection and security measures',
      icon: <CheckCircle className="w-5 h-5" />,
      color: securityScore >= 16 ? 'text-green-600' : securityScore >= 12 ? 'text-yellow-600' : 'text-red-600'
    },
    {
      name: 'Transparency',
      score: transparencyScore,
      maxScore: 20,
      description: 'Fee disclosure and business transparency',
      icon: <Info className="w-5 h-5" />,
      color: transparencyScore >= 16 ? 'text-green-600' : transparencyScore >= 12 ? 'text-yellow-600' : 'text-red-600'
    },
    {
      name: 'Reputation',
      score: reputationScore,
      maxScore: 15,
      description: 'Industry reputation and user feedback',
      icon: <AlertTriangle className="w-5 h-5" />,
      color: reputationScore >= 12 ? 'text-green-600' : reputationScore >= 9 ? 'text-yellow-600' : 'text-red-600'
    },
    {
      name: 'Customer Service',
      score: serviceScore,
      maxScore: 20,
      description: 'Support quality and responsiveness',
      icon: <CheckCircle className="w-5 h-5" />,
      color: serviceScore >= 16 ? 'text-green-600' : serviceScore >= 12 ? 'text-yellow-600' : 'text-red-600'
    }
  ]

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getTrustScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100'
    if (score >= 60) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  const getTrustScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 70) return 'Good'
    if (score >= 60) return 'Average'
    if (score >= 40) return 'Below Average'
    return 'Poor'
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Trust Score Analysis</h2>
        <div className="text-right">
          <div className={`text-4xl font-bold ${getTrustScoreColor(broker.trust_score)}`}>
            {broker.trust_score}
          </div>
          <div className="text-sm text-gray-600">out of 100</div>
        </div>
      </div>

      {/* Overall Trust Score */}
      <div className={`rounded-lg p-4 mb-6 ${getTrustScoreBgColor(broker.trust_score)}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Overall Trust Rating</h3>
            <p className="text-sm text-gray-600 mt-1">
              {getTrustScoreLabel(broker.trust_score)} - Based on comprehensive analysis of regulatory compliance, security measures, and user feedback.
            </p>
          </div>
          <div className={`text-2xl font-bold ${getTrustScoreColor(broker.trust_score)}`}>
            {getTrustScoreLabel(broker.trust_score)}
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Breakdown</h3>
        
        {categories.map((category, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className={category.color}>
                  {category.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{category.name}</h4>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-xl font-bold ${category.color}`}>
                  {category.score}/{category.maxScore}
                </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  category.score >= category.maxScore * 0.8
                    ? 'bg-green-600'
                    : category.score >= category.maxScore * 0.6
                    ? 'bg-yellow-600'
                    : 'bg-red-600'
                }`}
                style={{ width: `${(category.score / category.maxScore) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Methodology Link */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-900">Trust Score Methodology</h4>
            <p className="text-sm text-gray-600 mt-1">
              Our trust scores are calculated using a comprehensive methodology that evaluates multiple factors.
            </p>
          </div>
          <a
            href="/methodology"
            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            Learn More →
          </a>
        </div>
      </div>
    </div>
  )
}
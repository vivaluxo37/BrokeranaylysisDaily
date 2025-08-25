'use client'

import { Broker } from '@/lib/supabase'
import { Shield, CheckCircle, AlertTriangle, Info, ShieldCheck } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

interface BrokerTrustScoreProps {
  broker: Broker
}

interface TrustScoreCategory {
  name: string
  score: number
  maxScore: number
  description: string
  details: string[]
  icon: React.ReactNode
  color: string
  bgColor: string
}

export default function BrokerTrustScore({ broker }: BrokerTrustScoreProps) {
  // Calculate individual category scores based on trust score
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
      details: [
        'Multi-jurisdictional regulation',
        'Tier-1 regulatory authorities',
        'Active license verification',
        'Compliance history review'
      ],
      icon: <ShieldCheck className="w-6 h-6" />,
      color: regulationScore >= 20 ? 'text-green-600' : regulationScore >= 15 ? 'text-yellow-600' : 'text-red-600',
      bgColor: regulationScore >= 20 ? 'bg-green-50 border-green-200' : regulationScore >= 15 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'
    },
    {
      name: 'Security & Safety',
      score: securityScore,
      maxScore: 20,
      description: 'Client fund protection and security measures',
      details: [
        'Segregated client accounts',
        'Investor compensation schemes',
        'Bank-grade security protocols',
        'Regular security audits'
      ],
      icon: <Shield className="w-6 h-6" />,
      color: securityScore >= 16 ? 'text-green-600' : securityScore >= 12 ? 'text-yellow-600' : 'text-red-600',
      bgColor: securityScore >= 16 ? 'bg-green-50 border-green-200' : securityScore >= 12 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'
    },
    {
      name: 'Transparency',
      score: transparencyScore,
      maxScore: 20,
      description: 'Fee disclosure and business transparency',
      details: [
        'Clear fee structure',
        'Transparent trading conditions',
        'Regular financial reporting',
        'Open communication policies'
      ],
      icon: <Info className="w-6 h-6" />,
      color: transparencyScore >= 16 ? 'text-green-600' : transparencyScore >= 12 ? 'text-yellow-600' : 'text-red-600',
      bgColor: transparencyScore >= 16 ? 'bg-green-50 border-green-200' : transparencyScore >= 12 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'
    },
    {
      name: 'Market Reputation',
      score: reputationScore,
      maxScore: 15,
      description: 'Industry reputation and user feedback',
      details: [
        'Industry awards and recognition',
        'User satisfaction ratings',
        'Professional reviews',
        'Market presence and stability'
      ],
      icon: <CheckCircle className="w-6 h-6" />,
      color: reputationScore >= 12 ? 'text-green-600' : reputationScore >= 9 ? 'text-yellow-600' : 'text-red-600',
      bgColor: reputationScore >= 12 ? 'bg-green-50 border-green-200' : reputationScore >= 9 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'
    },
    {
      name: 'Customer Service',
      score: serviceScore,
      maxScore: 20,
      description: 'Support quality and responsiveness',
      details: [
        '24/5 customer support',
        'Multiple contact channels',
        'Response time tracking',
        'Support quality assessment'
      ],
      icon: <CheckCircle className="w-6 h-6" />,
      color: serviceScore >= 16 ? 'text-green-600' : serviceScore >= 12 ? 'text-yellow-600' : 'text-red-600',
      bgColor: serviceScore >= 16 ? 'bg-green-50 border-green-200' : serviceScore >= 12 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'
    }
  ]

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getTrustScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
    if (score >= 60) return 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200'
    return 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200'
  }

  const getTrustScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent'
    if (score >= 80) return 'Very Good'
    if (score >= 70) return 'Good'
    if (score >= 60) return 'Average'
    if (score >= 40) return 'Below Average'
    return 'Poor'
  }

  const getScoreExplanation = (score: number) => {
    if (score >= 80) return 'This broker meets the highest standards for safety, regulation, and service quality.'
    if (score >= 60) return 'This broker meets most safety and regulatory requirements with room for improvement.'
    return 'This broker has significant concerns that traders should carefully consider before opening an account.'
  }

  return (
    <section id="trust-score" className="bg-white rounded-2xl shadow-sm border p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Trust Score Analysis</h2>
          <p className="text-gray-600">Comprehensive evaluation of broker safety and reliability</p>
        </div>
        <div className="text-right">
          <div className={`text-5xl font-bold ${getTrustScoreColor(broker.trust_score)} mb-1`}>
            {broker.trust_score}
          </div>
          <div className="text-sm text-gray-600">out of 100</div>
        </div>
      </div>

      {/* Overall Trust Score */}
      <div className={`rounded-2xl border-2 p-6 mb-8 ${getTrustScoreBgColor(broker.trust_score)}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {broker.trust_score >= 60 ? (
              <ShieldCheck className={`w-8 h-8 ${getTrustScoreColor(broker.trust_score)}`} />
            ) : (
              <AlertTriangle className={`w-8 h-8 ${getTrustScoreColor(broker.trust_score)}`} />
            )}
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {getTrustScoreLabel(broker.trust_score)} Trust Rating
              </h3>
              <p className="text-gray-700 mt-1">
                {getScoreExplanation(broker.trust_score)}
              </p>
            </div>
          </div>
          <div className={`text-3xl font-bold ${getTrustScoreColor(broker.trust_score)}`}>
            {getTrustScoreLabel(broker.trust_score)}
          </div>
        </div>
        
        {broker.trust_score < 70 && (
          <div className="bg-white/60 rounded-lg p-4 mt-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-amber-800 mb-1">Important Notice</h4>
                <p className="text-sm text-amber-700">
                  This broker&apos;s trust score indicates potential concerns. We recommend considering
                  <a href="/brokers" className="text-blue-600 hover:text-blue-800 ml-1">alternative brokers</a>
                  with higher trust scores for better safety and service.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Category Breakdown */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Detailed Score Breakdown</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {categories.map((category, index) => (
            <div key={index} className={`border-2 rounded-xl p-6 ${category.bgColor}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={category.color}>
                    {category.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{category.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${category.color}`}>
                    {category.score}/{category.maxScore}
                  </div>
                  <div className="text-sm text-gray-600">
                    {Math.round((category.score / category.maxScore) * 100)}%
                  </div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      category.score >= category.maxScore * 0.8
                        ? 'bg-green-500'
                        : category.score >= category.maxScore * 0.6
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${(category.score / category.maxScore) * 100}%` }}
                  />
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2">
                {category.details.map((detail, detailIndex) => (
                  <div key={detailIndex} className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-blue-900 mb-2">Want to Compare Safer Brokers?</h4>
            <p className="text-blue-800 text-sm">
              Explore our curated list of top-rated brokers with excellent trust scores and proven track records.
            </p>
          </div>
          <div className="flex space-x-3">
            <a
              href="/methodology"
              className="text-blue-600 hover:text-blue-800 font-medium text-sm border border-blue-200 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Learn About Our Methodology
            </a>
            <a
              href="/brokers"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
            >
              Compare Brokers
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
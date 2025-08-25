'use client'

import { Broker } from '@/lib/supabase'
import { Star, Shield, Globe, Calendar, TrendingUp, Users, Award, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface BrokerProfileHeaderProps {
  broker: Broker
}

export default function BrokerProfileHeader({ broker }: BrokerProfileHeaderProps) {
  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100 border-green-200'
    if (score >= 60) return 'text-yellow-600 bg-yellow-100 border-yellow-200'
    return 'text-red-600 bg-red-100 border-red-200'
  }

  const getTrustScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 70) return 'Good'
    if (score >= 60) return 'Average'
    if (score >= 40) return 'Below Average'
    return 'Poor'
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
            <li className="text-gray-400">/</li>
            <li><Link href="/brokers" className="hover:text-blue-600">Brokers</Link></li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium">{broker.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Broker Info */}
          <div className="lg:col-span-2">
            <div className="flex items-start space-x-6 mb-6">
              {/* Logo */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-white rounded-xl shadow-sm border flex items-center justify-center overflow-hidden">
                  {broker.logo_url ? (
                    <Image
                      src={broker.logo_url}
                      alt={`${broker.name} logo`}
                      width={96}
                      height={96}
                      className="object-contain"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-gray-400">
                      {broker.name.charAt(0)}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Broker Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-3">
                  <h1 className="text-4xl font-bold text-gray-900">
                    {broker.name} Review {new Date().getFullYear()}
                  </h1>
                  {broker.founded_year && (
                    <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                      Est. {broker.founded_year}
                    </span>
                  )}
                </div>
                
                {broker.description && (
                  <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                    {broker.description}
                  </p>
                )}
                
                {/* Key Metrics Row */}
                <div className="flex flex-wrap items-center gap-6">
                  {/* Trust Score */}
                  <div className="flex items-center space-x-3">
                    <Shield className="w-6 h-6 text-blue-600" />
                    <div>
                      <div className="text-sm text-gray-600">Trust Score</div>
                      <div className={`text-xl font-bold px-3 py-1 rounded-lg border ${getTrustScoreColor(broker.trust_score)}`}>
                        {broker.trust_score}/100
                      </div>
                    </div>
                  </div>
                  
                  {/* Overall Rating */}
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(broker.overall_rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">User Rating</div>
                      <div className="font-bold text-lg">{broker.overall_rating}/5</div>
                    </div>
                  </div>
                  
                  {/* Review Count */}
                  {broker.review_count && (
                    <div className="flex items-center space-x-2">
                      <Users className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-600">Reviews</div>
                        <div className="font-semibold">{broker.review_count.toLocaleString()}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm border text-center hover:shadow-md transition-shadow">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  ${broker.minimum_deposit}
                </div>
                <div className="text-sm text-gray-600">Min Deposit</div>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-sm border text-center hover:shadow-md transition-shadow">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {broker.maximum_leverage}
                </div>
                <div className="text-sm text-gray-600">Max Leverage</div>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-sm border text-center hover:shadow-md transition-shadow">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {broker.spread_type || 'Variable'}
                </div>
                <div className="text-sm text-gray-600">Spread Type</div>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-sm border text-center hover:shadow-md transition-shadow">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {broker.platforms_count || '3+'}
                </div>
                <div className="text-sm text-gray-600">Platforms</div>
              </div>
            </div>
          </div>
          
          {/* Sticky Sidebar */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            {/* Trust Score Card */}
            <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
              <div className="text-center mb-4">
                <div className={`inline-flex items-center px-4 py-2 rounded-xl text-lg font-bold ${getTrustScoreColor(broker.trust_score)}`}>
                  <Shield className="w-5 h-5 mr-2" />
                  {broker.trust_score}/100 {getTrustScoreLabel(broker.trust_score)}
                </div>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Regulation</span>
                  <span className="font-semibold text-green-600">✓ Multi-regulated</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Client Funds</span>
                  <span className="font-semibold text-green-600">✓ Segregated</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Compensation</span>
                  <span className="font-semibold text-green-600">✓ Protected</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 mb-6">
              <a
                href={broker.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors text-center block flex items-center justify-center space-x-2"
              >
                <span>Visit {broker.name}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <button className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
                Compare Brokers
              </button>
              <button className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                Save for Later
              </button>
            </div>

            {/* Quick Links */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Quick Navigation</h3>
              <div className="space-y-2 text-sm">
                <a href="#trust-score" className="block text-blue-600 hover:text-blue-800">Trust Score Analysis</a>
                <a href="#trading-conditions" className="block text-blue-600 hover:text-blue-800">Trading Conditions</a>
                <a href="#regulation" className="block text-blue-600 hover:text-blue-800">Regulation & Safety</a>
                <a href="#reviews" className="block text-blue-600 hover:text-blue-800">User Reviews</a>
                <a href="#faq" className="block text-blue-600 hover:text-blue-800">FAQ</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
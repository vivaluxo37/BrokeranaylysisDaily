'use client'

import { Broker } from '@/lib/supabase'
import { Star, Shield, Globe, Calendar } from 'lucide-react'
import Image from 'next/image'

interface BrokerProfileHeaderProps {
  broker: Broker
}

export default function BrokerProfileHeader({ broker }: BrokerProfileHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          {/* Broker Info */}
          <div className="flex items-start space-x-6">
            {/* Logo */}
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                {broker.logo_url ? (
                  <Image
                    src={broker.logo_url}
                    alt={`${broker.name} logo`}
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                ) : (
                  <span className="text-2xl font-bold text-gray-400">
                    {broker.name.charAt(0)}
                  </span>
                )}
              </div>
            </div>
            
            {/* Broker Details */}
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {broker.name}
              </h1>
              
              {broker.description && (
                <p className="text-lg text-gray-600 mb-4 max-w-2xl">
                  {broker.description}
                </p>
              )}
              
              {/* Key Metrics */}
              <div className="flex flex-wrap items-center gap-6 text-sm">
                {/* Trust Score */}
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-600">Trust Score:</span>
                  <span className="font-semibold text-blue-600">
                    {broker.trust_score}/100
                  </span>
                </div>
                
                {/* Overall Rating */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(broker.overall_rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold">{broker.overall_rating}/5</span>
                  {broker.review_count && (
                    <span className="text-gray-500">({broker.review_count} reviews)</span>
                  )}
                </div>
                
                {/* Founded Year */}
                {broker.founded_year && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">Founded:</span>
                    <span className="font-semibold">{broker.founded_year}</span>
                  </div>
                )}
                
                {/* Website */}
                {broker.website_url && (
                  <div className="flex items-center space-x-2">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <a
                      href={broker.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="mt-6 lg:mt-0 flex flex-col sm:flex-row gap-3">
            <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
              Compare Brokers
            </button>
            <button className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors">
              Save for Later
            </button>
          </div>
        </div>
        
        {/* Quick Stats Bar */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">
              ${broker.minimum_deposit}
            </div>
            <div className="text-sm text-gray-600">Min Deposit</div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">
              {broker.maximum_leverage}
            </div>
            <div className="text-sm text-gray-600">Max Leverage</div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">
              {broker.spread_type || 'Variable'}
            </div>
            <div className="text-sm text-gray-600">Spread Type</div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">
              {broker.platforms_count || '3+'}
            </div>
            <div className="text-sm text-gray-600">Platforms</div>
          </div>
        </div>
      </div>
    </div>
  )
}
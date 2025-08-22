'use client'

import { Star, Shield, TrendingUp } from 'lucide-react'
import { Broker } from '@/lib/types'

interface BrokerComparisonHeaderProps {
  brokers: Broker[]
}

export default function BrokerComparisonHeader({ brokers }: BrokerComparisonHeaderProps) {
  const brokerNames = brokers.map(broker => broker.name).join(' vs ')
  
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {brokerNames} Comparison
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Compare {brokers.length} leading brokers side by side. Trust scores, trading conditions, 
            fees, and features to help you make the best choice for your trading needs.
          </p>
          
          {/* Broker Logos and Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {brokers.map((broker, index) => (
              <div key={broker.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-800">
                      {broker.name.charAt(0)}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold mb-2">{broker.name}</h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span>Trust Score: {broker.trust_score}/100</span>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-2">
                    <Star className="h-4 w-4 fill-current" />
                    <span>{broker.overall_rating}/5 Rating</span>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-2">
                    <TrendingUp className="h-4 w-4" />
                    <span>Min Deposit: ${broker.minimum_deposit}</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <a
                    href={broker.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full bg-white text-blue-600 py-2 px-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-center"
                  >
                    Visit {broker.name}
                  </a>
                </div>
              </div>
            ))}
          </div>
          
          {/* Quick Stats */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">
                {Math.max(...brokers.map(b => b.trust_score))}
              </div>
              <div className="text-blue-100">Highest Trust Score</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">
                ${Math.min(...brokers.map(b => b.minimum_deposit))}
              </div>
              <div className="text-blue-100">Lowest Min Deposit</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">
                {Math.max(...brokers.map(b => parseFloat(b.overall_rating.toString()))).toFixed(1)}
              </div>
              <div className="text-blue-100">Highest Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
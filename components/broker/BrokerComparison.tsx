'use client'

import { Broker } from '@/lib/supabase'
import { BarChart3, Plus, X, Star, Shield, TrendingUp } from 'lucide-react'
import { useState } from 'react'

interface BrokerComparisonProps {
  broker: Broker
}

interface ComparisonBroker {
  id: string
  name: string
  logo: string
  trustScore: number
  overallRating: number
  minimumDeposit: number
  maximumLeverage: string
  spreadType: string
  regulators: string[]
  tradingPlatforms: string[]
  instruments: number
  founded: number
}

export default function BrokerComparison({ broker }: BrokerComparisonProps) {
  const [comparisonBrokers, setComparisonBrokers] = useState<ComparisonBroker[]>([])
  const [showAddBroker, setShowAddBroker] = useState(false)

  // Mock data for suggested brokers to compare
  const suggestedBrokers: ComparisonBroker[] = [
    {
      id: '2',
      name: 'IC Markets',
      logo: '/logos/ic-markets.png',
      trustScore: 92,
      overallRating: 4.6,
      minimumDeposit: 200,
      maximumLeverage: '1:500',
      spreadType: 'Variable',
      regulators: ['ASIC', 'CySEC'],
      tradingPlatforms: ['MetaTrader 4', 'MetaTrader 5', 'cTrader'],
      instruments: 232,
      founded: 2007
    },
    {
      id: '3',
      name: 'Pepperstone',
      logo: '/logos/pepperstone.png',
      trustScore: 89,
      overallRating: 4.4,
      minimumDeposit: 200,
      maximumLeverage: '1:400',
      spreadType: 'Variable',
      regulators: ['ASIC', 'FCA', 'CySEC'],
      tradingPlatforms: ['MetaTrader 4', 'MetaTrader 5', 'cTrader'],
      instruments: 180,
      founded: 2010
    },
    {
      id: '4',
      name: 'XM Group',
      logo: '/logos/xm.png',
      trustScore: 85,
      overallRating: 4.2,
      minimumDeposit: 5,
      maximumLeverage: '1:888',
      spreadType: 'Variable',
      regulators: ['CySEC', 'ASIC', 'IFSC'],
      tradingPlatforms: ['MetaTrader 4', 'MetaTrader 5'],
      instruments: 1000,
      founded: 2009
    }
  ]

  // Convert current broker to comparison format
  const currentBroker: ComparisonBroker = {
    id: broker.id,
    name: broker.name,
    logo: '/logos/default.png',
    trustScore: broker.trust_score || 0,
    overallRating: broker.overall_rating || 0,
    minimumDeposit: broker.minimum_deposit || 0,
    maximumLeverage: '1:500', // This would come from database
    spreadType: 'Variable',
    regulators: ['FCA', 'CySEC'], // This would come from database
    tradingPlatforms: ['MetaTrader 4', 'MetaTrader 5'],
    instruments: 200,
    founded: 2015
  }

  const allBrokers = [currentBroker, ...comparisonBrokers]

  const addBrokerToComparison = (brokerToAdd: ComparisonBroker) => {
    if (comparisonBrokers.length < 3 && !comparisonBrokers.find(b => b.id === brokerToAdd.id)) {
      setComparisonBrokers([...comparisonBrokers, brokerToAdd])
      setShowAddBroker(false)
    }
  }

  const removeBrokerFromComparison = (brokerId: string) => {
    setComparisonBrokers(comparisonBrokers.filter(b => b.id !== brokerId))
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  const getTrustScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100'
    if (score >= 80) return 'text-blue-600 bg-blue-100'
    if (score >= 70) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const comparisonRows = [
    {
      label: 'Trust Score',
      key: 'trustScore',
      render: (value: number) => (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getTrustScoreColor(value)}`}>
          {value}/100
        </span>
      )
    },
    {
      label: 'Overall Rating',
      key: 'overallRating',
      render: (value: number) => (
        <div className="flex items-center space-x-2">
          {renderStars(Math.round(value))}
          <span className="text-sm text-gray-600">{value.toFixed(1)}</span>
        </div>
      )
    },
    {
      label: 'Minimum Deposit',
      key: 'minimumDeposit',
      render: (value: number) => `$${value.toLocaleString()}`
    },
    {
      label: 'Maximum Leverage',
      key: 'maximumLeverage',
      render: (value: string) => value
    },
    {
      label: 'Spread Type',
      key: 'spreadType',
      render: (value: string) => value
    },
    {
      label: 'Regulators',
      key: 'regulators',
      render: (value: string[]) => (
        <div className="flex flex-wrap gap-1">
          {value.map((regulator, index) => (
            <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
              {regulator}
            </span>
          ))}
        </div>
      )
    },
    {
      label: 'Trading Platforms',
      key: 'tradingPlatforms',
      render: (value: string[]) => (
        <div className="space-y-1">
          {value.map((platform, index) => (
            <div key={index} className="text-sm text-gray-700">{platform}</div>
          ))}
        </div>
      )
    },
    {
      label: 'Instruments',
      key: 'instruments',
      render: (value: number) => `${value.toLocaleString()}+`
    },
    {
      label: 'Founded',
      key: 'founded',
      render: (value: number) => value.toString()
    }
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Broker Comparison</h2>
        </div>
        {comparisonBrokers.length < 3 && (
          <button
            onClick={() => setShowAddBroker(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Broker</span>
          </button>
        )}
      </div>

      {comparisonBrokers.length === 0 ? (
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Compare {broker.name} with Other Brokers
          </h3>
          <p className="text-gray-600 mb-6">
            Add up to 3 brokers to compare features, fees, and ratings side by side.
          </p>
          <button
            onClick={() => setShowAddBroker(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Comparing
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Feature</th>
                {allBrokers.map((compBroker) => (
                  <th key={compBroker.id} className="text-center py-3 px-4 min-w-[200px]">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-lg font-bold text-gray-600">
                          {compBroker.name.charAt(0)}
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        {compBroker.name}
                      </div>
                      {compBroker.id !== currentBroker.id && (
                        <button
                          onClick={() => removeBrokerFromComparison(compBroker.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, index) => (
                <tr key={row.key} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="py-4 px-4 font-medium text-gray-900">{row.label}</td>
                  {allBrokers.map((compBroker) => (
                    <td key={compBroker.id} className="py-4 px-4 text-center">
                      {row.render((compBroker as any)[row.key])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Broker Modal */}
      {showAddBroker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add Broker to Comparison</h3>
              <button
                onClick={() => setShowAddBroker(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {suggestedBrokers
                .filter(b => !comparisonBrokers.find(cb => cb.id === b.id))
                .map((suggestedBroker) => (
                <div
                  key={suggestedBroker.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 cursor-pointer transition-colors"
                  onClick={() => addBrokerToComparison(suggestedBroker)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-lg font-bold text-gray-600">
                          {suggestedBroker.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{suggestedBroker.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Shield className="w-4 h-4" />
                            <span>Trust Score: {suggestedBroker.trustScore}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span>{suggestedBroker.overallRating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Plus className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Comparison Summary */}
      {comparisonBrokers.length > 0 && (
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-4">Comparison Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-blue-900">Highest Trust Score</div>
              <div className="text-lg font-bold text-blue-800">
                {Math.max(...allBrokers.map(b => b.trustScore))}/100
              </div>
            </div>
            <div className="text-center">
              <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-sm font-medium text-blue-900">Best Rating</div>
              <div className="text-lg font-bold text-blue-800">
                {Math.max(...allBrokers.map(b => b.overallRating)).toFixed(1)}
              </div>
            </div>
            <div className="text-center">
              <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-blue-900">Lowest Min. Deposit</div>
              <div className="text-lg font-bold text-blue-800">
                ${Math.min(...allBrokers.map(b => b.minimumDeposit)).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
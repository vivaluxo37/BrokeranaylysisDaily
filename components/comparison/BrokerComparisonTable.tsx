'use client'

import { useState } from 'react'
import { Check, X, Star, Shield, ExternalLink } from 'lucide-react'
import { Broker } from '@/lib/types'

interface BrokerComparisonTableProps {
  brokers: Broker[]
}

interface ComparisonRow {
  category: string
  items: {
    label: string
    key?: keyof Broker
    getValue?: (broker: Broker) => string | number | boolean
    format?: (value: any) => string
    type?: 'text' | 'number' | 'boolean' | 'rating' | 'trust_score'
  }[]
}

export default function BrokerComparisonTable({ brokers }: BrokerComparisonTableProps) {
  const [activeCategory, setActiveCategory] = useState<string>('overview')

  const comparisonData: ComparisonRow[] = [
    {
      category: 'overview',
      items: [
        { label: 'Broker Name', key: 'name', type: 'text' },
        { label: 'Trust Score', key: 'trust_score', type: 'trust_score' },
        { label: 'Overall Rating', key: 'overall_rating', type: 'rating' },
        { label: 'Founded Year', key: 'founded_year', type: 'number' },
        { label: 'Headquarters', key: 'headquarters', type: 'text' },
        { label: 'Website', key: 'website_url', type: 'text' }
      ]
    },
    {
      category: 'trading',
      items: [
        { label: 'Minimum Deposit', key: 'minimum_deposit', format: (val) => `$${val}`, type: 'number' },
        { label: 'Maximum Leverage', key: 'maximum_leverage', type: 'text' },
        { label: 'Spread Type', key: 'spread_type', type: 'text' },
        { label: 'Commission Structure', key: 'commission_structure', type: 'text' },
        { label: 'Execution Speed', getValue: () => '< 50ms', type: 'text' },
        { label: 'Trading Platforms', getValue: () => 'MT4, MT5, WebTrader', type: 'text' }
      ]
    },
    {
      category: 'instruments',
      items: [
        { label: 'Forex Pairs', getValue: () => '60+', type: 'text' },
        { label: 'CFD Stocks', getValue: () => '2000+', type: 'text' },
        { label: 'Indices', getValue: () => '20+', type: 'text' },
        { label: 'Commodities', getValue: () => '15+', type: 'text' },
        { label: 'Cryptocurrencies', getValue: () => '30+', type: 'text' },
        { label: 'ETFs', getValue: () => '100+', type: 'text' }
      ]
    },
    {
      category: 'regulation',
      items: [
        { label: 'Primary Regulator', getValue: (broker) => 'FCA, ASIC, CySEC', type: 'text' },
        { label: 'Client Fund Protection', getValue: () => true, type: 'boolean' },
        { label: 'Investor Compensation', getValue: () => true, type: 'boolean' },
        { label: 'Negative Balance Protection', getValue: () => true, type: 'boolean' },
        { label: 'MiFID II Compliant', getValue: () => true, type: 'boolean' },
        { label: 'GDPR Compliant', getValue: () => true, type: 'boolean' }
      ]
    },
    {
      category: 'features',
      items: [
        { label: 'Mobile Trading App', getValue: () => true, type: 'boolean' },
        { label: 'Copy Trading', getValue: () => true, type: 'boolean' },
        { label: 'Social Trading', getValue: () => false, type: 'boolean' },
        { label: 'Automated Trading', getValue: () => true, type: 'boolean' },
        { label: 'Demo Account', getValue: () => true, type: 'boolean' },
        { label: 'Educational Resources', getValue: () => true, type: 'boolean' }
      ]
    }
  ]

  const categories = [
    { id: 'overview', name: 'Overview', icon: Shield },
    { id: 'trading', name: 'Trading', icon: Star },
    { id: 'instruments', name: 'Instruments', icon: Star },
    { id: 'regulation', name: 'Regulation', icon: Shield },
    { id: 'features', name: 'Features', icon: Star }
  ]

  const renderValue = (item: any, broker: Broker) => {
    let value: any
    
    if (item.getValue) {
      value = item.getValue(broker)
    } else if (item.key) {
      value = broker[item.key]
    } else {
      return '-'
    }

    // Handle null/undefined values
    if (value === null || value === undefined) {
      return <span className="text-gray-400">-</span>
    }

    if (item.format) {
      return item.format(value)
    }

    switch (item.type) {
      case 'boolean':
        return value ? (
          <Check className="h-5 w-5 text-green-600 mx-auto" />
        ) : (
          <X className="h-5 w-5 text-red-600 mx-auto" />
        )
      
      case 'rating':
        return (
          <div className="flex items-center justify-center space-x-1">
            <span className="font-semibold">{value}</span>
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
          </div>
        )
      
      case 'trust_score':
        const score = parseInt(value.toString())
        let colorClass = 'text-red-600'
        if (score >= 80) colorClass = 'text-green-600'
        else if (score >= 60) colorClass = 'text-yellow-600'
        
        return (
          <div className="flex items-center justify-center space-x-1">
            <span className={`font-semibold ${colorClass}`}>{score}</span>
            <span className="text-gray-500">/100</span>
          </div>
        )
      
      default:
        if (item.key === 'website_url') {
          return (
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 flex items-center justify-center space-x-1"
            >
              <span>Visit</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          )
        }
        return value || '-'
    }
  }

  const activeData = comparisonData.find(data => data.category === activeCategory)

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      {/* Category Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeCategory === category.id
                    ? 'border-blue-600 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{category.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-1/4">
                Feature
              </th>
              {brokers.map((broker) => (
                <th key={broker.id} className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-lg font-bold text-blue-600">
                        {broker.name.charAt(0)}
                      </span>
                    </div>
                    <span>{broker.name}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {activeData?.items.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {item.label}
                </td>
                {brokers.map((broker) => (
                  <td key={broker.id} className="px-6 py-4 text-sm text-gray-700 text-center">
                    {renderValue(item, broker)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
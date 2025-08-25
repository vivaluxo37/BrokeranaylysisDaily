'use client'

import { Broker } from '@/lib/supabase'
import { 
  DollarSign, 
  TrendingUp, 
  Clock, 
  Zap, 
  Euro, 
  Bitcoin, 
  BarChart3,
  Smartphone,
  Monitor,
  Globe,
  CheckCircle,
  XCircle,
  Star
} from 'lucide-react'

interface BrokerTradingConditionsProps {
  broker: Broker
}

interface TradingCondition {
  label: string
  value: string | number
  description: string
  icon: React.ReactNode
  highlight?: boolean
  comparison?: 'good' | 'average' | 'poor'
}

interface InstrumentCategory {
  name: string
  count: string
  description: string
  icon: React.ReactNode
  color: string
  bgColor: string
}

interface Platform {
  name: string
  available: boolean
  description: string
  features: string[]
  icon: React.ReactNode
  popular?: boolean
}

export default function BrokerTradingConditions({ broker }: BrokerTradingConditionsProps) {
  const getComparisonColor = (comparison?: 'good' | 'average' | 'poor') => {
    switch (comparison) {
      case 'good': return 'border-green-200 bg-green-50'
      case 'average': return 'border-yellow-200 bg-yellow-50'
      case 'poor': return 'border-red-200 bg-red-50'
      default: return 'border-gray-200 bg-gray-50'
    }
  }

  const getComparisonBadge = (comparison?: 'good' | 'average' | 'poor') => {
    switch (comparison) {
      case 'good': return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Competitive</span>
      case 'average': return <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Average</span>
      case 'poor': return <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">High</span>
      default: return null
    }
  }

  const tradingConditions: TradingCondition[] = [
    {
      label: 'Minimum Deposit',
      value: `$${broker.minimum_deposit}`,
      description: 'Lowest amount required to open an account',
      icon: <DollarSign className="w-6 h-6" />,
      highlight: broker.minimum_deposit <= 100,
      comparison: broker.minimum_deposit <= 50 ? 'good' : broker.minimum_deposit <= 200 ? 'average' : 'poor'
    },
    {
      label: 'Maximum Leverage',
      value: broker.maximum_leverage,
      description: 'Highest leverage ratio available',
      icon: <TrendingUp className="w-6 h-6" />,
      comparison: 'average'
    },
    {
      label: 'Spread Type',
      value: broker.spread_type || 'Variable',
      description: 'Type of spreads offered',
      icon: <Zap className="w-6 h-6" />,
      comparison: 'average'
    },
    {
      label: 'Execution Speed',
      value: broker.execution_speed || '< 1ms',
      description: 'Average order execution time',
      icon: <Clock className="w-6 h-6" />,
      comparison: 'good'
    }
  ]

  const instruments: InstrumentCategory[] = [
    { 
      name: 'Forex Pairs', 
      count: broker.forex_pairs || '50+', 
      description: 'Major, minor, and exotic currency pairs',
      icon: <Euro className="w-6 h-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 border-blue-200'
    },
    { 
      name: 'Indices', 
      count: broker.indices_count || '20+', 
      description: 'Global stock market indices',
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50 border-green-200'
    },
    { 
      name: 'Commodities', 
      count: broker.commodities_count || '15+', 
      description: 'Precious metals, energy, and agricultural products',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 border-yellow-200'
    },
    { 
      name: 'Cryptocurrencies', 
      count: broker.crypto_count || '10+', 
      description: 'Major digital currencies',
      icon: <Bitcoin className="w-6 h-6" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 border-orange-200'
    },
    { 
      name: 'Stocks', 
      count: broker.stocks_count || '100+', 
      description: 'Individual company shares',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 border-purple-200'
    },
    { 
      name: 'ETFs', 
      count: broker.etfs_count || '50+', 
      description: 'Exchange-traded funds',
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 border-indigo-200'
    }
  ]

  const platforms: Platform[] = [
    { 
      name: 'MetaTrader 4', 
      available: broker.mt4_available !== false, 
      description: 'Popular forex trading platform',
      features: ['Expert Advisors', 'Custom Indicators', 'One-click Trading', 'Mobile App'],
      icon: <Monitor className="w-5 h-5" />,
      popular: true
    },
    { 
      name: 'MetaTrader 5', 
      available: broker.mt5_available !== false, 
      description: 'Advanced multi-asset platform',
      features: ['Multi-asset Trading', 'Advanced Charting', 'Economic Calendar', 'Copy Trading'],
      icon: <Monitor className="w-5 h-5" />,
      popular: true
    },
    { 
      name: 'WebTrader', 
      available: broker.webtrader_available !== false, 
      description: 'Browser-based trading',
      features: ['No Download Required', 'Cross-platform', 'Real-time Data', 'Portfolio Management'],
      icon: <Globe className="w-5 h-5" />
    },
    { 
      name: 'Mobile App', 
      available: broker.mobile_app_available !== false, 
      description: 'iOS and Android applications',
      features: ['Touch ID/Face ID', 'Push Notifications', 'Offline Charts', 'Account Management'],
      icon: <Smartphone className="w-5 h-5" />,
      popular: true
    },
    { 
      name: 'cTrader', 
      available: broker.ctrader_available || false, 
      description: 'Professional trading platform',
      features: ['Level II Pricing', 'Advanced Orders', 'cBots', 'Copy Trading'],
      icon: <Monitor className="w-5 h-5" />
    },
    { 
      name: 'Proprietary Platform', 
      available: broker.proprietary_platform || false, 
      description: 'Custom trading solution',
      features: ['Unique Features', 'Optimized Performance', 'Custom Tools', 'Integrated Analysis'],
      icon: <Star className="w-5 h-5" />
    }
  ]

  return (
    <section id="trading-conditions" className="bg-white rounded-2xl shadow-sm border p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Trading Conditions</h2>
        <p className="text-gray-600">Comprehensive overview of costs, leverage, and trading terms</p>
      </div>
      
      {/* Key Trading Conditions */}
      <div className="mb-12">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Key Trading Terms</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tradingConditions.map((condition, index) => (
            <div key={index} className={`border-2 rounded-xl p-6 transition-all hover:shadow-md ${getComparisonColor(condition.comparison)}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="text-blue-600">
                  {condition.icon}
                </div>
                {getComparisonBadge(condition.comparison)}
              </div>
              <h4 className="font-bold text-gray-900 mb-2">{condition.label}</h4>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {condition.value}
              </div>
              <p className="text-sm text-gray-600">{condition.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Trading Instruments */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Available Instruments</h3>
            <p className="text-gray-600 mt-1">Diverse range of tradeable assets</p>
          </div>
          <div className="text-sm text-gray-500">
            1000+ instruments available
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {instruments.map((instrument, index) => (
            <div key={index} className={`border-2 rounded-xl p-6 ${instrument.bgColor} hover:shadow-md transition-all`}>
              <div className="flex items-center justify-between mb-4">
                <div className={instrument.color}>
                  {instrument.icon}
                </div>
                <span className="text-2xl font-bold text-gray-900">{instrument.count}</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">{instrument.name}</h4>
              <p className="text-sm text-gray-600">{instrument.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Trading Platforms */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Trading Platforms</h3>
            <p className="text-gray-600 mt-1">Professional trading software and mobile apps</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {platforms.map((platform, index) => (
            <div key={index} className={`border-2 rounded-xl p-6 transition-all hover:shadow-md ${
              platform.available ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`${platform.available ? 'text-green-600' : 'text-gray-400'}`}>
                    {platform.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{platform.name}</h4>
                    {platform.popular && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Popular</span>
                    )}
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full ${
                  platform.available ? 'bg-green-500' : 'bg-gray-400'
                }`} />
              </div>
              <p className="text-sm text-gray-600 mb-4">{platform.description}</p>
              
              <div className="space-y-2">
                {platform.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center space-x-2">
                    {platform.available ? (
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    )}
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              
              {platform.available && (
                <div className="mt-4 pt-4 border-t border-green-200">
                  <span className="inline-block text-xs font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full">
                    Available
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Account Types Comparison */}
      <div>
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900">Account Types</h3>
          <p className="text-gray-600 mt-1">Choose the account that matches your trading style</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border-2 border-gray-200 rounded-xl p-6 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-gray-900">Standard Account</h4>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Most Popular</span>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Min Deposit:</span>
                <span className="font-semibold">${broker.minimum_deposit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Spread:</span>
                <span className="font-semibold">From 1.5 pips</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Commission:</span>
                <span className="font-semibold">No</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Leverage:</span>
                <span className="font-semibold">{broker.maximum_leverage}</span>
              </div>
            </div>
            <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              Open Account
            </button>
          </div>
          
          <div className="border-2 border-green-200 bg-green-50 rounded-xl p-6 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-gray-900">ECN Account</h4>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Pro Traders</span>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Min Deposit:</span>
                <span className="font-semibold">${Math.max(broker.minimum_deposit * 5, 1000)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Spread:</span>
                <span className="font-semibold">From 0.1 pips</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Commission:</span>
                <span className="font-semibold">$7/lot</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Leverage:</span>
                <span className="font-semibold">{broker.maximum_leverage}</span>
              </div>
            </div>
            <button className="w-full mt-4 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
              Open Account
            </button>
          </div>
          
          <div className="border-2 border-purple-200 bg-purple-50 rounded-xl p-6 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-gray-900">VIP Account</h4>
              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">Premium</span>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Min Deposit:</span>
                <span className="font-semibold">${Math.max(broker.minimum_deposit * 20, 10000)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Spread:</span>
                <span className="font-semibold">From 0.0 pips</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Commission:</span>
                <span className="font-semibold">$5/lot</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Leverage:</span>
                <span className="font-semibold">{broker.maximum_leverage}</span>
              </div>
            </div>
            <button className="w-full mt-4 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
              Open Account
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
'use client'

import { Broker } from '@/lib/supabase'
import { DollarSign, TrendingUp, Clock, Zap } from 'lucide-react'

interface BrokerTradingConditionsProps {
  broker: Broker
}

interface TradingCondition {
  label: string
  value: string | number
  description: string
  icon: React.ReactNode
}

export default function BrokerTradingConditions({ broker }: BrokerTradingConditionsProps) {
  const tradingConditions: TradingCondition[] = [
    {
      label: 'Minimum Deposit',
      value: `$${broker.minimum_deposit}`,
      description: 'Lowest amount required to open an account',
      icon: <DollarSign className="w-5 h-5 text-green-600" />
    },
    {
      label: 'Maximum Leverage',
      value: broker.maximum_leverage,
      description: 'Highest leverage ratio available',
      icon: <TrendingUp className="w-5 h-5 text-blue-600" />
    },
    {
      label: 'Spread Type',
      value: broker.spread_type || 'Variable',
      description: 'Type of spreads offered',
      icon: <Zap className="w-5 h-5 text-purple-600" />
    },
    {
      label: 'Execution Speed',
      value: broker.execution_speed || '< 1ms',
      description: 'Average order execution time',
      icon: <Clock className="w-5 h-5 text-orange-600" />
    }
  ]

  const instruments = [
    { name: 'Forex Pairs', count: broker.forex_pairs || '50+', description: 'Major, minor, and exotic currency pairs' },
    { name: 'Indices', count: broker.indices_count || '20+', description: 'Global stock market indices' },
    { name: 'Commodities', count: broker.commodities_count || '15+', description: 'Precious metals, energy, and agricultural products' },
    { name: 'Cryptocurrencies', count: broker.crypto_count || '10+', description: 'Major digital currencies' },
    { name: 'Stocks', count: broker.stocks_count || '100+', description: 'Individual company shares' },
    { name: 'ETFs', count: broker.etfs_count || '50+', description: 'Exchange-traded funds' }
  ]

  const platforms = [
    { name: 'MetaTrader 4', available: broker.mt4_available !== false, description: 'Popular forex trading platform' },
    { name: 'MetaTrader 5', available: broker.mt5_available !== false, description: 'Advanced multi-asset platform' },
    { name: 'WebTrader', available: broker.webtrader_available !== false, description: 'Browser-based trading' },
    { name: 'Mobile App', available: broker.mobile_app_available !== false, description: 'iOS and Android applications' },
    { name: 'cTrader', available: broker.ctrader_available || false, description: 'Professional trading platform' },
    { name: 'Proprietary Platform', available: broker.proprietary_platform || false, description: 'Custom trading solution' }
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Trading Conditions</h2>
      
      {/* Key Trading Conditions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {tradingConditions.map((condition, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              {condition.icon}
              <h3 className="font-semibold text-gray-900">{condition.label}</h3>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {condition.value}
            </div>
            <p className="text-sm text-gray-600">{condition.description}</p>
          </div>
        ))}
      </div>

      {/* Trading Instruments */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Available Instruments</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {instruments.map((instrument, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-gray-900">{instrument.name}</h4>
                <span className="text-lg font-bold text-blue-600">{instrument.count}</span>
              </div>
              <p className="text-sm text-gray-600">{instrument.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Trading Platforms */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Trading Platforms</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {platforms.map((platform, index) => (
            <div key={index} className={`border rounded-lg p-4 ${
              platform.available ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{platform.name}</h4>
                <div className={`w-3 h-3 rounded-full ${
                  platform.available ? 'bg-green-500' : 'bg-gray-400'
                }`} />
              </div>
              <p className="text-sm text-gray-600">{platform.description}</p>
              {platform.available && (
                <span className="inline-block mt-2 text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded">
                  Available
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Account Types */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Account Types</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Standard Account</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Min Deposit:</span>
                <span className="font-medium">${broker.minimum_deposit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Spread:</span>
                <span className="font-medium">From 1.5 pips</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Commission:</span>
                <span className="font-medium">No</span>
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">ECN Account</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Min Deposit:</span>
                <span className="font-medium">${Math.max(broker.minimum_deposit * 5, 1000)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Spread:</span>
                <span className="font-medium">From 0.1 pips</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Commission:</span>
                <span className="font-medium">$7/lot</span>
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">VIP Account</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Min Deposit:</span>
                <span className="font-medium">${Math.max(broker.minimum_deposit * 20, 10000)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Spread:</span>
                <span className="font-medium">From 0.0 pips</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Commission:</span>
                <span className="font-medium">$5/lot</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
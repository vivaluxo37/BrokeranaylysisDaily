'use client'

import React, { useState, useEffect } from 'react'
import { Calculator, TrendingUp, DollarSign, Percent } from 'lucide-react'

interface CalculationResult {
  pipValue: number
  spreadCost: number
  commission: number
  totalCost: number
  profitLoss: number
  netProfitLoss: number
}

const TradingCalculatorComponent: React.FC = () => {
  const [instrument, setInstrument] = useState('EURUSD')
  const [accountCurrency, setAccountCurrency] = useState('USD')
  const [lotSize, setLotSize] = useState(1)
  const [entryPrice, setEntryPrice] = useState(1.1000)
  const [exitPrice, setExitPrice] = useState(1.1050)
  const [spread, setSpread] = useState(1.5)
  const [commissionPerLot, setCommissionPerLot] = useState(0)
  const [position, setPosition] = useState<'buy' | 'sell'>('buy')
  const [result, setResult] = useState<CalculationResult | null>(null)

  const instruments = [
    { symbol: 'EURUSD', name: 'Euro / US Dollar', pipPosition: 4 },
    { symbol: 'GBPUSD', name: 'British Pound / US Dollar', pipPosition: 4 },
    { symbol: 'USDJPY', name: 'US Dollar / Japanese Yen', pipPosition: 2 },
    { symbol: 'USDCHF', name: 'US Dollar / Swiss Franc', pipPosition: 4 },
    { symbol: 'AUDUSD', name: 'Australian Dollar / US Dollar', pipPosition: 4 },
    { symbol: 'USDCAD', name: 'US Dollar / Canadian Dollar', pipPosition: 4 },
    { symbol: 'NZDUSD', name: 'New Zealand Dollar / US Dollar', pipPosition: 4 },
    { symbol: 'EURGBP', name: 'Euro / British Pound', pipPosition: 4 },
    { symbol: 'EURJPY', name: 'Euro / Japanese Yen', pipPosition: 2 },
    { symbol: 'GBPJPY', name: 'British Pound / Japanese Yen', pipPosition: 2 }
  ]

  const calculatePipValue = (symbol: string, lotSize: number, accountCurrency: string): number => {
    const selectedInstrument = instruments.find(i => i.symbol === symbol)
    if (!selectedInstrument) return 0

    const contractSize = 100000 // Standard lot size
    const actualLotSize = lotSize * contractSize

    if (selectedInstrument.pipPosition === 4) {
      // For 4-decimal pairs
      if (symbol.endsWith('USD') && accountCurrency === 'USD') {
        return (0.0001 * actualLotSize)
      } else {
        // Simplified calculation - in real implementation, would use current exchange rates
        return (0.0001 * actualLotSize)
      }
    } else {
      // For 2-decimal pairs (JPY pairs)
      if (accountCurrency === 'USD') {
        return (0.01 * actualLotSize) / entryPrice
      } else {
        return (0.01 * actualLotSize) / entryPrice
      }
    }
  }

  const calculateResults = () => {
    const selectedInstrument = instruments.find(i => i.symbol === instrument)
    if (!selectedInstrument) return

    const pipValue = calculatePipValue(instrument, lotSize, accountCurrency)
    
    // Calculate pip difference
    let pipDifference: number
    if (position === 'buy') {
      pipDifference = (exitPrice - entryPrice) * Math.pow(10, selectedInstrument.pipPosition)
    } else {
      pipDifference = (entryPrice - exitPrice) * Math.pow(10, selectedInstrument.pipPosition)
    }

    // Calculate costs
    const spreadCost = spread * pipValue
    const commission = commissionPerLot * lotSize
    const totalCost = spreadCost + commission

    // Calculate profit/loss
    const profitLoss = pipDifference * pipValue
    const netProfitLoss = profitLoss - totalCost

    setResult({
      pipValue,
      spreadCost,
      commission,
      totalCost,
      profitLoss,
      netProfitLoss
    })
  }

  useEffect(() => {
    calculateResults()
  }, [instrument, accountCurrency, lotSize, entryPrice, exitPrice, spread, commissionPerLot, position])

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: accountCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="flex items-center mb-8">
        <Calculator className="w-8 h-8 text-blue-600 mr-3" />
        <h2 className="text-3xl font-bold text-gray-900">Trading Calculator</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Trade Parameters</h3>
          
          {/* Instrument Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency Pair
            </label>
            <select
              value={instrument}
              onChange={(e) => setInstrument(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {instruments.map((inst) => (
                <option key={inst.symbol} value={inst.symbol}>
                  {inst.symbol} - {inst.name}
                </option>
              ))}
            </select>
          </div>

          {/* Account Currency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Currency
            </label>
            <select
              value={accountCurrency}
              onChange={(e) => setAccountCurrency(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="JPY">JPY</option>
              <option value="AUD">AUD</option>
              <option value="CAD">CAD</option>
            </select>
          </div>

          {/* Position Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Position Type
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="buy"
                  checked={position === 'buy'}
                  onChange={(e) => setPosition(e.target.value as 'buy' | 'sell')}
                  className="mr-2"
                />
                Buy (Long)
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="sell"
                  checked={position === 'sell'}
                  onChange={(e) => setPosition(e.target.value as 'buy' | 'sell')}
                  className="mr-2"
                />
                Sell (Short)
              </label>
            </div>
          </div>

          {/* Lot Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lot Size
            </label>
            <input
              type="number"
              value={lotSize}
              onChange={(e) => setLotSize(parseFloat(e.target.value) || 0)}
              step="0.01"
              min="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              1.0 = Standard lot (100,000 units), 0.1 = Mini lot (10,000 units)
            </p>
          </div>

          {/* Entry Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Entry Price
            </label>
            <input
              type="number"
              value={entryPrice}
              onChange={(e) => setEntryPrice(parseFloat(e.target.value) || 0)}
              step="0.0001"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Exit Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Exit Price
            </label>
            <input
              type="number"
              value={exitPrice}
              onChange={(e) => setExitPrice(parseFloat(e.target.value) || 0)}
              step="0.0001"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Spread */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Spread (pips)
            </label>
            <input
              type="number"
              value={spread}
              onChange={(e) => setSpread(parseFloat(e.target.value) || 0)}
              step="0.1"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Commission */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Commission per Lot ({accountCurrency})
            </label>
            <input
              type="number"
              value={commissionPerLot}
              onChange={(e) => setCommissionPerLot(parseFloat(e.target.value) || 0)}
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Calculation Results</h3>
          
          {result && (
            <div className="space-y-4">
              {/* Pip Value */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
                  <h4 className="font-semibold text-gray-900">Pip Value</h4>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(result.pipValue)}
                </p>
                <p className="text-sm text-gray-600">Per pip movement</p>
              </div>

              {/* Trading Costs */}
              <div className="bg-red-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Percent className="w-5 h-5 text-red-600 mr-2" />
                  <h4 className="font-semibold text-gray-900">Trading Costs</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Spread Cost:</span>
                    <span className="font-medium">{formatCurrency(result.spreadCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Commission:</span>
                    <span className="font-medium">{formatCurrency(result.commission)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-semibold">Total Cost:</span>
                    <span className="font-bold text-red-600">{formatCurrency(result.totalCost)}</span>
                  </div>
                </div>
              </div>

              {/* Profit/Loss */}
              <div className={`rounded-lg p-4 ${result.netProfitLoss >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="flex items-center mb-2">
                  <DollarSign className={`w-5 h-5 mr-2 ${result.netProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                  <h4 className="font-semibold text-gray-900">Profit/Loss</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Gross P/L:</span>
                    <span className={`font-medium ${result.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(result.profitLoss)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-semibold">Net P/L:</span>
                    <span className={`font-bold text-xl ${result.netProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(result.netProfitLoss)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Trade Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Trade Summary</h4>
                <div className="text-sm space-y-1">
                  <p><span className="font-medium">Position:</span> {position.toUpperCase()} {lotSize} lots of {instrument}</p>
                  <p><span className="font-medium">Entry:</span> {entryPrice.toFixed(instruments.find(i => i.symbol === instrument)?.pipPosition || 4)}</p>
                  <p><span className="font-medium">Exit:</span> {exitPrice.toFixed(instruments.find(i => i.symbol === instrument)?.pipPosition || 4)}</p>
                  <p><span className="font-medium">Pip Movement:</span> {((position === 'buy' ? exitPrice - entryPrice : entryPrice - exitPrice) * Math.pow(10, instruments.find(i => i.symbol === instrument)?.pipPosition || 4)).toFixed(1)} pips</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TradingCalculatorComponent

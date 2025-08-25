import { Metadata } from 'next'
import MegaMenuHeader from '@/components/MegaMenuHeader'
import Footer from '@/components/Footer'
import ChatBubble from '@/components/ChatBubble'
import TradingCalculatorComponent from '@/components/TradingCalculatorComponent'

export const metadata: Metadata = {
  title: 'Trading Cost Calculator - Calculate Spreads, Commissions & Profits | Brokeranalysis',
  description: 'Free trading cost calculator to calculate spreads, commissions, pip values, and potential profits. Compare trading costs across different brokers.',
  keywords: 'trading calculator, pip calculator, spread calculator, commission calculator, forex calculator, trading costs',
  openGraph: {
    title: 'Trading Cost Calculator - Calculate Spreads, Commissions & Profits',
    description: 'Free trading cost calculator to calculate spreads, commissions, pip values, and potential profits.',
    type: 'website',
    url: '/calculator',
    siteName: 'Brokeranalysis',
    images: [
      {
        url: '/images/tools/calculator-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Trading Cost Calculator'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trading Cost Calculator - Calculate Spreads, Commissions & Profits',
    description: 'Free trading cost calculator to calculate spreads, commissions, pip values, and potential profits.',
    images: ['/images/tools/calculator-og.jpg']
  }
}

export default function CalculatorPage() {
  return (
    <>
      <MegaMenuHeader />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Trading Cost Calculator
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Calculate your trading costs, pip values, and potential profits with our comprehensive 
                trading calculator. Compare costs across different brokers and optimize your trading strategy.
              </p>
              
              {/* Quick Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-200 mb-2">📊</div>
                  <div className="text-sm text-blue-100">Pip Calculator</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-200 mb-2">💰</div>
                  <div className="text-sm text-blue-100">Profit/Loss</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-200 mb-2">📈</div>
                  <div className="text-sm text-blue-100">Spread Costs</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-200 mb-2">🔄</div>
                  <div className="text-sm text-blue-100">Swap Rates</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-6">
            <TradingCalculatorComponent />
          </div>
        </section>

        {/* Educational Content */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Understanding Trading Costs
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Learn how to calculate and minimize your trading costs to maximize profitability.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Pip Value */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">📏</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Pip Value</h3>
                <p className="text-gray-600 mb-4">
                  A pip is the smallest price move in a currency pair. Understanding pip values 
                  helps you calculate potential profits and losses accurately.
                </p>
                <div className="text-sm text-gray-500">
                  <strong>Formula:</strong> (Pip in decimal places / Exchange Rate) × Lot Size
                </div>
              </div>

              {/* Spread Costs */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Spread Costs</h3>
                <p className="text-gray-600 mb-4">
                  The spread is the difference between bid and ask prices. It's the primary 
                  cost of trading and varies by broker and market conditions.
                </p>
                <div className="text-sm text-gray-500">
                  <strong>Cost:</strong> Spread × Pip Value × Lot Size
                </div>
              </div>

              {/* Commission */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">💳</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Commission</h3>
                <p className="text-gray-600 mb-4">
                  Some brokers charge commission per trade instead of wider spreads. 
                  ECN brokers typically use this model for transparent pricing.
                </p>
                <div className="text-sm text-gray-500">
                  <strong>Typical:</strong> $3-7 per standard lot (round turn)
                </div>
              </div>

              {/* Swap Rates */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🔄</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Swap Rates</h3>
                <p className="text-gray-600 mb-4">
                  Overnight financing costs for holding positions past 5 PM EST. 
                  Based on interest rate differentials between currencies.
                </p>
                <div className="text-sm text-gray-500">
                  <strong>Note:</strong> Can be positive or negative depending on position direction
                </div>
              </div>

              {/* Risk Management */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🛡️</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Risk Management</h3>
                <p className="text-gray-600 mb-4">
                  Calculate position sizes based on your risk tolerance. Never risk more 
                  than 1-2% of your account balance on a single trade.
                </p>
                <div className="text-sm text-gray-500">
                  <strong>Rule:</strong> Position Size = Risk Amount / Stop Loss in Pips
                </div>
              </div>

              {/* Profit Calculation */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Profit Calculation</h3>
                <p className="text-gray-600 mb-4">
                  Calculate potential profits by multiplying pip movement by pip value 
                  and lot size, then subtract all trading costs.
                </p>
                <div className="text-sm text-gray-500">
                  <strong>Formula:</strong> (Pips Gained × Pip Value × Lot Size) - Costs
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tips Section */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-4xl mx-auto px-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Trading Cost Optimization Tips</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Choose the Right Broker</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Compare spreads across multiple brokers</li>
                    <li>• Consider ECN brokers for high-volume trading</li>
                    <li>• Factor in commission costs vs. spread costs</li>
                    <li>• Check for hidden fees and charges</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Optimize Your Trading</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Trade during high liquidity hours</li>
                    <li>• Use appropriate position sizes</li>
                    <li>• Consider swap costs for overnight positions</li>
                    <li>• Monitor total cost per trade</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ChatBubble />
    </>
  )
}

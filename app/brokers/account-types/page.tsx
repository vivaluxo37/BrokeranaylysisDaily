import { Metadata } from 'next'
import { DollarSign, TrendingUp, Shield, Zap, Users, Award } from 'lucide-react'
import MegaMenuHeader from '@/components/MegaMenuHeader'
import Footer from '@/components/Footer'
import ChatBubble from '@/components/ChatBubble'
import Link from 'next/link'

// Enable static generation with revalidation
export const revalidate = 3600 // Revalidate every hour

export const metadata: Metadata = {
  title: 'Forex Account Types 2024 - ECN, STP, Market Maker & More | Brokeranalysis',
  description: 'Compare different forex account types including ECN, STP, Market Maker, Islamic accounts, and more. Find the best account type for your trading style.',
  keywords: 'forex account types, ECN accounts, STP accounts, market maker, Islamic accounts, scalping accounts, VIP accounts',
  openGraph: {
    title: 'Forex Account Types 2024 - ECN, STP, Market Maker & More',
    description: 'Compare different forex account types and find the best account type for your trading style.',
    type: 'website',
    url: '/brokers/account-types',
    siteName: 'Brokeranalysis'
  }
}

// Account type data
const accountTypes = [
  {
    name: 'ECN Accounts',
    code: 'ecn',
    icon: '⚡',
    description: 'Electronic Communication Network accounts with direct market access and institutional liquidity.',
    minDeposit: '$500 - $10,000',
    spreads: 'From 0.0 pips',
    commission: '$3-7 per lot',
    brokerCount: 45,
    features: ['Direct Market Access', 'Institutional Liquidity', 'No Dealing Desk', 'Level II Pricing', 'Fast Execution'],
    pros: ['Tightest spreads', 'No conflicts of interest', 'Transparent pricing', 'Best execution'],
    cons: ['Commission charges', 'Higher minimum deposit', 'More complex'],
    bestFor: 'Professional traders, scalpers, high-volume traders',
    popular: true,
    rating: 4.7
  },
  {
    name: 'STP Accounts',
    code: 'stp',
    icon: '🔄',
    description: 'Straight Through Processing accounts that route orders directly to liquidity providers.',
    minDeposit: '$100 - $1,000',
    spreads: 'From 0.8 pips',
    commission: 'Usually none',
    brokerCount: 68,
    features: ['No Dealing Desk', 'Direct Routing', 'Variable Spreads', 'Market Execution', 'No Requotes'],
    pros: ['No commission', 'Lower minimum deposit', 'No conflicts', 'Good execution'],
    cons: ['Wider spreads than ECN', 'Variable spreads', 'Less transparency'],
    bestFor: 'Intermediate traders, swing traders, position traders',
    popular: true,
    rating: 4.4
  },
  {
    name: 'Market Maker',
    code: 'market-maker',
    icon: '🏪',
    description: 'Traditional accounts where the broker acts as a counterparty to your trades.',
    minDeposit: '$10 - $250',
    spreads: 'Fixed from 1-3 pips',
    commission: 'Usually none',
    brokerCount: 72,
    features: ['Fixed Spreads', 'Instant Execution', 'Low Minimum Deposit', 'Dealing Desk', 'Guaranteed Fills'],
    pros: ['Low minimum deposit', 'Fixed spreads', 'Guaranteed execution', 'Simple structure'],
    cons: ['Potential conflicts', 'Wider spreads', 'Possible requotes', 'Less transparency'],
    bestFor: 'Beginners, small account traders, news traders',
    popular: true,
    rating: 4.1
  },
  {
    name: 'Islamic Accounts',
    code: 'islamic',
    icon: '☪️',
    description: 'Sharia-compliant accounts without swap/rollover interest charges for Muslim traders.',
    minDeposit: '$100 - $1,000',
    spreads: 'Standard spreads',
    commission: 'Varies by broker',
    brokerCount: 55,
    features: ['No Swap Charges', 'Sharia Compliant', 'Halal Trading', 'Islamic Finance Principles', 'Overnight Positions'],
    pros: ['No interest charges', 'Religious compliance', 'Hold positions overnight', 'Wide availability'],
    cons: ['May have other fees', 'Limited to certain instruments', 'Approval required'],
    bestFor: 'Muslim traders, long-term position holders',
    rating: 4.3
  },
  {
    name: 'Scalping Accounts',
    code: 'scalping',
    icon: '⚡',
    description: 'Specialized accounts optimized for high-frequency trading and scalping strategies.',
    minDeposit: '$500 - $5,000',
    spreads: 'From 0.0 pips',
    commission: '$2-5 per lot',
    brokerCount: 38,
    features: ['Ultra-Fast Execution', 'Low Latency', 'Scalping Allowed', 'Tight Spreads', 'Advanced Orders'],
    pros: ['Optimized for scalping', 'Fast execution', 'Tight spreads', 'No restrictions'],
    cons: ['Higher minimum deposit', 'Commission charges', 'Requires experience'],
    bestFor: 'Scalpers, day traders, algorithmic traders',
    rating: 4.5
  },
  {
    name: 'VIP Accounts',
    code: 'vip',
    icon: '👑',
    description: 'Premium accounts for high-net-worth individuals with exclusive benefits and services.',
    minDeposit: '$25,000 - $100,000+',
    spreads: 'Institutional spreads',
    commission: 'Negotiable',
    brokerCount: 32,
    features: ['Personal Account Manager', 'Institutional Spreads', 'Priority Support', 'Exclusive Research', 'Custom Solutions'],
    pros: ['Best conditions', 'Personal service', 'Exclusive benefits', 'Custom solutions'],
    cons: ['Very high minimum', 'Complex requirements', 'Limited availability'],
    bestFor: 'High-net-worth traders, institutional clients',
    rating: 4.6
  },
  {
    name: 'Micro Accounts',
    code: 'micro',
    icon: '🔍',
    description: 'Small-sized accounts perfect for beginners to learn trading with minimal risk.',
    minDeposit: '$1 - $50',
    spreads: 'Standard spreads',
    commission: 'Usually none',
    brokerCount: 58,
    features: ['Micro Lots (0.01)', 'Low Minimum Deposit', 'Risk Management', 'Educational Resources', 'Practice Trading'],
    pros: ['Very low minimum', 'Perfect for learning', 'Low risk', 'Easy to start'],
    cons: ['Limited profit potential', 'Higher spreads', 'Basic features'],
    bestFor: 'Complete beginners, practice trading, small budgets',
    rating: 4.2
  },
  {
    name: 'Copy Trading',
    code: 'copy-trading',
    icon: '📋',
    description: 'Accounts that allow you to automatically copy trades from successful traders.',
    minDeposit: '$200 - $1,000',
    spreads: 'Standard spreads',
    commission: 'Performance fees',
    brokerCount: 28,
    features: ['Auto Copy Trading', 'Strategy Selection', 'Risk Management', 'Performance Tracking', 'Social Trading'],
    pros: ['Learn from experts', 'Passive trading', 'Diversification', 'Performance tracking'],
    cons: ['Performance fees', 'Dependency on others', 'Limited control'],
    bestFor: 'Beginners, passive investors, social traders',
    rating: 4.0
  }
]

function AccountTypeCard({ accountType }: { accountType: any }) {
  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600'
    if (rating >= 4.0) return 'text-blue-600'
    if (rating >= 3.5) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="p-6">
        {/* Account Type Header */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="text-4xl">{accountType.icon}</div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1">{accountType.name}</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <span className={`font-semibold ${getRatingColor(accountType.rating)}`}>
                  ★ {accountType.rating}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4 text-blue-500" />
                <span>{accountType.brokerCount} brokers</span>
              </div>
            </div>
          </div>
          {accountType.popular && (
            <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
              Popular
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {accountType.description}
        </p>

        {/* Account Details */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <span className="text-gray-500">Min Deposit:</span>
            <div className="font-medium text-gray-900">{accountType.minDeposit}</div>
          </div>
          <div>
            <span className="text-gray-500">Spreads:</span>
            <div className="font-medium text-gray-900">{accountType.spreads}</div>
          </div>
          <div>
            <span className="text-gray-500">Commission:</span>
            <div className="font-medium text-gray-900">{accountType.commission}</div>
          </div>
          <div>
            <span className="text-gray-500">Best For:</span>
            <div className="font-medium text-gray-900 text-xs">{accountType.bestFor.split(',')[0]}</div>
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-4">
          <h4 className="font-semibold text-gray-900 mb-2 text-sm">Key Features</h4>
          <div className="space-y-1">
            {accountType.features.slice(0, 3).map((feature: string, index: number) => (
              <div key={index} className="flex items-center space-x-2 text-xs">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pros & Cons */}
        <div className="grid grid-cols-2 gap-4 mb-6 text-xs">
          <div>
            <h5 className="font-medium text-green-700 mb-1">Pros</h5>
            <ul className="space-y-1">
              {accountType.pros.slice(0, 2).map((pro: string, index: number) => (
                <li key={index} className="text-gray-600">• {pro}</li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-red-700 mb-1">Cons</h5>
            <ul className="space-y-1">
              {accountType.cons.slice(0, 2).map((con: string, index: number) => (
                <li key={index} className="text-gray-600">• {con}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Button */}
        <Link
          href={`/brokers/account-type/${accountType.code}`}
          className="w-full bg-blue-600 text-white text-center py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors block"
        >
          View {accountType.name}
        </Link>
      </div>
    </div>
  )
}

function AccountTypeComparison() {
  const topAccountTypes = accountTypes.filter(a => a.popular).slice(0, 3)

  return (
    <div className="bg-white rounded-lg shadow-md p-8 mt-12">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Account Type Comparison</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Account Type</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-900">Min Deposit</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-900">Spreads</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-900">Commission</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-900">Best For</th>
            </tr>
          </thead>
          <tbody>
            {topAccountTypes.map((accountType, index) => (
              <tr key={index} className="border-b border-gray-100">
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{accountType.icon}</span>
                    <span className="font-medium">{accountType.name}</span>
                  </div>
                </td>
                <td className="text-center py-3 px-4 text-gray-600">{accountType.minDeposit}</td>
                <td className="text-center py-3 px-4 text-gray-600">{accountType.spreads}</td>
                <td className="text-center py-3 px-4 text-gray-600">{accountType.commission}</td>
                <td className="text-center py-3 px-4 text-gray-600 text-xs">
                  {accountType.bestFor.split(',')[0]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function BrokerAccountTypesPage() {
  const popularAccountTypes = accountTypes.filter(a => a.popular)
  const otherAccountTypes = accountTypes.filter(a => !a.popular)
  const totalBrokers = accountTypes.reduce((sum, accountType) => sum + accountType.brokerCount, 0)

  return (
    <>
      <MegaMenuHeader />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Forex Account Types 2024
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Compare different forex account types including ECN, STP, Market Maker, Islamic accounts, 
                and more. Find the perfect account type that matches your trading style and experience level.
              </p>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-200 mb-2">{accountTypes.length}</div>
                  <div className="text-sm text-blue-100">Account Types</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-200 mb-2">{totalBrokers}+</div>
                  <div className="text-sm text-blue-100">Broker Options</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-200 mb-2">$1+</div>
                  <div className="text-sm text-blue-100">Min Deposit</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-200 mb-2">0.0</div>
                  <div className="text-sm text-blue-100">Min Spreads</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-6">
            {/* Popular Account Types */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Most Popular Account Types</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularAccountTypes.map((accountType) => (
                  <AccountTypeCard key={accountType.code} accountType={accountType} />
                ))}
              </div>
            </div>

            {/* Other Account Types */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Specialized Account Types</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherAccountTypes.map((accountType) => (
                  <AccountTypeCard key={accountType.code} accountType={accountType} />
                ))}
              </div>
            </div>

            {/* Account Type Comparison */}
            <AccountTypeComparison />

            {/* Choosing Guide */}
            <div className="bg-white rounded-lg shadow-md p-8 mt-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">How to Choose the Right Account Type</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Consider Your Budget</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Micro accounts for small budgets, VIP accounts for large capital
                  </p>
                  <p className="text-xs text-gray-500">
                    Choose an account type that matches your available trading capital and risk tolerance.
                  </p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Match Your Trading Style</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    ECN for scalping, STP for swing trading, Market Maker for beginners
                  </p>
                  <p className="text-xs text-gray-500">
                    Different account types are optimized for different trading strategies and frequencies.
                  </p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Understand the Costs</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Compare spreads, commissions, and other fees
                  </p>
                  <p className="text-xs text-gray-500">
                    Factor in all costs including spreads, commissions, swaps, and any additional fees.
                  </p>
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

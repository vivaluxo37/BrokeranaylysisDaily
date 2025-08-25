import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DollarSign, TrendingUp, Shield, Zap, Users, Award } from 'lucide-react'
import MegaMenuHeader from '@/components/MegaMenuHeader'
import Footer from '@/components/Footer'
import ChatBubble from '@/components/ChatBubble'
import { BrokerService } from '@/lib/services/brokerService'
import Link from 'next/link'
import Image from 'next/image'

// Enable static generation with revalidation
export const revalidate = 3600 // Revalidate every hour

interface AccountTypePageProps {
  params: Promise<{
    type: string
  }>
}

// Account type definitions
const accountTypes = {
  'ecn': {
    name: 'ECN Accounts',
    fullName: 'Electronic Communication Network Accounts',
    icon: '⚡',
    description: 'Direct market access with institutional liquidity and transparent pricing.',
    minDeposit: '$500 - $10,000',
    spreads: 'From 0.0 pips',
    commission: '$3-7 per lot',
    features: ['Direct Market Access', 'Institutional Liquidity', 'No Dealing Desk', 'Level II Pricing', 'Fast Execution'],
    pros: ['Tightest spreads', 'No conflicts of interest', 'Transparent pricing', 'Best execution'],
    cons: ['Commission charges', 'Higher minimum deposit', 'More complex'],
    bestFor: 'Professional traders, scalpers, high-volume traders'
  },
  'stp': {
    name: 'STP Accounts',
    fullName: 'Straight Through Processing Accounts',
    icon: '🔄',
    description: 'Orders routed directly to liquidity providers without dealing desk intervention.',
    minDeposit: '$100 - $1,000',
    spreads: 'From 0.8 pips',
    commission: 'Usually none',
    features: ['No Dealing Desk', 'Direct Routing', 'Variable Spreads', 'Market Execution', 'No Requotes'],
    pros: ['No commission', 'Lower minimum deposit', 'No conflicts', 'Good execution'],
    cons: ['Wider spreads than ECN', 'Variable spreads', 'Less transparency'],
    bestFor: 'Intermediate traders, swing traders, position traders'
  },
  'islamic': {
    name: 'Islamic Accounts',
    fullName: 'Sharia-Compliant Trading Accounts',
    icon: '☪️',
    description: 'Swap-free accounts compliant with Islamic finance principles.',
    minDeposit: '$100 - $1,000',
    spreads: 'Standard spreads',
    commission: 'Varies by broker',
    features: ['No Swap Charges', 'Sharia Compliant', 'Halal Trading', 'Islamic Finance Principles', 'Overnight Positions'],
    pros: ['No interest charges', 'Religious compliance', 'Hold positions overnight', 'Wide availability'],
    cons: ['May have other fees', 'Limited to certain instruments', 'Approval required'],
    bestFor: 'Muslim traders, long-term position holders'
  },
  'micro': {
    name: 'Micro Accounts',
    fullName: 'Micro Lot Trading Accounts',
    icon: '🔍',
    description: 'Small-sized accounts perfect for beginners with minimal risk exposure.',
    minDeposit: '$1 - $50',
    spreads: 'Standard spreads',
    commission: 'Usually none',
    features: ['Micro Lots (0.01)', 'Low Minimum Deposit', 'Risk Management', 'Educational Resources', 'Practice Trading'],
    pros: ['Very low minimum', 'Perfect for learning', 'Low risk', 'Easy to start'],
    cons: ['Limited profit potential', 'Higher spreads', 'Basic features'],
    bestFor: 'Complete beginners, practice trading, small budgets'
  },
  'vip': {
    name: 'VIP Accounts',
    fullName: 'VIP Premium Trading Accounts',
    icon: '👑',
    description: 'Premium accounts for high-net-worth individuals with exclusive benefits.',
    minDeposit: '$25,000 - $100,000+',
    spreads: 'Institutional spreads',
    commission: 'Negotiable',
    features: ['Personal Account Manager', 'Institutional Spreads', 'Priority Support', 'Exclusive Research', 'Custom Solutions'],
    pros: ['Best conditions', 'Personal service', 'Exclusive benefits', 'Custom solutions'],
    cons: ['Very high minimum', 'Complex requirements', 'Limited availability'],
    bestFor: 'High-net-worth traders, institutional clients'
  },
  'demo': {
    name: 'Demo Accounts',
    fullName: 'Practice Trading Accounts',
    icon: '🎯',
    description: 'Risk-free practice accounts with virtual money for learning and testing.',
    minDeposit: 'Free',
    spreads: 'Real market spreads',
    commission: 'Same as live accounts',
    features: ['Virtual Money', 'Real Market Conditions', 'No Risk', 'Platform Testing', 'Strategy Development'],
    pros: ['No financial risk', 'Learn without pressure', 'Test strategies', 'Platform familiarization'],
    cons: ['No real profits', 'Psychological differences', 'Limited time', 'May differ from live'],
    bestFor: 'Beginners, strategy testing, platform evaluation'
  }
}

// Get brokers offering specific account type
async function getAccountTypeBrokers(type: string) {
  try {
    const allBrokers = await BrokerService.getBrokers(50, 0)
    
    const accountTypeConfig = accountTypes[type as keyof typeof accountTypes]
    if (!accountTypeConfig) {
      return []
    }

    // Filter brokers based on account type availability
    const filteredBrokers = allBrokers.filter(broker => {
      // Basic filtering - in production, this would check actual account type availability
      if (type === 'ecn') {
        // ECN brokers typically have good ratings and regulation
        const rating = parseFloat(broker.overall_rating || '0')
        const hasRegulation = broker.regulation_info &&
          (typeof broker.regulation_info === 'object' ?
            broker.regulation_info.regulation :
            broker.regulation_info)
        return rating >= 6.0 && hasRegulation
      } else if (type === 'islamic') {
        // Most regulated brokers offer Islamic accounts
        const hasRegulation = broker.regulation_info &&
          (typeof broker.regulation_info === 'object' ?
            broker.regulation_info.regulation :
            broker.regulation_info)
        return hasRegulation
      } else if (type === 'micro') {
        // Micro accounts typically have low minimum deposits
        const minDeposit = parseFloat(broker.minimum_deposit || '999')
        return minDeposit <= 100 || !broker.minimum_deposit // Include brokers with no specified minimum
      } else if (type === 'vip') {
        // VIP accounts for high-value clients
        const rating = parseFloat(broker.overall_rating || '0')
        const minDeposit = parseFloat(broker.minimum_deposit || '0')
        return rating >= 7.0 && (minDeposit >= 1000 || !broker.minimum_deposit)
      } else if (type === 'demo') {
        return true // Most brokers offer demo accounts
      } else if (type === 'stp') {
        // STP brokers typically have good ratings
        const rating = parseFloat(broker.overall_rating || '0')
        return rating >= 5.0
      }
      return true
    })

    // Sort by rating (since trust_score is mostly null)
    return filteredBrokers.sort((a, b) => {
      const aRating = parseFloat(a.overall_rating || '0')
      const bRating = parseFloat(b.overall_rating || '0')
      return bRating - aRating
    }).slice(0, 12) // Top 12 brokers
  } catch (error) {
    console.error('Error fetching account type brokers:', error)
    return []
  }
}

// Generate metadata
export async function generateMetadata({ params }: AccountTypePageProps): Promise<Metadata> {
  const resolvedParams = await params
  const { type } = resolvedParams
  
  const accountTypeConfig = accountTypes[type as keyof typeof accountTypes]
  
  if (!accountTypeConfig) {
    return {
      title: 'Page Not Found - Brokeranalysis',
      description: 'The requested page could not be found.'
    }
  }

  const title = `Best ${accountTypeConfig.fullName} Brokers 2024 | Brokeranalysis`
  const description = `Find the best forex brokers offering ${accountTypeConfig.name.toLowerCase()}. Compare regulated brokers with ${accountTypeConfig.description.toLowerCase()}`

  return {
    title,
    description,
    keywords: `${accountTypeConfig.name}, ${type} accounts, ${accountTypeConfig.fullName}, forex ${type} brokers`,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `/brokers/account-type/${type}`,
      siteName: 'Brokeranalysis'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description
    }
  }
}

// Generate static params for all account types
export async function generateStaticParams() {
  return Object.keys(accountTypes).map(type => ({
    type
  }))
}

function BrokerCard({ broker }: { broker: any }) {
  const formatRating = (rating: number | null) => {
    if (!rating) return 'N/A'
    return rating.toFixed(1)
  }

  const formatTrustScore = (score: number | null) => {
    if (!score) return 'N/A'
    return `${score}/100`
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
            {broker.logo_url ? (
              <Image
                src={broker.logo_url}
                alt={`${broker.name} logo`}
                width={48}
                height={48}
                className="object-contain"
              />
            ) : (
              <span className="text-lg font-bold text-gray-600">
                {broker.name.charAt(0)}
              </span>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1">{broker.name}</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Award className="w-4 h-4 text-yellow-400" />
                <span>{formatRating(broker.overall_rating)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Shield className="w-4 h-4 text-green-500" />
                <span>{formatTrustScore(broker.trust_score)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <span className="text-gray-500">Min Spread:</span>
            <div className="font-medium">{broker.min_spread || '0.0'} pips</div>
          </div>
          <div>
            <span className="text-gray-500">Min Deposit:</span>
            <div className="font-medium">${broker.minimum_deposit || 'No minimum'}</div>
          </div>
          <div>
            <span className="text-gray-500">Regulation:</span>
            <div className="font-medium">{broker.regulation || 'Multiple'}</div>
          </div>
          <div>
            <span className="text-gray-500">Platforms:</span>
            <div className="font-medium">{broker.platforms || 'Multiple'}</div>
          </div>
        </div>

        <div className="flex space-x-3">
          <Link
            href={`/brokers/${broker.slug}`}
            className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            View Details
          </Link>
          <Link
            href={`/compare?brokers=${broker.slug}`}
            className="flex-1 bg-gray-100 text-gray-900 text-center py-2 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Compare
          </Link>
        </div>
      </div>
    </div>
  )
}

export default async function AccountTypeBrokersPage({ params }: AccountTypePageProps) {
  const resolvedParams = await params
  const { type } = resolvedParams
  
  const accountTypeConfig = accountTypes[type as keyof typeof accountTypes]
  
  if (!accountTypeConfig) {
    notFound()
  }

  const brokers = await getAccountTypeBrokers(type)

  return (
    <>
      <MegaMenuHeader />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-900 to-blue-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-4 mb-6">
                <span className="text-4xl">{accountTypeConfig.icon}</span>
                <h1 className="text-4xl lg:text-5xl font-bold">
                  Best {accountTypeConfig.fullName} Brokers
                </h1>
              </div>
              <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
                {accountTypeConfig.description} Find regulated brokers offering {accountTypeConfig.name.toLowerCase()} 
                with competitive trading conditions.
              </p>
              
              {/* Account Type Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-200 mb-2">{brokers.length}</div>
                  <div className="text-sm text-green-100">Top Brokers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-200 mb-2">{accountTypeConfig.minDeposit}</div>
                  <div className="text-sm text-green-100">Min Deposit</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-200 mb-2">{accountTypeConfig.spreads}</div>
                  <div className="text-sm text-green-100">Spreads</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-200 mb-2">{accountTypeConfig.commission}</div>
                  <div className="text-sm text-green-100">Commission</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Brokers Section */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Top {accountTypeConfig.fullName} Brokers ({brokers.length})
              </h2>
              <p className="text-gray-600">
                These brokers offer {accountTypeConfig.name.toLowerCase()} with competitive trading conditions 
                and reliable service.
              </p>
            </div>

            {brokers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {brokers.map((broker) => (
                  <BrokerCard key={broker.id} broker={broker} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-4">
                  No brokers found offering {accountTypeConfig.name.toLowerCase()}.
                </div>
                <Link
                  href="/brokers"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  View all brokers
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Account Type Information */}
        <section className="py-12 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              About {accountTypeConfig.fullName}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
                <ul className="space-y-2">
                  {accountTypeConfig.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pros & Cons</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-green-700 mb-2">Advantages</h4>
                    <ul className="space-y-1">
                      {accountTypeConfig.pros.map((pro, index) => (
                        <li key={index} className="text-sm text-gray-600">• {pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-red-700 mb-2">Disadvantages</h4>
                    <ul className="space-y-1">
                      {accountTypeConfig.cons.map((con, index) => (
                        <li key={index} className="text-sm text-gray-600">• {con}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Best For</h3>
              <p className="text-gray-600">{accountTypeConfig.bestFor}</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ChatBubble />
    </>
  )
}

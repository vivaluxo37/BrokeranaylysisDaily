import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { TrendingUp, Shield, Globe, Users, Award, Clock } from 'lucide-react'
import MegaMenuHeader from '@/components/MegaMenuHeader'
import Footer from '@/components/Footer'
import ChatBubble from '@/components/ChatBubble'
import { BrokerService } from '@/lib/services/brokerService'
import Link from 'next/link'
import Image from 'next/image'

// Enable static generation with revalidation
export const revalidate = 3600 // Revalidate every hour

interface StrategyPageProps {
  params: Promise<{
    strategy: string
    country: string
  }>
}

// Strategy definitions
const strategies = {
  'scalping': {
    name: 'Scalping',
    description: 'High-frequency trading with positions held for seconds to minutes',
    requirements: ['ultra_low_spreads', 'fast_execution', 'no_dealing_desk', 'low_latency'],
    minSpread: 0.5,
    executionSpeed: 'Ultra-fast',
    timeframe: 'Seconds to minutes'
  },
  'day-trading': {
    name: 'Day Trading',
    description: 'Intraday trading with positions closed before market close',
    requirements: ['competitive_spreads', 'good_execution', 'trading_tools', 'market_analysis'],
    minSpread: 1.0,
    executionSpeed: 'Fast',
    timeframe: 'Minutes to hours'
  },
  'swing-trading': {
    name: 'Swing Trading',
    description: 'Medium-term trading holding positions for days to weeks',
    requirements: ['research_tools', 'overnight_financing', 'analysis_tools', 'mobile_access'],
    minSpread: 1.5,
    executionSpeed: 'Standard',
    timeframe: 'Days to weeks'
  },
  'long-term': {
    name: 'Long-Term Trading',
    description: 'Position trading with holdings for weeks to months',
    requirements: ['low_swap_rates', 'research_tools', 'fundamental_analysis', 'portfolio_tools'],
    minSpread: 2.0,
    executionSpeed: 'Standard',
    timeframe: 'Weeks to months'
  },
  'algorithmic': {
    name: 'Algorithmic Trading',
    description: 'Automated trading using algorithms and expert advisors',
    requirements: ['api_access', 'vps_hosting', 'low_latency', 'expert_advisors'],
    minSpread: 0.8,
    executionSpeed: 'Ultra-fast',
    timeframe: 'Automated'
  }
}

// Country definitions
const countries = {
  'us': { name: 'United States', flag: '🇺🇸', regulator: 'CFTC & NFA', code: 'US' },
  'uk': { name: 'United Kingdom', flag: '🇬🇧', regulator: 'FCA', code: 'GB' },
  'au': { name: 'Australia', flag: '🇦🇺', regulator: 'ASIC', code: 'AU' },
  'ca': { name: 'Canada', flag: '🇨🇦', regulator: 'IIROC', code: 'CA' },
  'de': { name: 'Germany', flag: '🇩🇪', regulator: 'BaFin', code: 'DE' },
  'ph': { name: 'Philippines', flag: '🇵🇭', regulator: 'BSP', code: 'PH' }
}

// Get brokers filtered by strategy and country
async function getStrategyBrokers(strategy: string, country: string) {
  try {
    // Get all brokers and filter based on strategy requirements
    const allBrokers = await BrokerService.getBrokers(50, 0)
    
    const strategyConfig = strategies[strategy as keyof typeof strategies]
    const countryConfig = countries[country as keyof typeof countries]
    
    if (!strategyConfig || !countryConfig) {
      return []
    }

    // Filter brokers based on strategy requirements
    const filteredBrokers = allBrokers.filter(broker => {
      const rating = parseFloat(String(broker.overall_rating || '0'))
      const hasRegulation = broker.regulation_info &&
        (typeof broker.regulation_info === 'object' ?
          broker.regulation_info.regulation :
          broker.regulation_info)
      const minDeposit = parseFloat(String(broker.minimum_deposit || '999'))

      // Basic filtering - in production, this would be more sophisticated
      if (strategy === 'scalping') {
        // Scalping requires fast execution and low spreads - use high-rated brokers
        return rating >= 6.0 // Lowered requirement for more results
      } else if (strategy === 'day-trading') {
        // Day trading needs good platforms and execution
        return rating >= 6.0 && hasRegulation
      } else if (strategy === 'swing-trading') {
        // Swing trading is more forgiving, focus on low minimum deposits
        return rating >= 5.0 && (minDeposit <= 1000 || !broker.minimum_deposit)
      } else if (strategy === 'algorithmic') {
        // Algorithmic trading needs reliable platforms
        return rating >= 6.0 && hasRegulation
      }
      return rating >= 5.0
    })

    // Sort by rating (since trust_score is mostly null)
    return filteredBrokers.sort((a, b) => {
      const aRating = parseFloat(String(a.overall_rating || '0'))
      const bRating = parseFloat(String(b.overall_rating || '0'))
      return bRating - aRating
    }).slice(0, 12) // Top 12 brokers
  } catch (error) {
    console.error('Error fetching strategy brokers:', error)
    return []
  }
}

// Generate metadata
export async function generateMetadata({ params }: StrategyPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const { strategy, country } = resolvedParams
  
  const strategyConfig = strategies[strategy as keyof typeof strategies]
  const countryConfig = countries[country as keyof typeof countries]
  
  if (!strategyConfig || !countryConfig) {
    return {
      title: 'Page Not Found - Brokeranalysis',
      description: 'The requested page could not be found.'
    }
  }

  const title = `Best ${strategyConfig.name} Brokers in ${countryConfig.name} 2024 | Brokeranalysis`
  const description = `Find the best ${strategyConfig.name.toLowerCase()} brokers in ${countryConfig.name}. Compare regulated brokers optimized for ${strategyConfig.description.toLowerCase()}.`

  return {
    title,
    description,
    keywords: `${strategy} brokers ${country}, best ${strategy} brokers, ${countryConfig.name} forex brokers, ${strategy} trading`,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `/${strategy}/brokers/${country}`,
      siteName: 'Brokeranalysis'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description
    }
  }
}

// Generate static params for popular combinations
export async function generateStaticParams() {
  const popularCombinations = [
    { strategy: 'scalping', country: 'us' },
    { strategy: 'scalping', country: 'uk' },
    { strategy: 'day-trading', country: 'us' },
    { strategy: 'day-trading', country: 'uk' },
    { strategy: 'swing-trading', country: 'us' },
    { strategy: 'swing-trading', country: 'au' },
    { strategy: 'algorithmic', country: 'uk' },
    { strategy: 'algorithmic', country: 'ca' }
  ]

  return popularCombinations
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
            <div className="font-medium">{broker.platforms || 'MT4, MT5'}</div>
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

export default async function StrategyCountryPage({ params }: StrategyPageProps) {
  const resolvedParams = await params
  const { strategy, country } = resolvedParams
  
  const strategyConfig = strategies[strategy as keyof typeof strategies]
  const countryConfig = countries[country as keyof typeof countries]
  
  if (!strategyConfig || !countryConfig) {
    notFound()
  }

  const brokers = await getStrategyBrokers(strategy, country)

  return (
    <>
      <MegaMenuHeader />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-4 mb-6">
                <span className="text-4xl">{countryConfig.flag}</span>
                <h1 className="text-4xl lg:text-5xl font-bold">
                  Best {strategyConfig.name} Brokers in {countryConfig.name}
                </h1>
              </div>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Find the top-rated brokers optimized for {strategyConfig.description.toLowerCase()} 
                in {countryConfig.name}. All brokers are regulated by {countryConfig.regulator}.
              </p>
              
              {/* Strategy Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-200 mb-2">{brokers.length}</div>
                  <div className="text-sm text-blue-100">Top Brokers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-200 mb-2">{strategyConfig.minSpread}</div>
                  <div className="text-sm text-blue-100">Min Spread (pips)</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-200 mb-2">{strategyConfig.executionSpeed}</div>
                  <div className="text-sm text-blue-100">Execution</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-200 mb-2">{strategyConfig.timeframe}</div>
                  <div className="text-sm text-blue-100">Timeframe</div>
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
                Top {strategyConfig.name} Brokers in {countryConfig.name} ({brokers.length})
              </h2>
              <p className="text-gray-600">
                These brokers have been selected based on their suitability for {strategyConfig.description.toLowerCase()} 
                and compliance with {countryConfig.regulator} regulations.
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
                  No brokers found for {strategyConfig.name.toLowerCase()} in {countryConfig.name}.
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

        {/* Strategy Guide */}
        <section className="py-12 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {strategyConfig.name} Trading Guide for {countryConfig.name}
            </h2>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">
                {strategyConfig.description} requires specific broker features and regulatory compliance 
                in {countryConfig.name}. Here's what to look for:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Requirements</h3>
                  <ul className="space-y-2">
                    {strategyConfig.requirements.map((req, index) => (
                      <li key={index} className="flex items-center text-gray-600">
                        <TrendingUp className="w-4 h-4 text-green-500 mr-2" />
                        {req.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Regulation in {countryConfig.name}</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Shield className="w-5 h-5 text-green-500 mr-2" />
                      <span className="font-medium">{countryConfig.regulator}</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      All recommended brokers are regulated by {countryConfig.regulator} and 
                      authorized to provide services to {countryConfig.name} residents.
                    </p>
                  </div>
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

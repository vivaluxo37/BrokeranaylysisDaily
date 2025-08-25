import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Monitor, Smartphone, Globe, TrendingUp, Award, Zap } from 'lucide-react'
import MegaMenuHeader from '@/components/MegaMenuHeader'
import Footer from '@/components/Footer'
import ChatBubble from '@/components/ChatBubble'
import { BrokerService } from '@/lib/services/brokerService'
import Link from 'next/link'
import Image from 'next/image'

// Enable static generation with revalidation
export const revalidate = 3600 // Revalidate every hour

interface PlatformPageProps {
  params: Promise<{
    platform: string
  }>
}

// Platform definitions
const platforms = {
  'mt4': {
    name: 'MetaTrader 4',
    fullName: 'MetaTrader 4 (MT4)',
    icon: '📊',
    developer: 'MetaQuotes',
    description: 'The world\'s most popular forex trading platform with advanced charting and automated trading capabilities.',
    features: ['Expert Advisors (EAs)', 'Custom Indicators', 'Advanced Charting', 'One-Click Trading', 'Market Depth'],
    pros: ['Most widely supported', 'Huge community', 'Extensive customization', 'Proven stability'],
    cons: ['Older technology', 'Limited timeframes', 'No hedging on US accounts'],
    bestFor: 'Beginners and EA traders',
    category: 'Desktop/Mobile'
  },
  'mt5': {
    name: 'MetaTrader 5',
    fullName: 'MetaTrader 5 (MT5)',
    icon: '📈',
    developer: 'MetaQuotes',
    description: 'Next-generation trading platform with multi-asset support and enhanced analytical tools.',
    features: ['Multi-Asset Trading', 'More Timeframes', 'Economic Calendar', 'Depth of Market', 'MQL5 Programming'],
    pros: ['Modern architecture', 'Multi-asset support', 'Better backtesting', 'More indicators'],
    cons: ['Less broker support', 'Steeper learning curve', 'Different from MT4'],
    bestFor: 'Advanced traders and multi-asset trading',
    category: 'Desktop/Mobile'
  },
  'ctrader': {
    name: 'cTrader',
    fullName: 'cTrader Platform',
    icon: '⚡',
    developer: 'Spotware',
    description: 'Professional ECN trading platform with advanced order management and institutional features.',
    features: ['Level II Pricing', 'Advanced Orders', 'cBots (Robots)', 'Copy Trading', 'Risk Management'],
    pros: ['ECN-focused', 'Modern interface', 'Advanced orders', 'Transparent pricing'],
    cons: ['Fewer brokers', 'Smaller community', 'Learning curve'],
    bestFor: 'ECN traders and scalpers',
    category: 'Desktop/Mobile'
  },
  'tradingview': {
    name: 'TradingView',
    fullName: 'TradingView Platform',
    icon: '📉',
    developer: 'TradingView',
    description: 'Web-based charting platform with social trading features and advanced technical analysis.',
    features: ['Advanced Charting', 'Social Trading', 'Pine Script', 'Multi-Broker Support', 'Real-time Data'],
    pros: ['Best charting', 'Social features', 'Web-based', 'Multi-asset'],
    cons: ['Subscription required', 'Limited order types', 'Newer to forex'],
    bestFor: 'Chart analysis and social trading',
    category: 'Web-based'
  },
  'webtrader': {
    name: 'WebTrader',
    fullName: 'Web Trading Platforms',
    icon: '🌐',
    developer: 'Various',
    description: 'Browser-based trading platforms that require no download or installation.',
    features: ['No Download Required', 'Cross-Platform', 'Real-time Trading', 'Basic Charting'],
    pros: ['Instant access', 'No installation', 'Cross-platform', 'Always updated'],
    cons: ['Limited features', 'Internet dependent', 'Basic functionality'],
    bestFor: 'Casual traders and beginners',
    category: 'Web-based'
  },
  'mobile': {
    name: 'Mobile Apps',
    fullName: 'Mobile Trading Applications',
    icon: '📱',
    developer: 'Various',
    description: 'Native mobile applications for iOS and Android devices with trading capabilities.',
    features: ['Touch Interface', 'Push Notifications', 'Mobile Charts', 'Quick Orders', 'Account Management'],
    pros: ['Trade anywhere', 'Optimized for mobile', 'Push notifications', 'Quick access'],
    cons: ['Limited screen space', 'Reduced functionality', 'Battery usage'],
    bestFor: 'On-the-go trading',
    category: 'Mobile'
  },
  'proprietary': {
    name: 'Proprietary',
    fullName: 'Proprietary Trading Platforms',
    icon: '🔧',
    developer: 'Various Brokers',
    description: 'Custom-built platforms developed by individual brokers for their specific trading environment.',
    features: ['Broker-Specific Features', 'Integrated Tools', 'Custom Interface', 'Optimized Performance'],
    pros: ['Tailored experience', 'Integrated services', 'Optimized for broker', 'Unique features'],
    cons: ['Limited portability', 'Smaller community', 'Varying quality'],
    bestFor: 'Broker-specific features',
    category: 'Various'
  }
}

// Get brokers that support specific platform
async function getPlatformBrokers(platform: string) {
  try {
    const allBrokers = await BrokerService.getBrokers(50, 0)
    
    const platformConfig = platforms[platform as keyof typeof platforms]
    if (!platformConfig) {
      return []
    }

    // Filter brokers based on platform support
    // Since trading_platforms data is not populated, we'll use basic filtering based on broker quality
    const filteredBrokers = allBrokers.filter(broker => {
      const rating = parseFloat(broker.overall_rating || '0')
      const hasRegulation = broker.regulation_info &&
        (typeof broker.regulation_info === 'object' ?
          broker.regulation_info.regulation :
          broker.regulation_info)

      if (platform === 'mt4' || platform === 'mt5') {
        // Most established brokers support MT4/MT5
        return rating >= 5.0 // Remove regulation requirement for more results
      } else if (platform === 'ctrader') {
        // cTrader is typically offered by higher-end brokers
        return rating >= 6.0 && hasRegulation
      } else if (platform === 'tradingview') {
        // TradingView integration is common among modern brokers
        return rating >= 6.0
      } else if (platform === 'webtrader') {
        // Most brokers offer web trading
        return rating >= 4.0
      } else if (platform === 'mobile') {
        return true // Most brokers have mobile apps
      } else if (platform === 'proprietary') {
        // Proprietary platforms are typically from larger brokers
        return rating >= 7.0 && hasRegulation
      }
      return rating >= 5.0
    })

    // Sort by rating (since trust_score is mostly null)
    return filteredBrokers.sort((a, b) => {
      const aRating = parseFloat(a.overall_rating || '0')
      const bRating = parseFloat(b.overall_rating || '0')
      return bRating - aRating
    }).slice(0, 12) // Top 12 brokers
  } catch (error) {
    console.error('Error fetching platform brokers:', error)
    return []
  }
}

// Generate metadata
export async function generateMetadata({ params }: PlatformPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const { platform } = resolvedParams
  
  const platformConfig = platforms[platform as keyof typeof platforms]
  
  if (!platformConfig) {
    return {
      title: 'Page Not Found - Brokeranalysis',
      description: 'The requested page could not be found.'
    }
  }

  const title = `Best ${platformConfig.fullName} Brokers 2024 | Brokeranalysis`
  const description = `Find the best forex brokers offering ${platformConfig.fullName}. Compare regulated brokers with ${platformConfig.name} platform support and competitive trading conditions.`

  return {
    title,
    description,
    keywords: `${platformConfig.name} brokers, ${platform} forex brokers, ${platformConfig.fullName} trading, best ${platform} brokers`,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `/brokers/platform/${platform}`,
      siteName: 'Brokeranalysis'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description
    }
  }
}

// Generate static params for all platforms
export async function generateStaticParams() {
  return Object.keys(platforms).map(platform => ({
    platform
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
                <Monitor className="w-4 h-4 text-green-500" />
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

export default async function PlatformBrokersPage({ params }: PlatformPageProps) {
  const resolvedParams = await params
  const { platform } = resolvedParams
  
  const platformConfig = platforms[platform as keyof typeof platforms]
  
  if (!platformConfig) {
    notFound()
  }

  const brokers = await getPlatformBrokers(platform)

  return (
    <>
      <MegaMenuHeader />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-900 to-blue-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-4 mb-6">
                <span className="text-4xl">{platformConfig.icon}</span>
                <h1 className="text-4xl lg:text-5xl font-bold">
                  Best {platformConfig.fullName} Brokers
                </h1>
              </div>
              <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
                {platformConfig.description} Find regulated brokers offering {platformConfig.name} 
                with competitive trading conditions.
              </p>
              
              {/* Platform Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-200 mb-2">{brokers.length}</div>
                  <div className="text-sm text-purple-100">Top Brokers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-200 mb-2">{platformConfig.developer}</div>
                  <div className="text-sm text-purple-100">Developer</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-200 mb-2">{platformConfig.category}</div>
                  <div className="text-sm text-purple-100">Platform Type</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-200 mb-2">{platformConfig.bestFor}</div>
                  <div className="text-sm text-purple-100">Best For</div>
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
                Top {platformConfig.fullName} Brokers ({brokers.length})
              </h2>
              <p className="text-gray-600">
                These brokers offer {platformConfig.name} platform with competitive trading conditions 
                and reliable execution.
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
                  No brokers found offering {platformConfig.name}.
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

        {/* Platform Information */}
        <section className="py-12 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              About {platformConfig.fullName}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
                <ul className="space-y-2">
                  {platformConfig.features.map((feature, index) => (
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
                      {platformConfig.pros.map((pro, index) => (
                        <li key={index} className="text-sm text-gray-600">• {pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-red-700 mb-2">Disadvantages</h4>
                    <ul className="space-y-1">
                      {platformConfig.cons.map((con, index) => (
                        <li key={index} className="text-sm text-gray-600">• {con}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Best For</h3>
              <p className="text-gray-600">{platformConfig.bestFor}</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ChatBubble />
    </>
  )
}

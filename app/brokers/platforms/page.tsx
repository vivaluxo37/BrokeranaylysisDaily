import { Metadata } from 'next'
import { Monitor, Smartphone, Globe, TrendingUp, BarChart3, Zap } from 'lucide-react'
import MegaMenuHeader from '@/components/MegaMenuHeader'
import Footer from '@/components/Footer'
import ChatBubble from '@/components/ChatBubble'
import Link from 'next/link'

// Enable static generation with revalidation
export const revalidate = 3600 // Revalidate every hour

export const metadata: Metadata = {
  title: 'Forex Trading Platforms 2024 - MT4, MT5, cTrader & More | Brokeranalysis',
  description: 'Compare the best forex trading platforms including MetaTrader 4, MetaTrader 5, cTrader, TradingView, and proprietary platforms from top brokers.',
  keywords: 'forex trading platforms, MetaTrader 4, MetaTrader 5, cTrader, TradingView, trading software, forex platforms',
  openGraph: {
    title: 'Forex Trading Platforms 2024 - MT4, MT5, cTrader & More',
    description: 'Compare the best forex trading platforms including MetaTrader 4, MetaTrader 5, cTrader, and more.',
    type: 'website',
    url: '/brokers/platforms',
    siteName: 'Brokeranalysis'
  }
}

// Platform data
const platforms = [
  {
    name: 'MetaTrader 4',
    code: 'mt4',
    icon: '📊',
    developer: 'MetaQuotes',
    brokerCount: 85,
    description: 'The world\'s most popular forex trading platform with advanced charting and automated trading capabilities.',
    features: ['Expert Advisors (EAs)', 'Custom Indicators', 'Advanced Charting', 'One-Click Trading', 'Market Depth'],
    pros: ['Most widely supported', 'Huge community', 'Extensive customization', 'Proven stability'],
    cons: ['Older technology', 'Limited timeframes', 'No hedging on US accounts'],
    rating: 4.5,
    popular: true,
    category: 'Desktop/Mobile'
  },
  {
    name: 'MetaTrader 5',
    code: 'mt5',
    icon: '📈',
    developer: 'MetaQuotes',
    brokerCount: 78,
    description: 'Next-generation trading platform with multi-asset support and enhanced analytical tools.',
    features: ['Multi-Asset Trading', 'More Timeframes', 'Economic Calendar', 'Depth of Market', 'MQL5 Programming'],
    pros: ['Modern architecture', 'Multi-asset support', 'Better backtesting', 'More indicators'],
    cons: ['Less broker support', 'Steeper learning curve', 'Different from MT4'],
    rating: 4.4,
    popular: true,
    category: 'Desktop/Mobile'
  },
  {
    name: 'cTrader',
    code: 'ctrader',
    icon: '⚡',
    developer: 'Spotware',
    brokerCount: 45,
    description: 'Professional ECN trading platform with advanced order management and institutional features.',
    features: ['Level II Pricing', 'Advanced Orders', 'cBots (Robots)', 'Copy Trading', 'Risk Management'],
    pros: ['ECN-focused', 'Modern interface', 'Advanced orders', 'Transparent pricing'],
    cons: ['Fewer brokers', 'Smaller community', 'Learning curve'],
    rating: 4.6,
    popular: true,
    category: 'Desktop/Mobile'
  },
  {
    name: 'TradingView',
    code: 'tradingview',
    icon: '📉',
    developer: 'TradingView',
    brokerCount: 35,
    description: 'Web-based charting platform with social trading features and advanced technical analysis.',
    features: ['Advanced Charting', 'Social Trading', 'Pine Script', 'Multi-Broker Support', 'Real-time Data'],
    pros: ['Best charting', 'Social features', 'Web-based', 'Multi-asset'],
    cons: ['Subscription required', 'Limited order types', 'Newer to forex'],
    rating: 4.3,
    popular: true,
    category: 'Web-based'
  },
  {
    name: 'Proprietary Platforms',
    code: 'proprietary',
    icon: '🔧',
    developer: 'Various Brokers',
    brokerCount: 52,
    description: 'Custom-built platforms developed by individual brokers for their specific trading environment.',
    features: ['Broker-Specific Features', 'Integrated Tools', 'Custom Interface', 'Optimized Performance'],
    pros: ['Tailored experience', 'Integrated services', 'Optimized for broker', 'Unique features'],
    cons: ['Limited portability', 'Smaller community', 'Varying quality'],
    rating: 4.1,
    category: 'Various'
  },
  {
    name: 'WebTrader',
    code: 'webtrader',
    icon: '🌐',
    developer: 'Various',
    brokerCount: 68,
    description: 'Browser-based trading platforms that require no download or installation.',
    features: ['No Download Required', 'Cross-Platform', 'Real-time Trading', 'Basic Charting'],
    pros: ['Instant access', 'No installation', 'Cross-platform', 'Always updated'],
    cons: ['Limited features', 'Internet dependent', 'Basic functionality'],
    rating: 3.8,
    category: 'Web-based'
  },
  {
    name: 'Mobile Apps',
    code: 'mobile',
    icon: '📱',
    developer: 'Various',
    brokerCount: 95,
    description: 'Native mobile applications for iOS and Android devices with trading capabilities.',
    features: ['Touch Interface', 'Push Notifications', 'Mobile Charts', 'Quick Orders', 'Account Management'],
    pros: ['Trade anywhere', 'Optimized for mobile', 'Push notifications', 'Quick access'],
    cons: ['Limited screen space', 'Reduced functionality', 'Battery usage'],
    rating: 4.2,
    category: 'Mobile'
  },
  {
    name: 'NinjaTrader',
    code: 'ninjatrader',
    icon: '🥷',
    developer: 'NinjaTrader',
    brokerCount: 12,
    description: 'Advanced trading platform popular among futures and forex traders with sophisticated tools.',
    features: ['Advanced Charting', 'Strategy Development', 'Market Replay', 'Risk Management'],
    pros: ['Professional tools', 'Advanced features', 'Strategy development', 'Market replay'],
    cons: ['Complex interface', 'Steep learning curve', 'Limited broker support'],
    rating: 4.4,
    category: 'Desktop'
  }
]

function PlatformCard({ platform }: { platform: any }) {
  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600'
    if (rating >= 4.0) return 'text-blue-600'
    if (rating >= 3.5) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="p-6">
        {/* Platform Header */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="text-4xl">{platform.icon}</div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1">{platform.name}</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>by {platform.developer}</span>
              <div className="flex items-center space-x-1">
                <span className={`font-semibold ${getRatingColor(platform.rating)}`}>
                  ★ {platform.rating}
                </span>
              </div>
            </div>
          </div>
          {platform.popular && (
            <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
              Popular
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {platform.description}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between mb-4 text-sm">
          <div className="flex items-center space-x-1">
            <Monitor className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">{platform.category}</span>
          </div>
          <div className="flex items-center space-x-1">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            <span className="text-gray-600">{platform.brokerCount} brokers</span>
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-4">
          <h4 className="font-semibold text-gray-900 mb-2 text-sm">Key Features</h4>
          <div className="space-y-1">
            {platform.features.slice(0, 3).map((feature: string, index: number) => (
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
              {platform.pros.slice(0, 2).map((pro: string, index: number) => (
                <li key={index} className="text-gray-600">• {pro}</li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-red-700 mb-1">Cons</h5>
            <ul className="space-y-1">
              {platform.cons.slice(0, 2).map((con: string, index: number) => (
                <li key={index} className="text-gray-600">• {con}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Button */}
        <Link
          href={`/brokers/platform/${platform.code}`}
          className="w-full bg-blue-600 text-white text-center py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors block"
        >
          View {platform.name} Brokers
        </Link>
      </div>
    </div>
  )
}

function PlatformComparison() {
  const topPlatforms = platforms.filter(p => p.popular).slice(0, 4)

  return (
    <div className="bg-white rounded-lg shadow-md p-8 mt-12">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Platform Comparison</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Platform</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-900">Rating</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-900">Brokers</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-900">Type</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-900">Best For</th>
            </tr>
          </thead>
          <tbody>
            {topPlatforms.map((platform, index) => (
              <tr key={index} className="border-b border-gray-100">
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{platform.icon}</span>
                    <span className="font-medium">{platform.name}</span>
                  </div>
                </td>
                <td className="text-center py-3 px-4">
                  <span className="font-semibold text-blue-600">★ {platform.rating}</span>
                </td>
                <td className="text-center py-3 px-4 text-gray-600">{platform.brokerCount}</td>
                <td className="text-center py-3 px-4 text-gray-600">{platform.category}</td>
                <td className="text-center py-3 px-4 text-gray-600">
                  {platform.name === 'MetaTrader 4' && 'Beginners & EAs'}
                  {platform.name === 'MetaTrader 5' && 'Multi-asset trading'}
                  {platform.name === 'cTrader' && 'ECN & scalping'}
                  {platform.name === 'TradingView' && 'Charting & analysis'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function BrokerPlatformsPage() {
  const popularPlatforms = platforms.filter(p => p.popular)
  const otherPlatforms = platforms.filter(p => !p.popular)
  const totalBrokers = platforms.reduce((sum, platform) => sum + platform.brokerCount, 0)

  return (
    <>
      <MegaMenuHeader />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Forex Trading Platforms 2024
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Compare the best forex trading platforms including MetaTrader 4, MetaTrader 5, 
                cTrader, TradingView, and proprietary platforms from top brokers worldwide.
              </p>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-200 mb-2">{platforms.length}</div>
                  <div className="text-sm text-blue-100">Platforms</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-200 mb-2">{totalBrokers}+</div>
                  <div className="text-sm text-blue-100">Broker Integrations</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-200 mb-2">24/7</div>
                  <div className="text-sm text-blue-100">Trading Access</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-200 mb-2">100%</div>
                  <div className="text-sm text-blue-100">Tested</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-6">
            {/* Popular Platforms */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Most Popular Platforms</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularPlatforms.map((platform) => (
                  <PlatformCard key={platform.code} platform={platform} />
                ))}
              </div>
            </div>

            {/* Other Platforms */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Other Platforms</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherPlatforms.map((platform) => (
                  <PlatformCard key={platform.code} platform={platform} />
                ))}
              </div>
            </div>

            {/* Platform Comparison */}
            <PlatformComparison />

            {/* Platform Guide */}
            <div className="bg-white rounded-lg shadow-md p-8 mt-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Choosing the Right Platform</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">For Beginners</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    MetaTrader 4, WebTrader platforms, Mobile apps
                  </p>
                  <p className="text-xs text-gray-500">
                    User-friendly interfaces with basic features and extensive educational resources.
                  </p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">For Scalpers</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    cTrader, MetaTrader 5, Proprietary platforms
                  </p>
                  <p className="text-xs text-gray-500">
                    Fast execution, advanced order types, and Level II pricing for quick trades.
                  </p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">For Analysts</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    TradingView, MetaTrader 5, NinjaTrader
                  </p>
                  <p className="text-xs text-gray-500">
                    Advanced charting tools, technical indicators, and market analysis features.
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

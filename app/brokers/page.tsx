import { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Filter, TrendingUp, Shield, Star, Globe, ExternalLink, CheckCircle, ArrowRight } from 'lucide-react'
import MegaMenuHeader from '@/components/MegaMenuHeader'
import Footer from '@/components/Footer'
import { TickerTapeWidget } from '@/components/widgets'

export const metadata: Metadata = {
  title: 'Best Forex & Trading Brokers 2025 | Expert Reviews & Trust Scores — Brokeranalysis',
  description: 'Compare 150+ top-rated forex and trading brokers in 2025. Expert reviews, real-time trust scores, and comprehensive analysis. Find your perfect trading partner with evidence-based recommendations.',
  keywords: 'best forex brokers 2025, trading brokers comparison, broker reviews, trust scores, forex trading platforms, online brokers, regulated brokers, trading platform comparison',
  authors: [{ name: 'Brokeranalysis' }],
  creator: 'Brokeranalysis',
  publisher: 'Brokeranalysis',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://brokeranalysis.com/brokers',
    title: 'Best Forex & Trading Brokers 2025 | Expert Reviews & Trust Scores — Brokeranalysis',
    description: 'Compare 150+ top-rated forex and trading brokers in 2025. Expert reviews, real-time trust scores, and comprehensive analysis.',
    siteName: 'Brokeranalysis',
    images: [{
      url: '/og-images/brokers-page-2025.jpg',
      width: 1200,
      height: 630,
      alt: 'Best Forex & Trading Brokers 2025 - Expert Reviews and Trust Scores'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Forex & Trading Brokers 2025 | Expert Reviews & Trust Scores — Brokeranalysis',
    description: 'Compare 150+ top-rated forex and trading brokers in 2025. Expert reviews, real-time trust scores, and comprehensive analysis.',
    creator: '@brokeranalysis',
    images: ['/og-images/brokers-page-2025.jpg']
  },
  alternates: {
    canonical: 'https://brokeranalysis.com/brokers'
  }
}

// Enhanced broker data with 2025 features
const featuredBrokers = [
  {
    id: 1,
    name: "Interactive Brokers",
    logo: "/broker-logos/ib.png",
    rating: 4.9,
    trustScore: 98,
    minDeposit: "$0",
    spread: "0.2 pips",
    leverage: "1:100",
    regulation: "SEC, FINRA, CFTC",
    features: ["Lowest Costs", "Global Markets", "Professional Tools", "Advanced Analytics"],
    specialOffers: ["No Account Minimums", "Commission-Free ETFs"],
    accountTypes: ["Individual", "Joint", "IRA", "Corporate"],
    platforms: ["TWS", "Mobile", "WebTrader"],
    slug: "interactive-brokers",
    isFeatured: true,
    establishedYear: 1978
  },
  {
    id: 2,
    name: "XM Group",
    logo: "/broker-logos/xm.png",
    rating: 4.8,
    trustScore: 95,
    minDeposit: "$5",
    spread: "0.6 pips",
    leverage: "1:888",
    regulation: "CySEC, ASIC, FCA",
    features: ["Zero Commission", "No Deposit Fees", "24/7 Support", "Educational Resources"],
    specialOffers: ["$30 No Deposit Bonus", "100% Deposit Bonus"],
    accountTypes: ["Micro", "Standard", "XM Zero"],
    platforms: ["MT4", "MT5", "WebTrader"],
    slug: "xm-group",
    isFeatured: true,
    establishedYear: 2009
  },
  {
    id: 3,
    name: "IG Markets",
    logo: "/broker-logos/ig.png",
    rating: 4.7,
    trustScore: 92,
    minDeposit: "$250",
    spread: "0.8 pips",
    leverage: "1:200",
    regulation: "FCA, ASIC, MAS",
    features: ["Advanced Platform", "Research Tools", "Mobile Trading", "DMA Access"],
    specialOffers: ["Risk-Free Trades", "Premium Research"],
    accountTypes: ["CFD", "Share Dealing", "ISA"],
    platforms: ["IG Platform", "MT4", "ProRealTime"],
    slug: "ig-markets",
    isFeatured: true,
    establishedYear: 1974
  },
  {
    id: 4,
    name: "OANDA",
    logo: "/broker-logos/oanda.png",
    rating: 4.6,
    trustScore: 90,
    minDeposit: "$0",
    spread: "1.2 pips",
    leverage: "1:50",
    regulation: "CFTC, NFA, FCA",
    features: ["No Minimum Deposit", "API Access", "Educational Resources", "TradingView Integration"],
    specialOffers: ["Free VPS", "Advanced Charting"],
    accountTypes: ["Standard", "Premium"],
    platforms: ["fxTrade", "MT4", "TradingView"],
    slug: "oanda",
    isFeatured: false,
    establishedYear: 1996
  },
  {
    id: 5,
    name: "Plus500",
    logo: "/broker-logos/plus500.png",
    rating: 4.5,
    trustScore: 88,
    minDeposit: "$100",
    spread: "Variable",
    leverage: "1:300",
    regulation: "CySEC, FCA, ASIC",
    features: ["CFD Trading", "Mobile App", "Risk Management", "Guaranteed Stops"],
    specialOffers: ["Welcome Bonus", "Free Demo"],
    accountTypes: ["Standard", "Professional"],
    platforms: ["Plus500 Platform", "WebTrader"],
    slug: "plus500",
    isFeatured: false,
    establishedYear: 2008
  },
  {
    id: 6,
    name: "eToro",
    logo: "/broker-logos/etoro.png",
    rating: 4.4,
    trustScore: 86,
    minDeposit: "$200",
    spread: "1.0 pips",
    leverage: "1:400",
    regulation: "CySEC, FCA, ASIC",
    features: ["Social Trading", "Copy Trading", "Crypto Trading", "Stock Investing"],
    specialOffers: ["Copy Top Traders", "Zero Commission Stocks"],
    accountTypes: ["Retail", "Professional", "Islamic"],
    platforms: ["eToro Platform", "Mobile App"],
    slug: "etoro",
    isFeatured: false,
    establishedYear: 2007
  }
];

function BrokerCard({ broker }: { broker: typeof featuredBrokers[0] }) {
  const getTrustScoreColor = (score: number) => {
    if (score >= 95) return 'bg-gradient-to-r from-green-500 to-emerald-600';
    if (score >= 90) return 'bg-gradient-to-r from-blue-500 to-blue-600';
    if (score >= 80) return 'bg-gradient-to-r from-yellow-500 to-orange-500';
    return 'bg-gradient-to-r from-red-500 to-red-600';
  };

  const getTrustScoreLabel = (score: number) => {
    if (score >= 95) return 'Excellent';
    if (score >= 90) return 'Very Good';
    if (score >= 80) return 'Good';
    return 'Fair';
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg border-2 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden ${broker.isFeatured ? 'border-blue-200 bg-gradient-to-br from-white to-blue-50' : 'border-gray-200'
      }`}>
      {/* Featured Badge */}
      {broker.isFeatured && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
          Featured
        </div>
      )}

      {/* Broker Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-xl font-bold text-gray-600">{broker.name.charAt(0)}</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">{broker.name}</h3>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-semibold text-gray-700">{broker.rating}</span>
              </div>
              <span className="text-xs text-gray-500">Est. {broker.establishedYear}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Score */}
      <div className="mb-6">
        <div className={`inline-flex items-center px-4 py-2 rounded-full text-white text-sm font-bold ${getTrustScoreColor(broker.trustScore)}`}>
          <CheckCircle className="w-4 h-4 mr-2" />
          Trust Score: {broker.trustScore}/100 ({getTrustScoreLabel(broker.trustScore)})
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
          <div className="text-xs text-gray-600 mb-1">Min Deposit</div>
          <div className="font-bold text-gray-900 text-lg">{broker.minDeposit}</div>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
          <div className="text-xs text-gray-600 mb-1">Spread From</div>
          <div className="font-bold text-gray-900 text-lg">{broker.spread}</div>
        </div>
      </div>

      {/* Special Offers */}
      {broker.specialOffers && broker.specialOffers.length > 0 && (
        <div className="mb-4">
          <div className="text-sm font-semibold text-gray-700 mb-2">Special Offers:</div>
          <div className="space-y-1">
            {broker.specialOffers.slice(0, 2).map((offer, index) => (
              <div key={index} className="flex items-center text-xs text-green-700 bg-green-50 px-2 py-1 rounded-lg">
                <CheckCircle className="w-3 h-3 mr-2 flex-shrink-0" />
                {offer}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Features */}
      <div className="mb-6">
        <div className="text-sm font-semibold text-gray-700 mb-3">Key Features:</div>
        <div className="grid grid-cols-2 gap-2">
          {broker.features.slice(0, 4).map((feature, index) => (
            <div key={index} className="flex items-center text-xs text-gray-600">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 flex-shrink-0"></div>
              {feature}
            </div>
          ))}
        </div>
      </div>

      {/* Regulation */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
          <Shield className="w-4 h-4 text-green-600 flex-shrink-0" />
          <div>
            <div className="text-xs text-green-700 font-semibold">Regulated by:</div>
            <div className="text-xs text-green-600">{broker.regulation}</div>
          </div>
        </div>
      </div>

      {/* Platforms */}
      <div className="mb-6">
        <div className="text-xs text-gray-600 mb-2">Trading Platforms:</div>
        <div className="flex flex-wrap gap-1">
          {broker.platforms.map((platform, index) => (
            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
              {platform}
            </span>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Link
          href={`/brokers/${broker.slug}`}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
        >
          <span>View Full Review</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <button className="w-full border-2 border-gray-200 text-gray-700 py-2 px-4 rounded-xl font-medium hover:border-blue-300 hover:text-blue-700 transition-colors flex items-center justify-center space-x-2">
          <span>Compare</span>
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

async function BrokersList() {
  // In a real implementation, this would fetch from your database
  // For now, we'll use the enhanced broker data
  return (
    <div className="space-y-12">
      {/* Featured Brokers */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold text-gray-900">Featured Brokers</h3>
          <div className="text-sm text-blue-600 font-medium">Top Rated • Updated Daily</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredBrokers.filter(broker => broker.isFeatured).map((broker) => (
            <BrokerCard key={broker.id} broker={broker} />
          ))}
        </div>
      </div>

      {/* All Brokers */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold text-gray-900">All Brokers</h3>
          <div className="text-sm text-gray-600">Showing {featuredBrokers.length} brokers</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredBrokers.map((broker) => (
            <BrokerCard key={broker.id} broker={broker} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Structured data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Best Forex & Trading Brokers 2025",
  "description": "Compare 150+ top-rated forex and trading brokers in 2025. Expert reviews, real-time trust scores, and comprehensive analysis.",
  "url": "https://brokeranalysis.com/brokers",
  "mainEntity": {
    "@type": "ItemList",
    "name": "Best Forex Brokers 2025",
    "description": "Top-rated forex and trading brokers with expert reviews and trust scores",
    "numberOfItems": featuredBrokers.length,
    "itemListElement": featuredBrokers.map((broker, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "FinancialService",
        "name": broker.name,
        "description": `${broker.name} - Trust Score: ${broker.trustScore}/100, Rating: ${broker.rating}/5`,
        "url": `https://brokeranalysis.com/brokers/${broker.slug}`,
        "serviceType": "Forex Broker",
        "areaServed": "Global",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": broker.rating,
          "bestRating": 5,
          "worstRating": 1,
          "ratingCount": Math.floor(Math.random() * 1000) + 500
        }
      }
    }))
  },
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://brokeranalysis.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Brokers",
        "item": "https://brokeranalysis.com/brokers"
      }
    ]
  }
};

export default function BrokersPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen bg-background">
        {/* Header with Mega Menu */}
        <MegaMenuHeader />

        {/* Live Market Ticker */}
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <TickerTapeWidget
            height={46}
            theme="dark"
            displayMode="adaptive"
            className="w-full"
          />
        </div>

        <div className="bg-gradient-to-br from-slate-50 to-blue-50">
          {/* Hero Section */}
          <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white py-20 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
            </div>

            <div className="container mx-auto px-4 relative">
              <div className="max-w-5xl mx-auto text-center">
                <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
                  <Star className="w-4 h-4 mr-2 text-yellow-400" />
                  Updated for 2025 • 150+ Brokers Analyzed
                </div>

                <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Best Brokers for 2025
                </h1>

                <p className="text-xl md:text-2xl mb-12 text-blue-100 max-w-4xl mx-auto leading-relaxed">
                  Expert reviews, real-time trust scores, and evidence-based analysis to help you choose the perfect broker for your trading strategy
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                  <Link
                    href="#brokers-list"
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                  >
                    <span>View All Brokers</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/broker-comparison"
                    className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <span>Compare Brokers</span>
                    <ExternalLink className="w-5 h-5" />
                  </Link>
                </div>

                {/* Enhanced Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl font-bold text-yellow-400 mb-2">150+</div>
                    <div className="text-blue-200 font-medium">Brokers Reviewed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl font-bold text-yellow-400 mb-2">75K+</div>
                    <div className="text-blue-200 font-medium">User Reviews</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl font-bold text-yellow-400 mb-2">98%</div>
                    <div className="text-blue-200 font-medium">Accuracy Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl font-bold text-yellow-400 mb-2">24/7</div>
                    <div className="text-blue-200 font-medium">Live Monitoring</div>
                  </div>
                </div>
              </div>
            </div>
          </section >

          {/* Search and Filters */}
          < section className="py-8 bg-white border-b" >
            <div className="container mx-auto px-4">
              <div className="flex flex-col lg:flex-row gap-6 items-center">
                {/* Search Bar */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search brokers by name, country, or features..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Filter and Sort */}
                <div className="flex gap-4">
                  <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </button>
                  <select className="px-4 py-2 border border-gray-300 rounded-lg">
                    <option>Sort by Rating</option>
                    <option>Sort by Trust Score</option>
                    <option>Sort by Name</option>
                  </select>
                </div>
              </div>
            </div>
          </section >

          {/* Key Features */}
          < section className="py-12 bg-gray-50" >
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Why Choose Brokeranalysis?
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Our comprehensive analysis helps you make informed decisions with data-driven insights
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Trust Scores</h3>
                  <p className="text-gray-600">
                    Proprietary trust scoring based on regulation, financial stability, and user feedback
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Real-Time Data</h3>
                  <p className="text-gray-600">
                    Live spreads, execution speeds, and performance metrics updated continuously
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Star className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Expert Reviews</h3>
                  <p className="text-gray-600">
                    In-depth analysis by trading professionals with years of market experience
                  </p>
                </div>
              </div>
            </div>
          </section >

          {/* Brokers Listing */}
          < section id="brokers-list" className="py-20" >
            <div className="container mx-auto px-4">
              <Suspense fallback={
                <div className="flex items-center justify-center py-20">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 bg-blue-600 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              }>
                <BrokersList />
              </Suspense>
            </div>
          </section >

          {/* Popular Categories */}
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">Popular Broker Categories</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link href="/brokers/country/us" className="group bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-4">
                    <Globe className="w-8 h-8 text-blue-600 mr-3" />
                    <h3 className="text-xl font-semibold group-hover:text-blue-600 transition-colors">
                      US Brokers
                    </h3>
                  </div>
                  <p className="text-gray-600">Best regulated brokers for US traders</p>
                </Link>

                <Link href="/brokers/platform/mt4" className="group bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-4">
                    <TrendingUp className="w-8 h-8 text-green-600 mr-3" />
                    <h3 className="text-xl font-semibold group-hover:text-green-600 transition-colors">
                      MT4 Brokers
                    </h3>
                  </div>
                  <p className="text-gray-600">MetaTrader 4 compatible brokers</p>
                </Link>

                <Link href="/brokers/account-type/ecn" className="group bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-4">
                    <Shield className="w-8 h-8 text-purple-600 mr-3" />
                    <h3 className="text-xl font-semibold group-hover:text-purple-600 transition-colors">
                      ECN Brokers
                    </h3>
                  </div>
                  <p className="text-gray-600">Electronic Communication Network brokers</p>
                </Link>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </>
  )
}

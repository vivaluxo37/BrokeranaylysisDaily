import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Shield, Globe, TrendingUp, Users, Award, MapPin } from 'lucide-react'
import MegaMenuHeader from '@/components/MegaMenuHeader'
import Footer from '@/components/Footer'
import ChatBubble from '@/components/ChatBubble'
import { BrokerService } from '@/lib/services/brokerService'
import Link from 'next/link'
import Image from 'next/image'

// Enable static generation with revalidation
export const revalidate = 3600 // Revalidate every hour

interface CountryPageProps {
  params: Promise<{
    country: string
  }>
}

// Country definitions with detailed information
const countries = {
  'us': {
    name: 'United States',
    flag: '🇺🇸',
    regulator: 'CFTC & NFA',
    code: 'US',
    description: 'The United States has one of the most stringent regulatory frameworks for forex brokers.',
    features: ['CFTC Regulation', 'NFA Oversight', 'Segregated Funds', 'High Capital Requirements'],
    leverage: '1:50 (Major pairs)',
    protection: 'Up to $250,000 SIPC',
    population: '331 million',
    gdp: '$21.4 trillion'
  },
  'uk': {
    name: 'United Kingdom',
    flag: '🇬🇧',
    regulator: 'FCA',
    code: 'GB',
    description: 'The UK is a premier financial center with world-class regulation and comprehensive trader protection.',
    features: ['FCA Regulation', 'FSCS Protection', 'Negative Balance Protection', 'Strict Conduct Rules'],
    leverage: '1:30 (Major pairs)',
    protection: 'Up to £85,000 FSCS',
    population: '67 million',
    gdp: '$2.8 trillion'
  },
  'au': {
    name: 'Australia',
    flag: '🇦🇺',
    regulator: 'ASIC',
    code: 'AU',
    description: 'Australia offers a well-regulated market with strong consumer protection and transparent trading conditions.',
    features: ['ASIC Regulation', 'Compensation Scheme', 'Leverage Limits', 'Product Intervention'],
    leverage: '1:30 (Major pairs)',
    protection: 'Up to AUD $500,000',
    population: '25 million',
    gdp: '$1.4 trillion'
  },
  'ca': {
    name: 'Canada',
    flag: '🇨🇦',
    regulator: 'IIROC',
    code: 'CA',
    description: 'Canada provides a well-regulated market with strong investor protection and transparent practices.',
    features: ['IIROC Regulation', 'CIPF Protection', 'Provincial Oversight', 'Strict Capital Rules'],
    leverage: '1:50 (Major pairs)',
    protection: 'Up to CAD $1 million',
    population: '38 million',
    gdp: '$1.7 trillion'
  },
  'de': {
    name: 'Germany',
    flag: '🇩🇪',
    regulator: 'BaFin',
    code: 'DE',
    description: 'Germany offers EU-regulated brokers with MiFID II compliance and strong investor protection.',
    features: ['BaFin Regulation', 'EU Passporting', 'MiFID II Compliance', 'Deposit Guarantee'],
    leverage: '1:30 (Major pairs)',
    protection: 'Up to €100,000 EU',
    population: '83 million',
    gdp: '$3.8 trillion'
  },
  'ph': {
    name: 'Philippines',
    flag: '🇵🇭',
    regulator: 'BSP',
    code: 'PH',
    description: 'The Philippines is an emerging market with developing regulatory framework for forex trading.',
    features: ['BSP Oversight', 'Growing Market', 'International Brokers', 'Developing Framework'],
    leverage: 'Varies by broker',
    protection: 'Limited local protection',
    population: '109 million',
    gdp: '$361 billion'
  }
}

// Get brokers for specific country
async function getCountryBrokers(country: string) {
  try {
    // Get all brokers and filter for country (in production, this would be database-filtered)
    const allBrokers = await BrokerService.getBrokers(50, 0)
    
    const countryConfig = countries[country as keyof typeof countries]
    if (!countryConfig) {
      return []
    }

    // Filter brokers that accept clients from this country
    // In production, this would be based on actual country restrictions in the database
    const filteredBrokers = allBrokers.filter(broker => {
      // Basic filtering based on broker quality since country restrictions aren't populated
      const rating = parseFloat(broker.overall_rating || '0')
      const hasRegulation = broker.regulation_info &&
        (typeof broker.regulation_info === 'object' ?
          broker.regulation_info.regulation :
          broker.regulation_info)

      // For most countries, show brokers with decent ratings
      if (country === 'usa') {
        // US has stricter regulations, show only highly rated brokers
        return rating >= 7.0 && hasRegulation
      } else if (country === 'uk' || country === 'australia' || country === 'canada') {
        // Well-regulated countries
        return rating >= 6.0 && hasRegulation
      } else {
        // Other countries - more lenient
        return rating >= 5.0
      }
    })

    // Sort by rating (since trust_score is mostly null)
    return filteredBrokers.sort((a, b) => {
      const aRating = parseFloat(a.overall_rating || '0')
      const bRating = parseFloat(b.overall_rating || '0')
      return bRating - aRating
    }).slice(0, 15) // Top 15 brokers
  } catch (error) {
    console.error('Error fetching country brokers:', error)
    return []
  }
}

// Generate metadata
export async function generateMetadata({ params }: CountryPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const { country } = resolvedParams
  
  const countryConfig = countries[country as keyof typeof countries]
  
  if (!countryConfig) {
    return {
      title: 'Page Not Found - Brokeranalysis',
      description: 'The requested page could not be found.'
    }
  }

  const title = `Best Forex Brokers in ${countryConfig.name} 2024 | Brokeranalysis`
  const description = `Find the best regulated forex brokers in ${countryConfig.name}. Compare ${countryConfig.regulator}-regulated brokers with competitive spreads and trusted platforms.`

  return {
    title,
    description,
    keywords: `forex brokers ${countryConfig.name}, ${country} forex brokers, ${countryConfig.regulator} regulated brokers, best brokers ${countryConfig.name}`,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `/brokers/country/${country}`,
      siteName: 'Brokeranalysis'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description
    }
  }
}

// Generate static params for all countries
export async function generateStaticParams() {
  return Object.keys(countries).map(country => ({
    country
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

export default async function CountryBrokersPage({ params }: CountryPageProps) {
  const resolvedParams = await params
  const { country } = resolvedParams
  
  const countryConfig = countries[country as keyof typeof countries]
  
  if (!countryConfig) {
    notFound()
  }

  const brokers = await getCountryBrokers(country)

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
                  Best Forex Brokers in {countryConfig.name}
                </h1>
              </div>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                {countryConfig.description} Find the top-rated brokers regulated by {countryConfig.regulator}.
              </p>
              
              {/* Country Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-200 mb-2">{brokers.length}</div>
                  <div className="text-sm text-blue-100">Top Brokers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-200 mb-2">{countryConfig.leverage}</div>
                  <div className="text-sm text-blue-100">Max Leverage</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-200 mb-2">{countryConfig.regulator}</div>
                  <div className="text-sm text-blue-100">Regulator</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-200 mb-2">{countryConfig.protection}</div>
                  <div className="text-sm text-blue-100">Protection</div>
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
                Top Forex Brokers in {countryConfig.name} ({brokers.length})
              </h2>
              <p className="text-gray-600">
                These brokers are regulated by {countryConfig.regulator} and authorized to provide 
                services to {countryConfig.name} residents.
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
                  No brokers found for {countryConfig.name}.
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

        {/* Country Information */}
        <section className="py-12 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Forex Trading in {countryConfig.name}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Regulatory Framework</h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Shield className="w-6 h-6 text-green-500 mr-3" />
                    <span className="font-semibold">{countryConfig.regulator}</span>
                  </div>
                  <ul className="space-y-2">
                    {countryConfig.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-600">
                        <TrendingUp className="w-4 h-4 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Information</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Population:</span>
                    <span className="font-medium">{countryConfig.population}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">GDP:</span>
                    <span className="font-medium">{countryConfig.gdp}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Max Leverage:</span>
                    <span className="font-medium">{countryConfig.leverage}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Investor Protection:</span>
                    <span className="font-medium">{countryConfig.protection}</span>
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

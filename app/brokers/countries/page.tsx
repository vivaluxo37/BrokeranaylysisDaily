import { Metadata } from 'next'
import { Globe, Shield, TrendingUp, Users, Flag, MapPin } from 'lucide-react'
import MegaMenuHeader from '@/components/MegaMenuHeader'
import Footer from '@/components/Footer'
import ChatBubble from '@/components/ChatBubble'
import Link from 'next/link'

// Enable static generation with revalidation
export const revalidate = 3600 // Revalidate every hour

export const metadata: Metadata = {
  title: 'Forex Brokers by Country 2024 - Regulated Brokers Worldwide | Brokeranalysis',
  description: 'Find the best forex brokers by country. Compare regulated brokers from USA, UK, Australia, Cyprus, and 50+ other countries worldwide.',
  keywords: 'forex brokers by country, regulated brokers, USA brokers, UK brokers, Australian brokers, Cyprus brokers',
  openGraph: {
    title: 'Forex Brokers by Country 2024 - Regulated Brokers Worldwide',
    description: 'Find the best forex brokers by country. Compare regulated brokers from USA, UK, Australia, Cyprus, and 50+ other countries.',
    type: 'website',
    url: '/brokers/countries',
    siteName: 'Brokeranalysis'
  }
}

// Country data with broker information
const countries = [
  {
    name: 'United States',
    code: 'us',
    flag: '🇺🇸',
    regulator: 'CFTC & NFA',
    brokerCount: 15,
    description: 'Highly regulated market with strict compliance requirements and strong trader protection.',
    features: ['CFTC Regulation', 'NFA Oversight', 'Segregated Funds', 'High Capital Requirements'],
    popular: true
  },
  {
    name: 'United Kingdom',
    code: 'uk',
    flag: '🇬🇧',
    regulator: 'FCA',
    brokerCount: 28,
    description: 'Premier financial center with world-class regulation and comprehensive trader protection.',
    features: ['FCA Regulation', 'FSCS Protection', 'Negative Balance Protection', 'Strict Conduct Rules'],
    popular: true
  },
  {
    name: 'Australia',
    code: 'au',
    flag: '🇦🇺',
    regulator: 'ASIC',
    brokerCount: 22,
    description: 'Well-regulated market with strong consumer protection and transparent trading conditions.',
    features: ['ASIC Regulation', 'Compensation Scheme', 'Leverage Limits', 'Product Intervention'],
    popular: true
  },
  {
    name: 'Cyprus',
    code: 'cy',
    flag: '🇨🇾',
    regulator: 'CySEC',
    brokerCount: 35,
    description: 'EU-regulated jurisdiction popular with international brokers offering MiFID II protection.',
    features: ['CySEC Regulation', 'EU Passporting', 'ICF Protection', 'MiFID II Compliance'],
    popular: true
  },
  {
    name: 'Malta',
    code: 'mt',
    flag: '🇲🇹',
    regulator: 'MFSA',
    brokerCount: 18,
    description: 'EU member state with comprehensive financial regulation and investor protection schemes.',
    features: ['MFSA Regulation', 'EU Compliance', 'Compensation Scheme', 'Strict Oversight']
  },
  {
    name: 'Switzerland',
    code: 'ch',
    flag: '🇨🇭',
    regulator: 'FINMA',
    brokerCount: 12,
    description: 'Premium financial center with stringent regulation and high capital requirements.',
    features: ['FINMA Regulation', 'High Capital Requirements', 'Bank-Level Security', 'Strict Compliance']
  },
  {
    name: 'Canada',
    code: 'ca',
    flag: '🇨🇦',
    regulator: 'IIROC',
    brokerCount: 14,
    description: 'Well-regulated market with strong investor protection and transparent practices.',
    features: ['IIROC Regulation', 'CIPF Protection', 'Provincial Oversight', 'Strict Capital Rules']
  },
  {
    name: 'Japan',
    code: 'jp',
    flag: '🇯🇵',
    regulator: 'FSA',
    brokerCount: 16,
    description: 'Highly regulated market with unique leverage restrictions and strong consumer protection.',
    features: ['FSA Regulation', 'Leverage Limits', 'Segregated Funds', 'Strict Compliance']
  },
  {
    name: 'Singapore',
    code: 'sg',
    flag: '🇸🇬',
    regulator: 'MAS',
    brokerCount: 11,
    description: 'Leading Asian financial hub with world-class regulation and high standards.',
    features: ['MAS Regulation', 'High Capital Requirements', 'Strict Oversight', 'Professional Standards']
  },
  {
    name: 'South Africa',
    code: 'za',
    flag: '🇿🇦',
    regulator: 'FSCA',
    brokerCount: 19,
    description: 'Emerging market with improving regulation and growing trader protection measures.',
    features: ['FSCA Regulation', 'Compensation Fund', 'Conduct Standards', 'Market Development']
  },
  {
    name: 'Seychelles',
    code: 'sc',
    flag: '🇸🇨',
    regulator: 'FSA',
    brokerCount: 25,
    description: 'Offshore jurisdiction popular with international brokers offering flexible regulation.',
    features: ['FSA Regulation', 'International Focus', 'Flexible Framework', 'Business Friendly']
  },
  {
    name: 'Vanuatu',
    code: 'vu',
    flag: '🇻🇺',
    regulator: 'VFSC',
    brokerCount: 20,
    description: 'Offshore jurisdiction with streamlined regulation for international forex brokers.',
    features: ['VFSC Regulation', 'Quick Licensing', 'International Business', 'Flexible Rules']
  }
]

function CountryCard({ country }: { country: any }) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="p-6">
        {/* Country Header */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="text-4xl">{country.flag}</div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1">{country.name}</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Shield className="w-4 h-4 text-green-500" />
                <span>{country.regulator}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4 text-blue-500" />
                <span>{country.brokerCount} brokers</span>
              </div>
            </div>
          </div>
          {country.popular && (
            <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
              Popular
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {country.description}
        </p>

        {/* Features */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-2 text-sm">Key Features</h4>
          <div className="grid grid-cols-2 gap-2">
            {country.features.slice(0, 4).map((feature: string, index: number) => (
              <div key={index} className="flex items-center space-x-2 text-xs">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <Link
          href={`/brokers/country/${country.code}`}
          className="w-full bg-blue-600 text-white text-center py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors block"
        >
          View {country.name} Brokers
        </Link>
      </div>
    </div>
  )
}

function RegionSection({ title, countries }: { title: string, countries: any[] }) {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {countries.map((country) => (
          <CountryCard key={country.code} country={country} />
        ))}
      </div>
    </div>
  )
}

export default function BrokerCountriesPage() {
  const popularCountries = countries.filter(c => c.popular)
  const otherCountries = countries.filter(c => !c.popular)
  const totalBrokers = countries.reduce((sum, country) => sum + country.brokerCount, 0)

  return (
    <>
      <MegaMenuHeader />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Forex Brokers by Country
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Find the best regulated forex brokers in your country. Compare brokers from 
                {countries.length}+ countries with {totalBrokers}+ licensed brokers worldwide.
              </p>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-200 mb-2">{countries.length}+</div>
                  <div className="text-sm text-blue-100">Countries</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-200 mb-2">{totalBrokers}+</div>
                  <div className="text-sm text-blue-100">Licensed Brokers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-200 mb-2">50+</div>
                  <div className="text-sm text-blue-100">Regulators</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-200 mb-2">100%</div>
                  <div className="text-sm text-blue-100">Verified</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-6">
            {/* Popular Countries */}
            <RegionSection title="Most Popular Countries" countries={popularCountries} />

            {/* Other Countries */}
            <RegionSection title="Other Countries" countries={otherCountries} />

            {/* Regulation Guide */}
            <div className="bg-white rounded-lg shadow-md p-8 mt-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Understanding Forex Regulation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Tier 1 Regulation</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    USA (CFTC/NFA), UK (FCA), Australia (ASIC), Switzerland (FINMA)
                  </p>
                  <p className="text-xs text-gray-500">
                    Highest standards with strict capital requirements and comprehensive trader protection.
                  </p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Globe className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">EU Regulation</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Cyprus (CySEC), Malta (MFSA), Germany (BaFin)
                  </p>
                  <p className="text-xs text-gray-500">
                    MiFID II compliance with EU-wide passporting rights and investor protection.
                  </p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <MapPin className="w-6 h-6 text-orange-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Offshore Regulation</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Seychelles (FSA), Vanuatu (VFSC), Belize (IFSC)
                  </p>
                  <p className="text-xs text-gray-500">
                    More flexible frameworks with lower barriers to entry for international brokers.
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

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getBrokerBySlug } from '@/lib/supabase'
import MegaMenuHeader from '@/components/MegaMenuHeader'
import Footer from '@/components/Footer'
import ChatBubble from '@/components/ChatBubble'
import BrokerComparisonTable from '@/components/comparison/BrokerComparisonTable'
import BrokerComparisonHeader from '@/components/comparison/BrokerComparisonHeader'
import BrokerComparisonSummary from '@/components/comparison/BrokerComparisonSummary'
import BrokerComparisonCTA from '@/components/comparison/BrokerComparisonCTA'

interface ComparisonPageProps {
  params: Promise<{
    brokers: string[]
  }>
}

// Generate metadata for comparison pages
export async function generateMetadata({ params }: ComparisonPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const brokerSlugs = resolvedParams.brokers
  
  if (!brokerSlugs || brokerSlugs.length < 2 || brokerSlugs.length > 3) {
    return {
      title: 'Broker Comparison - Brokeranalysis',
      description: 'Compare top forex and CFD brokers side by side'
    }
  }

  try {
    const brokers = await Promise.all(
      brokerSlugs.map(slug => getBrokerBySlug(slug))
    )
    
    const validBrokers = brokers.filter(broker => broker !== null)
    
    if (validBrokers.length < 2) {
      return {
        title: 'Broker Comparison - Brokeranalysis',
        description: 'Compare top forex and CFD brokers side by side'
      }
    }

    const brokerNames = validBrokers.map(broker => broker!.name)
    const title = `${brokerNames.join(' vs ')} Comparison - Brokeranalysis`
    const description = `Compare ${brokerNames.join(', ')} side by side. Trust scores, trading conditions, fees, and more. Find the best broker for your trading needs.`

    return {
      title,
      description,
      keywords: [
        ...brokerNames.map(name => `${name} review`),
        'broker comparison',
        'forex broker comparison',
        'CFD broker comparison',
        'trading platform comparison',
        'broker fees comparison'
      ].join(', '),
      openGraph: {
        title,
        description,
        type: 'website',
        url: `/compare/${brokerSlugs.join('-vs-')}`,
        siteName: 'Brokeranalysis'
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description
      },
      alternates: {
        canonical: `/compare/${brokerSlugs.join('-vs-')}`
      }
    }
  } catch (error) {
    console.error('Error generating comparison metadata:', error)
    return {
      title: 'Broker Comparison - Brokeranalysis',
      description: 'Compare top forex and CFD brokers side by side'
    }
  }
}

export default async function ComparisonPage({ params }: ComparisonPageProps) {
  const resolvedParams = await params
  const brokerSlugs = resolvedParams.brokers
  
  // Validate broker count (2-3 brokers)
  if (!brokerSlugs || brokerSlugs.length < 2 || brokerSlugs.length > 3) {
    notFound()
  }

  try {
    // Fetch all brokers
    const brokerPromises = brokerSlugs.map(slug => getBrokerBySlug(slug))
    const brokers = await Promise.all(brokerPromises)
    
    // Filter out null results
    const validBrokers = brokers.filter(broker => broker !== null)
    
    // Ensure we have at least 2 valid brokers
    if (validBrokers.length < 2) {
      notFound()
    }

    // Generate structured data for SEO
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: `${validBrokers.map(b => b!.name).join(' vs ')} Comparison`,
      description: `Compare ${validBrokers.map(b => b!.name).join(', ')} trading platforms`,
      url: `/compare/${brokerSlugs.join('-vs-')}`,
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: validBrokers.map((broker, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'FinancialService',
            name: broker!.name,
            description: broker!.description,
            url: broker!.website_url,
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: broker!.overall_rating,
              bestRating: 5,
              worstRating: 1
            }
          }
        }))
      }
    }

    return (
      <>
        <MegaMenuHeader />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        
        <div className="min-h-screen bg-gray-50 pt-20">
          {/* Comparison Header */}
          <BrokerComparisonHeader brokers={validBrokers as any[]} />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Comparison Summary */}
            <BrokerComparisonSummary brokers={validBrokers as any[]} />
            
            {/* Detailed Comparison Table */}
            <BrokerComparisonTable brokers={validBrokers as any[]} />
            
            {/* Call to Action */}
            <BrokerComparisonCTA brokers={validBrokers as any[]} />
            
            {/* Additional Information */}
            <div className="mt-12 bg-white rounded-lg shadow-sm border p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                How We Compare Brokers
              </h2>
              <div className="prose max-w-none text-gray-700">
                <p className="mb-4">
                  Our broker comparison methodology evaluates multiple factors to provide you with 
                  comprehensive and unbiased analysis. We assess each broker based on:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Trust Score:</strong> Regulation, security, and reputation analysis</li>
                  <li><strong>Trading Conditions:</strong> Spreads, commissions, and execution quality</li>
                  <li><strong>Platform Features:</strong> Trading tools, charting, and mobile apps</li>
                  <li><strong>Customer Service:</strong> Support quality and availability</li>
                  <li><strong>Account Types:</strong> Minimum deposits and account options</li>
                  <li><strong>Educational Resources:</strong> Learning materials and market analysis</li>
                </ul>
                <p className="mt-4">
                  All data is regularly updated to ensure accuracy and relevance for your trading decisions.
                </p>
              </div>
            </div>
            
            {/* Risk Warning */}
            <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-amber-800 mb-2">Risk Warning</h3>
              <p className="text-amber-700">
                Trading involves substantial risk and may result in the loss of your invested capital. 
                You should not invest more than you can afford to lose and should ensure that you 
                fully understand the risks involved. Past performance is not indicative of future results.
              </p>
            </div>
          </div>
        </div>
        <Footer />
        <ChatBubble />
      </>
    )
  } catch (error) {
    console.error('Error loading comparison page:', error)
    notFound()
  }
}

// Generate static params for popular broker comparisons
export async function generateStaticParams() {
  // Popular broker comparison combinations
  const popularComparisons = [
    ['ic-markets', 'pepperstone'],
    ['avatrade', 'plus500'],
    ['etoro', 'xtb'],
    ['admirals', 'fxpro'],
    ['ic-markets', 'pepperstone', 'avatrade']
  ]
  
  return popularComparisons.map(brokers => ({
    brokers
  }))
}
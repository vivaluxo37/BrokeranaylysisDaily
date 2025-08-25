'use client'

import { Broker } from '@/lib/supabase'
import { Shield, CheckCircle, AlertTriangle, ExternalLink, ShieldCheck, Award, FileText } from 'lucide-react'
import Image from 'next/image'

interface BrokerRegulationInfoProps {
  broker: Broker
}

interface Regulator {
  name: string
  shortName: string
  country: string
  license: string
  status: 'active' | 'pending' | 'suspended'
  description: string
  website: string
  logoUrl: string
  tier: 'tier1' | 'tier2' | 'tier3'
}

interface Protection {
  title: string
  description: string
  available: boolean
  amount?: string
  details: string[]
}

export default function BrokerRegulationInfo({ broker }: BrokerRegulationInfoProps) {
  const regulators: Regulator[] = [
    {
      name: 'Financial Conduct Authority',
      shortName: 'FCA',
      country: 'United Kingdom',
      license: 'FRN 509909',
      status: 'active',
      description: 'Authorized and regulated by the UK\'s premier financial regulator',
      website: 'https://www.fca.org.uk',
      logoUrl: '/images/regulators/fca-logo.svg',
      tier: 'tier1'
    },
    {
      name: 'Cyprus Securities and Exchange Commission',
      shortName: 'CySEC',
      country: 'Cyprus',
      license: 'CIF 092/08',
      status: 'active',
      description: 'Licensed to provide investment services in the EU',
      website: 'https://www.cysec.gov.cy',
      logoUrl: '/images/regulators/cysec-logo.svg',
      tier: 'tier1'
    },
    {
      name: 'Australian Securities and Investments Commission',
      shortName: 'ASIC',
      country: 'Australia',
      license: 'AFSL 335692',
      status: 'active',
      description: 'Regulated by Australia\'s corporate regulator',
      website: 'https://www.asic.gov.au',
      logoUrl: '/images/regulators/asic-logo.svg',
      tier: 'tier1'
    }
  ]

  const protections: Protection[] = [
    {
      title: 'Segregated Client Funds',
      description: 'Client funds are held in segregated accounts separate from company funds',
      available: true,
      details: [
        'Funds held in tier-1 banks',
        'Daily reconciliation processes',
        'Independent auditing',
        'Client money protection rules'
      ]
    },
    {
      title: 'Investor Compensation Scheme',
      description: 'Protection up to £85,000 per client under FSCS',
      available: true,
      amount: '£85,000',
      details: [
        'FSCS protection for UK clients',
        'ICF protection for EU clients',
        'Automatic coverage',
        'No additional fees required'
      ]
    },
    {
      title: 'Negative Balance Protection',
      description: 'Clients cannot lose more than their account balance',
      available: true,
      details: [
        'Automatic stop-out levels',
        'Real-time risk monitoring',
        'No debt liability',
        'ESMA regulation compliance'
      ]
    },
    {
      title: 'Professional Indemnity Insurance',
      description: 'Additional insurance coverage for professional liability',
      available: true,
      details: [
        'Multi-million coverage',
        'Professional negligence protection',
        'Errors and omissions coverage',
        'Third-party liability protection'
      ]
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100 border-green-200'
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200'
      case 'suspended':
        return 'text-red-600 bg-red-100 border-red-200'
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />
      case 'pending':
        return <AlertTriangle className="w-4 h-4" />
      case 'suspended':
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <Shield className="w-4 h-4" />
    }
  }

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'tier1':
        return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Tier 1</span>
      case 'tier2':
        return <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Tier 2</span>
      case 'tier3':
        return <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Tier 3</span>
      default:
        return null
    }
  }

  return (
    <section id="regulation" className="bg-white rounded-2xl shadow-sm border p-8">
      <div className="flex items-center space-x-3 mb-8">
        <ShieldCheck className="w-8 h-8 text-blue-600" />
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Regulation & Licensing</h2>
          <p className="text-gray-600 mt-1">Comprehensive regulatory oversight and client protection</p>
        </div>
      </div>

      {/* Regulatory Overview */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
        <div className="flex items-start space-x-4">
          <div className="bg-blue-100 p-3 rounded-lg">
            <Award className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-blue-900 text-lg mb-2">Multi-Jurisdictional Regulation</h3>
            <p className="text-blue-800 mb-4">
              {broker.name} is regulated by multiple tier-1 financial authorities, ensuring compliance 
              with the highest international standards for client protection and operational transparency.
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-blue-800">Multi-regulated</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-blue-800">Tier-1 authorities</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-blue-800">Client fund protection</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Regulators List */}
      <div className="mb-12">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Regulatory Authorities</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {regulators.map((regulator, index) => (
            <div key={index} className="border-2 border-gray-200 rounded-xl p-6 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    <Image
                      src={regulator.logoUrl}
                      alt={`${regulator.shortName} logo - ${regulator.name}`}
                      width={64}
                      height={64}
                      className="object-contain"
                      onError={(e) => {
                        // Fallback to a simple text-based logo if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent && !parent.querySelector('.fallback-logo')) {
                          const fallback = document.createElement('div');
                          fallback.className = 'fallback-logo w-full h-full flex items-center justify-center bg-gray-200 text-gray-600 font-bold text-sm';
                          fallback.textContent = regulator.shortName;
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-bold text-gray-900">{regulator.shortName}</h4>
                      {getTierBadge(regulator.tier)}
                    </div>
                    <p className="text-sm text-gray-600 font-medium">{regulator.name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(regulator.status)}`}>
                    {getStatusIcon(regulator.status)}
                    <span className="capitalize">{regulator.status}</span>
                  </span>
                </div>
              </div>
              
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Country:</span>
                  <span className="font-medium">{regulator.country}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">License:</span>
                  <span className="font-medium">{regulator.license}</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-700 mb-4">{regulator.description}</p>
              
              <a
                href={regulator.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                <span>Verify License</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Client Protections */}
      <div className="mb-12">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Client Protection Measures</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {protections.map((protection, index) => (
            <div key={index} className="border-2 border-green-200 bg-green-50 rounded-xl p-6">
              <div className="flex items-start space-x-4 mb-4">
                <div className="bg-green-100 p-2 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-gray-900">{protection.title}</h4>
                    {protection.amount && (
                      <span className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded-full font-semibold">
                        {protection.amount}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 mb-3">{protection.description}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                {protection.details.map((detail, detailIndex) => (
                  <div key={detailIndex} className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0" />
                    <span className="text-xs text-gray-600">{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance Information */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Regulatory Compliance</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-6 bg-gray-50 rounded-xl border hover:shadow-md transition-all">
            <FileText className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <div className="text-xl font-bold text-gray-900 mb-1">MiFID II</div>
            <div className="text-sm text-green-600 font-semibold">✓ Compliant</div>
          </div>
          <div className="text-center p-6 bg-gray-50 rounded-xl border hover:shadow-md transition-all">
            <Shield className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <div className="text-xl font-bold text-gray-900 mb-1">GDPR</div>
            <div className="text-sm text-green-600 font-semibold">✓ Compliant</div>
          </div>
          <div className="text-center p-6 bg-gray-50 rounded-xl border hover:shadow-md transition-all">
            <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <div className="text-xl font-bold text-gray-900 mb-1">AML/KYC</div>
            <div className="text-sm text-green-600 font-semibold">✓ Compliant</div>
          </div>
          <div className="text-center p-6 bg-gray-50 rounded-xl border hover:shadow-md transition-all">
            <Award className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <div className="text-xl font-bold text-gray-900 mb-1">ESMA</div>
            <div className="text-sm text-green-600 font-semibold">✓ Compliant</div>
          </div>
        </div>
      </div>

      {/* Risk Warning */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <div className="bg-amber-100 p-2 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h4 className="font-bold text-amber-800 mb-2">Important Risk Disclosure</h4>
            <p className="text-sm text-amber-700 leading-relaxed">
              Trading involves substantial risk of loss and may not be suitable for all investors. 
              Past performance is not indicative of future results. Leveraged trading can result in losses 
              exceeding your initial deposit. Please ensure you fully understand the risks involved and 
              seek independent financial advice if necessary. Only trade with money you can afford to lose.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
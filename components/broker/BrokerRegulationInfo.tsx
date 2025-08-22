'use client'

import { Broker } from '@/lib/supabase'
import { Shield, CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react'

interface BrokerRegulationInfoProps {
  broker: Broker
}

interface Regulator {
  name: string
  country: string
  license: string
  status: 'active' | 'pending' | 'suspended'
  description: string
  website: string
}

export default function BrokerRegulationInfo({ broker }: BrokerRegulationInfoProps) {
  // In a real implementation, this would come from the database
  const regulators: Regulator[] = [
    {
      name: 'Financial Conduct Authority',
      country: 'United Kingdom',
      license: 'FRN 509909',
      status: 'active',
      description: 'Authorized and regulated by the UK\'s premier financial regulator',
      website: 'https://www.fca.org.uk'
    },
    {
      name: 'Cyprus Securities and Exchange Commission',
      country: 'Cyprus',
      license: 'CIF 092/08',
      status: 'active',
      description: 'Licensed to provide investment services in the EU',
      website: 'https://www.cysec.gov.cy'
    },
    {
      name: 'Australian Securities and Investments Commission',
      country: 'Australia',
      license: 'AFSL 335692',
      status: 'active',
      description: 'Regulated by Australia\'s corporate regulator',
      website: 'https://www.asic.gov.au'
    }
  ]

  const protections = [
    {
      title: 'Segregated Client Funds',
      description: 'Client funds are held in segregated accounts separate from company funds',
      available: true
    },
    {
      title: 'Investor Compensation Scheme',
      description: 'Protection up to £85,000 per client under FSCS',
      available: true
    },
    {
      title: 'Negative Balance Protection',
      description: 'Clients cannot lose more than their account balance',
      available: true
    },
    {
      title: 'Professional Indemnity Insurance',
      description: 'Additional insurance coverage for professional liability',
      available: true
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100'
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'suspended':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
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

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Shield className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Regulation & Licensing</h2>
      </div>

      {/* Regulatory Overview */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">Regulatory Status</h3>
        <p className="text-blue-800 text-sm">
          {broker.name} is regulated by multiple tier-1 financial authorities, ensuring compliance 
          with strict financial standards and client protection measures.
        </p>
      </div>

      {/* Regulators List */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Regulatory Authorities</h3>
        <div className="space-y-4">
          {regulators.map((regulator, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-semibold text-gray-900">{regulator.name}</h4>
                    <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(regulator.status)}`}>
                      {getStatusIcon(regulator.status)}
                      <span className="capitalize">{regulator.status}</span>
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div><strong>Country:</strong> {regulator.country}</div>
                    <div><strong>License:</strong> {regulator.license}</div>
                    <div>{regulator.description}</div>
                  </div>
                </div>
                <a
                  href={regulator.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 ml-4"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Client Protections */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Client Protections</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {protections.map((protection, index) => (
            <div key={index} className={`border rounded-lg p-4 ${
              protection.available ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
            }`}>
              <div className="flex items-start space-x-3">
                <div className={`mt-1 ${
                  protection.available ? 'text-green-600' : 'text-gray-400'
                }`}>
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{protection.title}</h4>
                  <p className="text-sm text-gray-600">{protection.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance Information */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Compliance & Reporting</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 mb-1">MiFID II</div>
            <div className="text-sm text-gray-600">Compliant</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 mb-1">GDPR</div>
            <div className="text-sm text-gray-600">Compliant</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 mb-1">AML/KYC</div>
            <div className="text-sm text-gray-600">Compliant</div>
          </div>
        </div>
      </div>

      {/* Risk Warning */}
      <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-amber-800 mb-1">Risk Warning</h4>
            <p className="text-sm text-amber-700">
              Trading involves substantial risk of loss and may not be suitable for all investors. 
              Past performance is not indicative of future results. Please ensure you fully understand 
              the risks involved and seek independent advice if necessary.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
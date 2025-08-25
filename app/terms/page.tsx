import { Metadata } from 'next'
import { FileText, AlertTriangle, Scale, Shield, Users, Globe } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service | Brokeranalysis',
  description: 'Read our Terms of Service to understand the rules and guidelines for using Brokeranalysis platform and services.',
  robots: 'index, follow',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <FileText className="w-12 h-12 text-yellow-300 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold">Terms of Service</h1>
            </div>
            <p className="text-xl text-blue-100">
              Please read these terms carefully before using our services.
            </p>
            <div className="mt-6 text-sm text-blue-200">
              Last updated: January 24, 2025
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            {/* Introduction */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Agreement to Terms</h2>
              <p className="text-lg text-gray-700 mb-4">
                These Terms of Service ("Terms") govern your use of the Brokeranalysis website and services operated by Brokeranalysis ("we," "our," or "us").
              </p>
              <p className="text-lg text-gray-700">
                By accessing or using our service, you agree to be bound by these Terms. If you disagree with any part of these terms, you may not access the service.
              </p>
            </div>

            {/* Acceptance */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <Scale className="w-8 h-8 text-blue-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">Acceptance of Terms</h2>
              </div>
              
              <p className="text-gray-700 mb-4">
                By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. Additionally, when using this website's particular services, you shall be subject to any posted guidelines or rules applicable to such services.
              </p>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mr-2 mt-0.5" />
                  <p className="text-amber-800">
                    <strong>Important:</strong> If you do not agree to abide by the above, please do not use this service.
                  </p>
                </div>
              </div>
            </div>

            {/* Use License */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <Shield className="w-8 h-8 text-green-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">Use License</h2>
              </div>
              
              <p className="text-gray-700 mb-4">
                Permission is granted to temporarily download one copy of the materials on Brokeranalysis's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to reverse engineer any software contained on the website</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
              </ul>
              
              <p className="text-gray-700">
                This license shall automatically terminate if you violate any of these restrictions and may be terminated by Brokeranalysis at any time.
              </p>
            </div>

            {/* Disclaimer */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <AlertTriangle className="w-8 h-8 text-red-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">Disclaimer</h2>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-red-900 mb-3">Investment Risk Warning</h3>
                <p className="text-red-800 mb-2">
                  Trading forex, CFDs, and other financial instruments involves substantial risk and may not be suitable for all investors. You could lose some or all of your invested capital.
                </p>
                <p className="text-red-800">
                  Past performance is not indicative of future results. Please ensure you fully understand the risks involved and seek independent advice if necessary.
                </p>
              </div>
              
              <p className="text-gray-700 mb-4">
                The materials on Brokeranalysis's website are provided on an 'as is' basis. Brokeranalysis makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation:
              </p>
              
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Implied warranties or conditions of merchantability</li>
                <li>Fitness for a particular purpose</li>
                <li>Non-infringement of intellectual property or other violation of rights</li>
                <li>Accuracy, completeness, or timeliness of information</li>
              </ul>
            </div>

            {/* Limitations */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Limitations</h2>
              <p className="text-gray-700 mb-4">
                In no event shall Brokeranalysis or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Brokeranalysis's website, even if Brokeranalysis or an authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
              <p className="text-gray-700">
                Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.
              </p>
            </div>

            {/* User Conduct */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <Users className="w-8 h-8 text-purple-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">User Conduct</h2>
              </div>
              
              <p className="text-gray-700 mb-4">You agree not to use the service to:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Upload, post, or transmit any content that is unlawful, harmful, or offensive</li>
                <li>Impersonate any person or entity or misrepresent your affiliation</li>
                <li>Interfere with or disrupt the service or servers</li>
                <li>Attempt to gain unauthorized access to any portion of the website</li>
                <li>Use automated systems to access the website without permission</li>
                <li>Violate any applicable local, state, national, or international law</li>
              </ul>
            </div>

            {/* Affiliate Disclosure */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Affiliate Disclosure</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <p className="text-blue-800 mb-4">
                  <strong>Important Disclosure:</strong> Brokeranalysis may receive compensation when you click on links to broker websites or sign up for services through our platform.
                </p>
                <ul className="list-disc list-inside text-blue-800 space-y-1 ml-4">
                  <li>This compensation helps us maintain our free services</li>
                  <li>Our reviews and recommendations remain independent and unbiased</li>
                  <li>We clearly mark affiliate links where applicable</li>
                  <li>Compensation does not influence our broker rankings or reviews</li>
                </ul>
              </div>
            </div>

            {/* Intellectual Property */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Intellectual Property Rights</h2>
              <p className="text-gray-700 mb-4">
                The service and its original content, features, and functionality are and will remain the exclusive property of Brokeranalysis and its licensors. The service is protected by copyright, trademark, and other laws.
              </p>
              <p className="text-gray-700">
                Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.
              </p>
            </div>

            {/* Termination */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Termination</h2>
              <p className="text-gray-700 mb-4">
                We may terminate or suspend your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
              <p className="text-gray-700">
                Upon termination, your right to use the service will cease immediately.
              </p>
            </div>

            {/* Governing Law */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <Globe className="w-8 h-8 text-indigo-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">Governing Law</h2>
              </div>
              
              <p className="text-gray-700">
                These Terms shall be interpreted and governed by the laws of the jurisdiction in which Brokeranalysis operates, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
              </p>
            </div>

            {/* Changes to Terms */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Changes to Terms</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
              </p>
              <p className="text-gray-700">
                What constitutes a material change will be determined at our sole discretion. By continuing to access or use our service after those revisions become effective, you agree to be bound by the revised terms.
              </p>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-50 rounded-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> legal@brokeranalysis.com</p>
                <p><strong>Address:</strong> Brokeranalysis Legal Department</p>
                <p><strong>Response Time:</strong> We aim to respond within 5 business days</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

import { Metadata } from 'next'
import { Shield, Eye, Lock, Users, Database, Globe } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy | Brokeranalysis',
  description: 'Learn how Brokeranalysis protects your privacy and handles your personal data. Our comprehensive privacy policy explains our data practices.',
  robots: 'index, follow',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <Shield className="w-12 h-12 text-yellow-300 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold">Privacy Policy</h1>
            </div>
            <p className="text-xl text-blue-100">
              Your privacy is important to us. Learn how we protect and handle your data.
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
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Introduction</h2>
              <p className="text-lg text-gray-700 mb-4">
                Brokeranalysis ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
              </p>
              <p className="text-lg text-gray-700">
                By using our website, you consent to the data practices described in this policy.
              </p>
            </div>

            {/* Information We Collect */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <Database className="w-8 h-8 text-blue-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">Information We Collect</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Personal Information</h3>
                  <p className="text-gray-700 mb-2">We may collect personal information that you provide directly to us, including:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>Name and contact information (email address, phone number)</li>
                    <li>Trading experience and preferences</li>
                    <li>Account information for personalized recommendations</li>
                    <li>Communication preferences</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Automatically Collected Information</h3>
                  <p className="text-gray-700 mb-2">We automatically collect certain information when you visit our website:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>IP address and location data</li>
                    <li>Browser type and version</li>
                    <li>Device information and operating system</li>
                    <li>Pages visited and time spent on our site</li>
                    <li>Referral sources and search terms</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Cookies and Tracking Technologies</h3>
                  <p className="text-gray-700">
                    We use cookies, web beacons, and similar tracking technologies to enhance your experience and analyze website usage. You can control cookie settings through your browser preferences.
                  </p>
                </div>
              </div>
            </div>

            {/* How We Use Information */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <Eye className="w-8 h-8 text-green-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">How We Use Your Information</h2>
              </div>
              
              <p className="text-gray-700 mb-4">We use the information we collect for the following purposes:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Provide personalized broker recommendations</li>
                <li>Improve our website and services</li>
                <li>Send newsletters and marketing communications (with your consent)</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Analyze website usage and performance</li>
                <li>Comply with legal obligations</li>
                <li>Prevent fraud and ensure website security</li>
              </ul>
            </div>

            {/* Information Sharing */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <Users className="w-8 h-8 text-purple-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">Information Sharing and Disclosure</h2>
              </div>
              
              <p className="text-gray-700 mb-4">We may share your information in the following circumstances:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><strong>Affiliate Partners:</strong> When you click on broker links, we may share limited information to track referrals</li>
                <li><strong>Service Providers:</strong> With third-party vendors who help us operate our website and services</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
              </ul>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <p className="text-blue-800 font-medium">
                  We do not sell, rent, or trade your personal information to third parties for their marketing purposes.
                </p>
              </div>
            </div>

            {/* Data Security */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <Lock className="w-8 h-8 text-red-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">Data Security</h2>
              </div>
              
              <p className="text-gray-700 mb-4">
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Technical Measures</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• SSL/TLS encryption</li>
                    <li>• Secure data storage</li>
                    <li>• Regular security audits</li>
                    <li>• Access controls</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Organizational Measures</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Staff training</li>
                    <li>• Data minimization</li>
                    <li>• Regular policy updates</li>
                    <li>• Incident response procedures</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Your Rights */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <Globe className="w-8 h-8 text-indigo-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">Your Rights and Choices</h2>
              </div>
              
              <p className="text-gray-700 mb-4">You have the following rights regarding your personal information:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><strong>Access:</strong> Request access to your personal information</li>
                <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                <li><strong>Cookie Control:</strong> Manage cookie preferences through your browser</li>
              </ul>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
                <p className="text-green-800">
                  <strong>To exercise your rights:</strong> Contact us at privacy@brokeranalysis.com
                </p>
              </div>
            </div>

            {/* International Transfers */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">International Data Transfers</h2>
              <p className="text-gray-700 mb-4">
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with applicable privacy laws.
              </p>
            </div>

            {/* Children's Privacy */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Children's Privacy</h2>
              <p className="text-gray-700">
                Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children under 18. If you become aware that a child has provided us with personal information, please contact us.
              </p>
            </div>

            {/* Changes to Policy */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Changes to This Privacy Policy</h2>
              <p className="text-gray-700">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically.
              </p>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-50 rounded-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> privacy@brokeranalysis.com</p>
                <p><strong>Address:</strong> Brokeranalysis Privacy Team</p>
                <p><strong>Response Time:</strong> We aim to respond within 30 days</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

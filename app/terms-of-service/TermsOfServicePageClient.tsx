'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Scale, 
  AlertTriangle, 
  Shield, 
  Users, 
  Globe, 
  Calendar,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Gavel,
  Lock,
  Eye
} from 'lucide-react';

export default function TermsOfServicePageClient() {
  const lastUpdated = 'January 15, 2025';
  const effectiveDate = 'January 15, 2025';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Scale className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            These terms govern your use of Brokeranalysis platform and services. 
            Please read them carefully before using our platform.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge className="px-4 py-2 text-blue-600 bg-blue-100">
              <Gavel className="w-4 h-4 mr-2" />
              Legally Binding
            </Badge>
            <Badge className="px-4 py-2 text-green-600 bg-green-100">
              <Shield className="w-4 h-4 mr-2" />
              User Protected
            </Badge>
            <Badge className="px-4 py-2 text-purple-600 bg-purple-100">
              <Globe className="w-4 h-4 mr-2" />
              Global Coverage
            </Badge>
          </div>
        </div>

        {/* Last Updated */}
        <Card className="mb-8">
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-600" />
                <span className="text-gray-600">Last Updated: {lastUpdated}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-600">Effective Date: {effectiveDate}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg">Table of Contents</CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  {[
                    { id: 'acceptance', title: 'Acceptance of Terms' },
                    { id: 'description', title: 'Service Description' },
                    { id: 'user-accounts', title: 'User Accounts' },
                    { id: 'acceptable-use', title: 'Acceptable Use' },
                    { id: 'prohibited-activities', title: 'Prohibited Activities' },
                    { id: 'disclaimers', title: 'Disclaimers' },
                    { id: 'limitation-liability', title: 'Limitation of Liability' },
                    { id: 'intellectual-property', title: 'Intellectual Property' },
                    { id: 'privacy', title: 'Privacy & Data' },
                    { id: 'termination', title: 'Termination' },
                    { id: 'governing-law', title: 'Governing Law' },
                    { id: 'changes', title: 'Changes to Terms' },
                    { id: 'contact', title: 'Contact Information' }
                  ].map(item => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="block text-sm text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      {item.title}
                    </a>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Acceptance of Terms */}
            <Card id="acceptance">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gavel className="w-5 h-5" />
                  Acceptance of Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  By accessing and using Brokeranalysis ("the Service"), you accept and agree to be bound by the 
                  terms and provision of this agreement. If you do not agree to abide by the above, please do not 
                  use this service.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  These Terms of Service ("Terms") constitute a legally binding agreement between you ("User" or "you") 
                  and Brokeranalysis ("we," "us," or "our") regarding your use of our website, services, and applications.
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-amber-900 mb-1">Important Notice</h4>
                      <p className="text-amber-800 text-sm">
                        By using our service, you acknowledge that you have read, understood, and agree to be bound by these Terms. 
                        If you are using the service on behalf of an organization, you represent that you have the authority to bind that organization.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Service Description */}
            <Card id="description">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Service Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Brokeranalysis is an AI-powered platform that provides broker recommendations, comparisons, 
                  and educational content for traders and investors.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Our Services Include:</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-1" />
                        <span>AI-powered broker recommendations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-1" />
                        <span>Comprehensive broker comparisons</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-1" />
                        <span>Trust scores and ratings</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-1" />
                        <span>Educational content and market insights</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-1" />
                        <span>API access for developers</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-3">Service Limitations:</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-red-600 mt-1" />
                        <span>We do not provide financial advice</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-red-600 mt-1" />
                        <span>We are not a licensed broker or dealer</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-red-600 mt-1" />
                        <span>We do not execute trades or hold funds</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-red-600 mt-1" />
                        <span>Information is for educational purposes only</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Accounts */}
            <Card id="user-accounts">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  User Accounts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Account Registration</h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      To access certain features of our service, you may be required to create an account. 
                      You agree to provide accurate, current, and complete information during registration.
                    </p>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600 mt-1" />
                        <span>You must be at least 18 years old to create an account</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600 mt-1" />
                        <span>You are responsible for maintaining account security</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600 mt-1" />
                        <span>You must notify us immediately of any unauthorized access</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600 mt-1" />
                        <span>One person may not maintain multiple accounts</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Account Security</h4>
                    <p className="text-blue-800 text-sm">
                      You are solely responsible for maintaining the confidentiality of your account credentials. 
                      We recommend using strong passwords and enabling two-factor authentication when available.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Acceptable Use */}
            <Card id="acceptable-use">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Acceptable Use Policy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-6">
                  You agree to use our service only for lawful purposes and in accordance with these Terms. 
                  You are responsible for your conduct and any content you submit.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Permitted Uses
                    </h3>
                    <ul className="space-y-2 text-green-800 text-sm">
                      <li>• Research and compare brokers for personal use</li>
                      <li>• Access educational content and market insights</li>
                      <li>• Use our API within rate limits</li>
                      <li>• Share content with proper attribution</li>
                      <li>• Provide feedback and suggestions</li>
                    </ul>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                      <XCircle className="w-5 h-5" />
                      Prohibited Uses
                    </h3>
                    <ul className="space-y-2 text-red-800 text-sm">
                      <li>• Scraping or automated data collection</li>
                      <li>• Reverse engineering our algorithms</li>
                      <li>• Creating fake accounts or impersonation</li>
                      <li>• Distributing malware or harmful code</li>
                      <li>• Violating intellectual property rights</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Disclaimers */}
            <Card id="disclaimers">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Important Disclaimers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <h3 className="font-semibold text-amber-900 mb-3">Financial Disclaimer</h3>
                    <p className="text-amber-800 text-sm leading-relaxed">
                      Brokeranalysis is not a financial advisor, broker, or investment company. We provide information 
                      and tools for educational purposes only. All trading involves risk, and you should never trade 
                      with money you cannot afford to lose. Past performance does not guarantee future results.
                    </p>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="font-semibold text-red-900 mb-3">No Investment Advice</h3>
                    <p className="text-red-800 text-sm leading-relaxed">
                      Our recommendations and content are not personalized investment advice. We do not consider your 
                      individual financial situation, investment objectives, or risk tolerance. Always consult with 
                      qualified financial professionals before making investment decisions.
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-3">Information Accuracy</h3>
                    <p className="text-blue-800 text-sm leading-relaxed">
                      While we strive to provide accurate and up-to-date information, we cannot guarantee the 
                      completeness, accuracy, or timeliness of all content. Broker terms, conditions, and offerings 
                      may change without notice. Always verify information directly with brokers.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Limitation of Liability */}
            <Card id="limitation-liability">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="w-5 h-5" />
                  Limitation of Liability
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-6">
                  To the maximum extent permitted by law, Brokeranalysis shall not be liable for any indirect, 
                  incidental, special, consequential, or punitive damages.
                </p>
                
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Excluded Damages</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Loss of profits or revenue</li>
                      <li>• Loss of data or information</li>
                      <li>• Business interruption</li>
                      <li>• Trading losses or missed opportunities</li>
                      <li>• Consequential or indirect damages</li>
                    </ul>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Maximum Liability</h4>
                    <p className="text-sm text-gray-600">
                      Our total liability to you for any claims arising from your use of our service shall not 
                      exceed the amount you paid us in the twelve (12) months preceding the claim, or $100, 
                      whichever is greater.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Intellectual Property */}
            <Card id="intellectual-property">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Intellectual Property Rights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Our Content</h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      All content, features, and functionality of our service, including but not limited to text, 
                      graphics, logos, algorithms, and software, are owned by Brokeranalysis and protected by 
                      copyright, trademark, and other intellectual property laws.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-3">Your Content</h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      You retain ownership of any content you submit to our service. However, by submitting content, 
                      you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and distribute 
                      your content in connection with our service.
                    </p>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Permitted Use</h4>
                    <p className="text-sm text-gray-600">
                      You may use our content for personal, non-commercial purposes. Any commercial use requires 
                      our prior written consent. You may not reproduce, distribute, or create derivative works 
                      without permission.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Termination */}
            <Card id="termination">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <XCircle className="w-5 h-5" />
                  Termination
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Termination by You</h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      You may terminate your account at any time by contacting us or using the account deletion 
                      feature in your account settings. Upon termination, your right to use the service will cease immediately.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-3">Termination by Us</h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      We may terminate or suspend your account immediately, without prior notice, if you breach 
                      these Terms or engage in conduct that we determine to be harmful to our service or other users.
                    </p>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-900 mb-2">Effect of Termination</h4>
                    <p className="text-yellow-800 text-sm">
                      Upon termination, all provisions of these Terms that by their nature should survive termination 
                      shall survive, including ownership provisions, warranty disclaimers, and limitations of liability.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card id="contact">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-6">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-blue-600 mt-1" />
                      <div>
                        <h4 className="font-semibold mb-1">Email</h4>
                        <p className="text-gray-600">legal@brokeranalysis.com</p>
                        <p className="text-sm text-gray-500">For legal and terms-related inquiries</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-green-600 mt-1" />
                      <div>
                        <h4 className="font-semibold mb-1">Phone</h4>
                        <p className="text-gray-600">(801)-893-2577</p>
                        <p className="text-sm text-gray-500">Business hours: 9 AM - 5 PM EST</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-purple-600 mt-1" />
                      <div>
                        <h4 className="font-semibold mb-1">Mailing Address</h4>
                        <p className="text-gray-600">
                          30 N Gould St Ste R<br />
                          Sheridan, WY 82801<br />
                          United States
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Globe className="w-5 h-5 text-orange-600 mt-1" />
                      <div>
                        <h4 className="font-semibold mb-1">Legal Department</h4>
                        <p className="text-gray-600">legal@brokeranalysis.com</p>
                        <p className="text-sm text-gray-500">For formal legal notices</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>EIN:</strong> 384298140 | 
                    <strong>Last Updated:</strong> {lastUpdated} | 
                    <strong>Effective Date:</strong> {effectiveDate}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
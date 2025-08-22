'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Lock, 
  Eye, 
  Database, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  FileText,
  Users,
  Globe
} from 'lucide-react';

export default function PrivacyPolicyPageClient() {
  const lastUpdated = 'January 15, 2025';
  const effectiveDate = 'January 15, 2025';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Your privacy is important to us. This policy explains how Brokeranalysis collects, 
            uses, and protects your personal information.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge className="px-4 py-2 text-green-600 bg-green-100">
              <CheckCircle className="w-4 h-4 mr-2" />
              GDPR Compliant
            </Badge>
            <Badge className="px-4 py-2 text-blue-600 bg-blue-100">
              <Lock className="w-4 h-4 mr-2" />
              Data Encrypted
            </Badge>
            <Badge className="px-4 py-2 text-purple-600 bg-purple-100">
              <Eye className="w-4 h-4 mr-2" />
              Transparent
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
                <AlertCircle className="w-5 h-5 text-blue-600" />
                <span className="text-blue-600">Effective Date: {effectiveDate}</span>
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
                    { id: 'overview', title: 'Overview' },
                    { id: 'information-collection', title: 'Information We Collect' },
                    { id: 'information-use', title: 'How We Use Information' },
                    { id: 'information-sharing', title: 'Information Sharing' },
                    { id: 'data-security', title: 'Data Security' },
                    { id: 'cookies', title: 'Cookies & Tracking' },
                    { id: 'user-rights', title: 'Your Rights' },
                    { id: 'data-retention', title: 'Data Retention' },
                    { id: 'international-transfers', title: 'International Transfers' },
                    { id: 'children-privacy', title: 'Children\'s Privacy' },
                    { id: 'policy-changes', title: 'Policy Changes' },
                    { id: 'contact', title: 'Contact Us' }
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
            {/* Overview */}
            <Card id="overview">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Brokeranalysis ("we," "our," or "us") is committed to protecting your privacy and personal information. 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you 
                  visit our website and use our services.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  By using our services, you agree to the collection and use of information in accordance with this policy. 
                  We will not use or share your information with anyone except as described in this Privacy Policy.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">Important Note</h4>
                      <p className="text-blue-800 text-sm">
                        This policy applies to all users of Brokeranalysis services, including our website, 
                        API, and any related applications or services we provide.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Information We Collect */}
            <Card id="information-collection">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Personal Information</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-1" />
                        <span>Name and email address when you create an account</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-1" />
                        <span>Trading preferences and experience level</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-1" />
                        <span>Country of residence for regulatory compliance</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-1" />
                        <span>Communication preferences and subscription settings</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-3">Usage Information</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-1" />
                        <span>Pages visited and features used on our platform</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-1" />
                        <span>Search queries and broker comparisons</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-1" />
                        <span>Time spent on different sections of our website</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-1" />
                        <span>Device information and browser type</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-3">Technical Information</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-1" />
                        <span>IP address and approximate location</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-1" />
                        <span>Cookies and similar tracking technologies</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-1" />
                        <span>Referral sources and marketing campaign data</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* How We Use Information */}
            <Card id="information-use">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Service Provision</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600 mt-1" />
                        <span>Provide personalized broker recommendations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600 mt-1" />
                        <span>Maintain and improve our platform</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600 mt-1" />
                        <span>Process and respond to your inquiries</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600 mt-1" />
                        <span>Send important service notifications</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Analytics & Improvement</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-purple-600 mt-1" />
                        <span>Analyze usage patterns and preferences</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-purple-600 mt-1" />
                        <span>Improve our recommendation algorithms</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-purple-600 mt-1" />
                        <span>Develop new features and services</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-purple-600 mt-1" />
                        <span>Ensure platform security and prevent fraud</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Security */}
            <Card id="data-security">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Data Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-6">
                  We implement industry-standard security measures to protect your personal information 
                  against unauthorized access, alteration, disclosure, or destruction.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Technical Safeguards
                    </h3>
                    <ul className="space-y-2 text-green-800 text-sm">
                      <li>• SSL/TLS encryption for data transmission</li>
                      <li>• AES-256 encryption for data at rest</li>
                      <li>• Regular security audits and penetration testing</li>
                      <li>• Secure cloud infrastructure with AWS/Google Cloud</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Administrative Safeguards
                    </h3>
                    <ul className="space-y-2 text-blue-800 text-sm">
                      <li>• Limited access on a need-to-know basis</li>
                      <li>• Employee training on data protection</li>
                      <li>• Regular access reviews and monitoring</li>
                      <li>• Incident response and breach notification procedures</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card id="user-rights">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Your Privacy Rights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Under applicable data protection laws (including GDPR and CCPA), you have the following rights 
                  regarding your personal information:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Eye className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Right to Access</h4>
                        <p className="text-sm text-gray-600">Request a copy of the personal information we hold about you.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Right to Rectification</h4>
                        <p className="text-sm text-gray-600">Request correction of inaccurate or incomplete information.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <XCircle className="w-4 h-4 text-red-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Right to Erasure</h4>
                        <p className="text-sm text-gray-600">Request deletion of your personal information under certain circumstances.</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Database className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Right to Portability</h4>
                        <p className="text-sm text-gray-600">Request transfer of your data to another service provider.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Right to Object</h4>
                        <p className="text-sm text-gray-600">Object to processing of your personal information for certain purposes.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Lock className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Right to Restrict</h4>
                        <p className="text-sm text-gray-600">Request restriction of processing under certain circumstances.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">How to Exercise Your Rights</h4>
                  <p className="text-blue-800 text-sm mb-2">
                    To exercise any of these rights, please contact us at privacy@brokeranalysis.com. 
                    We will respond to your request within 30 days.
                  </p>
                  <p className="text-blue-800 text-sm">
                    You may also have the right to lodge a complaint with a supervisory authority if you 
                    believe we have not handled your personal information appropriately.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card id="contact">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Contact Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-6">
                  If you have any questions about this Privacy Policy or our data practices, 
                  please don't hesitate to contact us:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-blue-600 mt-1" />
                      <div>
                        <h4 className="font-semibold mb-1">Email</h4>
                        <p className="text-gray-600">privacy@brokeranalysis.com</p>
                        <p className="text-sm text-gray-500">For privacy-related inquiries</p>
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
                        <h4 className="font-semibold mb-1">Data Protection Officer</h4>
                        <p className="text-gray-600">dpo@brokeranalysis.com</p>
                        <p className="text-sm text-gray-500">For GDPR-related matters</p>
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
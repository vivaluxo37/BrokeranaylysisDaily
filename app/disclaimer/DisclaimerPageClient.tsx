'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  Shield, 
  TrendingDown, 
  DollarSign, 
  Globe, 
  Calendar,
  Info,
  ExternalLink,
  FileText,
  Scale,
  Eye,
  Users,
  Building,
  Gavel,
  Lock,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

export default function DisclaimerPageClient() {
  const lastUpdated = 'January 15, 2025';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Important Disclaimer
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Please read this disclaimer carefully before using Brokeranalysis. 
            Understanding these risks and limitations is essential for making informed decisions.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge className="px-4 py-2 text-red-600 bg-red-100">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Risk Warning
            </Badge>
            <Badge className="px-4 py-2 text-orange-600 bg-orange-100">
              <TrendingDown className="w-4 h-4 mr-2" />
              Trading Risks
            </Badge>
            <Badge className="px-4 py-2 text-blue-600 bg-blue-100">
              <Info className="w-4 h-4 mr-2" />
              Educational Only
            </Badge>
          </div>
        </div>

        {/* Last Updated */}
        <Card className="mb-8">
          <CardContent className="py-6">
            <div className="flex items-center justify-center gap-2">
              <Calendar className="w-5 h-5 text-gray-600" />
              <span className="text-gray-600">Last Updated: {lastUpdated}</span>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg">Quick Navigation</CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  {[
                    { id: 'general-disclaimer', title: 'General Disclaimer' },
                    { id: 'risk-warning', title: 'Risk Warning' },
                    { id: 'no-financial-advice', title: 'No Financial Advice' },
                    { id: 'information-accuracy', title: 'Information Accuracy' },
                    { id: 'third-party-content', title: 'Third-Party Content' },
                    { id: 'regulatory-notice', title: 'Regulatory Notice' },
                    { id: 'limitation-liability', title: 'Limitation of Liability' },
                    { id: 'jurisdiction', title: 'Jurisdiction' },
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
            {/* General Disclaimer */}
            <Card id="general-disclaimer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  General Disclaimer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-6 h-6 text-red-600 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-red-900 mb-2 text-lg">Important Notice</h3>
                        <p className="text-red-800 leading-relaxed">
                          Brokeranalysis is an informational platform that provides broker comparisons, reviews, 
                          and educational content. We are NOT a licensed financial advisor, broker-dealer, 
                          investment advisor, or financial institution. All information provided is for 
                          educational and informational purposes only.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed mb-4">
                      The content on this website, including but not limited to broker reviews, comparisons, 
                      trust scores, and recommendations, represents our opinions and research findings. These 
                      should not be construed as personalized investment advice or recommendations to buy, 
                      sell, or hold any financial instruments.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      By using our platform, you acknowledge that you understand and accept the risks 
                      associated with trading and investing, and that you will make your own independent 
                      decisions based on your own research and due diligence.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk Warning */}
            <Card id="risk-warning">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5" />
                  Risk Warning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                    <h3 className="font-semibold text-orange-900 mb-3 text-lg flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Trading and Investment Risks
                    </h3>
                    <p className="text-orange-800 leading-relaxed mb-4">
                      Trading in financial markets involves substantial risk of loss and is not suitable for all investors. 
                      You should carefully consider your investment objectives, level of experience, and risk appetite 
                      before engaging in any trading activity.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg">Key Risk Factors:</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-600 mt-1" />
                          <span>You may lose some or all of your invested capital</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-600 mt-1" />
                          <span>Past performance does not guarantee future results</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-600 mt-1" />
                          <span>Market volatility can result in rapid losses</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-600 mt-1" />
                          <span>Leverage amplifies both gains and losses</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-600 mt-1" />
                          <span>Currency and interest rate fluctuations</span>
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg">Specific Market Risks:</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <TrendingDown className="w-4 h-4 text-orange-600 mt-1" />
                          <span><strong>Forex:</strong> High volatility and leverage risks</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <TrendingDown className="w-4 h-4 text-orange-600 mt-1" />
                          <span><strong>CFDs:</strong> Complex instruments with high risk</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <TrendingDown className="w-4 h-4 text-orange-600 mt-1" />
                          <span><strong>Crypto:</strong> Extreme volatility and regulatory uncertainty</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <TrendingDown className="w-4 h-4 text-orange-600 mt-1" />
                          <span><strong>Commodities:</strong> Price volatility and storage costs</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <TrendingDown className="w-4 h-4 text-orange-600 mt-1" />
                          <span><strong>Stocks:</strong> Company and market-specific risks</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-900 mb-2">Risk Management Advice</h4>
                    <p className="text-yellow-800 text-sm">
                      Never invest money you cannot afford to lose. Consider using stop-loss orders, 
                      diversifying your portfolio, and starting with small amounts until you gain experience. 
                      Always seek independent financial advice if you are unsure about any investment decision.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* No Financial Advice */}
            <Card id="no-financial-advice">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="w-5 h-5" />
                  No Financial Advice
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="font-semibold text-blue-900 mb-3 text-lg">Educational Content Only</h3>
                    <p className="text-blue-800 leading-relaxed">
                      All content provided on Brokeranalysis, including broker reviews, comparisons, trust scores, 
                      and market analysis, is intended for educational and informational purposes only. This content 
                      does not constitute financial, investment, trading, or any other type of advice.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-lg mb-3">What We Provide:</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <Info className="w-4 h-4 text-blue-600 mt-1" />
                          <span>General information about brokers and trading platforms</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Info className="w-4 h-4 text-blue-600 mt-1" />
                          <span>Comparative analysis based on publicly available data</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Info className="w-4 h-4 text-blue-600 mt-1" />
                          <span>Educational content about trading concepts</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Info className="w-4 h-4 text-blue-600 mt-1" />
                          <span>Market insights and industry trends</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-lg mb-3">What We Don't Provide:</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-600 mt-1" />
                          <span>Personalized investment recommendations</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-600 mt-1" />
                          <span>Financial planning or advisory services</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-600 mt-1" />
                          <span>Tax or legal advice</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-600 mt-1" />
                          <span>Guaranteed returns or profit predictions</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Seek Professional Advice</h4>
                    <p className="text-sm text-gray-600">
                      Before making any financial decisions, we strongly recommend consulting with qualified 
                      financial advisors, tax professionals, or legal experts who can provide personalized 
                      advice based on your individual circumstances and objectives.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Information Accuracy */}
            <Card id="information-accuracy">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Information Accuracy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <p className="text-gray-700 leading-relaxed">
                    While we strive to provide accurate and up-to-date information, we cannot guarantee 
                    the completeness, accuracy, reliability, or timeliness of all content on our platform.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="font-semibold text-yellow-900 mb-3">Information Sources</h4>
                      <ul className="space-y-2 text-yellow-800 text-sm">
                        <li>• Publicly available broker information</li>
                        <li>• Regulatory filings and disclosures</li>
                        <li>• Third-party data providers</li>
                        <li>• User reviews and feedback</li>
                        <li>• Market data and analysis</li>
                      </ul>
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h4 className="font-semibold text-red-900 mb-3">Potential Limitations</h4>
                      <ul className="space-y-2 text-red-800 text-sm">
                        <li>• Information may become outdated</li>
                        <li>• Broker terms and conditions change frequently</li>
                        <li>• Market conditions affect trading conditions</li>
                        <li>• Regulatory changes impact broker operations</li>
                        <li>• Technical errors may occur</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Verification Responsibility</h4>
                    <p className="text-blue-800 text-sm">
                      Users are responsible for verifying all information directly with brokers before making 
                      any decisions. Always check current terms, conditions, fees, and regulatory status 
                      with the broker directly.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Third-Party Content */}
            <Card id="third-party-content">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="w-5 h-5" />
                  Third-Party Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <p className="text-gray-700 leading-relaxed">
                    Our platform may contain links to third-party websites, services, or content. 
                    We do not endorse, control, or assume responsibility for any third-party content.
                  </p>

                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">External Links</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Links to broker websites, regulatory bodies, and other external resources are 
                        provided for convenience only. We are not responsible for the content, privacy 
                        practices, or security of external websites.
                      </p>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Verify broker credentials independently</li>
                        <li>• Read all terms and conditions carefully</li>
                        <li>• Check regulatory status with relevant authorities</li>
                        <li>• Be cautious of phishing and fraudulent websites</li>
                      </ul>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">User-Generated Content</h4>
                      <p className="text-sm text-gray-600">
                        Reviews, comments, and other user-generated content represent the opinions of 
                        individual users and do not reflect our views. We do not verify the accuracy 
                        of user-submitted information.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Regulatory Notice */}
            <Card id="regulatory-notice">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Regulatory Notice
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                    <h3 className="font-semibold text-purple-900 mb-3 text-lg">Regulatory Compliance</h3>
                    <p className="text-purple-800 leading-relaxed">
                      Brokeranalysis operates as an informational platform and is not regulated as a 
                      financial services provider. We do not hold any financial licenses and do not 
                      provide regulated financial services.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-lg mb-3">Important Considerations:</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <Shield className="w-4 h-4 text-blue-600 mt-1" />
                          <span>Always verify broker regulatory status</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Shield className="w-4 h-4 text-blue-600 mt-1" />
                          <span>Check local laws and regulations</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Shield className="w-4 h-4 text-blue-600 mt-1" />
                          <span>Understand your local tax obligations</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Shield className="w-4 h-4 text-blue-600 mt-1" />
                          <span>Be aware of investor protection schemes</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-lg mb-3">Regulatory Bodies:</h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• <strong>US:</strong> SEC, CFTC, FINRA, NFA</li>
                        <li>• <strong>UK:</strong> FCA (Financial Conduct Authority)</li>
                        <li>• <strong>EU:</strong> ESMA, National Regulators</li>
                        <li>• <strong>Australia:</strong> ASIC</li>
                        <li>• <strong>Canada:</strong> IIROC, Provincial Regulators</li>
                        <li>• <strong>Others:</strong> Check local regulatory bodies</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Limitation of Liability */}
            <Card id="limitation-liability">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gavel className="w-5 h-5" />
                  Limitation of Liability
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h3 className="font-semibold text-red-900 mb-3 text-lg">Liability Exclusion</h3>
                    <p className="text-red-800 leading-relaxed">
                      To the maximum extent permitted by law, Brokeranalysis and its affiliates, directors, 
                      employees, and agents shall not be liable for any direct, indirect, incidental, 
                      special, consequential, or punitive damages arising from your use of our platform.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-lg mb-3">Excluded Damages:</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-600 mt-1" />
                          <span>Trading losses or missed opportunities</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-600 mt-1" />
                          <span>Loss of profits or revenue</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-600 mt-1" />
                          <span>Business interruption</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-600 mt-1" />
                          <span>Data loss or corruption</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-lg mb-3">Circumstances:</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <Info className="w-4 h-4 text-blue-600 mt-1" />
                          <span>Inaccurate or outdated information</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Info className="w-4 h-4 text-blue-600 mt-1" />
                          <span>Technical errors or system failures</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Info className="w-4 h-4 text-blue-600 mt-1" />
                          <span>Third-party actions or omissions</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Info className="w-4 h-4 text-blue-600 mt-1" />
                          <span>Broker-related issues or disputes</span>
                        </li>
                      </ul>
                    </div>
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
                  If you have any questions about this disclaimer or need clarification on any points, 
                  please contact us:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-blue-600 mt-1" />
                      <div>
                        <h4 className="font-semibold mb-1">Email</h4>
                        <p className="text-gray-600">legal@brokeranalysis.com</p>
                        <p className="text-sm text-gray-500">For legal and disclaimer inquiries</p>
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
                      <Building className="w-5 h-5 text-orange-600 mt-1" />
                      <div>
                        <h4 className="font-semibold mb-1">Business Information</h4>
                        <p className="text-gray-600">EIN: 384298140</p>
                        <p className="text-sm text-gray-500">Registered in Wyoming, USA</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-600 text-center">
                    This disclaimer was last updated on {lastUpdated} and may be updated from time to time. 
                    Please check this page regularly for any changes.
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
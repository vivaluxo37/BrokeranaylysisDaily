'use client';

import { useState } from 'react';
import { 
  Shield, 
  Scale, 
  FileText, 
  Users, 
  TrendingUp, 
  Globe, 
  CheckCircle, 
  AlertTriangle,
  BarChart3,
  Brain,
  Lock,
  Search,
  Award,
  Target,
  Zap,
  Eye,
  Database,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

const trustScoreComponents = [
  {
    category: 'Regulation & Licensing',
    weight: 25,
    icon: Shield,
    description: 'Regulatory compliance, licensing status, and oversight quality',
    factors: [
      'Tier 1 regulatory licenses (FCA, ASIC, CySEC)',
      'Regulatory history and compliance record',
      'Client fund protection measures',
      'Compensation scheme participation'
    ]
  },
  {
    category: 'Financial Stability',
    weight: 20,
    icon: TrendingUp,
    description: 'Company financial health and operational stability',
    factors: [
      'Company financial statements and audits',
      'Years in operation and track record',
      'Parent company backing and ownership',
      'Insurance coverage and capital adequacy'
    ]
  },
  {
    category: 'Trading Conditions',
    weight: 20,
    icon: BarChart3,
    description: 'Spreads, fees, execution quality, and trading environment',
    factors: [
      'Competitive spreads and commission rates',
      'Execution speed and slippage analysis',
      'Available trading instruments and markets',
      'Leverage options and margin requirements'
    ]
  },
  {
    category: 'Platform & Technology',
    weight: 15,
    icon: Zap,
    description: 'Trading platform quality, tools, and technological infrastructure',
    factors: [
      'Platform stability and uptime',
      'Mobile app functionality and features',
      'Charting tools and technical analysis',
      'API availability and algorithmic trading'
    ]
  },
  {
    category: 'Customer Service',
    weight: 10,
    icon: Users,
    description: 'Support quality, responsiveness, and customer satisfaction',
    factors: [
      'Support availability and response times',
      'Multiple contact methods and languages',
      'Educational resources and training',
      'Account management and onboarding'
    ]
  },
  {
    category: 'Transparency',
    weight: 10,
    icon: Eye,
    description: 'Information disclosure, fee transparency, and business practices',
    factors: [
      'Clear fee structure and cost disclosure',
      'Terms and conditions transparency',
      'Conflict of interest management',
      'Regular reporting and communication'
    ]
  }
];

const evaluationProcess = [
  {
    step: 1,
    title: 'Data Collection',
    icon: Database,
    description: 'We gather comprehensive data from multiple sources including regulatory filings, company reports, and real-time market data.',
    details: [
      'Regulatory database monitoring',
      'Financial statement analysis',
      'Real-time spread and execution tracking',
      'Customer feedback aggregation'
    ]
  },
  {
    step: 2,
    title: 'AI Analysis',
    icon: Brain,
    description: 'Our proprietary AI algorithms process and analyze the collected data to identify patterns and assess risk factors.',
    details: [
      'Natural language processing of regulatory documents',
      'Sentiment analysis of customer reviews',
      'Pattern recognition in trading conditions',
      'Anomaly detection in broker behavior'
    ]
  },
  {
    step: 3,
    title: 'Expert Review',
    icon: Search,
    description: 'Our team of financial experts manually reviews AI findings and conducts additional qualitative assessments.',
    details: [
      'CFA-certified analyst review',
      'Regulatory compliance verification',
      'Platform testing and evaluation',
      'Customer service assessment'
    ]
  },
  {
    step: 4,
    title: 'Score Calculation',
    icon: Target,
    description: 'Trust scores are calculated using our weighted methodology, with continuous updates as new data becomes available.',
    details: [
      'Weighted component scoring',
      'Historical performance tracking',
      'Peer comparison analysis',
      'Risk-adjusted rating calculation'
    ]
  },
  {
    step: 5,
    title: 'Continuous Monitoring',
    icon: Clock,
    description: 'We continuously monitor brokers for changes in regulatory status, financial health, and trading conditions.',
    details: [
      'Real-time regulatory alerts',
      'Daily spread monitoring',
      'Quarterly financial updates',
      'Customer feedback integration'
    ]
  }
];

const ratingScale = [
  { range: '90-100', label: 'Excellent', color: 'bg-green-500', description: 'Top-tier brokers with exceptional standards across all categories' },
  { range: '80-89', label: 'Very Good', color: 'bg-blue-500', description: 'High-quality brokers with strong performance in most areas' },
  { range: '70-79', label: 'Good', color: 'bg-yellow-500', description: 'Solid brokers with good overall performance and few concerns' },
  { range: '60-69', label: 'Fair', color: 'bg-orange-500', description: 'Adequate brokers with some areas for improvement' },
  { range: '50-59', label: 'Poor', color: 'bg-red-500', description: 'Below-average brokers with significant concerns' },
  { range: '0-49', label: 'Very Poor', color: 'bg-red-700', description: 'Brokers with serious issues that may pose risks to traders' }
];

export default function MethodologyPageClient() {
  const [activeSection, setActiveSection] = useState('overview');

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Our <span className="text-yellow-400">Methodology</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto mb-8">
              Discover how we evaluate brokers with scientific rigor, AI-powered analysis, 
              and complete transparency to deliver the most accurate trust scores in the industry.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                <Link href="#trust-score">Trust Score Breakdown</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-900">
                <Link href="#process">Evaluation Process</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="bg-white border-b border-gray-200 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'trust-score', label: 'Trust Score' },
              { id: 'process', label: 'Process' },
              { id: 'rating-scale', label: 'Rating Scale' },
              { id: 'transparency', label: 'Transparency' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeSection === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </section>

      {/* Overview Section */}
      {activeSection === 'overview' && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Evidence-Based Broker Analysis</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our methodology combines quantitative data analysis with qualitative expert assessment 
                to provide the most comprehensive broker evaluations available.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <Card>
                <CardHeader>
                  <div className="flex items-center">
                    <Database className="w-8 h-8 text-blue-600 mr-3" />
                    <CardTitle>Data-Driven</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    We analyze over 200 data points per broker, including regulatory filings, 
                    financial statements, real-time trading conditions, and customer feedback.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center">
                    <Brain className="w-8 h-8 text-blue-600 mr-3" />
                    <CardTitle>AI-Powered</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Advanced machine learning algorithms process vast amounts of information 
                    to identify patterns and risks that human analysis might miss.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center">
                    <Eye className="w-8 h-8 text-blue-600 mr-3" />
                    <CardTitle>Transparent</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Every score is backed by clear evidence and reasoning. We disclose our 
                    methodology, data sources, and any potential conflicts of interest.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Key Principles</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Independence</h4>
                    <p className="text-gray-600">Our ratings are not influenced by advertising relationships or broker partnerships.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Objectivity</h4>
                    <p className="text-gray-600">We use standardized criteria and quantitative metrics to ensure fair comparisons.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Continuous Updates</h4>
                    <p className="text-gray-600">Scores are updated regularly as new information becomes available.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Global Coverage</h4>
                    <p className="text-gray-600">We evaluate brokers from all major financial jurisdictions worldwide.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Trust Score Section */}
      {activeSection === 'trust-score' && (
        <section id="trust-score" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Trust Score Components</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our 100-point trust score is calculated using six weighted categories, 
                each reflecting critical aspects of broker quality and reliability.
              </p>
            </div>

            <div className="space-y-8">
              {trustScoreComponents.map((component, index) => {
                const Icon = component.icon;
                return (
                  <Card key={index} className="overflow-hidden">
                    <CardHeader className="bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Icon className="w-8 h-8 text-blue-600 mr-4" />
                          <div>
                            <CardTitle className="text-xl">{component.category}</CardTitle>
                            <CardDescription className="text-base">{component.description}</CardDescription>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">{component.weight}%</div>
                          <div className="text-sm text-gray-500">Weight</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">Category Weight</span>
                          <span className="text-sm text-gray-500">{component.weight}% of total score</span>
                        </div>
                        <Progress value={component.weight} className="h-2" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-3">Key Evaluation Factors:</h4>
                      <ul className="grid md:grid-cols-2 gap-2">
                        {component.factors.map((factor, factorIndex) => (
                          <li key={factorIndex} className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 text-sm">{factor}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Process Section */}
      {activeSection === 'process' && (
        <section id="process" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Evaluation Process</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                A systematic, multi-stage approach that combines automated data collection 
                with expert human analysis for maximum accuracy and reliability.
              </p>
            </div>

            <div className="space-y-12">
              {evaluationProcess.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 mr-8">
                      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {step.step}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <Card>
                        <CardHeader>
                          <div className="flex items-center">
                            <Icon className="w-8 h-8 text-blue-600 mr-3" />
                            <CardTitle className="text-2xl">{step.title}</CardTitle>
                          </div>
                          <CardDescription className="text-lg">{step.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ul className="grid md:grid-cols-2 gap-3">
                            {step.details.map((detail, detailIndex) => (
                              <li key={detailIndex} className="flex items-start">
                                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-700">{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Rating Scale Section */}
      {activeSection === 'rating-scale' && (
        <section id="rating-scale" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Trust Score Rating Scale</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Understanding what each trust score range means and how to interpret 
                broker ratings for your trading decisions.
              </p>
            </div>

            <div className="space-y-4">
              {ratingScale.map((rating, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className={`w-16 h-16 ${rating.color} rounded-lg flex items-center justify-center text-white font-bold mr-6`}>
                        {rating.range}
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{rating.label}</h3>
                        <p className="text-gray-600">{rating.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-12 bg-blue-50 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Score Interpretation Guidelines</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">For Conservative Traders</h4>
                  <p className="text-gray-700 mb-2">Consider brokers with scores of 80+ for maximum safety and reliability.</p>
                  <p className="text-gray-600 text-sm">Prioritize regulatory strength and financial stability over trading costs.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">For Active Traders</h4>
                  <p className="text-gray-700 mb-2">Brokers with scores of 70+ may be suitable if they excel in trading conditions.</p>
                  <p className="text-gray-600 text-sm">Balance trust score with specific trading requirements and costs.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Transparency Section */}
      {activeSection === 'transparency' && (
        <section id="transparency" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Transparency & Accountability</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We believe in complete transparency about our methods, data sources, 
                and any potential conflicts of interest.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-6 h-6 text-blue-600 mr-3" />
                    Data Sources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">Regulatory databases and filings</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">Company financial statements</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">Real-time market data feeds</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">Customer reviews and feedback</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">Third-party research and reports</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Scale className="w-6 h-6 text-blue-600 mr-3" />
                    Conflict of Interest Policy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <AlertTriangle className="w-4 h-4 text-orange-500 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">No paid placements in rankings</span>
                    </li>
                    <li className="flex items-start">
                      <AlertTriangle className="w-4 h-4 text-orange-500 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">Affiliate relationships disclosed</span>
                    </li>
                    <li className="flex items-start">
                      <AlertTriangle className="w-4 h-4 text-orange-500 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">Editorial independence maintained</span>
                    </li>
                    <li className="flex items-start">
                      <AlertTriangle className="w-4 h-4 text-orange-500 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">Regular third-party audits</span>
                    </li>
                    <li className="flex items-start">
                      <AlertTriangle className="w-4 h-4 text-orange-500 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">Public methodology documentation</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quality Assurance</CardTitle>
                <CardDescription>
                  Multiple layers of verification ensure the accuracy and reliability of our analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Brain className="w-8 h-8 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">AI Validation</h4>
                    <p className="text-gray-600 text-sm">Automated checks for data consistency and anomaly detection</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Expert Review</h4>
                    <p className="text-gray-600 text-sm">Manual verification by certified financial analysts</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award className="w-8 h-8 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Third-Party Audit</h4>
                    <p className="text-gray-600 text-sm">Independent verification of our methodology and results</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Experience Our Methodology in Action</h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            See how our comprehensive evaluation process helps you find the perfect broker 
            for your trading needs with confidence and transparency.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
              <Link href="/">Get AI Recommendation</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-900">
              <Link href="/brokers">Browse Broker Ratings</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
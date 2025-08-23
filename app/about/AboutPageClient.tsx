'use client';

import { useState } from 'react';
import { 
  Shield, 
  Target, 
  Users, 
  Award, 
  TrendingUp, 
  Globe, 
  CheckCircle, 
  Star,
  BarChart3,
  Brain,
  Lock,
  Zap,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const stats = [
  { label: 'Brokers Analyzed', value: '500+', icon: BarChart3 },
  { label: 'Trust Scores Generated', value: '10,000+', icon: Shield },
  { label: 'Users Served', value: '50,000+', icon: Users },
  { label: 'Countries Covered', value: '100+', icon: Globe },
];

const values = [
  {
    icon: Shield,
    title: 'Transparency',
    description: 'We provide clear, evidence-based broker evaluations with full disclosure of our methodology and potential conflicts of interest.'
  },
  {
    icon: Brain,
    title: 'AI-Powered Insights',
    description: 'Our advanced AI algorithms analyze vast amounts of data to provide personalized broker recommendations tailored to your trading style.'
  },
  {
    icon: Target,
    title: 'Accuracy',
    description: 'We continuously update our data and refine our algorithms to ensure the most accurate and current broker information.'
  },
  {
    icon: Lock,
    title: 'Independence',
    description: 'Our recommendations are based on objective analysis, not marketing relationships or paid placements.'
  }
];

const team = [
  {
    name: 'Sarah Johnson',
    role: 'CEO & Co-Founder',
    bio: 'Former Goldman Sachs analyst with 15+ years in financial markets and fintech innovation.',
    image: '/images/team/sarah-johnson.jpg'
  },
  {
    name: 'Michael Chen',
    role: 'CTO & Co-Founder',
    bio: 'Ex-Google engineer specializing in AI/ML systems and large-scale data processing.',
    image: '/images/team/michael-chen.jpg'
  },
  {
    name: 'David Rodriguez',
    role: 'Head of Research',
    bio: 'CFA charterholder with expertise in broker analysis and regulatory compliance across global markets.',
    image: '/images/team/david-rodriguez.jpg'
  },
  {
    name: 'Emily Watson',
    role: 'Head of Product',
    bio: 'Product strategist with deep experience in user experience design for financial platforms.',
    image: '/images/team/emily-watson.jpg'
  }
];

const milestones = [
  {
    year: '2020',
    title: 'Company Founded',
    description: 'Brokeranalysis was founded with the mission to bring transparency to broker selection.'
  },
  {
    year: '2021',
    title: 'AI Algorithm Launch',
    description: 'Launched our proprietary AI-powered broker recommendation engine.'
  },
  {
    year: '2022',
    title: 'Trust Score System',
    description: 'Introduced our comprehensive 100-point trust scoring methodology.'
  },
  {
    year: '2023',
    title: 'Global Expansion',
    description: 'Expanded coverage to include brokers from over 100 countries worldwide.'
  },
  {
    year: '2024',
    title: 'Advanced RAG System',
    description: 'Implemented cutting-edge RAG technology for real-time broker intelligence.'
  }
];

export default function AboutPageClient() {
  const [activeTab, setActiveTab] = useState('mission');

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              About <span className="text-yellow-400">Brokeranalysis</span>
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100 max-w-4xl mx-auto mb-8">
              We're revolutionizing how traders find and evaluate brokers through AI-powered analysis, 
              transparent methodologies, and evidence-based recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                <Link href="/methodology">Our Methodology</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-indigo-900">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
                    <Icon className="w-8 h-8 text-indigo-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values Tabs */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Foundation</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built on principles of transparency, innovation, and trader empowerment
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-lg p-1 shadow-lg">
              {['mission', 'vision', 'values'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-md font-medium capitalize transition-all ${
                    activeTab === tab
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-indigo-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="max-w-4xl mx-auto">
            {activeTab === 'mission' && (
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <div className="flex items-center mb-6">
                  <Target className="w-8 h-8 text-indigo-600 mr-3" />
                  <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  To democratize access to high-quality broker analysis and empower traders worldwide 
                  with the tools and insights they need to make informed decisions. We believe every 
                  trader deserves transparent, unbiased information about the platforms they trust 
                  with their capital.
                </p>
              </div>
            )}

            {activeTab === 'vision' && (
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <div className="flex items-center mb-6">
                  <Zap className="w-8 h-8 text-indigo-600 mr-3" />
                  <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  To become the world's most trusted source for broker intelligence, setting the 
                  standard for transparency and accuracy in financial platform evaluation. We envision 
                  a future where every trading decision is backed by comprehensive, AI-powered insights 
                  and where broker selection is no longer a gamble but an informed choice.
                </p>
              </div>
            )}

            {activeTab === 'values' && (
              <div className="grid md:grid-cols-2 gap-6">
                {values.map((value, index) => {
                  const Icon = value.icon;
                  return (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                      <div className="flex items-center mb-4">
                        <Icon className="w-6 h-6 text-indigo-600 mr-3" />
                        <h4 className="text-xl font-semibold text-gray-900">{value.title}</h4>
                      </div>
                      <p className="text-gray-700">{value.description}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From startup to industry leader - the milestones that shaped Brokeranalysis
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-indigo-200"></div>
            {milestones.map((milestone, index) => (
              <div key={index} className={`relative flex items-center mb-12 ${
                index % 2 === 0 ? 'justify-start' : 'justify-end'
              }`}>
                <div className={`w-1/2 ${
                  index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'
                }`}>
                  <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
                    <div className="text-2xl font-bold text-indigo-600 mb-2">{milestone.year}</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{milestone.title}</h3>
                    <p className="text-gray-700">{milestone.description}</p>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-indigo-600 rounded-full border-4 border-white"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The experts behind Brokeranalysis, combining decades of financial markets experience 
              with cutting-edge technology expertise
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <User className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                <div className="text-indigo-600 font-medium mb-3">{member.role}</div>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Find Your Perfect Broker?</h2>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto mb-8">
            Join thousands of traders who trust Brokeranalysis for transparent, 
            AI-powered broker recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
              <Link href="/">Get AI Recommendation</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-indigo-900">
              <Link href="/brokers">Browse All Brokers</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
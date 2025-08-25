'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Star, 
  Shield, 
  Cpu,
  DollarSign, 
  Users, 
  Award,
  Filter,
  Search,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Info,
  Zap,
  Monitor,
  Smartphone,
  Download
} from 'lucide-react';

interface PlatformPageClientProps {
  platform: string;
}

interface Broker {
  id: string;
  name: string;
  logo: string;
  trustScore: number;
  minDeposit: number;
  platformRating: number;
  platformFeatures: string[];
  pros: string[];
  cons: string[];
}

interface PlatformInfo {
  name: string;
  developer: string;
  releaseYear: number;
  pricing: string;
  supportedAssets: string[];
  keyFeatures: string[];
  systemRequirements: string;
  mobileSupport: boolean;
  webVersion: boolean;
  apiAccess: boolean;
  customization: string;
  learningCurve: 'Easy' | 'Moderate' | 'Steep';
}

const mockBrokers: Broker[] = [
  {
    id: 'ic-markets',
    name: 'IC Markets',
    logo: '/logos/ic-markets.png',
    trustScore: 95,
    minDeposit: 200,
    platformRating: 9.2,
    platformFeatures: ['Raw Spread', 'ECN Execution', 'VPS Support', 'Advanced Charting'],
    pros: ['Excellent execution speed', 'Low latency', 'Multiple platform options'],
    cons: ['Steeper learning curve', 'Advanced features may overwhelm beginners']
  },
  {
    id: 'pepperstone',
    name: 'Pepperstone',
    logo: '/logos/pepperstone.png',
    trustScore: 92,
    minDeposit: 200,
    platformRating: 8.9,
    platformFeatures: ['Razor Account', 'AutoChartist', 'Social Trading', 'Advanced Tools'],
    pros: ['User-friendly interface', 'Great mobile app', 'Excellent customer support'],
    cons: ['Commission-based accounts', 'Limited free VPS']
  },
  {
    id: 'xm',
    name: 'XM',
    logo: '/logos/xm.png',
    trustScore: 88,
    minDeposit: 5,
    platformRating: 8.5,
    platformFeatures: ['One-Click Trading', 'Trading Signals', 'Educational Resources', 'Webinars'],
    pros: ['Easy to use', 'Great for beginners', 'Excellent educational content'],
    cons: ['Higher spreads', 'Limited advanced features']
  }
];

const platformData: Record<string, PlatformInfo> = {
  'metatrader-4': {
    name: 'MetaTrader 4',
    developer: 'MetaQuotes Software',
    releaseYear: 2005,
    pricing: 'Free with broker',
    supportedAssets: ['Forex', 'CFDs', 'Futures', 'Indices'],
    keyFeatures: ['Advanced Charting', 'Expert Advisors', 'Technical Indicators', 'Backtesting'],
    systemRequirements: 'Windows, macOS, Linux, Web, Mobile',
    mobileSupport: true,
    webVersion: true,
    apiAccess: true,
    customization: 'High (MQL4 programming)',
    learningCurve: 'Moderate'
  },
  'metatrader-5': {
    name: 'MetaTrader 5',
    developer: 'MetaQuotes Software',
    releaseYear: 2010,
    pricing: 'Free with broker',
    supportedAssets: ['Forex', 'Stocks', 'CFDs', 'Futures', 'Options', 'Bonds'],
    keyFeatures: ['Multi-Asset Trading', 'Depth of Market', 'Economic Calendar', 'Built-in Chat'],
    systemRequirements: 'Windows, macOS, Linux, Web, Mobile',
    mobileSupport: true,
    webVersion: true,
    apiAccess: true,
    customization: 'High (MQL5 programming)',
    learningCurve: 'Moderate'
  },
  'ctrader': {
    name: 'cTrader',
    developer: 'Spotware Systems',
    releaseYear: 2011,
    pricing: 'Free with broker',
    supportedAssets: ['Forex', 'CFDs', 'Indices'],
    keyFeatures: ['ECN Execution', 'Level II Pricing', 'Advanced Order Types', 'Algorithmic Trading'],
    systemRequirements: 'Windows, macOS, Web, Mobile',
    mobileSupport: true,
    webVersion: true,
    apiAccess: true,
    customization: 'Medium (cAlgo programming)',
    learningCurve: 'Easy'
  },
  'ninjatrader': {
    name: 'NinjaTrader',
    developer: 'NinjaTrader LLC',
    releaseYear: 2003,
    pricing: 'Free demo, paid licenses available',
    supportedAssets: ['Futures', 'Forex', 'Stocks', 'CFDs'],
    keyFeatures: ['Advanced Charting', 'Market Analytics', 'Strategy Development', 'Trade Simulation'],
    systemRequirements: 'Windows only',
    mobileSupport: false,
    webVersion: false,
    apiAccess: true,
    customization: 'High (C# programming)',
    learningCurve: 'Steep'
  }
};

export default function PlatformPageClient({ platform }: PlatformPageClientProps) {
  const [filteredBrokers, setFilteredBrokers] = useState<Broker[]>(mockBrokers);
  const [searchTerm, setSearchTerm] = useState('');
  const [minTrustScore, setMinTrustScore] = useState(0);
  const [selectedTab, setSelectedTab] = useState<'brokers' | 'platform'>('brokers');

  const platformInfo = platformData[platform] || {
    name: platform.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    developer: 'Various developers',
    releaseYear: 2010,
    pricing: 'Free with broker',
    supportedAssets: ['Forex', 'CFDs', 'Indices'],
    keyFeatures: ['Charting Tools', 'Technical Analysis', 'Order Management'],
    systemRequirements: 'Windows, macOS, Web, Mobile',
    mobileSupport: true,
    webVersion: true,
    apiAccess: false,
    customization: 'Medium',
    learningCurve: 'Moderate'
  };

  const platformTitle = platformInfo.name;

  useEffect(() => {
    let filtered = mockBrokers.filter(broker => 
      broker.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      broker.trustScore >= minTrustScore
    );
    
    // Sort by platform rating
    filtered.sort((a, b) => b.platformRating - a.platformRating);
    
    setFilteredBrokers(filtered);
  }, [searchTerm, minTrustScore]);

  const getLearningCurveColor = (curve: string) => {
    switch (curve) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Moderate': return 'text-yellow-600 bg-yellow-100';
      case 'Steep': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {platformTitle} Trading Platform Review
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Complete guide to {platformTitle} - features, pricing, supported brokers, and expert analysis. 
          Find the best brokers offering {platformTitle}.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Badge className="px-4 py-2 text-blue-600 bg-blue-100">
            <Cpu className="w-4 h-4 mr-2" />
            {platformInfo.developer}
          </Badge>
          <Badge className="px-4 py-2 text-green-600 bg-green-100">
            <DollarSign className="w-4 h-4 mr-2" />
            {platformInfo.pricing}
          </Badge>
          <Badge className={`px-4 py-2 ${getLearningCurveColor(platformInfo.learningCurve)}`}>
            <Zap className="w-4 h-4 mr-2" />
            {platformInfo.learningCurve} Learning Curve
          </Badge>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-white rounded-lg p-1 shadow-md">
          <button
            onClick={() => setSelectedTab('brokers')}
            className={`px-6 py-3 rounded-md font-medium transition-colors ${
              selectedTab === 'brokers'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Top Brokers
          </button>
          <button
            onClick={() => setSelectedTab('platform')}
            className={`px-6 py-3 rounded-md font-medium transition-colors ${
              selectedTab === 'platform'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Platform Features
          </button>
        </div>
      </div>

      {/* Brokers Tab */}
      {selectedTab === 'brokers' && (
        <div>
          {/* Filters */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filter Brokers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Search Brokers</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search by name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Minimum Trust Score</label>
                  <Input
                    type="range"
                    min="0"
                    max="100"
                    value={minTrustScore}
                    onChange={(e) => setMinTrustScore(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-sm text-gray-600 mt-1">{minTrustScore}+</div>
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={() => {
                      setSearchTerm('');
                      setMinTrustScore(0);
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Broker Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            {filteredBrokers.map((broker, index) => (
              <Card key={broker.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="font-bold text-blue-600">{broker.name.charAt(0)}</span>
                      </div>
                      <div>
                        <CardTitle className="text-lg">{broker.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="ml-1 font-medium">{broker.platformRating}/10</span>
                          </div>
                          <Badge variant="outline">#{index + 1}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">{broker.trustScore}</div>
                      <div className="text-sm text-gray-600">Trust Score</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-600">Min Deposit</div>
                      <div className="font-medium">${broker.minDeposit}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Platform Rating</div>
                      <div className="font-medium">{broker.platformRating}/10</div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-2">Platform Features</div>
                    <div className="flex flex-wrap gap-1">
                      {broker.platformFeatures.slice(0, 3).map((feature, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Pros</div>
                      {broker.pros.slice(0, 2).map((pro, idx) => (
                        <div key={idx} className="flex items-center gap-1 text-sm text-green-600">
                          <CheckCircle className="w-3 h-3" />
                          {pro}
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Cons</div>
                      {broker.cons.slice(0, 2).map((con, idx) => (
                        <div key={idx} className="flex items-center gap-1 text-sm text-red-600">
                          <AlertTriangle className="w-3 h-3" />
                          {con}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button className="flex-1">
                      Visit Broker
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button variant="outline">
                      Full Review
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Platform Tab */}
      {selectedTab === 'platform' && (
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="w-6 h-6" />
                {platformTitle} Platform Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    Platform Overview
                  </h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Developer:</span>
                      <span className="font-medium">{platformInfo.developer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Release Year:</span>
                      <span className="font-medium">{platformInfo.releaseYear}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pricing:</span>
                      <span className="font-medium">{platformInfo.pricing}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Learning Curve:</span>
                      <Badge className={getLearningCurveColor(platformInfo.learningCurve)}>
                        {platformInfo.learningCurve}
                      </Badge>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Key Features
                  </h3>
                  <ul className="space-y-2">
                    {platformInfo.keyFeatures.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Cpu className="w-5 h-5" />
                    Technical Specifications
                  </h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">System Requirements:</span>
                      <span className="font-medium text-right">{platformInfo.systemRequirements}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mobile Support:</span>
                      <span className="font-medium">{platformInfo.mobileSupport ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Web Version:</span>
                      <span className="font-medium">{platformInfo.webVersion ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">API Access:</span>
                      <span className="font-medium">{platformInfo.apiAccess ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Customization:</span>
                      <span className="font-medium">{platformInfo.customization}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Supported Assets
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {platformInfo.supportedAssets.map((asset, idx) => (
                      <Badge key={idx} variant="outline">{asset}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* CTA Section */}
      <div className="text-center mt-16">
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="py-12">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Trading with {platformTitle}?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Choose from our top-rated brokers offering {platformTitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Compare {platformTitle} Brokers
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
                Download {platformTitle}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
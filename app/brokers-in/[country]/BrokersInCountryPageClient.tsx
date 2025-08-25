'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Star, 
  Shield, 
  Globe, 
  DollarSign, 
  Users, 
  Award,
  Filter,
  Search,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Info,
  Building,
  Scale
} from 'lucide-react';

interface BrokersInCountryPageClientProps {
  country: string;
}

interface Broker {
  id: string;
  name: string;
  logo: string;
  trustScore: number;
  minDeposit: number;
  maxLeverage: string;
  spreads: string;
  regulation: string[];
  features: string[];
  pros: string[];
  cons: string[];
  countryAvailable: boolean;
}

interface CountryInfo {
  name: string;
  regulation: string;
  taxImplications: string;
  popularPairs: string[];
  tradingHours: string;
  restrictions: string[];
  regulator: string;
  depositProtection: string;
}

const mockBrokers: Broker[] = [
  {
    id: 'ic-markets',
    name: 'IC Markets',
    logo: '/logos/ic-markets.png',
    trustScore: 95,
    minDeposit: 200,
    maxLeverage: '1:500',
    spreads: 'From 0.0 pips',
    regulation: ['ASIC', 'CySEC', 'FSA'],
    features: ['ECN Trading', 'MetaTrader 4/5', 'cTrader', 'Copy Trading'],
    pros: ['Ultra-low spreads', 'Fast execution', 'Multiple platforms'],
    cons: ['Higher minimum deposit', 'Complex for beginners'],
    countryAvailable: true
  },
  {
    id: 'pepperstone',
    name: 'Pepperstone',
    logo: '/logos/pepperstone.png',
    trustScore: 92,
    minDeposit: 200,
    maxLeverage: '1:400',
    spreads: 'From 0.0 pips',
    regulation: ['ASIC', 'FCA', 'CySEC'],
    features: ['Razor Account', 'AutoChartist', 'VPS Hosting', 'Social Trading'],
    pros: ['Excellent execution', 'Advanced tools', 'Good support'],
    cons: ['Commission-based pricing', 'Limited educational content'],
    countryAvailable: true
  },
  {
    id: 'xm',
    name: 'XM',
    logo: '/logos/xm.png',
    trustScore: 88,
    minDeposit: 5,
    maxLeverage: '1:888',
    spreads: 'From 1.0 pips',
    regulation: ['CySEC', 'ASIC', 'IFSC'],
    features: ['Micro Accounts', 'Bonus Programs', 'Educational Resources', 'Webinars'],
    pros: ['Low minimum deposit', 'Great education', 'Flexible account types'],
    cons: ['Higher spreads on standard', 'Complex bonus terms'],
    countryAvailable: true
  }
];

const countryData: Record<string, CountryInfo> = {
  'united-states': {
    name: 'United States',
    regulation: 'CFTC and NFA regulated',
    regulator: 'Commodity Futures Trading Commission (CFTC) & National Futures Association (NFA)',
    taxImplications: 'Section 1256 contracts - 60/40 tax treatment',
    popularPairs: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CAD'],
    tradingHours: 'Sunday 5 PM - Friday 5 PM EST',
    restrictions: ['FIFO rule', 'No hedging', 'Maximum 50:1 leverage for majors'],
    depositProtection: 'No statutory deposit protection for forex trading accounts'
  },
  'united-kingdom': {
    name: 'United Kingdom',
    regulation: 'FCA regulated',
    regulator: 'Financial Conduct Authority (FCA)',
    taxImplications: 'Spread betting tax-free, CFDs subject to capital gains',
    popularPairs: ['GBP/USD', 'EUR/GBP', 'GBP/JPY', 'EUR/USD'],
    tradingHours: 'Sunday 10 PM - Friday 10 PM GMT',
    restrictions: ['ESMA leverage limits', 'Negative balance protection'],
    depositProtection: '£85,000 under Financial Services Compensation Scheme (FSCS)'
  },
  'australia': {
    name: 'Australia',
    regulation: 'ASIC regulated',
    regulator: 'Australian Securities and Investments Commission (ASIC)',
    taxImplications: 'CGT applies to trading profits',
    popularPairs: ['AUD/USD', 'EUR/AUD', 'GBP/AUD', 'AUD/JPY'],
    tradingHours: 'Monday 7 AM - Saturday 7 AM AEDT',
    restrictions: ['Leverage limits for retail clients', 'Product intervention powers'],
    depositProtection: 'No statutory deposit protection for forex trading accounts'
  },
  'canada': {
    name: 'Canada',
    regulation: 'IIROC regulated',
    regulator: 'Investment Industry Regulatory Organization of Canada (IIROC)',
    taxImplications: 'Business income vs capital gains treatment',
    popularPairs: ['USD/CAD', 'EUR/CAD', 'GBP/CAD', 'CAD/JPY'],
    tradingHours: 'Sunday 5 PM - Friday 5 PM EST',
    restrictions: ['Maximum 50:1 leverage', 'Segregated client funds'],
    depositProtection: 'Up to CAD $1,000,000 through CIPF'
  }
};

export default function BrokersInCountryPageClient({ country }: BrokersInCountryPageClientProps) {
  const [filteredBrokers, setFilteredBrokers] = useState<Broker[]>(mockBrokers);
  const [searchTerm, setSearchTerm] = useState('');
  const [minTrustScore, setMinTrustScore] = useState(0);
  const [selectedTab, setSelectedTab] = useState<'brokers' | 'country'>('brokers');

  const countryInfo = countryData[country] || {
    name: country.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    regulation: 'Regulatory information not specified',
    regulator: 'Local financial authority',
    taxImplications: 'Consult local tax advisor for specific implications',
    popularPairs: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF'],
    tradingHours: '24/5 market hours',
    restrictions: ['Check local regulations for specific restrictions'],
    depositProtection: 'Varies by jurisdiction and broker regulation'
  };

  const countryTitle = countryInfo.name;

  useEffect(() => {
    let filtered = mockBrokers.filter(broker => 
      broker.countryAvailable &&
      broker.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      broker.trustScore >= minTrustScore
    );
    
    // Sort by trust score
    filtered.sort((a, b) => b.trustScore - a.trustScore);
    
    setFilteredBrokers(filtered);
  }, [searchTerm, minTrustScore]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Best Forex Brokers in {countryTitle}
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Expert-reviewed forex brokers available in {countryTitle}. 
          Compare regulations, trading conditions, and features to find your perfect trading partner.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Badge className="px-4 py-2 text-blue-600 bg-blue-100">
            <Shield className="w-4 h-4 mr-2" />
            {countryInfo.regulation}
          </Badge>
          <Badge className="px-4 py-2 text-green-600 bg-green-100">
            <Globe className="w-4 h-4 mr-2" />
            {countryInfo.regulator}
          </Badge>
          <Badge className="px-4 py-2 text-purple-600 bg-purple-100">
            <Scale className="w-4 h-4 mr-2" />
            {countryInfo.depositProtection.split(' ')[0]} Protection
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
            onClick={() => setSelectedTab('country')}
            className={`px-6 py-3 rounded-md font-medium transition-colors ${
              selectedTab === 'country'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            {countryTitle} Info
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
                            <span className="ml-1 font-medium">{broker.trustScore}</span>
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
                      <div className="text-sm text-gray-600">Max Leverage</div>
                      <div className="font-medium">{broker.maxLeverage}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Spreads</div>
                      <div className="font-medium">{broker.spreads}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Regulation</div>
                      <div className="font-medium">{broker.regulation.join(', ')}</div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-2">Key Features</div>
                    <div className="flex flex-wrap gap-1">
                      {broker.features.slice(0, 3).map((feature, idx) => (
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

      {/* Country Tab */}
      {selectedTab === 'country' && (
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-6 h-6" />
                Trading in {countryInfo.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Regulation & Compliance
                  </h3>
                  <p className="text-gray-600 mb-4">{countryInfo.regulation}</p>
                  
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Scale className="w-5 h-5" />
                    Regulator
                  </h3>
                  <p className="text-gray-600 mb-4">{countryInfo.regulator}</p>
                  
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Deposit Protection
                  </h3>
                  <p className="text-gray-600">{countryInfo.depositProtection}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    Tax Implications
                  </h3>
                  <p className="text-gray-600 mb-6">{countryInfo.taxImplications}</p>
                  
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Trading Hours
                  </h3>
                  <p className="text-gray-600 mb-6">{countryInfo.tradingHours}</p>
                  
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Trading Restrictions
                  </h3>
                  <ul className="space-y-2">
                    {countryInfo.restrictions.map((restriction, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        <span className="text-gray-600">{restriction}</span>
                      </li>
                    ))}
                  </ul>
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
              Ready to Start Trading in {countryTitle}?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of traders who trust our expert recommendations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Compare All Brokers
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
                Get Personalized Recommendations
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
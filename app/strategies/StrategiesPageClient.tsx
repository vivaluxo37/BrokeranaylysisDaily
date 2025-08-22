'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  TrendingUp, 
  Globe, 
  Search, 
  ArrowRight, 
  BarChart3, 
  AlertTriangle,
  Clock,
  Target,
  Filter,
  Star
} from 'lucide-react';

interface Strategy {
  id: string;
  name: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  timeframe: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  popularity: number;
  icon: React.ReactNode;
}

interface Country {
  id: string;
  name: string;
  code: string;
  regulation: string;
  flag: string;
  brokerCount: number;
}

interface StrategyCombination {
  strategy: string;
  country: string;
  brokerCount: number;
  avgTrustScore: number;
  popularity: number;
}

const strategies: Strategy[] = [
  {
    id: 'scalping',
    name: 'Scalping',
    description: 'High-frequency trading with quick profits from small price movements',
    difficulty: 'Advanced',
    timeframe: '1-15 minutes',
    riskLevel: 'High',
    popularity: 85,
    icon: <BarChart3 className="w-6 h-6" />
  },
  {
    id: 'day-trading',
    name: 'Day Trading',
    description: 'Intraday positions closed before market close',
    difficulty: 'Advanced',
    timeframe: '1 minute - 1 day',
    riskLevel: 'High',
    popularity: 92,
    icon: <TrendingUp className="w-6 h-6" />
  },
  {
    id: 'swing-trading',
    name: 'Swing Trading',
    description: 'Medium-term strategy capturing price swings over days to weeks',
    difficulty: 'Intermediate',
    timeframe: '1 day - 1 week',
    riskLevel: 'Medium',
    popularity: 78,
    icon: <Target className="w-6 h-6" />
  },
  {
    id: 'position-trading',
    name: 'Position Trading',
    description: 'Long-term strategy holding positions for weeks to months',
    difficulty: 'Beginner',
    timeframe: '1 week - 6 months',
    riskLevel: 'Low',
    popularity: 65,
    icon: <Clock className="w-6 h-6" />
  }
];

const countries: Country[] = [
  { id: 'usa', name: 'United States', code: 'US', regulation: 'CFTC/NFA', flag: '🇺🇸', brokerCount: 15 },
  { id: 'uk', name: 'United Kingdom', code: 'GB', regulation: 'FCA', flag: '🇬🇧', brokerCount: 22 },
  { id: 'australia', name: 'Australia', code: 'AU', regulation: 'ASIC', flag: '🇦🇺', brokerCount: 18 },
  { id: 'canada', name: 'Canada', code: 'CA', regulation: 'IIROC', flag: '🇨🇦', brokerCount: 12 },
  { id: 'germany', name: 'Germany', code: 'DE', regulation: 'BaFin', flag: '🇩🇪', brokerCount: 20 },
  { id: 'france', name: 'France', code: 'FR', regulation: 'AMF', flag: '🇫🇷', brokerCount: 16 },
  { id: 'japan', name: 'Japan', code: 'JP', regulation: 'JFSA', flag: '🇯🇵', brokerCount: 14 },
  { id: 'singapore', name: 'Singapore', code: 'SG', regulation: 'MAS', flag: '🇸🇬', brokerCount: 11 },
  { id: 'switzerland', name: 'Switzerland', code: 'CH', regulation: 'FINMA', flag: '🇨🇭', brokerCount: 9 },
  { id: 'netherlands', name: 'Netherlands', code: 'NL', regulation: 'AFM', flag: '🇳🇱', brokerCount: 13 },
  { id: 'south-africa', name: 'South Africa', code: 'ZA', regulation: 'FSCA', flag: '🇿🇦', brokerCount: 8 },
  { id: 'new-zealand', name: 'New Zealand', code: 'NZ', regulation: 'FMA', flag: '🇳🇿', brokerCount: 7 }
];

// Generate strategy-country combinations
const generateCombinations = (): StrategyCombination[] => {
  const combinations: StrategyCombination[] = [];
  
  strategies.forEach(strategy => {
    countries.forEach(country => {
      combinations.push({
        strategy: strategy.id,
        country: country.id,
        brokerCount: Math.floor(Math.random() * 8) + 3, // 3-10 brokers
        avgTrustScore: Math.floor(Math.random() * 20) + 80, // 80-100 trust score
        popularity: Math.floor(Math.random() * 40) + 60 // 60-100 popularity
      });
    });
  });
  
  return combinations.sort((a, b) => b.popularity - a.popularity);
};

export default function StrategiesPageClient() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStrategy, setSelectedStrategy] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [combinations] = useState<StrategyCombination[]>(generateCombinations());

  const filteredCombinations = combinations.filter(combo => {
    const strategy = strategies.find(s => s.id === combo.strategy);
    const country = countries.find(c => c.id === combo.country);
    
    const matchesSearch = 
      strategy?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStrategy = selectedStrategy === 'all' || combo.strategy === selectedStrategy;
    const matchesCountry = selectedCountry === 'all' || combo.country === selectedCountry;
    
    return matchesSearch && matchesStrategy && matchesCountry;
  });

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-100';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'Advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Trading Strategies & Broker Guides
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Discover the best brokers for your trading strategy in your country. 
          Expert-curated recommendations based on strategy requirements and local regulations.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Badge className="px-4 py-2 text-blue-600 bg-blue-100">
            <Globe className="w-4 h-4 mr-2" />
            {countries.length} Countries
          </Badge>
          <Badge className="px-4 py-2 text-purple-600 bg-purple-100">
            <TrendingUp className="w-4 h-4 mr-2" />
            {strategies.length} Strategies
          </Badge>
          <Badge className="px-4 py-2 text-green-600 bg-green-100">
            <Star className="w-4 h-4 mr-2" />
            {combinations.length} Combinations
          </Badge>
        </div>
      </div>

      {/* Strategy Overview Cards */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Trading Strategies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {strategies.map((strategy) => (
            <Card key={strategy.id} className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedStrategy(strategy.id)}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    {strategy.icon}
                  </div>
                  <CardTitle className="text-lg">{strategy.name}</CardTitle>
                </div>
                <div className="flex gap-2">
                  <Badge className={`text-xs ${getRiskColor(strategy.riskLevel)}`}>
                    {strategy.riskLevel} Risk
                  </Badge>
                  <Badge className={`text-xs ${getDifficultyColor(strategy.difficulty)}`}>
                    {strategy.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">{strategy.description}</p>
                <div className="text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-600">{strategy.timeframe}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-600">{strategy.popularity}% popularity</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Find Your Perfect Strategy-Country Combination
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search strategies or countries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Strategy</label>
              <select
                value={selectedStrategy}
                onChange={(e) => setSelectedStrategy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Strategies</option>
                {strategies.map(strategy => (
                  <option key={strategy.id} value={strategy.id}>{strategy.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Country</label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Countries</option>
                {countries.map(country => (
                  <option key={country.id} value={country.id}>
                    {country.flag} {country.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedStrategy('all');
                  setSelectedCountry('all');
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

      {/* Strategy-Country Combinations */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Strategy-Country Combinations
          </h2>
          <div className="text-sm text-gray-600">
            {filteredCombinations.length} combinations found
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCombinations.slice(0, 24).map((combo) => {
            const strategy = strategies.find(s => s.id === combo.strategy)!;
            const country = countries.find(c => c.id === combo.country)!;
            
            return (
              <Card key={`${combo.strategy}-${combo.country}`} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{country.flag}</span>
                      <div>
                        <CardTitle className="text-lg">{strategy.name}</CardTitle>
                        <div className="text-sm text-gray-600">{country.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">{combo.avgTrustScore}</div>
                      <div className="text-xs text-gray-600">Avg Score</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-600">Available Brokers</div>
                      <div className="font-medium">{combo.brokerCount}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Regulation</div>
                      <div className="font-medium">{country.regulation}</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mb-4">
                    <Badge className={`text-xs ${getRiskColor(strategy.riskLevel)}`}>
                      {strategy.riskLevel} Risk
                    </Badge>
                    <Badge className={`text-xs ${getDifficultyColor(strategy.difficulty)}`}>
                      {strategy.difficulty}
                    </Badge>
                  </div>
                  
                  <Link href={`/strategies/${combo.strategy}/${combo.country}`}>
                    <Button className="w-full">
                      View Brokers
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {filteredCombinations.length > 24 && (
          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              Load More Combinations
            </Button>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="py-12">
            <h2 className="text-3xl font-bold mb-4">
              Need Personalized Recommendations?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Our AI-powered system can analyze your trading style and recommend the perfect broker for your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Get AI Recommendations
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
                Compare All Brokers
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
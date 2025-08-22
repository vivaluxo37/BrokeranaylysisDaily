'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Filter, 
  X, 
  Star, 
  DollarSign, 
  Shield, 
  Globe, 
  TrendingUp,
  Clock,
  Award,
  Zap,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export interface AdvancedSearchFilters {
  // Basic filters
  category: string;
  trustScoreMin: number;
  ratingMin: number;
  maxDeposit: number;
  minDeposit: number;
  regulation: string[];
  features: string[];
  sortBy: string;
  
  // Advanced filters
  brokerType: string[];
  tradingPlatforms: string[];
  instruments: string[];
  accountTypes: string[];
  paymentMethods: string[];
  countries: string[];
  languages: string[];
  
  // Performance filters
  spreadType: string;
  maxSpread: number;
  maxLeverage: number;
  minLeverage: number;
  
  // Date filters
  dateRange: string;
  foundedAfter: number;
  
  // Content filters
  contentType: string[];
  difficulty: string[];
  readingTime: number;
}

interface AdvancedSearchFiltersProps {
  onFiltersChange: (filters: AdvancedSearchFilters) => void;
  initialFilters?: Partial<AdvancedSearchFilters>;
  facetCounts?: Record<string, Record<string, number>>;
}

const defaultFilters: AdvancedSearchFilters = {
  category: 'all',
  trustScoreMin: 0,
  ratingMin: 0,
  maxDeposit: 50000,
  minDeposit: 0,
  regulation: [],
  features: [],
  sortBy: 'relevance',
  brokerType: [],
  tradingPlatforms: [],
  instruments: [],
  accountTypes: [],
  paymentMethods: [],
  countries: [],
  languages: [],
  spreadType: 'all',
  maxSpread: 10,
  maxLeverage: 1000,
  minLeverage: 1,
  dateRange: 'all',
  foundedAfter: 1990,
  contentType: [],
  difficulty: [],
  readingTime: 60
};

const categories = [
  { id: 'all', label: 'All Results', icon: Globe },
  { id: 'brokers', label: 'Brokers', icon: TrendingUp },
  { id: 'articles', label: 'Articles', icon: Clock },
  { id: 'blog', label: 'Blog Posts', icon: Award },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'comparisons', label: 'Comparisons', icon: Zap }
];

const regulations = [
  'ASIC', 'FCA', 'CySEC', 'CFTC', 'NFA', 'FINMA', 'BaFin', 'FSA', 'JFSA', 'MAS'
];

const brokerTypes = [
  'ECN', 'STP', 'Market Maker', 'DMA', 'Hybrid'
];

const tradingPlatforms = [
  'MetaTrader 4', 'MetaTrader 5', 'cTrader', 'TradingView', 'NinjaTrader',
  'ProRealTime', 'Custom Platform', 'Web Platform', 'Mobile App'
];

const instruments = [
  'Forex', 'CFDs', 'Stocks', 'Indices', 'Commodities', 'Cryptocurrencies',
  'Bonds', 'ETFs', 'Options', 'Futures'
];

const accountTypes = [
  'Standard', 'ECN', 'VIP', 'Islamic', 'Demo', 'Cent', 'Professional', 'Institutional'
];

const paymentMethods = [
  'Credit Card', 'Bank Transfer', 'PayPal', 'Skrill', 'Neteller', 'WebMoney',
  'Perfect Money', 'Cryptocurrency', 'Local Banking'
];

const contentTypes = [
  'Tutorial', 'Guide', 'Analysis', 'News', 'Review', 'Comparison', 'Strategy'
];

const difficultyLevels = [
  'Beginner', 'Intermediate', 'Advanced', 'Expert'
];

const sortOptions = [
  { value: 'relevance', label: 'Most Relevant' },
  { value: 'trust-score', label: 'Highest Trust Score' },
  { value: 'rating', label: 'Highest Rating' },
  { value: 'min-deposit', label: 'Lowest Min Deposit' },
  { value: 'max-leverage', label: 'Highest Leverage' },
  { value: 'recent', label: 'Most Recent' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'alphabetical', label: 'A-Z' }
];

export default function AdvancedSearchFilters({ 
  onFiltersChange, 
  initialFilters,
  facetCounts = {}
}: AdvancedSearchFiltersProps) {
  const [filters, setFilters] = useState<AdvancedSearchFilters>({
    ...defaultFilters,
    ...initialFilters
  });

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: true,
    broker: false,
    trading: false,
    performance: false,
    content: false
  });

  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const updateFilters = (newFilters: Partial<AdvancedSearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
  };

  const toggleArrayFilter = (key: keyof AdvancedSearchFilters, value: string) => {
    const currentArray = filters[key] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFilters({ [key]: newArray });
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const hasActiveFilters = () => {
    return Object.entries(filters).some(([key, value]) => {
      const defaultValue = defaultFilters[key as keyof AdvancedSearchFilters];
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value !== defaultValue;
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    Object.entries(filters).forEach(([key, value]) => {
      const defaultValue = defaultFilters[key as keyof AdvancedSearchFilters];
      if (Array.isArray(value)) {
        count += value.length;
      } else if (value !== defaultValue) {
        count += 1;
      }
    });
    return count;
  };

  const getFacetCount = (category: string, value: string): number => {
    return facetCounts[category]?.[value] || 0;
  };

  const FilterSection = ({ 
    title, 
    sectionKey, 
    icon: Icon, 
    children 
  }: { 
    title: string; 
    sectionKey: string; 
    icon: any; 
    children: React.ReactNode; 
  }) => (
    <Card className="mb-4">
      <CardHeader 
        className="pb-3 cursor-pointer" 
        onClick={() => toggleSection(sectionKey)}
      >
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Icon className="h-4 w-4" />
            <span>{title}</span>
          </div>
          {expandedSections[sectionKey] ? 
            <ChevronUp className="h-4 w-4" /> : 
            <ChevronDown className="h-4 w-4" />
          }
        </CardTitle>
      </CardHeader>
      {expandedSections[sectionKey] && (
        <CardContent className="pt-0">
          {children}
        </CardContent>
      )}
    </Card>
  );

  return (
    <div className="space-y-4">
      {/* Filter Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Advanced Filters</span>
              {getActiveFiltersCount() > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {getActiveFiltersCount()}
                </Badge>
              )}
            </CardTitle>
            {hasActiveFilters() && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Basic Filters */}
      <FilterSection title="Basic Filters" sectionKey="basic" icon={Filter}>
        {/* Category Filter */}
        <div className="mb-4">
          <Label className="text-sm font-medium mb-2 block">Category</Label>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => updateFilters({ category: category.id })}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors ${
                    filters.category === category.id
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{category.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sort By */}
        <div className="mb-4">
          <Label className="text-sm font-medium mb-2 block">Sort By</Label>
          <select
            value={filters.sortBy}
            onChange={(e) => updateFilters({ sortBy: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Trust Score Range */}
        <div className="mb-4">
          <Label className="text-sm font-medium mb-2 flex items-center space-x-2">
            <Shield className="h-4 w-4 text-green-600" />
            <span>Trust Score: {filters.trustScoreMin}+</span>
          </Label>
          <Input
            type="range"
            min="0"
            max="100"
            value={filters.trustScoreMin}
            onChange={(e) => updateFilters({ trustScoreMin: parseInt(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0</span>
            <span>50</span>
            <span>100</span>
          </div>
        </div>

        {/* Rating Range */}
        <div className="mb-4">
          <Label className="text-sm font-medium mb-2 flex items-center space-x-2">
            <Star className="h-4 w-4 text-yellow-500" />
            <span>Rating: {filters.ratingMin.toFixed(1)}+</span>
          </Label>
          <Input
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={filters.ratingMin}
            onChange={(e) => updateFilters({ ratingMin: parseFloat(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0</span>
            <span>2.5</span>
            <span>5.0</span>
          </div>
        </div>
      </FilterSection>

      {/* Broker-Specific Filters */}
      <FilterSection title="Broker Details" sectionKey="broker" icon={TrendingUp}>
        {/* Deposit Range */}
        <div className="mb-4">
          <Label className="text-sm font-medium mb-2 flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span>Deposit Range</span>
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-gray-500">Min: ${filters.minDeposit}</Label>
              <Input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={filters.minDeposit}
                onChange={(e) => updateFilters({ minDeposit: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500">Max: ${filters.maxDeposit}</Label>
              <Input
                type="range"
                min="100"
                max="50000"
                step="100"
                value={filters.maxDeposit}
                onChange={(e) => updateFilters({ maxDeposit: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Regulation */}
        <div className="mb-4">
          <Label className="text-sm font-medium mb-2 block">Regulation</Label>
          <div className="flex flex-wrap gap-1">
            {regulations.map((reg) => (
              <Badge
                key={reg}
                variant={filters.regulation.includes(reg) ? 'default' : 'outline'}
                className="cursor-pointer text-xs"
                onClick={() => toggleArrayFilter('regulation', reg)}
              >
                {reg}
                {getFacetCount('regulation', reg) > 0 && (
                  <span className="ml-1 text-xs opacity-70">
                    ({getFacetCount('regulation', reg)})
                  </span>
                )}
              </Badge>
            ))}
          </div>
        </div>

        {/* Broker Type */}
        <div className="mb-4">
          <Label className="text-sm font-medium mb-2 block">Broker Type</Label>
          <div className="space-y-2">
            {brokerTypes.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`broker-type-${type}`}
                  checked={filters.brokerType.includes(type)}
                  onCheckedChange={() => toggleArrayFilter('brokerType', type)}
                />
                <Label htmlFor={`broker-type-${type}`} className="text-sm">
                  {type}
                  {getFacetCount('brokerType', type) > 0 && (
                    <span className="ml-1 text-xs text-gray-500">
                      ({getFacetCount('brokerType', type)})
                    </span>
                  )}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </FilterSection>

      {/* Trading Filters */}
      <FilterSection title="Trading Features" sectionKey="trading" icon={Zap}>
        {/* Trading Platforms */}
        <div className="mb-4">
          <Label className="text-sm font-medium mb-2 block">Trading Platforms</Label>
          <div className="space-y-2">
            {tradingPlatforms.map((platform) => (
              <div key={platform} className="flex items-center space-x-2">
                <Checkbox
                  id={`platform-${platform}`}
                  checked={filters.tradingPlatforms.includes(platform)}
                  onCheckedChange={() => toggleArrayFilter('tradingPlatforms', platform)}
                />
                <Label htmlFor={`platform-${platform}`} className="text-sm">
                  {platform}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Instruments */}
        <div className="mb-4">
          <Label className="text-sm font-medium mb-2 block">Instruments</Label>
          <div className="flex flex-wrap gap-1">
            {instruments.map((instrument) => (
              <Badge
                key={instrument}
                variant={filters.instruments.includes(instrument) ? 'default' : 'outline'}
                className="cursor-pointer text-xs"
                onClick={() => toggleArrayFilter('instruments', instrument)}
              >
                {instrument}
              </Badge>
            ))}
          </div>
        </div>

        {/* Account Types */}
        <div className="mb-4">
          <Label className="text-sm font-medium mb-2 block">Account Types</Label>
          <div className="flex flex-wrap gap-1">
            {accountTypes.map((type) => (
              <Badge
                key={type}
                variant={filters.accountTypes.includes(type) ? 'default' : 'outline'}
                className="cursor-pointer text-xs"
                onClick={() => toggleArrayFilter('accountTypes', type)}
              >
                {type}
              </Badge>
            ))}
          </div>
        </div>
      </FilterSection>

      {/* Performance Filters */}
      <FilterSection title="Performance" sectionKey="performance" icon={Award}>
        {/* Leverage Range */}
        <div className="mb-4">
          <Label className="text-sm font-medium mb-2 block">
            Max Leverage: 1:{filters.maxLeverage}
          </Label>
          <Input
            type="range"
            min="1"
            max="1000"
            value={filters.maxLeverage}
            onChange={(e) => updateFilters({ maxLeverage: parseInt(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1:1</span>
            <span>1:500</span>
            <span>1:1000</span>
          </div>
        </div>

        {/* Max Spread */}
        <div className="mb-4">
          <Label className="text-sm font-medium mb-2 block">
            Max Spread: {filters.maxSpread} pips
          </Label>
          <Input
            type="range"
            min="0"
            max="10"
            step="0.1"
            value={filters.maxSpread}
            onChange={(e) => updateFilters({ maxSpread: parseFloat(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0</span>
            <span>5</span>
            <span>10</span>
          </div>
        </div>
      </FilterSection>

      {/* Content Filters */}
      <FilterSection title="Content" sectionKey="content" icon={Clock}>
        {/* Content Type */}
        <div className="mb-4">
          <Label className="text-sm font-medium mb-2 block">Content Type</Label>
          <div className="flex flex-wrap gap-1">
            {contentTypes.map((type) => (
              <Badge
                key={type}
                variant={filters.contentType.includes(type) ? 'default' : 'outline'}
                className="cursor-pointer text-xs"
                onClick={() => toggleArrayFilter('contentType', type)}
              >
                {type}
              </Badge>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div className="mb-4">
          <Label className="text-sm font-medium mb-2 block">Difficulty Level</Label>
          <div className="flex flex-wrap gap-1">
            {difficultyLevels.map((level) => (
              <Badge
                key={level}
                variant={filters.difficulty.includes(level) ? 'default' : 'outline'}
                className="cursor-pointer text-xs"
                onClick={() => toggleArrayFilter('difficulty', level)}
              >
                {level}
              </Badge>
            ))}
          </div>
        </div>

        {/* Reading Time */}
        <div className="mb-4">
          <Label className="text-sm font-medium mb-2 block">
            Max Reading Time: {filters.readingTime} min
          </Label>
          <Input
            type="range"
            min="1"
            max="60"
            value={filters.readingTime}
            onChange={(e) => updateFilters({ readingTime: parseInt(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1 min</span>
            <span>30 min</span>
            <span>60 min</span>
          </div>
        </div>
      </FilterSection>

      {/* Active Filters Summary */}
      {hasActiveFilters() && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-sm">Active Filters ({getActiveFiltersCount()})</h3>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {Object.entries(filters).map(([key, value]) => {
                const defaultValue = defaultFilters[key as keyof AdvancedSearchFilters];
                if (Array.isArray(value) && value.length > 0) {
                  return value.map((item) => (
                    <Badge key={`${key}-${item}`} variant="secondary" className="text-xs">
                      {item}
                      <X 
                        className="h-3 w-3 ml-1 cursor-pointer" 
                        onClick={() => toggleArrayFilter(key as keyof AdvancedSearchFilters, item)}
                      />
                    </Badge>
                  ));
                } else if (value !== defaultValue && !Array.isArray(value)) {
                  return (
                    <Badge key={key} variant="secondary" className="text-xs">
                      {key}: {String(value)}
                      <X 
                        className="h-3 w-3 ml-1 cursor-pointer" 
                        onClick={() => updateFilters({ [key]: defaultValue })}
                      />
                    </Badge>
                  );
                }
                return null;
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
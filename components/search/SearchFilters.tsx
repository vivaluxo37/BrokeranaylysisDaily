'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter, X, Star, DollarSign, Shield } from 'lucide-react';

interface SearchFiltersProps {
  onFiltersChange: (filters: SearchFilters) => void;
  initialFilters?: SearchFilters;
}

export interface SearchFilters {
  category: string;
  trustScoreMin: number;
  ratingMin: number;
  maxDeposit: number;
  regulation: string[];
  features: string[];
  sortBy: string;
}

const categories = [
  { id: 'all', label: 'All Results', count: 15 },
  { id: 'brokers', label: 'Brokers', count: 8 },
  { id: 'articles', label: 'Articles', count: 4 },
  { id: 'blog', label: 'Blog Posts', count: 3 }
];

const regulations = [
  'ASIC', 'FCA', 'CySEC', 'CFTC', 'NFA', 'FINMA', 'BaFin', 'FSA'
];

const features = [
  'ECN Trading', 'STP Trading', 'MetaTrader 4', 'MetaTrader 5', 'cTrader',
  'Social Trading', 'Copy Trading', 'Automated Trading', 'Mobile Trading',
  'Demo Account', 'Islamic Account', 'VPS Hosting'
];

const sortOptions = [
  { value: 'relevance', label: 'Most Relevant' },
  { value: 'trust-score', label: 'Highest Trust Score' },
  { value: 'rating', label: 'Highest Rating' },
  { value: 'min-deposit', label: 'Lowest Min Deposit' },
  { value: 'recent', label: 'Most Recent' }
];

export default function SearchFilters({ onFiltersChange, initialFilters }: SearchFiltersProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    category: 'all',
    trustScoreMin: 0,
    ratingMin: 0,
    maxDeposit: 10000,
    regulation: [],
    features: [],
    sortBy: 'relevance',
    ...initialFilters
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const clearFilters = () => {
    const defaultFilters: SearchFilters = {
      category: 'all',
      trustScoreMin: 0,
      ratingMin: 0,
      maxDeposit: 10000,
      regulation: [],
      features: [],
      sortBy: 'relevance'
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const toggleRegulation = (reg: string) => {
    const newRegulation = filters.regulation.includes(reg)
      ? filters.regulation.filter(r => r !== reg)
      : [...filters.regulation, reg];
    updateFilters({ regulation: newRegulation });
  };

  const toggleFeature = (feature: string) => {
    const newFeatures = filters.features.includes(feature)
      ? filters.features.filter(f => f !== feature)
      : [...filters.features, feature];
    updateFilters({ features: newFeatures });
  };

  const hasActiveFilters = filters.category !== 'all' || 
    filters.trustScoreMin > 0 || 
    filters.ratingMin > 0 || 
    filters.maxDeposit < 10000 || 
    filters.regulation.length > 0 || 
    filters.features.length > 0;

  return (
    <div className="space-y-4">
      {/* Quick Filters */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </CardTitle>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Category Filter */}
          <div>
            <h3 className="font-medium mb-3">Category</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => updateFilters({ category: category.id })}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    filters.category === category.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{category.label}</span>
                    <span className="text-sm text-gray-500">({category.count})</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div>
            <h3 className="font-medium mb-3">Sort By</h3>
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilters({ sortBy: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Advanced Filters Toggle */}
          <Button
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full"
          >
            {isExpanded ? 'Hide' : 'Show'} Advanced Filters
          </Button>
        </CardContent>
      </Card>

      {/* Advanced Filters */}
      {isExpanded && (
        <Card>
          <CardHeader>
            <CardTitle>Advanced Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Trust Score Filter */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Shield className="h-4 w-4 text-green-600" />
                <h3 className="font-medium">Minimum Trust Score</h3>
              </div>
              <div className="space-y-2">
                <Input
                  type="range"
                  min="0"
                  max="100"
                  value={filters.trustScoreMin}
                  onChange={(e) => updateFilters({ trustScoreMin: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>0</span>
                  <span className="font-medium">{filters.trustScoreMin}</span>
                  <span>100</span>
                </div>
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Star className="h-4 w-4 text-yellow-500" />
                <h3 className="font-medium">Minimum Rating</h3>
              </div>
              <div className="space-y-2">
                <Input
                  type="range"
                  min="0"
                  max="5"
                  step="0.1"
                  value={filters.ratingMin}
                  onChange={(e) => updateFilters({ ratingMin: parseFloat(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>0</span>
                  <span className="font-medium">{filters.ratingMin.toFixed(1)}</span>
                  <span>5.0</span>
                </div>
              </div>
            </div>

            {/* Max Deposit Filter */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <DollarSign className="h-4 w-4 text-green-600" />
                <h3 className="font-medium">Maximum Deposit</h3>
              </div>
              <div className="space-y-2">
                <Input
                  type="range"
                  min="0"
                  max="10000"
                  step="100"
                  value={filters.maxDeposit}
                  onChange={(e) => updateFilters({ maxDeposit: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>$0</span>
                  <span className="font-medium">${filters.maxDeposit.toLocaleString()}</span>
                  <span>$10,000+</span>
                </div>
              </div>
            </div>

            {/* Regulation Filter */}
            <div>
              <h3 className="font-medium mb-3">Regulation</h3>
              <div className="flex flex-wrap gap-2">
                {regulations.map((reg) => (
                  <Badge
                    key={reg}
                    variant={filters.regulation.includes(reg) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleRegulation(reg)}
                  >
                    {reg}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Features Filter */}
            <div>
              <h3 className="font-medium mb-3">Features</h3>
              <div className="flex flex-wrap gap-2">
                {features.map((feature) => (
                  <Badge
                    key={feature}
                    variant={filters.features.includes(feature) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleFeature(feature)}
                  >
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Active Filters</h3>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.category !== 'all' && (
                <Badge variant="secondary">
                  Category: {categories.find(c => c.id === filters.category)?.label}
                </Badge>
              )}
              {filters.trustScoreMin > 0 && (
                <Badge variant="secondary">
                  Trust Score: {filters.trustScoreMin}+
                </Badge>
              )}
              {filters.ratingMin > 0 && (
                <Badge variant="secondary">
                  Rating: {filters.ratingMin.toFixed(1)}+
                </Badge>
              )}
              {filters.maxDeposit < 10000 && (
                <Badge variant="secondary">
                  Max Deposit: ${filters.maxDeposit.toLocaleString()}
                </Badge>
              )}
              {filters.regulation.map((reg) => (
                <Badge key={reg} variant="secondary">
                  {reg}
                </Badge>
              ))}
              {filters.features.map((feature) => (
                <Badge key={feature} variant="secondary">
                  {feature}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
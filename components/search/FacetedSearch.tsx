'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { 
  ChevronDown, 
  ChevronRight, 
  Search, 
  X, 
  Filter,
  BarChart3,
  Globe,
  Shield,
  Zap,
  DollarSign,
  Star,
  TrendingUp
} from 'lucide-react';
import { AdvancedSearchFilters } from './AdvancedSearchFilters';

interface FacetValue {
  value: string;
  label: string;
  count: number;
  selected: boolean;
}

interface FacetGroup {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  type: 'checkbox' | 'range' | 'rating' | 'search';
  expanded: boolean;
  values: FacetValue[];
  min?: number;
  max?: number;
  step?: number;
  currentRange?: [number, number];
  searchTerm?: string;
}

interface FacetedSearchProps {
  filters: AdvancedSearchFilters;
  onFiltersChange: (filters: Partial<AdvancedSearchFilters>) => void;
  resultCount: number;
  isLoading?: boolean;
}

// Mock data for facet counts - in real app, this would come from search API
const generateFacetData = (filters: AdvancedSearchFilters): FacetGroup[] => {
  return [
    {
      id: 'category',
      label: 'Category',
      icon: Filter,
      type: 'checkbox',
      expanded: true,
      values: [
        { value: 'brokers', label: 'Brokers', count: 156, selected: filters.category === 'brokers' },
        { value: 'articles', label: 'Articles', count: 89, selected: filters.category === 'articles' },
        { value: 'guides', label: 'Guides', count: 67, selected: filters.category === 'guides' },
        { value: 'news', label: 'News', count: 234, selected: filters.category === 'news' },
        { value: 'tools', label: 'Tools', count: 23, selected: filters.category === 'tools' }
      ]
    },
    {
      id: 'regulation',
      label: 'Regulation',
      icon: Shield,
      type: 'checkbox',
      expanded: true,
      values: [
        { value: 'FCA', label: 'FCA (UK)', count: 45, selected: filters.regulation.includes('FCA') },
        { value: 'ASIC', label: 'ASIC (Australia)', count: 38, selected: filters.regulation.includes('ASIC') },
        { value: 'CySEC', label: 'CySEC (Cyprus)', count: 67, selected: filters.regulation.includes('CySEC') },
        { value: 'CFTC', label: 'CFTC (USA)', count: 23, selected: filters.regulation.includes('CFTC') },
        { value: 'FSA', label: 'FSA (Japan)', count: 19, selected: filters.regulation.includes('FSA') },
        { value: 'BaFin', label: 'BaFin (Germany)', count: 15, selected: filters.regulation.includes('BaFin') }
      ]
    },
    {
      id: 'brokerType',
      label: 'Broker Type',
      icon: TrendingUp,
      type: 'checkbox',
      expanded: true,
      values: [
        { value: 'ECN', label: 'ECN', count: 34, selected: filters.brokerType?.includes('ECN') || false },
        { value: 'STP', label: 'STP', count: 56, selected: filters.brokerType?.includes('STP') || false },
        { value: 'Market Maker', label: 'Market Maker', count: 78, selected: filters.brokerType?.includes('Market Maker') || false },
        { value: 'DMA', label: 'DMA', count: 23, selected: filters.brokerType?.includes('DMA') || false }
      ]
    },
    {
      id: 'trustScore',
      label: 'Trust Score',
      icon: Star,
      type: 'range',
      expanded: true,
      values: [],
      min: 0,
      max: 100,
      step: 5,
      currentRange: [filters.trustScoreMin || 0, filters.trustScoreMax || 100]
    },
    {
      id: 'rating',
      label: 'Rating',
      icon: BarChart3,
      type: 'rating',
      expanded: true,
      values: [
        { value: '5', label: '5 Stars', count: 12, selected: filters.ratingMin === 5 },
        { value: '4', label: '4+ Stars', count: 45, selected: filters.ratingMin === 4 },
        { value: '3', label: '3+ Stars', count: 89, selected: filters.ratingMin === 3 },
        { value: '2', label: '2+ Stars', count: 134, selected: filters.ratingMin === 2 }
      ]
    },
    {
      id: 'deposit',
      label: 'Min Deposit',
      icon: DollarSign,
      type: 'range',
      expanded: false,
      values: [],
      min: 0,
      max: 10000,
      step: 100,
      currentRange: [filters.minDeposit || 0, filters.maxDeposit || 10000]
    },
    {
      id: 'platforms',
      label: 'Trading Platforms',
      icon: Zap,
      type: 'search',
      expanded: false,
      searchTerm: '',
      values: [
        { value: 'MetaTrader 4', label: 'MetaTrader 4', count: 89, selected: filters.tradingPlatforms?.includes('MetaTrader 4') || false },
        { value: 'MetaTrader 5', label: 'MetaTrader 5', count: 76, selected: filters.tradingPlatforms?.includes('MetaTrader 5') || false },
        { value: 'cTrader', label: 'cTrader', count: 34, selected: filters.tradingPlatforms?.includes('cTrader') || false },
        { value: 'TradingView', label: 'TradingView', count: 45, selected: filters.tradingPlatforms?.includes('TradingView') || false },
        { value: 'NinjaTrader', label: 'NinjaTrader', count: 23, selected: filters.tradingPlatforms?.includes('NinjaTrader') || false },
        { value: 'ProRealTime', label: 'ProRealTime', count: 18, selected: filters.tradingPlatforms?.includes('ProRealTime') || false }
      ]
    },
    {
      id: 'countries',
      label: 'Countries',
      icon: Globe,
      type: 'search',
      expanded: false,
      searchTerm: '',
      values: [
        { value: 'United Kingdom', label: 'United Kingdom', count: 45, selected: filters.countries?.includes('United Kingdom') || false },
        { value: 'Australia', label: 'Australia', count: 38, selected: filters.countries?.includes('Australia') || false },
        { value: 'Cyprus', label: 'Cyprus', count: 67, selected: filters.countries?.includes('Cyprus') || false },
        { value: 'United States', label: 'United States', count: 23, selected: filters.countries?.includes('United States') || false },
        { value: 'Germany', label: 'Germany', count: 19, selected: filters.countries?.includes('Germany') || false },
        { value: 'Switzerland', label: 'Switzerland', count: 15, selected: filters.countries?.includes('Switzerland') || false }
      ]
    }
  ];
};

export default function FacetedSearch({
  filters,
  onFiltersChange,
  resultCount,
  isLoading = false
}: FacetedSearchProps) {
  const [facetGroups, setFacetGroups] = useState<FacetGroup[]>([]);
  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});

  useEffect(() => {
    const newFacetGroups = generateFacetData(filters);
    setFacetGroups(newFacetGroups);
  }, [filters]);

  const toggleFacetGroup = (groupId: string) => {
    setFacetGroups(prev => prev.map(group => 
      group.id === groupId 
        ? { ...group, expanded: !group.expanded }
        : group
    ));
  };

  const handleCheckboxChange = (groupId: string, value: string, checked: boolean) => {
    const group = facetGroups.find(g => g.id === groupId);
    if (!group) return;

    switch (groupId) {
      case 'category':
        onFiltersChange({ category: checked ? value as any : 'all' });
        break;
      case 'regulation':
        const currentRegulation = filters.regulation || [];
        const newRegulation = checked 
          ? [...currentRegulation, value]
          : currentRegulation.filter(r => r !== value);
        onFiltersChange({ regulation: newRegulation });
        break;
      case 'brokerType':
        const currentBrokerType = filters.brokerType || [];
        const newBrokerType = checked 
          ? [...currentBrokerType, value]
          : currentBrokerType.filter(t => t !== value);
        onFiltersChange({ brokerType: newBrokerType });
        break;
      case 'platforms':
        const currentPlatforms = filters.tradingPlatforms || [];
        const newPlatforms = checked 
          ? [...currentPlatforms, value]
          : currentPlatforms.filter(p => p !== value);
        onFiltersChange({ tradingPlatforms: newPlatforms });
        break;
      case 'countries':
        const currentCountries = filters.countries || [];
        const newCountries = checked 
          ? [...currentCountries, value]
          : currentCountries.filter(c => c !== value);
        onFiltersChange({ countries: newCountries });
        break;
    }
  };

  const handleRangeChange = (groupId: string, range: [number, number]) => {
    switch (groupId) {
      case 'trustScore':
        onFiltersChange({ 
          trustScoreMin: range[0], 
          trustScoreMax: range[1] 
        });
        break;
      case 'deposit':
        onFiltersChange({ 
          minDeposit: range[0], 
          maxDeposit: range[1] 
        });
        break;
    }
  };

  const handleRatingChange = (rating: number) => {
    onFiltersChange({ ratingMin: rating });
  };

  const handleSearchTermChange = (groupId: string, term: string) => {
    setSearchTerms(prev => ({ ...prev, [groupId]: term }));
  };

  const getFilteredValues = (group: FacetGroup) => {
    if (group.type !== 'search') return group.values;
    
    const searchTerm = searchTerms[group.id] || '';
    if (!searchTerm) return group.values;
    
    return group.values.filter(value => 
      value.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.category && filters.category !== 'all') count++;
    if (filters.regulation && filters.regulation.length > 0) count += filters.regulation.length;
    if (filters.brokerType && filters.brokerType.length > 0) count += filters.brokerType.length;
    if (filters.trustScoreMin && filters.trustScoreMin > 0) count++;
    if (filters.trustScoreMax && filters.trustScoreMax < 100) count++;
    if (filters.ratingMin && filters.ratingMin > 0) count++;
    if (filters.minDeposit && filters.minDeposit > 0) count++;
    if (filters.maxDeposit && filters.maxDeposit < 10000) count++;
    if (filters.tradingPlatforms && filters.tradingPlatforms.length > 0) count += filters.tradingPlatforms.length;
    if (filters.countries && filters.countries.length > 0) count += filters.countries.length;
    return count;
  }, [filters]);

  const clearAllFilters = () => {
    onFiltersChange({
      category: 'all',
      regulation: [],
      brokerType: [],
      trustScoreMin: 0,
      trustScoreMax: 100,
      ratingMin: 0,
      minDeposit: 0,
      maxDeposit: 10000,
      tradingPlatforms: [],
      countries: []
    });
  };

  return (
    <div className="space-y-4">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-600" />
          <h3 className="font-semibold">Filters</h3>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-xs"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Result Count */}
      <div className="text-sm text-gray-600">
        {isLoading ? (
          <span>Searching...</span>
        ) : (
          <span>{resultCount.toLocaleString()} results found</span>
        )}
      </div>

      {/* Facet Groups */}
      <div className="space-y-3">
        {facetGroups.map((group) => {
          const Icon = group.icon;
          const filteredValues = getFilteredValues(group);
          
          return (
            <Card key={group.id} className="border-gray-200">
              <CardHeader 
                className="pb-2 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleFacetGroup(group.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className="h-4 w-4 text-gray-600" />
                    <span className="font-medium text-sm">{group.label}</span>
                  </div>
                  {group.expanded ? (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </CardHeader>
              
              {group.expanded && (
                <CardContent className="pt-0">
                  {/* Search input for searchable facets */}
                  {group.type === 'search' && (
                    <div className="mb-3">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder={`Search ${group.label.toLowerCase()}...`}
                          value={searchTerms[group.id] || ''}
                          onChange={(e) => handleSearchTermChange(group.id, e.target.value)}
                          className="pl-8 h-9 text-sm"
                        />
                      </div>
                    </div>
                  )}

                  {/* Range slider */}
                  {group.type === 'range' && (
                    <div className="space-y-3">
                      <Slider
                        value={group.currentRange || [group.min || 0, group.max || 100]}
                        onValueChange={(value) => handleRangeChange(group.id, value as [number, number])}
                        min={group.min}
                        max={group.max}
                        step={group.step}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{group.currentRange?.[0] || group.min}</span>
                        <span>{group.currentRange?.[1] || group.max}</span>
                      </div>
                    </div>
                  )}

                  {/* Rating stars */}
                  {group.type === 'rating' && (
                    <div className="space-y-2">
                      {group.values.map((value) => (
                        <button
                          key={value.value}
                          onClick={() => handleRatingChange(parseInt(value.value))}
                          className={`w-full flex items-center justify-between p-2 rounded-md text-sm transition-colors ${
                            value.selected 
                              ? 'bg-blue-50 border border-blue-200' 
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < parseInt(value.value) 
                                      ? 'text-yellow-400 fill-current' 
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span>{value.label}</span>
                          </div>
                          <span className="text-gray-500">({value.count})</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Checkbox list */}
                  {group.type === 'checkbox' && (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {filteredValues.map((value) => (
                        <div key={value.value} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`${group.id}-${value.value}`}
                              checked={value.selected}
                              onCheckedChange={(checked) => 
                                handleCheckboxChange(group.id, value.value, checked as boolean)
                              }
                            />
                            <label 
                              htmlFor={`${group.id}-${value.value}`}
                              className="text-sm cursor-pointer"
                            >
                              {value.label}
                            </label>
                          </div>
                          <span className="text-xs text-gray-500">({value.count})</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
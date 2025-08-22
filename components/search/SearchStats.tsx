'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Filter, Clock } from 'lucide-react';

interface SearchStatsProps {
  query: string;
  totalResults: number;
  searchTime?: number;
  activeFilters?: {
    category?: string;
    trustScore?: [number, number];
    rating?: number;
    regulation?: string[];
    features?: string[];
    sortBy?: string;
  };
  onClearFilter?: (filterType: string, value?: string) => void;
  onClearAllFilters?: () => void;
}

export default function SearchStats({
  query,
  totalResults,
  searchTime,
  activeFilters = {},
  onClearFilter,
  onClearAllFilters
}: SearchStatsProps) {
  const hasActiveFilters = Object.values(activeFilters).some(filter => {
    if (Array.isArray(filter)) {
      return filter.length > 0;
    }
    return filter !== undefined && filter !== '';
  });

  const getFilterCount = () => {
    let count = 0;
    if (activeFilters.category) count++;
    if (activeFilters.trustScore) count++;
    if (activeFilters.rating) count++;
    if (activeFilters.regulation?.length) count++;
    if (activeFilters.features?.length) count++;
    if (activeFilters.sortBy && activeFilters.sortBy !== 'relevance') count++;
    return count;
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatSearchTime = (time: number) => {
    if (time < 1) {
      return `${Math.round(time * 1000)}ms`;
    }
    return `${time.toFixed(2)}s`;
  };

  const renderActiveFilter = (type: string, value: any, label: string) => {
    return (
      <Badge
        key={`${type}-${value}`}
        variant="secondary"
        className="flex items-center space-x-1 pr-1"
      >
        <span className="text-xs">{label}</span>
        <button
          onClick={() => onClearFilter?.(type, typeof value === 'string' ? value : undefined)}
          className="ml-1 hover:bg-gray-300 rounded-full p-0.5 transition-colors"
        >
          <X className="h-3 w-3" />
        </button>
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      {/* Search Results Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            {query ? (
              <>
                <span className="font-medium">{formatNumber(totalResults)}</span> results for{' '}
                <span className="font-medium text-gray-900">"{query}"</span>
              </>
            ) : (
              <>
                <span className="font-medium">{formatNumber(totalResults)}</span> results
              </>
            )}
            {searchTime && (
              <span className="ml-2 text-gray-400">
                <Clock className="inline h-3 w-3 mr-1" />
                {formatSearchTime(searchTime)}
              </span>
            )}
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              <Filter className="inline h-4 w-4 mr-1" />
              {getFilterCount()} filter{getFilterCount() !== 1 ? 's' : ''} applied
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAllFilters}
              className="text-xs h-7 px-2"
            >
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.category && 
            renderActiveFilter('category', activeFilters.category, `Category: ${activeFilters.category}`)
          }
          
          {activeFilters.trustScore && 
            renderActiveFilter(
              'trustScore', 
              activeFilters.trustScore, 
              `Trust Score: ${activeFilters.trustScore[0]}-${activeFilters.trustScore[1]}`
            )
          }
          
          {activeFilters.rating && 
            renderActiveFilter('rating', activeFilters.rating, `Rating: ${activeFilters.rating}+ stars`)
          }
          
          {activeFilters.regulation?.map(reg => 
            renderActiveFilter('regulation', reg, `Regulation: ${reg}`)
          )}
          
          {activeFilters.features?.map(feature => 
            renderActiveFilter('features', feature, `Feature: ${feature}`)
          )}
          
          {activeFilters.sortBy && activeFilters.sortBy !== 'relevance' && 
            renderActiveFilter(
              'sortBy', 
              activeFilters.sortBy, 
              `Sort: ${activeFilters.sortBy.replace(/([A-Z])/g, ' $1').toLowerCase()}`
            )
          }
        </div>
      )}

      {/* No Results Message */}
      {totalResults === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <Filter className="h-12 w-12 mx-auto mb-4" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No results found
          </h3>
          <p className="text-gray-600 mb-4">
            {query ? (
              <>We couldn't find any results for "{query}". Try adjusting your search or filters.</>
            ) : (
              <>No results match your current filters. Try adjusting your criteria.</>
            )}
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            <p>Suggestions:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Check your spelling</li>
              <li>Try more general keywords</li>
              <li>Remove some filters</li>
              <li>Browse our popular brokers or articles</li>
            </ul>
          </div>
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={onClearAllFilters}
              className="mt-4"
            >
              Clear all filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
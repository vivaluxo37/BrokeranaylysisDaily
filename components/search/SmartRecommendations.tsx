'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Lightbulb, 
  TrendingUp, 
  Users, 
  Clock, 
  Star,
  ArrowRight,
  Sparkles,
  Target,
  Filter
} from 'lucide-react';
import { AdvancedSearchFilters } from './AdvancedSearchFilters';

interface SmartRecommendation {
  id: string;
  type: 'search' | 'filter' | 'broker' | 'article';
  title: string;
  description: string;
  reason: string;
  confidence: number;
  filters?: Partial<AdvancedSearchFilters>;
  url?: string;
  metadata?: {
    trustScore?: number;
    rating?: number;
    category?: string;
    readingTime?: number;
    popularity?: number;
  };
}

interface SmartRecommendationsProps {
  currentQuery: string | undefined;
  currentFilters: AdvancedSearchFilters;
  searchHistory: string[];
  onApplyRecommendation: (recommendation: SmartRecommendation) => void;
  onSearchRecommendation: (query: string) => void;
}

// Mock data for recommendations
const generateRecommendations = (
  query: string | undefined,
  filters: AdvancedSearchFilters,
  history: string[]
): SmartRecommendation[] => {
  const recommendations: SmartRecommendation[] = [];

  // Early return if query is undefined or null
  if (!query) {
    return recommendations;
  }

  // Query-based recommendations
  if (query.toLowerCase().includes('scalping')) {
    recommendations.push({
      id: 'scalping-brokers',
      type: 'filter',
      title: 'Best Scalping Brokers',
      description: 'Filter for ECN brokers with tight spreads and fast execution',
      reason: 'Based on your search for scalping',
      confidence: 95,
      filters: {
        brokerType: ['ECN', 'STP'],
        maxSpread: 1.0,
        tradingPlatforms: ['MetaTrader 4', 'MetaTrader 5', 'cTrader']
      }
    });
  }

  if (query.toLowerCase().includes('beginner')) {
    recommendations.push({
      id: 'beginner-friendly',
      type: 'filter',
      title: 'Beginner-Friendly Brokers',
      description: 'Brokers with low minimum deposits and educational resources',
      reason: 'Perfect for beginners',
      confidence: 90,
      filters: {
        maxDeposit: 100,
        features: ['Demo Account', 'Educational Resources'],
        difficulty: ['Beginner']
      }
    });
  }

  // Filter-based recommendations
  if (filters.regulation.length === 0) {
    recommendations.push({
      id: 'add-regulation',
      type: 'filter',
      title: 'Add Regulation Filter',
      description: 'Filter by trusted regulators like FCA, ASIC, or CySEC',
      reason: 'Ensure broker safety and compliance',
      confidence: 85,
      filters: {
        regulation: ['FCA', 'ASIC', 'CySEC']
      }
    });
  }

  if (filters.trustScoreMin < 80) {
    recommendations.push({
      id: 'high-trust-score',
      type: 'filter',
      title: 'High Trust Score Brokers',
      description: 'Show only brokers with trust scores above 80',
      reason: 'Focus on most reliable brokers',
      confidence: 80,
      filters: {
        trustScoreMin: 80
      }
    });
  }

  // Popular searches
  recommendations.push(
    {
      id: 'popular-mt5',
      type: 'search',
      title: 'MetaTrader 5 Brokers',
      description: 'Find brokers offering MT5 platform',
      reason: 'Popular search this week',
      confidence: 75
    },
    {
      id: 'popular-crypto',
      type: 'search',
      title: 'Cryptocurrency Trading',
      description: 'Brokers offering crypto CFDs and spot trading',
      reason: 'Trending topic',
      confidence: 70
    }
  );

  // Content recommendations
  if (filters.category === 'brokers' || filters.category === 'all') {
    recommendations.push({
      id: 'broker-comparison-guide',
      type: 'article',
      title: 'How to Choose the Right Broker',
      description: 'Complete guide to broker selection criteria',
      reason: 'Helpful for broker research',
      confidence: 85,
      url: '/articles/how-to-choose-broker',
      metadata: {
        category: 'Education',
        readingTime: 8,
        popularity: 92
      }
    });
  }

  // Personalized recommendations based on history
  if (history.some(h => h.toLowerCase().includes('forex'))) {
    recommendations.push({
      id: 'forex-specialists',
      type: 'filter',
      title: 'Forex Specialists',
      description: 'Brokers specializing in forex trading',
      reason: 'Based on your search history',
      confidence: 80,
      filters: {
        instruments: ['Forex'],
        brokerType: ['ECN', 'STP']
      }
    });
  }

  return recommendations.sort((a, b) => b.confidence - a.confidence).slice(0, 6);
};

const trendingSearches = [
  { query: 'best forex brokers 2024', count: 1250 },
  { query: 'low spread ECN brokers', count: 890 },
  { query: 'crypto trading platforms', count: 756 },
  { query: 'scalping friendly brokers', count: 623 },
  { query: 'regulated brokers USA', count: 567 }
];

const quickFilters = [
  {
    name: 'Top Rated',
    filters: { ratingMin: 4.5, trustScoreMin: 85 },
    icon: Star,
    color: 'text-yellow-600'
  },
  {
    name: 'Low Deposit',
    filters: { maxDeposit: 100 },
    icon: Target,
    color: 'text-green-600'
  },
  {
    name: 'ECN Brokers',
    filters: { brokerType: ['ECN'] },
    icon: TrendingUp,
    color: 'text-blue-600'
  },
  {
    name: 'Regulated',
    filters: { regulation: ['FCA', 'ASIC', 'CySEC'] },
    icon: Filter,
    color: 'text-purple-600'
  }
];

export default function SmartRecommendations({
  currentQuery,
  currentFilters,
  searchHistory,
  onApplyRecommendation,
  onSearchRecommendation
}: SmartRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<SmartRecommendation[]>([]);
  const [showTrending, setShowTrending] = useState(false);

  useEffect(() => {
    const newRecommendations = generateRecommendations(
      currentQuery,
      currentFilters,
      searchHistory
    );
    setRecommendations(newRecommendations);
  }, [currentQuery, currentFilters, searchHistory]);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 80) return 'text-blue-600';
    if (confidence >= 70) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'search': return <Lightbulb className="h-4 w-4" />;
      case 'filter': return <Filter className="h-4 w-4" />;
      case 'broker': return <TrendingUp className="h-4 w-4" />;
      case 'article': return <Clock className="h-4 w-4" />;
      default: return <Sparkles className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Smart Recommendations */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <span>Smart Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recommendations.length > 0 ? (
            <div className="space-y-3">
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer"
                  onClick={() => onApplyRecommendation(rec)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        {getTypeIcon(rec.type)}
                        <h4 className="font-medium text-sm">{rec.title}</h4>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getConfidenceColor(rec.confidence)}`}
                        >
                          {rec.confidence}%
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{rec.description}</p>
                      <p className="text-xs text-gray-500">{rec.reason}</p>
                      {rec.metadata && (
                        <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500">
                          {rec.metadata.trustScore && (
                            <span>Trust Score: {rec.metadata.trustScore}</span>
                          )}
                          {rec.metadata.rating && (
                            <span>Rating: {rec.metadata.rating}/5</span>
                          )}
                          {rec.metadata.readingTime && (
                            <span>{rec.metadata.readingTime} min read</span>
                          )}
                        </div>
                      )}
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 ml-2 flex-shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              No recommendations available. Try adjusting your search or filters.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Quick Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-blue-600" />
            <span>Quick Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {quickFilters.map((filter) => {
              const Icon = filter.icon;
              return (
                <Button
                  key={filter.name}
                  variant="outline"
                  size="sm"
                  className="justify-start h-auto p-3"
                  onClick={() => onApplyRecommendation({
                    id: `quick-${filter.name}`,
                    type: 'filter',
                    title: filter.name,
                    description: `Apply ${filter.name} filter`,
                    reason: 'Quick filter',
                    confidence: 100,
                    filters: filter.filters
                  })}
                >
                  <Icon className={`h-4 w-4 mr-2 ${filter.color}`} />
                  <span className="text-sm">{filter.name}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Trending Searches */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              <span>Trending Searches</span>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTrending(!showTrending)}
            >
              {showTrending ? 'Hide' : 'Show'}
            </Button>
          </div>
        </CardHeader>
        {showTrending && (
          <CardContent>
            <div className="space-y-2">
              {trendingSearches.map((search, index) => (
                <button
                  key={search.query}
                  onClick={() => onSearchRecommendation(search.query)}
                  className="w-full text-left p-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-500 w-4">
                        {index + 1}
                      </span>
                      <span className="text-sm">{search.query}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{search.count}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Search Tips */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            <span>Search Tips</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-start space-x-2">
              <span className="text-blue-600 font-medium">•</span>
              <span>Use specific terms like "ECN broker" or "low spread" for better results</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-600 font-medium">•</span>
              <span>Combine filters to narrow down your search effectively</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-600 font-medium">•</span>
              <span>Check trust scores and regulations for broker safety</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-600 font-medium">•</span>
              <span>Use comparison tools to evaluate multiple brokers</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
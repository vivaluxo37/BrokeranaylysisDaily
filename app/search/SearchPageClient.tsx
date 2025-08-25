'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import SearchBar from '@/components/search/SearchBar';
import SearchFilters from '@/components/search/SearchFilters';
import AdvancedSearchFilters from '@/components/search/AdvancedSearchFilters';
import FacetedSearch from '@/components/search/FacetedSearch';
import SmartRecommendations from '@/components/search/SmartRecommendations';
import SearchResults, { SearchResult } from '@/components/search/SearchResults';
import SearchStats from '@/components/search/SearchStats';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Filter, Sparkles, BarChart3, Settings } from 'lucide-react';
import { searchAllContent } from '@/lib/services/vectorService';

// Mock search results data
const mockSearchResults: SearchResult[] = [
  {
    id: '1',
    type: 'broker' as const,
    title: 'IC Markets',
    description: 'Leading ECN broker with tight spreads and fast execution',
    url: '/brokers/ic-markets',
    trustScore: 95,
    rating: 4.8,
    minDeposit: 200,
    regulation: ['ASIC', 'CySEC'],
    highlights: ['ECN Trading', 'MetaTrader 4/5', 'cTrader']
  },
  {
    id: '2',
    type: 'broker' as const,
    title: 'Pepperstone',
    description: 'Award-winning forex and CFD broker with competitive pricing',
    url: '/brokers/pepperstone',
    trustScore: 92,
    rating: 4.7,
    minDeposit: 200,
    regulation: ['ASIC', 'FCA'],
    highlights: ['Razor Spreads', 'Social Trading', 'AutoChartist']
  },
  {
    id: '3',
    type: 'article' as const,
    title: 'Best Forex Brokers for Beginners 2024',
    description: 'Complete guide to choosing your first forex broker with safety tips',
    url: '/articles/best-forex-brokers-beginners-2024',
    category: 'Education',
    readTime: '8 min read',
    publishDate: '2024-01-15'
  },
  {
    id: '4',
    type: 'blog' as const,
    title: 'Market Analysis: EUR/USD Weekly Outlook',
    description: 'Technical and fundamental analysis for the upcoming week',
    url: '/blog/eurusd-weekly-outlook-jan-2024',
    category: 'Market Analysis',
    readTime: '5 min read',
    publishDate: '2024-01-20'
  },
  {
    id: '5',
    type: 'broker' as const,
    title: 'XM Group',
    description: 'Global multi-asset broker with extensive educational resources',
    url: '/brokers/xm-group',
    trustScore: 88,
    rating: 4.5,
    minDeposit: 5,
    regulation: ['CySEC', 'ASIC'],
    highlights: ['No Deposit Bonus', 'Educational Resources', 'Multi-Asset']
  }
];

interface SearchFilters {
  category: 'all' | 'brokers' | 'articles' | 'guides' | 'news' | 'tools';
  trustScoreMin: number;
  trustScoreMax: number;
  ratingMin: number;
  maxDeposit: number;
  regulation: string[];
  features: string[];
  sortBy: 'relevance' | 'trust_score' | 'rating' | 'name';
  // Advanced filters
  brokerType: string[];
  tradingPlatforms: string[];
  instruments: string[];
  accountTypes: string[];
  paymentMethods: string[];
  countries: string[];
  languages: string[];
  spreadType: string;
  maxLeverage: number;
  minDeposit: number;
  contentType: string[];
  difficulty: string[];
  readingTimeMax: number;
  dateFrom?: string;
  dateTo?: string;
  // Additional properties for AdvancedSearchFilters compatibility
  maxSpread: number;
  minLeverage: number;
  dateRange: string;
  foundedAfter: number;
  readingTime: number;
}

export default function SearchPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams?.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<SearchFilters>({
    category: 'all',
    sortBy: 'relevance',
    trustScoreMin: 0,
    trustScoreMax: 100,
    ratingMin: 0,
    maxDeposit: 10000,
    regulation: [],
    features: [],
    // Advanced filters with default values
    brokerType: [],
    tradingPlatforms: [],
    instruments: [],
    accountTypes: [],
    paymentMethods: [],
    countries: [],
    languages: [],
    spreadType: 'variable',
    maxLeverage: 500,
    minDeposit: 0,
    contentType: [],
    difficulty: [],
    readingTimeMax: 60,
    dateFrom: undefined,
    dateTo: undefined,
    // Additional properties for AdvancedSearchFilters compatibility
    maxSpread: 5,
    minLeverage: 1,
    dateRange: 'all',
    foundedAfter: 2000,
    readingTime: 30
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchMode, setSearchMode] = useState<'simple' | 'advanced' | 'faceted'>('simple');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState(mockSearchResults);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTime, setSearchTime] = useState(0.23);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const resultsPerPage = 10;

  // Perform search
  const performSearch = async (searchQuery: string, searchFilters: SearchFilters) => {
    setIsLoading(true);
    const startTime = Date.now();
    
    try {
      // In a real app, this would call the actual search API
      // For now, we'll simulate the search with mock data
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
      
      const results = mockSearchResults.filter(result => {
        // Text search
        if (searchQuery && !result.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !result.description.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }
        
        // Category filter
        if (searchFilters.category !== 'all') {
          const categoryMap: Record<string, string> = {
            'brokers': 'broker',
            'articles': 'article',
            'news': 'blog',
            'guides': 'article',
            'tools': 'comparison'
          };
          const mappedCategory = categoryMap[searchFilters.category] || searchFilters.category;
          if (result.type !== mappedCategory) {
            return false;
          }
        }
        
        // Broker-specific filters
        if (result.type === 'broker') {
          if (result.trustScore && result.trustScore < searchFilters.trustScoreMin) return false;
          if (result.trustScore && result.trustScore > searchFilters.trustScoreMax) return false;
          if (result.rating && result.rating < searchFilters.ratingMin) return false;
          if (result.minDeposit && searchFilters.minDeposit && result.minDeposit < searchFilters.minDeposit) return false;
          if (result.minDeposit && result.minDeposit > searchFilters.maxDeposit) return false;
          
          if (searchFilters.regulation.length > 0 && result.regulation && 
              !searchFilters.regulation.some(reg => result.regulation?.includes(reg))) {
            return false;
          }
          
          if (searchFilters.features.length > 0 && 'features' in result &&
              Array.isArray(result.features) &&
              !searchFilters.features.some(feature => (result.features as string[])?.includes(feature))) {
            return false;
          }
          
          // Advanced filters
          if (searchFilters.brokerType && searchFilters.brokerType.length > 0) {
            // Mock broker type check
            return true; // In real app, check against broker type
          }
          
          if (searchFilters.tradingPlatforms && searchFilters.tradingPlatforms.length > 0) {
            // Mock platform check
            return true; // In real app, check against available platforms
          }
        }
        
        return true;
      });
      
      // Sort results
      const sortedResults = [...results].sort((a, b) => {
        switch (searchFilters.sortBy) {
          case 'trust_score':
            return (b.trustScore || 0) - (a.trustScore || 0);
          case 'rating':
            return (b.rating || 0) - (a.rating || 0);
          case 'name':
            return a.title.localeCompare(b.title);
          default: // relevance
            return 0;
        }
      });
      
      setSearchResults(sortedResults);
      setSearchTime((Date.now() - startTime) / 1000);
      
      // Add to search history
      if (searchQuery && !searchHistory.includes(searchQuery)) {
        setSearchHistory(prev => [searchQuery, ...prev.slice(0, 9)]); // Keep last 10 searches
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and paginate results
  const totalResults = searchResults.length;
  const totalPages = Math.ceil(totalResults / resultsPerPage);
  const startIndex = (currentPage - 1) * resultsPerPage;
  const paginatedResults = searchResults.slice(startIndex, startIndex + resultsPerPage);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [query, filters]);
  
  useEffect(() => {
    if (query || Object.keys(filters).some(key => {
      const value = filters[key as keyof SearchFilters];
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'string') return value !== 'all' && value !== 'relevance';
      if (typeof value === 'number') return value > 0 && key !== 'trustScoreMax' && key !== 'maxDeposit';
      return false;
    })) {
      performSearch(query, filters);
    }
  }, [query, filters]);
  
  const handleFiltersChange = (newFilters: any) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };
  
  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
  };
  
  const handleClearFilter = (filterType: string, value?: string) => {
    const newFilters = { ...filters };
    
    switch (filterType) {
      case 'category':
        newFilters.category = 'all';
        break;
      case 'trustScore':
        newFilters.trustScoreMin = 0;
        newFilters.trustScoreMax = 100;
        break;
      case 'rating':
        newFilters.ratingMin = 0;
        break;
      case 'regulation':
        if (value) {
          newFilters.regulation = newFilters.regulation.filter(r => r !== value);
        } else {
          newFilters.regulation = [];
        }
        break;
      case 'features':
        if (value) {
          newFilters.features = newFilters.features.filter(f => f !== value);
        } else {
          newFilters.features = [];
        }
        break;
      case 'sortBy':
        newFilters.sortBy = 'relevance';
        break;
    }
    
    setFilters(newFilters);
  };
  
  const handleClearAllFilters = () => {
    setFilters({
      category: 'all',
      sortBy: 'relevance',
      trustScoreMin: 0,
      trustScoreMax: 100,
      ratingMin: 0,
      maxDeposit: 10000,
      minDeposit: 0,
      regulation: [],
      features: [],
      // Advanced filters with default values
      brokerType: [],
      tradingPlatforms: [],
      instruments: [],
      accountTypes: [],
      paymentMethods: [],
      countries: [],
      languages: [],
      spreadType: 'variable',
      maxLeverage: 500,
      contentType: [],
      difficulty: [],
      readingTimeMax: 60,
      dateFrom: undefined,
      dateTo: undefined,
      // Additional properties for AdvancedSearchFilters compatibility
      maxSpread: 5,
      minLeverage: 1,
      dateRange: 'all',
      foundedAfter: 2000,
      readingTime: 30
    });
  };

  const handleApplyRecommendation = (recommendation: any) => {
    if (recommendation.type === 'search') {
      setQuery(recommendation.title);
    } else if (recommendation.type === 'filter' && recommendation.filters) {
      handleFiltersChange(recommendation.filters);
    } else if (recommendation.url) {
      router.push(recommendation.url);
    }
  };

  const handleSearchRecommendation = (searchQuery: string) => {
    setQuery(searchQuery);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Search Results
          </h1>
          
          {/* Search Bar */}
          <div className="mb-6">
            <SearchBar
              placeholder="Search brokers, articles, or topics..."
              onSearch={handleSearch}
              size="lg"
              autoFocus={!query}
            />
          </div>
          
          {/* Search Stats */}
          <SearchStats
            query={query}
            totalResults={totalResults}
            searchTime={searchTime}
            activeFilters={{
              category: filters.category !== 'all' ? filters.category : undefined,
              trustScore: filters.trustScoreMin > 0 ? [filters.trustScoreMin, 100] as [number, number] : undefined,
              rating: filters.ratingMin > 0 ? filters.ratingMin : undefined,
              regulation: filters.regulation.length > 0 ? filters.regulation : undefined,
              features: filters.features.length > 0 ? filters.features : undefined,
              sortBy: filters.sortBy !== 'relevance' ? filters.sortBy : undefined
            }}
            onClearFilter={handleClearFilter}
            onClearAllFilters={handleClearAllFilters}
          />
        </div>
        
        {/* Smart Recommendations */}
        {(!query && searchHistory.length === 0) && (
          <div className="mb-8">
            <SmartRecommendations
              onApplyRecommendation={handleApplyRecommendation}
              onSearchRecommendation={handleSearchRecommendation}
              searchHistory={searchHistory}
              currentFilters={filters}
              currentQuery={query}
            />
          </div>
        )}
        
        {/* Search Mode Tabs */}
        <Tabs value={searchMode} onValueChange={(value) => setSearchMode(value as any)} className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="simple" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Simple Search
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Advanced Filters
            </TabsTrigger>
            <TabsTrigger value="faceted" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Faceted Search
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="simple" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Simple Filters Sidebar */}
              <div className="lg:col-span-1">
                <div className="lg:sticky lg:top-4">
                  <SearchFilters
                    onFiltersChange={handleFiltersChange}
                    initialFilters={filters}
                  />
                </div>
              </div>
              
              {/* Results */}
              <div className="lg:col-span-3">
                <SearchResults
                  results={paginatedResults}
                  isLoading={isLoading}
                  searchQuery={query}
                  filters={filters}
                  totalResults={totalResults}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Advanced Filters Sidebar */}
              <div className="lg:col-span-1">
                <div className="lg:sticky lg:top-4">
                  <AdvancedSearchFilters
                    onFiltersChange={handleFiltersChange}
                    initialFilters={filters}
                  />
                </div>
              </div>
              
              {/* Results */}
              <div className="lg:col-span-3">
                <SearchResults
                  results={paginatedResults}
                  isLoading={isLoading}
                  searchQuery={query}
                  filters={filters}
                  totalResults={totalResults}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="faceted" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Faceted Search Sidebar */}
              <div className="lg:col-span-1">
                <div className="lg:sticky lg:top-4">
                  <FacetedSearch
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                    resultCount={totalResults}
                    isLoading={isLoading}
                  />
                </div>
              </div>
              
              {/* Results */}
              <div className="lg:col-span-3">
                <SearchResults
                  results={paginatedResults}
                  isLoading={isLoading}
                  searchQuery={query}
                  filters={filters}
                  totalResults={totalResults}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
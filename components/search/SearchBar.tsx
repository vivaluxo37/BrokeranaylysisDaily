'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, X, Clock, TrendingUp, Star } from 'lucide-react';
import Link from 'next/link';

interface SearchSuggestion {
  id: string;
  type: 'broker' | 'article' | 'query' | 'recent';
  title: string;
  subtitle?: string;
  url?: string;
  trustScore?: number;
  category?: string;
}

interface SearchBarProps {
  placeholder?: string;
  showSuggestions?: boolean;
  autoFocus?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onSearch?: (query: string) => void;
}

// Mock suggestions data
const mockSuggestions: SearchSuggestion[] = [
  {
    id: '1',
    type: 'broker',
    title: 'IC Markets',
    subtitle: 'ECN Broker with tight spreads',
    url: '/brokers/ic-markets',
    trustScore: 95
  },
  {
    id: '2',
    type: 'broker',
    title: 'Pepperstone',
    subtitle: 'Award-winning forex broker',
    url: '/brokers/pepperstone',
    trustScore: 92
  },
  {
    id: '3',
    type: 'article',
    title: 'Best Forex Brokers 2024',
    subtitle: 'Complete broker comparison guide',
    url: '/articles/best-forex-brokers-2024',
    category: 'Education'
  },
  {
    id: '4',
    type: 'query',
    title: 'forex trading platforms',
    subtitle: 'Popular search'
  },
  {
    id: '5',
    type: 'query',
    title: 'low spread brokers',
    subtitle: 'Trending search'
  }
];

const recentSearches = [
  'IC Markets review',
  'best ECN brokers',
  'forex trading tips',
  'MetaTrader 5 brokers'
];

export default function SearchBar({
  placeholder = 'Search brokers, articles, or topics...',
  showSuggestions = true,
  autoFocus = false,
  size = 'md',
  className = '',
  onSearch
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [recentQueries, setRecentQueries] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('brokeranalysis-recent-searches');
    if (saved) {
      setRecentQueries(JSON.parse(saved));
    } else {
      setRecentQueries(recentSearches);
    }
  }, []);

  useEffect(() => {
    // Filter suggestions based on query
    if (query.length > 0) {
      const filtered = mockSuggestions.filter(suggestion =>
        suggestion.title.toLowerCase().includes(query.toLowerCase()) ||
        suggestion.subtitle?.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
    setSelectedIndex(-1);
  }, [query]);

  useEffect(() => {
    // Handle click outside
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    // Save to recent searches
    const updated = [searchQuery, ...recentQueries.filter(q => q !== searchQuery)].slice(0, 5);
    setRecentQueries(updated);
    localStorage.setItem('brokeranalysis-recent-searches', JSON.stringify(updated));

    // Close suggestions
    setIsOpen(false);
    setQuery('');

    // Handle search
    if (onSearch) {
      onSearch(searchQuery);
    } else {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIndex >= 0) {
      const selected = suggestions[selectedIndex];
      if (selected.url) {
        router.push(selected.url);
      } else {
        handleSearch(selected.title);
      }
    } else {
      handleSearch(query);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > -1 ? prev - 1 : prev);
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const clearRecentSearches = () => {
    setRecentQueries([]);
    localStorage.removeItem('brokeranalysis-recent-searches');
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-10 text-sm';
      case 'lg':
        return 'h-14 text-lg';
      default:
        return 'h-12 text-base';
    }
  };

  const renderSuggestion = (suggestion: SearchSuggestion, index: number) => {
    const isSelected = index === selectedIndex;
    
    return (
      <div
        key={suggestion.id}
        className={`px-4 py-3 cursor-pointer transition-colors ${
          isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
        }`}
        onClick={() => {
          if (suggestion.url) {
            router.push(suggestion.url);
          } else {
            handleSearch(suggestion.title);
          }
        }}
      >
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            {suggestion.type === 'broker' && (
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </div>
            )}
            {suggestion.type === 'article' && (
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Star className="h-4 w-4 text-green-600" />
              </div>
            )}
            {suggestion.type === 'query' && (
              <Search className="h-4 w-4 text-gray-400" />
            )}
            {suggestion.type === 'recent' && (
              <Clock className="h-4 w-4 text-gray-400" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-900 truncate">
                {suggestion.title}
              </span>
              {suggestion.trustScore && (
                <Badge variant="secondary" className="text-xs">
                  {suggestion.trustScore}/100
                </Badge>
              )}
              {suggestion.category && (
                <Badge variant="outline" className="text-xs">
                  {suggestion.category}
                </Badge>
              )}
            </div>
            {suggestion.subtitle && (
              <p className="text-sm text-gray-500 truncate">
                {suggestion.subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${
            size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5'
          }`} />
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => showSuggestions && setIsOpen(true)}
            onKeyDown={handleKeyDown}
            autoFocus={autoFocus}
            className={`pl-10 pr-12 ${getSizeClasses()}`}
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <Button
            type="submit"
            size="sm"
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${
              size === 'sm' ? 'h-6 px-2' : size === 'lg' ? 'h-10 px-4' : 'h-8 px-3'
            }`}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-96 overflow-y-auto shadow-lg">
          <CardContent className="p-0">
            {query.length === 0 && recentQueries.length > 0 && (
              <div>
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <h3 className="text-sm font-medium text-gray-700">Recent Searches</h3>
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Clear
                  </button>
                </div>
                {recentQueries.map((recent, index) => (
                  <div
                    key={index}
                    className="px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleSearch(recent)}
                  >
                    <div className="flex items-center space-x-3">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-700">{recent}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {suggestions.length > 0 && (
              <div>
                {query.length > 0 && (
                  <div className="px-4 py-2 border-b border-gray-100">
                    <h3 className="text-sm font-medium text-gray-700">Suggestions</h3>
                  </div>
                )}
                {suggestions.map((suggestion, index) => renderSuggestion(suggestion, index))}
              </div>
            )}

            {query.length > 0 && suggestions.length === 0 && (
              <div className="px-4 py-6 text-center text-gray-500">
                <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No suggestions found</p>
                <p className="text-xs mt-1">Press Enter to search for "{query}"</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
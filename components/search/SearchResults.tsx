'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Shield, TrendingUp, Clock, User, ExternalLink, Search } from 'lucide-react';
import Link from 'next/link';
import { SearchFilters } from './SearchFilters';

export interface SearchResult {
  id: string;
  type: 'broker' | 'article' | 'blog' | 'comparison';
  title: string;
  description: string;
  url: string;
  trustScore?: number;
  rating?: number;
  minDeposit?: number;
  regulation?: string[];
  highlights?: string[];
  category?: string;
  readTime?: string;
  publishDate?: string;
  author?: string;
  tags?: string[];
  featured?: boolean;
}

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  searchQuery: string;
  filters: SearchFilters;
  totalResults: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function SearchResults({
  results,
  isLoading,
  searchQuery,
  filters,
  totalResults,
  currentPage,
  totalPages,
  onPageChange
}: SearchResultsProps) {

  const renderBrokerResult = (result: SearchResult) => (
    <Card key={result.id} className={`hover:shadow-lg transition-all duration-200 ${result.featured ? 'ring-2 ring-blue-200' : ''}`}>
      <CardContent className="p-6">
        {result.featured && (
          <div className="flex items-center space-x-2 mb-3">
            <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              Featured
            </Badge>
          </div>
        )}
        
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <Link href={result.url} className="text-xl font-semibold text-blue-600 hover:text-blue-800 transition-colors">
              {result.title}
            </Link>
            <p className="text-gray-600 mt-2 leading-relaxed">{result.description}</p>
          </div>
          
          <div className="flex flex-col items-end space-y-3 ml-6">
            {result.trustScore && (
              <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="font-semibold text-green-700">{result.trustScore}/100</span>
              </div>
            )}
            
            {result.rating && (
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="font-medium text-gray-700">{result.rating}</span>
                <span className="text-sm text-gray-500">/5</span>
              </div>
            )}
          </div>
        </div>
        
        {result.highlights && result.highlights.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {result.highlights.slice(0, 4).map((highlight, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {highlight}
              </Badge>
            ))}
            {result.highlights.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{result.highlights.length - 4} more
              </Badge>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            {result.minDeposit !== undefined && (
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-4 w-4" />
                <span>Min: ${result.minDeposit}</span>
              </div>
            )}
            
            {result.regulation && result.regulation.length > 0 && (
              <div className="flex items-center space-x-1">
                <Shield className="h-4 w-4" />
                <span>Regulated: {result.regulation.slice(0, 2).join(', ')}</span>
                {result.regulation.length > 2 && <span>+{result.regulation.length - 2}</span>}
              </div>
            )}
          </div>
          
          <Link href={result.url}>
            <Button variant="outline" size="sm" className="hover:bg-blue-50">
              View Details
              <ExternalLink className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );

  const renderContentResult = (result: SearchResult) => (
    <Card key={result.id} className={`hover:shadow-lg transition-all duration-200 ${result.featured ? 'ring-2 ring-blue-200' : ''}`}>
      <CardContent className="p-6">
        {result.featured && (
          <div className="flex items-center space-x-2 mb-3">
            <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              Featured
            </Badge>
          </div>
        )}
        
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Link href={result.url} className="text-xl font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                {result.title}
              </Link>
              {result.category && (
                <Badge variant={result.type === 'article' ? 'default' : 'outline'} className="text-xs">
                  {result.category}
                </Badge>
              )}
            </div>
            <p className="text-gray-600 leading-relaxed">{result.description}</p>
          </div>
        </div>
        
        {result.tags && result.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {result.tags.slice(0, 5).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
            {result.tags.length > 5 && (
              <Badge variant="outline" className="text-xs">
                +{result.tags.length - 5} more
              </Badge>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            {result.readTime && (
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{result.readTime}</span>
              </div>
            )}
            
            {result.author && (
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>{result.author}</span>
              </div>
            )}
            
            {result.publishDate && (
              <span>{new Date(result.publishDate).toLocaleDateString()}</span>
            )}
          </div>
          
          <Link href={result.url}>
            <Button variant="outline" size="sm" className="hover:bg-blue-50">
              Read More
              <ExternalLink className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );

  const renderLoadingSkeleton = () => (
    <div className="space-y-6">
      {[1, 2, 3, 4, 5].map((i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
              <div className="ml-6">
                <div className="h-8 w-20 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="flex space-x-2 mb-4">
              <div className="h-6 bg-gray-200 rounded w-16"></div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
              <div className="h-6 bg-gray-200 rounded w-18"></div>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <div className="flex space-x-4">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="h-8 w-24 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderEmptyState = () => (
    <Card>
      <CardContent className="p-12 text-center">
        <Search className="h-16 w-16 text-gray-400 mx-auto mb-6" />
        <h3 className="text-xl font-medium text-gray-900 mb-3">
          No results found
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          {searchQuery 
            ? `We couldn't find any results for "${searchQuery}". Try adjusting your search terms or filters.`
            : 'Try adjusting your filters to see more results.'
          }
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
      </CardContent>
    </Card>
  );

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
      const pages = [];
      const maxVisible = 5;
      
      if (totalPages <= maxVisible) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        if (currentPage <= 3) {
          for (let i = 1; i <= 4; i++) pages.push(i);
          pages.push('...');
          pages.push(totalPages);
        } else if (currentPage >= totalPages - 2) {
          pages.push(1);
          pages.push('...');
          for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
        } else {
          pages.push(1);
          pages.push('...');
          for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
          pages.push('...');
          pages.push(totalPages);
        }
      }
      
      return pages;
    };

    return (
      <div className="mt-8 flex items-center justify-center space-x-2">
        <Button
          variant="outline"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        
        {getPageNumbers().map((page, index) => (
          page === '...' ? (
            <span key={index} className="px-3 py-2 text-gray-500">...</span>
          ) : (
            <Button
              key={index}
              variant={currentPage === page ? 'default' : 'outline'}
              onClick={() => onPageChange(page as number)}
              className={currentPage === page ? 'bg-blue-600 text-white' : ''}
            >
              {page}
            </Button>
          )
        ))}
        
        <Button
          variant="outline"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {searchQuery ? (
              <>
                Results for <span className="text-blue-600">"{searchQuery}"</span>
              </>
            ) : (
              'All Results'
            )}
          </h2>
          {!isLoading && (
            <p className="text-gray-600 mt-1">
              {totalResults.toLocaleString()} result{totalResults !== 1 ? 's' : ''} found
              {totalPages > 1 && (
                <span> • Page {currentPage} of {totalPages}</span>
              )}
            </p>
          )}
        </div>
        
        {filters.category !== 'all' && (
          <Badge variant="secondary" className="capitalize">
            {filters.category}
          </Badge>
        )}
      </div>

      {/* Results */}
      {isLoading ? (
        renderLoadingSkeleton()
      ) : results.length === 0 ? (
        renderEmptyState()
      ) : (
        <div className="space-y-6">
          {results.map((result) => (
            result.type === 'broker' ? renderBrokerResult(result) : renderContentResult(result)
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && results.length > 0 && renderPagination()}
    </div>
  );
}
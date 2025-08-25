/**
 * Loading state components specifically for broker pages
 */

import React from 'react';
import { Skeleton } from './skeleton';

interface LoadingStateProps {
  className?: string;
}

/**
 * Loading state for broker cards
 */
export const BrokerCardSkeleton: React.FC<LoadingStateProps> = ({ className = '' }) => {
  return (
    <div className={`border rounded-lg p-6 space-y-4 ${className}`}>
      {/* Broker header */}
      <div className="flex items-center space-x-4">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-32" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>

      {/* Broker details */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-18" />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex space-x-3">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-20" />
      </div>
    </div>
  );
};

/**
 * Loading state for broker list
 */
export const BrokerListSkeleton: React.FC<{ count?: number; className?: string }> = ({ 
  count = 6, 
  className = '' 
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <BrokerCardSkeleton key={index} />
      ))}
    </div>
  );
};

/**
 * Loading state for broker page header
 */
export const BrokerPageHeaderSkeleton: React.FC<LoadingStateProps> = ({ className = '' }) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Page title and icon */}
      <div className="flex items-center space-x-4">
        <Skeleton className="w-16 h-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="text-center space-y-2">
            <Skeleton className="h-8 w-12 mx-auto" />
            <Skeleton className="h-4 w-20 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Loading state for broker comparison table
 */
export const BrokerTableSkeleton: React.FC<{ rows?: number; className?: string }> = ({ 
  rows = 5, 
  className = '' 
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Table header */}
      <div className="grid grid-cols-5 gap-4 p-4 border-b">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-18" />
        <Skeleton className="h-5 w-22" />
        <Skeleton className="h-5 w-16" />
      </div>

      {/* Table rows */}
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="grid grid-cols-5 gap-4 p-4 border-b">
          <div className="flex items-center space-x-2">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-4 w-18" />
          <Skeleton className="h-8 w-20" />
        </div>
      ))}
    </div>
  );
};

/**
 * Loading state for broker filters
 */
export const BrokerFiltersSkeleton: React.FC<LoadingStateProps> = ({ className = '' }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-wrap gap-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-24" />
        ))}
      </div>
      <div className="flex items-center space-x-4">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-28" />
      </div>
    </div>
  );
};

/**
 * Error state component for broker pages
 */
interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
  className?: string;
}

export const BrokerErrorState: React.FC<ErrorStateProps> = ({
  title = 'Unable to Load Brokers',
  message = 'We\'re having trouble loading broker data. Please try again.',
  onRetry,
  showRetry = true,
  className = ''
}) => {
  return (
    <div className={`text-center py-12 space-y-4 ${className}`}>
      {/* Error icon */}
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
      </div>

      {/* Error content */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-600 max-w-md mx-auto">{message}</p>
      </div>

      {/* Retry button */}
      {showRetry && onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Try Again
        </button>
      )}
    </div>
  );
};

/**
 * Empty state component for when no brokers are found
 */
interface EmptyStateProps {
  title?: string;
  message?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const BrokerEmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Brokers Found',
  message = 'No brokers match your current criteria. Try adjusting your filters.',
  actionText = 'Clear Filters',
  onAction,
  className = ''
}) => {
  return (
    <div className={`text-center py-12 space-y-4 ${className}`}>
      {/* Empty icon */}
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Empty content */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-600 max-w-md mx-auto">{message}</p>
      </div>

      {/* Action button */}
      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

/**
 * Combined loading wrapper for broker pages
 */
interface BrokerPageWrapperProps {
  loading: boolean;
  error?: string | null;
  empty?: boolean;
  onRetry?: () => void;
  onClearFilters?: () => void;
  children: React.ReactNode;
  className?: string;
}

export const BrokerPageWrapper: React.FC<BrokerPageWrapperProps> = ({
  loading,
  error,
  empty,
  onRetry,
  onClearFilters,
  children,
  className = ''
}) => {
  if (loading) {
    return (
      <div className={className}>
        <BrokerPageHeaderSkeleton />
        <div className="mt-8">
          <BrokerListSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        <BrokerErrorState
          message={error}
          onRetry={onRetry}
          showRetry={!!onRetry}
        />
      </div>
    );
  }

  if (empty) {
    return (
      <div className={className}>
        <BrokerEmptyState
          onAction={onClearFilters}
          actionText={onClearFilters ? 'Clear Filters' : undefined}
        />
      </div>
    );
  }

  return <div className={className}>{children}</div>;
};

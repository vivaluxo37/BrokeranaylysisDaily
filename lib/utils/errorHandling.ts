/**
 * Comprehensive error handling utilities for broker pages
 */

export interface ErrorInfo {
  message: string;
  code?: string;
  context?: string;
  timestamp: Date;
}

export interface FallbackOptions {
  showFallbackContent?: boolean;
  fallbackMessage?: string;
  retryable?: boolean;
  logError?: boolean;
}

/**
 * Standard error codes for broker-related operations
 */
export const ERROR_CODES = {
  DATABASE_CONNECTION_FAILED: 'DATABASE_CONNECTION_FAILED',
  BROKER_DATA_NOT_FOUND: 'BROKER_DATA_NOT_FOUND',
  INVALID_BROKER_DATA: 'INVALID_BROKER_DATA',
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
} as const;

/**
 * Create a standardized error object
 */
export function createError(
  message: string,
  code?: string,
  context?: string
): ErrorInfo {
  return {
    message,
    code,
    context,
    timestamp: new Date()
  };
}

/**
 * Handle broker data fetching errors with fallback mechanisms
 */
export function handleBrokerDataError(
  error: unknown,
  context: string,
  options: FallbackOptions = {}
): ErrorInfo {
  const {
    logError = true,
    showFallbackContent = true,
    fallbackMessage = 'Unable to load broker data. Please try again later.',
    retryable = true
  } = options;

  let errorInfo: ErrorInfo;

  if (error instanceof Error) {
    // Network/connection errors
    if (error.message.includes('fetch') || error.message.includes('network')) {
      errorInfo = createError(
        fallbackMessage,
        ERROR_CODES.NETWORK_ERROR,
        context
      );
    }
    // Database errors
    else if (error.message.includes('database') || error.message.includes('supabase')) {
      errorInfo = createError(
        fallbackMessage,
        ERROR_CODES.DATABASE_CONNECTION_FAILED,
        context
      );
    }
    // Timeout errors
    else if (error.message.includes('timeout')) {
      errorInfo = createError(
        fallbackMessage,
        ERROR_CODES.TIMEOUT_ERROR,
        context
      );
    }
    // Generic error
    else {
      errorInfo = createError(
        error.message,
        ERROR_CODES.UNKNOWN_ERROR,
        context
      );
    }
  } else {
    errorInfo = createError(
      'An unexpected error occurred',
      ERROR_CODES.UNKNOWN_ERROR,
      context
    );
  }

  if (logError) {
    console.error(`[${context}] Error:`, {
      message: errorInfo.message,
      code: errorInfo.code,
      timestamp: errorInfo.timestamp,
      originalError: error
    });
  }

  return errorInfo;
}

/**
 * Validate broker data structure
 */
export function validateBrokerData(broker: any): boolean {
  if (!broker || typeof broker !== 'object') {
    return false;
  }

  // Required fields
  const requiredFields = ['id', 'name', 'slug'];
  for (const field of requiredFields) {
    if (!broker[field]) {
      return false;
    }
  }

  return true;
}

/**
 * Clean and validate broker array
 */
export function cleanBrokerArray(brokers: any[]): any[] {
  if (!Array.isArray(brokers)) {
    return [];
  }

  return brokers.filter(broker => validateBrokerData(broker));
}

/**
 * Retry mechanism for broker data fetching
 */
export async function retryBrokerOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        break;
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }

  throw lastError;
}

/**
 * Safe broker data fetcher with comprehensive error handling
 */
export async function safeBrokerDataFetch<T>(
  fetchFunction: () => Promise<T>,
  fallbackData: T,
  context: string,
  options: FallbackOptions = {}
): Promise<T> {
  try {
    const result = await retryBrokerOperation(fetchFunction);
    
    // Validate result if it's an array
    if (Array.isArray(result)) {
      const cleanedResult = cleanBrokerArray(result as any[]);
      if (cleanedResult.length === 0 && Array.isArray(fallbackData)) {
        console.log(`[${context}] No valid data returned, using fallback`);
        return fallbackData;
      }
      return cleanedResult as T;
    }

    return result;
  } catch (error) {
    const errorInfo = handleBrokerDataError(error, context, options);
    
    // Return fallback data
    console.log(`[${context}] Using fallback data due to error:`, errorInfo.code);
    return fallbackData;
  }
}

/**
 * Create error boundary props for React components
 */
export function createErrorBoundaryProps(context: string) {
  return {
    onError: (error: Error, errorInfo: any) => {
      const errorDetails = createError(
        error.message,
        ERROR_CODES.UNKNOWN_ERROR,
        context
      );
      
      console.error(`[ErrorBoundary:${context}]`, {
        error: errorDetails,
        componentStack: errorInfo.componentStack
      });
    }
  };
}

/**
 * Format error message for user display
 */
export function formatErrorForUser(error: ErrorInfo): string {
  switch (error.code) {
    case ERROR_CODES.DATABASE_CONNECTION_FAILED:
      return 'We\'re experiencing temporary connectivity issues. Please try again in a moment.';
    case ERROR_CODES.BROKER_DATA_NOT_FOUND:
      return 'No broker data found for your criteria. Please try adjusting your filters.';
    case ERROR_CODES.NETWORK_ERROR:
      return 'Network connection issue. Please check your internet connection and try again.';
    case ERROR_CODES.TIMEOUT_ERROR:
      return 'Request timed out. Please try again.';
    default:
      return 'Something went wrong. Please try again later.';
  }
}

/**
 * Log performance metrics for broker data operations
 */
export function logPerformanceMetric(
  operation: string,
  startTime: number,
  success: boolean,
  dataCount?: number
) {
  const duration = Date.now() - startTime;
  
  console.log(`[Performance:${operation}]`, {
    duration: `${duration}ms`,
    success,
    dataCount,
    timestamp: new Date().toISOString()
  });
}

import {
  AIProvider,
  RateLimitStatus,
  AIServiceError
} from '../types';

/**
 * Rate Limiting and Error Handling System
 * Manages API rate limits and implements fallback mechanisms
 */
export class RateLimiter {
  private limits: Map<string, RateLimitConfig>;
  private usage: Map<string, RateLimitUsage>;
  private circuitBreakers: Map<string, CircuitBreaker>;
  private retryQueues: Map<string, RetryQueue>;
  private fallbackChains: Map<AIProvider, AIProvider[]>;

  constructor() {
    this.limits = new Map();
    this.usage = new Map();
    this.circuitBreakers = new Map();
    this.retryQueues = new Map();
    this.fallbackChains = new Map();
    
    this.initializeDefaultLimits();
    this.initializeFallbackChains();
    this.startCleanupInterval();
  }

  /**
   * Check if a request can be made to a provider
   */
  async canMakeRequest(provider: AIProvider, model?: string): Promise<boolean> {
    const key = this.getKey(provider, model);
    
    // Check circuit breaker
    const circuitBreaker = this.getCircuitBreaker(key);
    if (circuitBreaker.state === 'open') {
      return false;
    }
    
    // Check rate limits
    const usage = this.getUsage(key);
    const limit = this.getLimit(key);
    
    const now = Date.now();
    
    // Clean old requests
    usage.requests = usage.requests.filter(timestamp => 
      now - timestamp < limit.windowMs
    );
    
    // Check if under limit
    return usage.requests.length < limit.maxRequests;
  }

  /**
   * Record a successful request
   */
  recordRequest(provider: AIProvider, model?: string): void {
    const key = this.getKey(provider, model);
    const usage = this.getUsage(key);
    const circuitBreaker = this.getCircuitBreaker(key);
    
    usage.requests.push(Date.now());
    usage.lastRequest = Date.now();
    
    // Record success for circuit breaker
    circuitBreaker.recordSuccess();
  }

  /**
   * Record a failed request
   */
  recordFailure(provider: AIProvider, error: AIServiceError, model?: string): void {
    const key = this.getKey(provider, model);
    const circuitBreaker = this.getCircuitBreaker(key);
    
    // Record failure for circuit breaker
    circuitBreaker.recordFailure(error);
    
    // Add to retry queue if retryable
    if (error.retryable) {
      this.addToRetryQueue(provider, error, model);
    }
  }

  /**
   * Get current rate limit status
   */
  getRateLimitStatus(provider: AIProvider, model?: string): RateLimitStatus {
    const key = this.getKey(provider, model);
    const usage = this.getUsage(key);
    const limit = this.getLimit(key);
    const circuitBreaker = this.getCircuitBreaker(key);
    
    const now = Date.now();
    
    // Clean old requests
    usage.requests = usage.requests.filter(timestamp => 
      now - timestamp < limit.windowMs
    );
    
    const remainingRequests = Math.max(0, limit.maxRequests - usage.requests.length);
    const resetTime = usage.requests.length > 0 
      ? new Date(Math.min(...usage.requests) + limit.windowMs)
      : new Date();
    
    return {
      isLimited: usage.requests.length >= limit.maxRequests || circuitBreaker.state === 'open',
      remainingRequests,
      resetTime,
      retryAfter: this.calculateRetryAfter(key),
      circuitBreakerState: circuitBreaker.state,
      errorRate: circuitBreaker.getErrorRate()
    };
  }

  /**
   * Wait for rate limit to reset
   */
  async waitForRateLimit(provider: AIProvider, model?: string): Promise<void> {
    const status = this.getRateLimitStatus(provider, model);
    
    if (!status.isLimited) {
      return;
    }
    
    const waitTime = status.retryAfter || 1000;
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }

  /**
   * Execute request with rate limiting and fallbacks
   */
  async executeWithFallback<T>(
    provider: AIProvider,
    requestFn: () => Promise<T>,
    model?: string,
    maxRetries: number = 3
  ): Promise<T> {
    const providers = [provider, ...(this.fallbackChains.get(provider) || [])];
    let lastError: AIServiceError | null = null;
    
    for (const currentProvider of providers) {
      try {
        // Check if we can make request
        if (!(await this.canMakeRequest(currentProvider, model))) {
          // Try to wait for rate limit
          await this.waitForRateLimit(currentProvider, model);
          
          // Check again after waiting
          if (!(await this.canMakeRequest(currentProvider, model))) {
            continue; // Try next provider
          }
        }
        
        // Execute request with retries
        const result = await this.executeWithRetry(
          currentProvider,
          requestFn,
          maxRetries,
          model
        );
        
        this.recordRequest(currentProvider, model);
        return result;
        
      } catch (error) {
        lastError = error as AIServiceError;
        this.recordFailure(currentProvider, lastError, model);
        
        // If error is not retryable, try next provider immediately
        if (!lastError.retryable) {
          continue;
        }
        
        // If this is the last provider, throw the error
        if (currentProvider === providers[providers.length - 1]) {
          throw lastError;
        }
      }
    }
    
    throw lastError || new Error('All providers failed');
  }

  /**
   * Set custom rate limit for a provider/model
   */
  setRateLimit(provider: AIProvider, config: RateLimitConfig, model?: string): void {
    const key = this.getKey(provider, model);
    this.limits.set(key, config);
  }

  /**
   * Set fallback chain for a provider
   */
  setFallbackChain(provider: AIProvider, fallbacks: AIProvider[]): void {
    this.fallbackChains.set(provider, fallbacks);
  }

  /**
   * Get retry queue status
   */
  getRetryQueueStatus(): Map<string, RetryQueueStatus> {
    const status = new Map<string, RetryQueueStatus>();
    
    for (const [key, queue] of this.retryQueues.entries()) {
      status.set(key, {
        pendingRequests: queue.items.length,
        nextRetryTime: queue.items.length > 0 ? queue.items[0].nextRetry : null,
        totalRetries: queue.totalRetries,
        successfulRetries: queue.successfulRetries
      });
    }
    
    return status;
  }

  /**
   * Process retry queues
   */
  async processRetryQueues(): Promise<void> {
    const now = Date.now();
    
    for (const [key, queue] of this.retryQueues.entries()) {
      const readyItems = queue.items.filter(item => item.nextRetry <= now);
      
      for (const item of readyItems) {
        try {
          // Remove from queue
          queue.items = queue.items.filter(i => i.id !== item.id);
          
          // Try to execute
          await item.requestFn();
          
          queue.successfulRetries++;
          
        } catch (error) {
          queue.totalRetries++;
          
          // Re-add to queue with exponential backoff if retries left
          if (item.retryCount < item.maxRetries) {
            item.retryCount++;
            item.nextRetry = now + this.calculateBackoffDelay(item.retryCount);
            queue.items.push(item);
          }
        }
      }
    }
  }

  /**
   * Clear all rate limit data
   */
  reset(): void {
    this.usage.clear();
    this.circuitBreakers.clear();
    this.retryQueues.clear();
  }

  /**
   * Get comprehensive status report
   */
  getStatusReport(): RateLimiterStatus {
    const providerStatus: Record<AIProvider, any> = {} as any;
    
    for (const provider of Object.values(AIProvider)) {
      const status = this.getRateLimitStatus(provider);
      const retryQueue = this.retryQueues.get(this.getKey(provider));
      
      providerStatus[provider] = {
        rateLimitStatus: status,
        retryQueueSize: retryQueue?.items.length || 0,
        circuitBreakerState: this.getCircuitBreaker(this.getKey(provider)).state,
        fallbackChain: this.fallbackChains.get(provider) || []
      };
    }
    
    return {
      timestamp: new Date(),
      providers: providerStatus,
      totalRetryQueueSize: Array.from(this.retryQueues.values())
        .reduce((sum, queue) => sum + queue.items.length, 0)
    };
  }

  // Private methods
  private getKey(provider: AIProvider, model?: string): string {
    return model ? `${provider}:${model}` : provider;
  }

  private getUsage(key: string): RateLimitUsage {
    if (!this.usage.has(key)) {
      this.usage.set(key, {
        requests: [],
        lastRequest: 0
      });
    }
    return this.usage.get(key)!;
  }

  private getLimit(key: string): RateLimitConfig {
    return this.limits.get(key) || this.getDefaultLimit();
  }

  private getCircuitBreaker(key: string): CircuitBreaker {
    if (!this.circuitBreakers.has(key)) {
      this.circuitBreakers.set(key, new CircuitBreaker());
    }
    return this.circuitBreakers.get(key)!;
  }

  private calculateRetryAfter(key: string): number {
    const usage = this.getUsage(key);
    const limit = this.getLimit(key);
    
    if (usage.requests.length === 0) {
      return 0;
    }
    
    const oldestRequest = Math.min(...usage.requests);
    const resetTime = oldestRequest + limit.windowMs;
    
    return Math.max(0, resetTime - Date.now());
  }

  private async executeWithRetry<T>(
    provider: AIProvider,
    requestFn: () => Promise<T>,
    maxRetries: number,
    model?: string
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on the last attempt
        if (attempt === maxRetries) {
          throw lastError;
        }
        
        // Calculate backoff delay
        const delay = this.calculateBackoffDelay(attempt + 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError!;
  }

  private calculateBackoffDelay(attempt: number): number {
    // Exponential backoff with jitter
    const baseDelay = 1000; // 1 second
    const maxDelay = 30000; // 30 seconds
    
    const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay);
    const jitter = Math.random() * 0.1 * delay; // 10% jitter
    
    return delay + jitter;
  }

  private addToRetryQueue(
    provider: AIProvider,
    error: AIServiceError,
    model?: string
  ): void {
    const key = this.getKey(provider, model);
    
    if (!this.retryQueues.has(key)) {
      this.retryQueues.set(key, {
        items: [],
        totalRetries: 0,
        successfulRetries: 0
      });
    }
    
    const queue = this.retryQueues.get(key)!;
    const retryItem: RetryItem = {
      id: `retry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      provider,
      model,
      error,
      requestFn: async () => { throw new Error('Retry function not implemented'); },
      retryCount: 0,
      maxRetries: 3,
      nextRetry: Date.now() + this.calculateBackoffDelay(1),
      createdAt: Date.now()
    };
    
    queue.items.push(retryItem);
  }

  private initializeDefaultLimits(): void {
    // OpenAI limits
    this.limits.set(AIProvider.OPENAI, {
      maxRequests: 500,
      windowMs: 60000, // 1 minute
      burstLimit: 50
    });
    
    // Groq limits
    this.limits.set(AIProvider.GROQ, {
      maxRequests: 30,
      windowMs: 60000, // 1 minute
      burstLimit: 10
    });
    
    // OpenRouter limits
    this.limits.set(AIProvider.OPENROUTER, {
      maxRequests: 20,
      windowMs: 60000, // 1 minute
      burstLimit: 5
    });
  }

  private initializeFallbackChains(): void {
    // Set up fallback chains
    this.fallbackChains.set(AIProvider.GROQ, [AIProvider.OPENROUTER, AIProvider.OPENAI]);
    this.fallbackChains.set(AIProvider.OPENROUTER, [AIProvider.GROQ, AIProvider.OPENAI]);
    this.fallbackChains.set(AIProvider.OPENAI, [AIProvider.GROQ, AIProvider.OPENROUTER]);
  }

  private getDefaultLimit(): RateLimitConfig {
    return {
      maxRequests: 10,
      windowMs: 60000,
      burstLimit: 5
    };
  }

  private startCleanupInterval(): void {
    // Clean up old data every 5 minutes
    setInterval(() => {
      this.cleanupOldData();
    }, 5 * 60 * 1000);
  }

  private cleanupOldData(): void {
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    
    // Clean up usage data
    for (const [key, usage] of this.usage.entries()) {
      if (now - usage.lastRequest > maxAge) {
        this.usage.delete(key);
      }
    }
    
    // Clean up retry queues
    for (const [key, queue] of this.retryQueues.entries()) {
      queue.items = queue.items.filter(item => 
        now - item.createdAt < maxAge
      );
      
      if (queue.items.length === 0) {
        this.retryQueues.delete(key);
      }
    }
  }
}

/**
 * Circuit Breaker implementation
 */
class CircuitBreaker {
  private failures: number = 0;
  private successes: number = 0;
  private lastFailureTime: number = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  private readonly failureThreshold: number = 5;
  private readonly recoveryTimeout: number = 60000; // 1 minute
  private readonly successThreshold: number = 3;

  recordSuccess(): void {
    this.successes++;
    
    if (this.state === 'half-open' && this.successes >= this.successThreshold) {
      this.state = 'closed';
      this.failures = 0;
      this.successes = 0;
    }
  }

  recordFailure(error: AIServiceError): void {
    this.failures++;
    this.lastFailureTime = Date.now();
    
    if (this.failures >= this.failureThreshold) {
      this.state = 'open';
    }
  }

  get state(): 'closed' | 'open' | 'half-open' {
    // Check if we should transition from open to half-open
    if (this.state === 'open' && 
        Date.now() - this.lastFailureTime > this.recoveryTimeout) {
      this.state = 'half-open';
      this.successes = 0;
    }
    
    return this.state;
  }

  getErrorRate(): number {
    const total = this.failures + this.successes;
    return total > 0 ? this.failures / total : 0;
  }

  reset(): void {
    this.failures = 0;
    this.successes = 0;
    this.state = 'closed';
    this.lastFailureTime = 0;
  }
}

// Type definitions
interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  burstLimit?: number;
}

interface RateLimitUsage {
  requests: number[];
  lastRequest: number;
}

interface RetryItem {
  id: string;
  provider: AIProvider;
  model?: string;
  error: AIServiceError;
  requestFn: () => Promise<any>;
  retryCount: number;
  maxRetries: number;
  nextRetry: number;
  createdAt: number;
}

interface RetryQueue {
  items: RetryItem[];
  totalRetries: number;
  successfulRetries: number;
}

interface RetryQueueStatus {
  pendingRequests: number;
  nextRetryTime: Date | null;
  totalRetries: number;
  successfulRetries: number;
}

interface RateLimiterStatus {
  timestamp: Date;
  providers: Record<AIProvider, {
    rateLimitStatus: RateLimitStatus;
    retryQueueSize: number;
    circuitBreakerState: string;
    fallbackChain: AIProvider[];
  }>;
  totalRetryQueueSize: number;
}

// Export default instance
export const rateLimiter = new RateLimiter();

// Export error handling utilities
export class ErrorHandler {
  /**
   * Classify error type and determine if retryable
   */
  static classifyError(error: any): AIServiceError {
    const baseError: AIServiceError = {
      message: error.message || 'Unknown error',
      code: error.code || 'UNKNOWN_ERROR',
      retryable: false,
      provider: error.provider || 'unknown',
      timestamp: new Date()
    };

    // Rate limit errors
    if (error.status === 429 || error.code === 'RATE_LIMIT_EXCEEDED') {
      return {
        ...baseError,
        code: 'RATE_LIMIT_EXCEEDED',
        retryable: true,
        retryAfter: error.retryAfter || 60000
      };
    }

    // Network errors
    if (error.code === 'ECONNRESET' || error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
      return {
        ...baseError,
        code: 'NETWORK_ERROR',
        retryable: true
      };
    }

    // Server errors (5xx)
    if (error.status >= 500 && error.status < 600) {
      return {
        ...baseError,
        code: 'SERVER_ERROR',
        retryable: true
      };
    }

    // Authentication errors
    if (error.status === 401 || error.status === 403) {
      return {
        ...baseError,
        code: 'AUTHENTICATION_ERROR',
        retryable: false
      };
    }

    // Bad request errors
    if (error.status >= 400 && error.status < 500) {
      return {
        ...baseError,
        code: 'CLIENT_ERROR',
        retryable: false
      };
    }

    return baseError;
  }

  /**
   * Create user-friendly error message
   */
  static createUserMessage(error: AIServiceError): string {
    switch (error.code) {
      case 'RATE_LIMIT_EXCEEDED':
        return 'Service is temporarily busy. Please try again in a moment.';
      case 'NETWORK_ERROR':
        return 'Connection issue detected. Retrying with backup service.';
      case 'SERVER_ERROR':
        return 'Service temporarily unavailable. Trying alternative provider.';
      case 'AUTHENTICATION_ERROR':
        return 'Service authentication issue. Please contact support.';
      case 'CLIENT_ERROR':
        return 'Invalid request. Please check your input and try again.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }

  /**
   * Log error with appropriate level
   */
  static logError(error: AIServiceError, context?: any): void {
    const logData = {
      error: {
        message: error.message,
        code: error.code,
        provider: error.provider,
        retryable: error.retryable
      },
      context,
      timestamp: error.timestamp
    };

    if (error.retryable) {
      console.warn('Retryable AI service error:', logData);
    } else {
      console.error('Non-retryable AI service error:', logData);
    }
  }
}
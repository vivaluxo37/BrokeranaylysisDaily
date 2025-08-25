// Simple in-memory cache for blog performance optimization
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class SimpleCache {
  private cache = new Map<string, CacheEntry<any>>();

  set<T>(key: string, data: T, ttl: number = 3600000): void { // Default 1 hour TTL
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if cache entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// Export singleton instance
export const cache = new SimpleCache();

// Cache keys for different data types
export const CACHE_KEYS = {
  ARTICLES: 'articles',
  ARTICLE_COUNT: 'article_count',
  CATEGORIES: 'categories',
  FEATURED_ARTICLES: 'featured_articles',
  BLOG_METADATA: 'blog_metadata',
  ARTICLE_BY_SLUG: (slug: string) => `article_${slug}`,
  ARTICLES_BY_CATEGORY: (category: string) => `articles_category_${category}`,
  RELATED_ARTICLES: (articleId: string) => `related_${articleId}`,
} as const;

// Cache TTL constants (in milliseconds)
export const CACHE_TTL = {
  SHORT: 900000,    // 15 minutes
  MEDIUM: 3600000,  // 1 hour
  LONG: 7200000,    // 2 hours
  VERY_LONG: 86400000, // 24 hours
} as const;

// Utility function to generate cache key with parameters
export function generateCacheKey(base: string, params: Record<string, any> = {}): string {
  const paramString = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}:${value}`)
    .join('|');
  
  return paramString ? `${base}|${paramString}` : base;
}

// Cleanup expired cache entries every 30 minutes
if (typeof window === 'undefined') { // Only run on server
  setInterval(() => {
    cache.cleanup();
  }, 1800000); // 30 minutes
}

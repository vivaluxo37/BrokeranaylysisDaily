'use client'

// Cache configuration and strategies

export interface CacheConfig {
  ttl: number // Time to live in seconds
  staleWhileRevalidate?: number // SWR time in seconds
  maxAge?: number // Browser cache max age
  sMaxAge?: number // CDN cache max age
  tags?: string[] // Cache tags for invalidation
  revalidate?: number // ISR revalidation time
}

// Cache strategies
export const CacheStrategies = {
  // Static assets (images, fonts, etc.)
  STATIC_ASSETS: {
    ttl: 31536000, // 1 year
    maxAge: 31536000,
    sMaxAge: 31536000
  } as CacheConfig,

  // API responses
  API_RESPONSES: {
    ttl: 300, // 5 minutes
    staleWhileRevalidate: 60,
    maxAge: 300,
    sMaxAge: 600
  } as CacheConfig,

  // Broker data
  BROKER_DATA: {
    ttl: 3600, // 1 hour
    staleWhileRevalidate: 300,
    maxAge: 3600,
    sMaxAge: 7200,
    tags: ['brokers']
  } as CacheConfig,

  // Market data
  MARKET_DATA: {
    ttl: 60, // 1 minute
    staleWhileRevalidate: 30,
    maxAge: 60,
    sMaxAge: 120,
    tags: ['market-data']
  } as CacheConfig,

  // News articles
  NEWS_DATA: {
    ttl: 900, // 15 minutes
    staleWhileRevalidate: 300,
    maxAge: 900,
    sMaxAge: 1800,
    tags: ['news']
  } as CacheConfig,

  // User data
  USER_DATA: {
    ttl: 300, // 5 minutes
    maxAge: 0, // No browser cache for user data
    sMaxAge: 0,
    tags: ['user']
  } as CacheConfig,

  // Search results
  SEARCH_RESULTS: {
    ttl: 1800, // 30 minutes
    staleWhileRevalidate: 600,
    maxAge: 1800,
    sMaxAge: 3600,
    tags: ['search']
  } as CacheConfig,

  // Static pages
  STATIC_PAGES: {
    ttl: 86400, // 24 hours
    staleWhileRevalidate: 3600,
    maxAge: 86400,
    sMaxAge: 172800,
    revalidate: 86400
  } as CacheConfig,

  // Dynamic pages
  DYNAMIC_PAGES: {
    ttl: 3600, // 1 hour
    staleWhileRevalidate: 300,
    maxAge: 3600,
    sMaxAge: 7200,
    revalidate: 3600
  } as CacheConfig
}

// In-memory cache implementation
class MemoryCache {
  private cache = new Map<string, { data: any; expires: number; tags: string[] }>()
  private maxSize: number

  constructor(maxSize = 1000) {
    this.maxSize = maxSize
  }

  set(key: string, data: any, config: CacheConfig): void {
    // Clean up expired entries if cache is full
    if (this.cache.size >= this.maxSize) {
      this.cleanup()
    }

    const expires = Date.now() + (config.ttl * 1000)
    this.cache.set(key, {
      data,
      expires,
      tags: config.tags || []
    })
  }

  get(key: string): any | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    if (Date.now() > entry.expires) {
      this.cache.delete(key)
      return null
    }

    return entry.data
  }

  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  invalidateByTag(tag: string): number {
    let count = 0
    for (const [key, entry] of this.cache.entries()) {
      if (entry.tags.includes(tag)) {
        this.cache.delete(key)
        count++
      }
    }
    return count
  }

  clear(): void {
    this.cache.clear()
  }

  size(): number {
    return this.cache.size
  }

  private cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expires) {
        this.cache.delete(key)
      }
    }
  }

  getStats(): { size: number; expired: number } {
    const now = Date.now()
    let expired = 0
    
    for (const entry of this.cache.values()) {
      if (now > entry.expires) {
        expired++
      }
    }

    return {
      size: this.cache.size,
      expired
    }
  }
}

// Global cache instance
export const memoryCache = new MemoryCache()

// Browser storage cache
class BrowserCache {
  private prefix: string

  constructor(prefix = 'brokeranalysis_') {
    this.prefix = prefix
  }

  set(key: string, data: any, config: CacheConfig): boolean {
    if (typeof window === 'undefined') return false

    try {
      const item = {
        data,
        expires: Date.now() + (config.ttl * 1000),
        tags: config.tags || []
      }

      localStorage.setItem(this.prefix + key, JSON.stringify(item))
      return true
    } catch (error) {
      console.warn('Failed to set browser cache:', error)
      return false
    }
  }

  get(key: string): any | null {
    if (typeof window === 'undefined') return null

    try {
      const item = localStorage.getItem(this.prefix + key)
      if (!item) return null

      const parsed = JSON.parse(item)
      if (Date.now() > parsed.expires) {
        localStorage.removeItem(this.prefix + key)
        return null
      }

      return parsed.data
    } catch (error) {
      console.warn('Failed to get browser cache:', error)
      return null
    }
  }

  delete(key: string): boolean {
    if (typeof window === 'undefined') return false

    try {
      localStorage.removeItem(this.prefix + key)
      return true
    } catch (error) {
      console.warn('Failed to delete browser cache:', error)
      return false
    }
  }

  clear(): boolean {
    if (typeof window === 'undefined') return false

    try {
      const keys = Object.keys(localStorage).filter(key => 
        key.startsWith(this.prefix)
      )
      
      keys.forEach(key => localStorage.removeItem(key))
      return true
    } catch (error) {
      console.warn('Failed to clear browser cache:', error)
      return false
    }
  }

  getSize(): number {
    if (typeof window === 'undefined') return 0

    try {
      let size = 0
      for (const key in localStorage) {
        if (key.startsWith(this.prefix)) {
          size += localStorage[key].length
        }
      }
      return size
    } catch (error) {
      return 0
    }
  }
}

export const browserCache = new BrowserCache()

// Cache manager with multiple strategies
class CacheManager {
  async get(key: string, fallback?: () => Promise<any>, config?: CacheConfig): Promise<any> {
    // Try memory cache first
    let data = memoryCache.get(key)
    if (data !== null) {
      return data
    }

    // Try browser cache
    data = browserCache.get(key)
    if (data !== null) {
      // Populate memory cache
      if (config) {
        memoryCache.set(key, data, config)
      }
      return data
    }

    // Fallback to data source
    if (fallback && config) {
      try {
        data = await fallback()
        this.set(key, data, config)
        return data
      } catch (error) {
        console.error('Cache fallback failed:', error)
        throw error
      }
    }

    return null
  }

  set(key: string, data: any, config: CacheConfig): void {
    memoryCache.set(key, data, config)
    browserCache.set(key, data, config)
  }

  delete(key: string): void {
    memoryCache.delete(key)
    browserCache.delete(key)
  }

  invalidateByTag(tag: string): void {
    memoryCache.invalidateByTag(tag)
    // Browser cache doesn't support tag-based invalidation easily
    // Consider implementing a tag index if needed
  }

  clear(): void {
    memoryCache.clear()
    browserCache.clear()
  }

  getStats() {
    return {
      memory: memoryCache.getStats(),
      browser: {
        size: browserCache.getSize()
      }
    }
  }
}

export const cacheManager = new CacheManager()

// HTTP cache headers utility
export function getCacheHeaders(config: CacheConfig): Record<string, string> {
  const headers: Record<string, string> = {}

  if (config.maxAge !== undefined) {
    const cacheControl = [`max-age=${config.maxAge}`]
    
    if (config.sMaxAge !== undefined) {
      cacheControl.push(`s-maxage=${config.sMaxAge}`)
    }
    
    if (config.staleWhileRevalidate !== undefined) {
      cacheControl.push(`stale-while-revalidate=${config.staleWhileRevalidate}`)
    }
    
    headers['Cache-Control'] = cacheControl.join(', ')
  }

  if (config.tags && config.tags.length > 0) {
    headers['Cache-Tag'] = config.tags.join(', ')
  }

  return headers
}

// SWR-like hook for cached data fetching
export function useCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  config: CacheConfig
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let mounted = true

    async function fetchData() {
      try {
        setLoading(true)
        setError(null)
        
        const result = await cacheManager.get(key, fetcher, config)
        
        if (mounted) {
          setData(result)
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      mounted = false
    }
  }, [key, config.ttl])

  const mutate = async (newData?: T) => {
    if (newData !== undefined) {
      setData(newData)
      cacheManager.set(key, newData, config)
    } else {
      // Revalidate
      try {
        setLoading(true)
        const result = await fetcher()
        setData(result)
        cacheManager.set(key, result, config)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }
  }

  return {
    data,
    loading,
    error,
    mutate
  }
}

// Cache warming utilities
export const cacheWarming = {
  async warmBrokerData() {
    const brokerIds = ['ic-markets', 'pepperstone', 'fp-markets'] // Popular brokers
    
    await Promise.allSettled(
      brokerIds.map(id => 
        cacheManager.get(
          `broker:${id}`,
          () => fetch(`/api/brokers/${id}`).then(r => r.json()),
          CacheStrategies.BROKER_DATA
        )
      )
    )
  },

  async warmMarketData() {
    const pairs = ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD']
    
    await Promise.allSettled(
      pairs.map(pair => 
        cacheManager.get(
          `market:${pair}`,
          () => fetch(`/api/market-data/${pair}`).then(r => r.json()),
          CacheStrategies.MARKET_DATA
        )
      )
    )
  },

  async warmSearchResults() {
    const popularQueries = ['best forex broker', 'low spread broker', 'regulated broker']
    
    await Promise.allSettled(
      popularQueries.map(query => 
        cacheManager.get(
          `search:${encodeURIComponent(query)}`,
          () => fetch(`/api/search?q=${encodeURIComponent(query)}`).then(r => r.json()),
          CacheStrategies.SEARCH_RESULTS
        )
      )
    )
  }
}

// Cache monitoring and analytics
export const cacheAnalytics = {
  trackHit(key: string, source: 'memory' | 'browser' | 'network') {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'cache_hit', {
        cache_key: key,
        cache_source: source
      })
    }
  },

  trackMiss(key: string) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'cache_miss', {
        cache_key: key
      })
    }
  },

  getPerformanceMetrics() {
    const stats = cacheManager.getStats()
    return {
      memoryHitRate: stats.memory.size > 0 ? 
        (stats.memory.size - stats.memory.expired) / stats.memory.size : 0,
      memorySize: stats.memory.size,
      browserSize: stats.browser.size
    }
  }
}

import { useState, useEffect } from 'react'

export type { CacheConfig }
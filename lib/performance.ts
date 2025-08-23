'use client'

// Dynamic imports used to avoid compilation issues with web-vitals

// Core Web Vitals thresholds
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  INP: { good: 200, poor: 500 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 }
}

type MetricName = 'LCP' | 'INP' | 'CLS' | 'FCP' | 'TTFB'

interface PerformanceMetric {
  name: MetricName
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  timestamp: number
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private callbacks: ((metric: PerformanceMetric) => void)[] = []

  constructor() {
    // Don't initialize metrics in constructor, let start() handle it
  }

  private async initializeMetrics() {
    try {
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        return
      }

      // Import web-vitals functions dynamically with better error handling
      const webVitals = await import('web-vitals').catch((error) => {
        console.warn('Failed to load web-vitals:', error)
        return null
      })

      if (!webVitals) {
        console.warn('web-vitals module not available')
        return
      }

      const { onLCP, onINP, onCLS, onFCP, onTTFB } = webVitals

      // Ensure functions exist before using them
      if (onLCP && typeof onLCP === 'function') {
        onLCP((metric) => {
          this.recordMetric('LCP', metric.value)
        })
      }

      if (onINP && typeof onINP === 'function') {
        onINP((metric) => {
          this.recordMetric('INP', metric.value)
        })
      }

      if (onCLS && typeof onCLS === 'function') {
        onCLS((metric) => {
          this.recordMetric('CLS', metric.value)
        })
      }

      if (onFCP && typeof onFCP === 'function') {
        onFCP((metric) => {
          this.recordMetric('FCP', metric.value)
        })
      }

      if (onTTFB && typeof onTTFB === 'function') {
        onTTFB((metric) => {
          this.recordMetric('TTFB', metric.value)
        })
      }
    } catch (error) {
      console.warn('Performance monitoring initialization failed:', error)
    }
  }

  private recordMetric(name: MetricName, value: number) {
    const threshold = THRESHOLDS[name]
    let rating: 'good' | 'needs-improvement' | 'poor'

    if (value <= threshold.good) {
      rating = 'good'
    } else if (value <= threshold.poor) {
      rating = 'needs-improvement'
    } else {
      rating = 'poor'
    }

    const metric: PerformanceMetric = {
      name,
      value,
      rating,
      timestamp: Date.now()
    }

    this.metrics.push(metric)
    this.callbacks.forEach(callback => callback(metric))

    // Send to analytics (if available)
    if (typeof window !== 'undefined' && 'gtag' in window) {
      ;(window as any).gtag('event', name, {
        event_category: 'Web Vitals',
        value: Math.round(value),
        custom_parameter_1: rating
      })
    }
  }

  public onMetric(callback: (metric: PerformanceMetric) => void) {
    this.callbacks.push(callback)
  }

  public getMetrics(): PerformanceMetric[] {
    return [...this.metrics]
  }

  public getLatestMetric(name: MetricName): PerformanceMetric | undefined {
    return this.metrics
      .filter(metric => metric.name === name)
      .sort((a, b) => b.timestamp - a.timestamp)[0]
  }

  public getPerformanceScore(): number {
    const latestMetrics = Object.keys(THRESHOLDS).map(name => 
      this.getLatestMetric(name as MetricName)
    ).filter(Boolean) as PerformanceMetric[]

    if (latestMetrics.length === 0) return 0

    const scores = latestMetrics.map(metric => {
      switch (metric.rating) {
        case 'good': return 100
        case 'needs-improvement': return 50
        case 'poor': return 0
        default: return 0
      }
    })

    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
  }

  public start(): void {
    this.initializeMetrics()
  }

  public stop(): void {
    // Clear callbacks to stop receiving metrics
    this.callbacks = []
    // Note: web-vitals doesn't provide a way to stop monitoring,
    // but clearing callbacks prevents further processing
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor()

// Utility functions for performance optimization
export const preloadResource = (href: string, as: string) => {
  if (typeof window !== 'undefined') {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = href
    link.as = as
    document.head.appendChild(link)
  }
}

export const prefetchResource = (href: string) => {
  if (typeof window !== 'undefined') {
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = href
    document.head.appendChild(link)
  }
}

// Intersection Observer for lazy loading
export const createIntersectionObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit
) => {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null
  }

  return new IntersectionObserver(callback, {
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  })
}

// Resource hints for critical resources
export const addResourceHints = () => {
  if (typeof window === 'undefined') return

  // Preconnect to external domains
  const preconnectDomains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ]

  preconnectDomains.forEach(domain => {
    const link = document.createElement('link')
    link.rel = 'preconnect'
    link.href = domain
    link.crossOrigin = 'anonymous'
    document.head.appendChild(link)
  })
}

// Performance timing utilities
export const measurePerformance = (name: string, fn: () => void | Promise<void>) => {
  if (typeof window === 'undefined') {
    return fn()
  }

  const start = performance.now()
  const result = fn()

  if (result instanceof Promise) {
    return result.finally(() => {
      const end = performance.now()
      console.log(`${name} took ${end - start} milliseconds`)
    })
  } else {
    const end = performance.now()
    console.log(`${name} took ${end - start} milliseconds`)
    return result
  }
}

// Memory usage monitoring
export const getMemoryUsage = () => {
  if (typeof window === 'undefined' || !('memory' in performance)) {
    return null
  }

  const memory = (performance as any).memory
  return {
    usedJSHeapSize: memory.usedJSHeapSize,
    totalJSHeapSize: memory.totalJSHeapSize,
    jsHeapSizeLimit: memory.jsHeapSizeLimit,
    usagePercentage: Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100)
  }
}

export type { PerformanceMetric, MetricName }
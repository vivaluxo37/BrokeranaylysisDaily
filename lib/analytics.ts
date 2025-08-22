'use client'

import { supabase } from './supabase'

// Analytics event types
export interface AnalyticsEvent {
  event_name: string
  user_id?: string
  session_id: string
  page_url: string
  page_title: string
  referrer?: string
  user_agent: string
  timestamp: string
  properties?: Record<string, any>
}

// User behavior tracking
export interface UserBehavior {
  user_id?: string
  session_id: string
  action: string
  target: string
  page_url: string
  timestamp: string
  duration?: number
  metadata?: Record<string, any>
}

// Conversion tracking
export interface ConversionEvent {
  user_id?: string
  session_id: string
  conversion_type: 'signup' | 'broker_click' | 'comparison_view' | 'review_submit' | 'newsletter_signup'
  value?: number
  broker_id?: string
  page_url: string
  timestamp: string
  metadata?: Record<string, any>
}

// Performance metrics
export interface PerformanceMetric {
  session_id: string
  page_url: string
  metric_name: 'FCP' | 'LCP' | 'INP' | 'CLS' | 'TTFB' | 'page_load_time'
  value: number
  timestamp: string
  user_agent: string
}

class AnalyticsService {
  private supabase = createClient()
  private sessionId: string
  private userId?: string
  private isInitialized = false
  private eventQueue: AnalyticsEvent[] = []
  private behaviorQueue: UserBehavior[] = []
  private conversionQueue: ConversionEvent[] = []
  private performanceQueue: PerformanceMetric[] = []
  private flushInterval: NodeJS.Timeout | null = null

  constructor() {
    this.sessionId = this.generateSessionId()
    this.init()
  }

  private async init() {
    if (typeof window === 'undefined') return

    // Get user ID if authenticated
    const { data: { user } } = await this.supabase.auth.getUser()
    this.userId = user?.id

    // Listen for auth changes
    this.supabase.auth.onAuthStateChange((event, session) => {
      this.userId = session?.user?.id
    })

    // Set up periodic flushing
    this.flushInterval = setInterval(() => {
      this.flush()
    }, 30000) // Flush every 30 seconds

    // Flush on page unload
    window.addEventListener('beforeunload', () => {
      this.flush()
    })

    // Track page views automatically
    this.trackPageView()

    // Track performance metrics
    this.trackPerformanceMetrics()

    this.isInitialized = true
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Track custom events
  async trackEvent(eventName: string, properties?: Record<string, any>) {
    if (typeof window === 'undefined') return

    const event: AnalyticsEvent = {
      event_name: eventName,
      user_id: this.userId,
      session_id: this.sessionId,
      page_url: window.location.href,
      page_title: document.title,
      referrer: document.referrer,
      user_agent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      properties
    }

    this.eventQueue.push(event)
    
    // Flush immediately for important events
    if (['conversion', 'error', 'signup'].includes(eventName)) {
      await this.flush()
    }
  }

  // Track user behavior
  async trackUserBehavior(behavior: UserBehavior): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_behavior')
        .insert({
          user_id: this.userId,
          session_id: this.sessionId,
          page_url: behavior.page_url || window.location.href,
          page_title: document.title,
          action: behavior.action,
          target: behavior.target,
          duration: behavior.duration,
          metadata: behavior.metadata,
          timestamp: behavior.timestamp || new Date().toISOString()
        })

      if (error) {
        console.error('Failed to store user behavior:', error)
      }
    } catch (error) {
      console.error('Failed to track user behavior:', error)
    }
  }

  // Track performance metrics
  async trackPerformance(metric: PerformanceMetric): Promise<void> {
    try {
      const { error } = await supabase
        .from('performance_metrics')
        .insert({
          page_url: metric.page_url || window.location.href,
          metric_name: metric.metric_name,
          value: metric.value,
          user_agent: navigator.userAgent,
          session_id: this.sessionId,
          timestamp: metric.timestamp || new Date().toISOString()
        })

      if (error) {
        console.error('Failed to store performance metric:', error)
      }
    } catch (error) {
      console.error('Failed to track performance:', error)
    }
  }

  // Track user behavior (legacy method for backward compatibility)
  trackBehavior(action: string, target: string, duration?: number, metadata?: Record<string, any>) {
    if (typeof window === 'undefined') return

    const behavior: UserBehavior = {
      user_id: this.userId,
      session_id: this.sessionId,
      action,
      target,
      page_url: window.location.href,
      timestamp: new Date().toISOString(),
      duration,
      metadata
    }

    this.behaviorQueue.push(behavior)
  }

  // Track conversions
  async trackConversion(
    type: ConversionEvent['conversion_type'],
    value?: number,
    brokerId?: string,
    metadata?: Record<string, any>
  ) {
    if (typeof window === 'undefined') return

    try {
      const { error } = await supabase
        .from('conversion_events')
        .insert({
          user_id: this.userId,
          session_id: this.sessionId,
          conversion_type: type,
          value,
          broker_id: brokerId,
          page_url: window.location.href,
          timestamp: new Date().toISOString(),
          metadata
        })

      if (error) {
        console.error('Failed to store conversion event:', error)
      }
    } catch (error) {
      console.error('Failed to track conversion:', error)
    }
  }

  // Track page views
  trackPageView(url?: string, title?: string) {
    if (typeof window === 'undefined') return

    this.trackEvent('page_view', {
      url: url || window.location.href,
      title: title || document.title,
      referrer: document.referrer
    })
  }

  // Track performance metrics
  private trackPerformanceMetrics() {
    if (typeof window === 'undefined' || !('performance' in window)) return

    // Track Core Web Vitals
    this.trackWebVitals()

    // Track page load time
    window.addEventListener('load', () => {
      const loadTime = performance.now()
      this.trackPerformanceMetric('page_load_time', loadTime)
    })
  }

  private trackWebVitals() {
    // This would integrate with web-vitals library in a real implementation
    // For now, we'll track basic performance metrics
    
    if ('PerformanceObserver' in window) {
      // Track Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1] as any
        this.trackPerformanceMetric('LCP', lastEntry.startTime)
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

      // Track Interaction to Next Paint (INP)
      const inpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          this.trackPerformanceMetric('INP', entry.processingStart - entry.startTime)
        })
      })
      inpObserver.observe({ entryTypes: ['first-input'] })

      // Track Cumulative Layout Shift (CLS)
      let clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
          }
        })
        this.trackPerformanceMetric('CLS', clsValue)
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })
    }
  }

  private trackPerformanceMetric(metricName: PerformanceMetric['metric_name'], value: number) {
    if (typeof window === 'undefined') return

    const metric: PerformanceMetric = {
      session_id: this.sessionId,
      page_url: window.location.href,
      metric_name: metricName,
      value,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent
    }

    this.performanceQueue.push(metric)
  }

  // Track clicks
  trackClick(element: string, properties?: Record<string, any>) {
    this.trackBehavior('click', element, undefined, properties)
  }

  // Track form submissions
  trackFormSubmission(formName: string, success: boolean, properties?: Record<string, any>) {
    this.trackBehavior('form_submit', formName, undefined, {
      success,
      ...properties
    })
  }

  // Track search queries
  trackSearch(query: string, results: number, filters?: Record<string, any>) {
    this.trackEvent('search', {
      query,
      results_count: results,
      filters
    })
  }

  // Track broker interactions
  trackBrokerInteraction(brokerId: string, action: string, properties?: Record<string, any>) {
    this.trackEvent('broker_interaction', {
      broker_id: brokerId,
      action,
      ...properties
    })

    // Track as conversion if it's a significant action
    if (['visit_website', 'open_account'].includes(action)) {
      this.trackConversion('broker_click', undefined, brokerId, { action })
    }
  }

  // Track errors
  trackError(error: Error, context?: Record<string, any>) {
    this.trackEvent('error', {
      error_message: error.message,
      error_stack: error.stack,
      context
    })
  }

  // Flush queued events to database
  private async flush() {
    if (!this.isInitialized) return

    try {
      // Flush events
      if (this.eventQueue.length > 0) {
        const { error: eventsError } = await this.supabase
          .from('analytics_events')
          .insert(this.eventQueue)
        
        if (eventsError) {
          console.error('Failed to flush analytics events:', eventsError)
        } else {
          this.eventQueue = []
        }
      }

      // Flush behaviors
      if (this.behaviorQueue.length > 0) {
        const { error: behaviorsError } = await this.supabase
          .from('user_behaviors')
          .insert(this.behaviorQueue)
        
        if (behaviorsError) {
          console.error('Failed to flush user behaviors:', behaviorsError)
        } else {
          this.behaviorQueue = []
        }
      }

      // Flush conversions
      if (this.conversionQueue.length > 0) {
        const { error: conversionsError } = await this.supabase
          .from('conversion_events')
          .insert(this.conversionQueue)
        
        if (conversionsError) {
          console.error('Failed to flush conversion events:', conversionsError)
        } else {
          this.conversionQueue = []
        }
      }

      // Flush performance metrics
      if (this.performanceQueue.length > 0) {
        const { error: performanceError } = await this.supabase
          .from('performance_metrics')
          .insert(this.performanceQueue)
        
        if (performanceError) {
          console.error('Failed to flush performance metrics:', performanceError)
        } else {
          this.performanceQueue = []
        }
      }
    } catch (error) {
      console.error('Failed to flush analytics data:', error)
    }
  }

  // Get analytics data (for admin dashboard)
  async getAnalyticsData(startDate: string, endDate: string) {
    const { data: events } = await this.supabase
      .from('analytics_events')
      .select('*')
      .gte('timestamp', startDate)
      .lte('timestamp', endDate)

    const { data: conversions } = await this.supabase
      .from('conversion_events')
      .select('*')
      .gte('timestamp', startDate)
      .lte('timestamp', endDate)

    const { data: performance } = await this.supabase
      .from('performance_metrics')
      .select('*')
      .gte('timestamp', startDate)
      .lte('timestamp', endDate)

    return {
      events: events || [],
      conversions: conversions || [],
      performance: performance || []
    }
  }

  // Clean up
  destroy() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval)
    }
    this.flush()
  }
}

// Create singleton instance
const analytics = new AnalyticsService()

export default analytics

// Convenience functions
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  analytics.trackEvent(eventName, properties)
}

export const trackPageView = (url?: string, title?: string) => {
  analytics.trackPageView(url, title)
}

export const trackClick = (element: string, properties?: Record<string, any>) => {
  analytics.trackClick(element, properties)
}

export const trackConversion = (
  type: ConversionEvent['conversion_type'],
  value?: number,
  brokerId?: string,
  metadata?: Record<string, any>
) => {
  analytics.trackConversion(type, value, brokerId, metadata)
}

export const trackBrokerInteraction = (brokerId: string, action: string, properties?: Record<string, any>) => {
  analytics.trackBrokerInteraction(brokerId, action, properties)
}

export const trackSearch = (query: string, results: number, filters?: Record<string, any>) => {
  analytics.trackSearch(query, results, filters)
}

export const trackError = (error: Error, context?: Record<string, any>) => {
  analytics.trackError(error, context)
}
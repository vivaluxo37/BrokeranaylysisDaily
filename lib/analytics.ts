'use client'

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
  private supabaseClient: any = null
  private sessionId: string
  private userId?: string
  private isInitialized = false
  private isEnabled = true
  private eventQueue: AnalyticsEvent[] = []
  private behaviorQueue: UserBehavior[] = []
  private conversionQueue: ConversionEvent[] = []
  private performanceQueue: PerformanceMetric[] = []
  private flushInterval: NodeJS.Timeout | null = null

  constructor() {
    this.sessionId = this.generateSessionId()

    // Disable analytics in development mode
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics disabled in development mode')
      this.isEnabled = false
      this.isInitialized = true // Mark as initialized to prevent any further setup
      return
    }

    // Initialize supabase client only in production
    this.initSupabaseClient()
    this.init()
  }

  private initSupabaseClient() {
    if (this.isEnabled && !this.supabaseClient) {
      try {
        const { supabase } = require('./supabase')
        this.supabaseClient = supabase
      } catch (error) {
        console.warn('Failed to initialize supabase client:', error)
        this.isEnabled = false
      }
    }
  }

  private getSupabaseClient() {
    if (!this.supabaseClient && this.isEnabled) {
      this.initSupabaseClient()
    }
    return this.supabaseClient
  }

  private async init() {
    if (typeof window === 'undefined') return

    const client = this.getSupabaseClient()
    if (!client) return

    // Get user ID if authenticated
    const { data: { user } } = await client.auth.getUser()
    this.userId = user?.id

    // Listen for auth changes
    client.auth.onAuthStateChange((event, session) => {
      this.userId = session?.user?.id
    })

    // Test analytics connection
    try {
      console.log('Testing analytics service connection...')
      const { error: testError } = await client
        .from('analytics_events')
        .select('count', { count: 'exact', head: true })

      if (testError) {
        console.warn('Analytics connection test failed, disabling analytics:', testError)
        this.isEnabled = false
        return // Exit early if connection fails
      } else {
        console.log('Analytics connection test successful')
        this.isEnabled = true
      }
    } catch (error) {
      console.warn('Analytics connection test error, disabling analytics:', error)
      this.isEnabled = false
      return // Exit early if connection fails
    }

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
    if (typeof window === 'undefined' || !this.isEnabled) return

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
    if (typeof window === 'undefined' || !this.isEnabled) return

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
    if (!this.isInitialized || !this.isEnabled) return

    const client = this.getSupabaseClient()
    if (!client) return

    try {
      // Flush events
      if (this.eventQueue.length > 0) {
        console.log(`Attempting to flush ${this.eventQueue.length} analytics events...`)

        const { error: eventsError } = await client
          .from('analytics_events')
          .insert(this.eventQueue)

        if (eventsError) {
          console.error('Failed to flush analytics events:', {
            error: eventsError,
            message: eventsError.message,
            details: eventsError.details,
            hint: eventsError.hint,
            code: eventsError.code,
            eventCount: this.eventQueue.length
          })
        } else {
          console.log(`Successfully flushed ${this.eventQueue.length} analytics events`)
          this.eventQueue = []
        }
      }

      // Flush behaviors
      if (this.behaviorQueue.length > 0) {
        const { error: behaviorsError } = await client
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
        const { error: conversionsError } = await client
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
        console.log(`Attempting to flush ${this.performanceQueue.length} performance metrics...`)

        const { error: performanceError } = await client
          .from('performance_metrics')
          .insert(this.performanceQueue)

        if (performanceError) {
          console.error('Failed to flush performance metrics:', {
            error: performanceError,
            message: performanceError.message,
            details: performanceError.details,
            hint: performanceError.hint,
            code: performanceError.code,
            metricCount: this.performanceQueue.length
          })
        } else {
          console.log(`Successfully flushed ${this.performanceQueue.length} performance metrics`)
          this.performanceQueue = []
        }
      }
    } catch (error) {
      console.error('Failed to flush analytics data:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      })
    }
  }

  // Get analytics data (for admin dashboard)
  async getAnalyticsData(startDate: string, endDate: string) {
    const client = this.getSupabaseClient()
    if (!client) return { events: [], conversions: [], performance: [] }

    const { data: events } = await client
      .from('analytics_events')
      .select('*')
      .gte('timestamp', startDate)
      .lte('timestamp', endDate)

    const { data: conversions } = await client
      .from('conversion_events')
      .select('*')
      .gte('timestamp', startDate)
      .lte('timestamp', endDate)

    const { data: performance } = await client
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

// Lazy singleton instance
let analyticsInstance: AnalyticsService | null = null

const getAnalytics = (): AnalyticsService => {
  // Always return mock analytics in development mode
  if (process.env.NODE_ENV === 'development') {
    if (!analyticsInstance) {
      console.log('Analytics disabled in development mode - using mock service')
      analyticsInstance = {
        trackEvent: () => {},
        trackPageView: () => {},
        trackClick: () => {},
        trackConversion: () => {},
        trackUserBehavior: () => {},
        trackPerformance: () => {},
        setUserId: () => {},
        getSessionId: () => 'dev-mock-session-id',
        trackBrokerInteraction: () => {},
        trackSearchQuery: () => {},
        trackFormSubmission: () => {},
        trackDownload: () => {},
        trackVideoPlay: () => {},
        trackSocialShare: () => {},
        trackNewsletterSignup: () => {},
        trackContactForm: () => {},
        trackBrokerComparison: () => {},
        trackAIRecommendation: () => {},
        trackSearch: () => {},
        trackError: () => {},
        destroy: () => {}
      } as any
    }
    return analyticsInstance
  }

  if (!analyticsInstance) {
    try {
      analyticsInstance = new AnalyticsService()
    } catch (error) {
      console.warn('Analytics service initialization failed:', error)
      // Return a mock analytics service that does nothing
      analyticsInstance = {
        trackEvent: () => {},
        trackPageView: () => {},
        trackClick: () => {},
        trackConversion: () => {},
        trackUserBehavior: () => {},
        trackPerformance: () => {},
        setUserId: () => {},
        getSessionId: () => 'mock-session-id',
        trackBrokerInteraction: () => {},
        trackSearchQuery: () => {},
        trackFormSubmission: () => {},
        trackDownload: () => {},
        trackVideoPlay: () => {},
        trackSocialShare: () => {},
        trackNewsletterSignup: () => {},
        trackContactForm: () => {},
        trackBrokerComparison: () => {},
        trackAIRecommendation: () => {},
        trackSearch: () => {},
        trackError: () => {},
        destroy: () => {}
      } as any
    }
  }
  return analyticsInstance
}

export default getAnalytics

// Convenience functions with error handling
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  // Disable analytics in development mode
  if (process.env.NODE_ENV === 'development') {
    return
  }

  try {
    if (typeof window !== 'undefined') {
      getAnalytics().trackEvent(eventName, properties)
    }
  } catch (error) {
    console.warn('Failed to track event:', error)
  }
}

export const trackPageView = (url?: string, title?: string) => {
  // Disable analytics in development mode
  if (process.env.NODE_ENV === 'development') {
    return
  }

  try {
    if (typeof window !== 'undefined') {
      getAnalytics().trackPageView(url, title)
    }
  } catch (error) {
    console.warn('Failed to track page view:', error)
  }
}

export const trackClick = (element: string, properties?: Record<string, any>) => {
  try {
    if (typeof window !== 'undefined') {
      getAnalytics().trackClick(element, properties)
    }
  } catch (error) {
    console.warn('Failed to track click:', error)
  }
}

export const trackConversion = (
  type: ConversionEvent['conversion_type'],
  value?: number,
  brokerId?: string,
  metadata?: Record<string, any>
) => {
  try {
    if (typeof window !== 'undefined') {
      getAnalytics().trackConversion(type, value, brokerId, metadata)
    }
  } catch (error) {
    console.warn('Failed to track conversion:', error)
  }
}

export const trackBrokerInteraction = (brokerId: string, action: string, properties?: Record<string, any>) => {
  try {
    if (typeof window !== 'undefined') {
      getAnalytics().trackBrokerInteraction(brokerId, action, properties)
    }
  } catch (error) {
    console.warn('Failed to track broker interaction:', error)
  }
}

export const trackSearch = (query: string, results: number, filters?: Record<string, any>) => {
  try {
    if (typeof window !== 'undefined') {
      getAnalytics().trackSearch(query, results, filters)
    }
  } catch (error) {
    console.warn('Failed to track search:', error)
  }
}

export const trackError = (error: Error, context?: Record<string, any>) => {
  try {
    if (typeof window !== 'undefined') {
      getAnalytics().trackError(error, context)
    }
  } catch (error) {
    console.warn('Failed to track error:', error)
  }
}

export const trackUserBehavior = (behavior: UserBehavior) => {
  try {
    if (typeof window !== 'undefined') {
      getAnalytics().trackUserBehavior(behavior)
    }
  } catch (error) {
    console.warn('Failed to track user behavior:', error)
  }
}

export const trackPerformance = (metric: PerformanceMetric) => {
  try {
    if (typeof window !== 'undefined') {
      getAnalytics().trackPerformance(metric)
    }
  } catch (error) {
    console.warn('Failed to track performance:', error)
  }
}

export const setUserId = (userId: string) => {
  try {
    if (typeof window !== 'undefined') {
      getAnalytics().setUserId(userId)
    }
  } catch (error) {
    console.warn('Failed to set user ID:', error)
  }
}

export const getSessionId = () => {
  try {
    if (typeof window !== 'undefined') {
      return getAnalytics().getSessionId()
    }
    return 'ssr-session-id'
  } catch (error) {
    console.warn('Failed to get session ID:', error)
    return 'error-session-id'
  }
}
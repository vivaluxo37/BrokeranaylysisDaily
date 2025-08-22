'use client'

import { useState, useEffect, useCallback } from 'react'
import { analyticsService } from '@/lib/analytics'
import { supabase } from '@/lib/supabase'
import type { AnalyticsEvent, UserBehavior, ConversionEvent, PerformanceMetric } from '@/lib/analytics'

interface AnalyticsStats {
  totalEvents: number
  uniqueUsers: number
  pageViews: number
  conversionRate: number
  avgSessionDuration: number
  bounceRate: number
  topPages: Array<{ page: string; views: number; conversions: number }>
  conversionFunnel: Array<{ step: string; users: number; rate: number }>
  recentEvents: Array<{ id: string; type: string; description: string; value?: number; timestamp: string }>
}

interface UseAnalyticsDashboardReturn {
  stats: AnalyticsStats | null
  loading: boolean
  error: string | null
  dateRange: { from: Date; to: Date }
  setDateRange: (range: { from: Date; to: Date }) => void
  refreshData: () => Promise<void>
}

export function useAnalyticsDashboard(): UseAnalyticsDashboardReturn {
  const [stats, setStats] = useState<AnalyticsStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    to: new Date()
  })

  // Load analytics data
  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Get date range for queries
      const startDate = new Date(dateRange.from)
      const endDate = new Date(dateRange.to)
      
      // Fetch analytics summary
      const { data: summaryData, error: summaryError } = await supabase
        .from('analytics_summary')
        .select('*')
        .gte('date', startDate.toISOString().split('T')[0])
        .lte('date', endDate.toISOString().split('T')[0])
        .order('date', { ascending: false })
      
      if (summaryError) throw summaryError
      
      // Fetch conversion funnel
      const { data: conversionData, error: conversionError } = await supabase
        .from('conversion_funnel')
        .select('*')
      
      if (conversionError) throw conversionError
      
      // Fetch top pages
      const { data: topPagesData, error: topPagesError } = await supabase
        .from('analytics_events')
        .select('page_url, count(*)')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .not('page_url', 'is', null)
        .order('count', { ascending: false })
        .limit(10)
      
      if (topPagesError) throw topPagesError
      
      // Fetch recent events
      const { data: recentEventsData, error: recentEventsError } = await supabase
        .from('analytics_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20)
      
      if (recentEventsError) throw recentEventsError
      
      // Calculate aggregated stats
      const totalEvents = summaryData?.reduce((sum, day) => sum + (day.total_events || 0), 0) || 0
      const uniqueUsers = summaryData?.reduce((sum, day) => sum + (day.unique_users || 0), 0) || 0
      const pageViews = summaryData?.reduce((sum, day) => sum + (day.unique_pages || 0), 0) || 0
      
      const stats = {
        totalEvents,
        uniqueUsers,
        pageViews,
        conversionRate: conversionData?.[0]?.conversions ? 
          (conversionData[0].conversions / uniqueUsers * 100) : 0,
        avgSessionDuration: 245, // TODO: Calculate from session data
        bounceRate: 42.5, // TODO: Calculate from behavior data
        topPages: topPagesData?.map(page => ({
          page: page.page_url,
          views: page.count,
          conversions: 0 // TODO: Join with conversion data
        })) || [],
        conversionFunnel: conversionData?.map((item, index) => ({
          step: item.conversion_type,
          users: item.conversions,
          rate: index === 0 ? 100 : (item.conversions / conversionData[0].conversions * 100)
        })) || [],
        recentEvents: recentEventsData?.map(event => ({
          id: event.id,
          type: event.event_category,
          description: `${event.event_action} - ${event.event_label || event.page_url}`,
          value: event.event_value,
          timestamp: event.created_at
        })) || []
      }
      
      setStats(stats)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }, [dateRange])

  // Load data on mount and when date range changes
  useEffect(() => {
    loadData()
  }, [loadData])

  return {
    stats,
    loading,
    error,
    dateRange,
    setDateRange,
    refreshData: loadData
  }
}

interface UseAnalyticsReturn {
  // Tracking functions
  trackEvent: (event: Omit<AnalyticsEvent, 'id' | 'timestamp'>) => Promise<void>
  trackUserBehavior: (behavior: Omit<UserBehavior, 'id' | 'timestamp'>) => Promise<void>
  trackConversion: (conversion: Omit<ConversionEvent, 'id' | 'timestamp'>) => Promise<void>
  trackPageView: (page: string, title?: string) => Promise<void>
  trackPerformance: (metric: Omit<PerformanceMetric, 'id' | 'timestamp'>) => Promise<void>
  
  // State
  isTracking: boolean
  sessionId: string
  userId: string | null
  
  // Configuration
  enableTracking: () => void
  disableTracking: () => void
  setUserId: (userId: string | null) => void
  
  // Analytics data
  getSessionEvents: () => AnalyticsEvent[]
  clearSession: () => void
}

export function useAnalytics(): UseAnalyticsReturn {
  const [isTracking, setIsTracking] = useState(true)
  const [sessionId] = useState(() => analyticsService.getSessionId())
  const [userId, setUserIdState] = useState<string | null>(null)
  const [sessionEvents, setSessionEvents] = useState<AnalyticsEvent[]>([])

  // Initialize analytics on mount
  useEffect(() => {
    // Check if user has opted out of tracking
    const trackingPreference = localStorage.getItem('analytics_enabled')
    if (trackingPreference === 'false') {
      setIsTracking(false)
    }

    // Get user ID from auth context if available
    const storedUserId = localStorage.getItem('user_id')
    if (storedUserId) {
      setUserIdState(storedUserId)
    }

    // Track initial page view
    if (isTracking) {
      trackPageView(window.location.pathname, document.title)
    }
  }, [])

  // Track page views on route changes
  useEffect(() => {
    if (!isTracking) return

    const handleRouteChange = () => {
      trackPageView(window.location.pathname, document.title)
    }

    // Listen for navigation events
    window.addEventListener('popstate', handleRouteChange)
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange)
    }
  }, [isTracking])

  const trackEvent = useCallback(async (event: Omit<AnalyticsEvent, 'id' | 'timestamp'>) => {
    if (!isTracking) return

    try {
      const fullEvent: AnalyticsEvent = {
        ...event,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        session_id: sessionId,
        user_id: userId
      }

      await analyticsService.trackEvent(fullEvent)
      setSessionEvents(prev => [...prev, fullEvent])
    } catch (error) {
      console.error('Failed to track event:', error)
    }
  }, [isTracking, sessionId, userId])

  const trackUserBehavior = useCallback(async (behavior: Omit<UserBehavior, 'id' | 'timestamp'>) => {
    if (!isTracking) return

    try {
      const fullBehavior: UserBehavior = {
        ...behavior,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        session_id: sessionId,
        user_id: userId
      }

      await analyticsService.trackUserBehavior(fullBehavior)
    } catch (error) {
      console.error('Failed to track user behavior:', error)
    }
  }, [isTracking, sessionId, userId])

  const trackConversion = useCallback(async (conversion: Omit<ConversionEvent, 'id' | 'timestamp'>) => {
    if (!isTracking) return

    try {
      const fullConversion: ConversionEvent = {
        ...conversion,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        session_id: sessionId,
        user_id: userId
      }

      await analyticsService.trackConversion(fullConversion)
    } catch (error) {
      console.error('Failed to track conversion:', error)
    }
  }, [isTracking, sessionId, userId])

  const trackPageView = useCallback(async (page: string, title?: string) => {
    if (!isTracking) return

    try {
      await analyticsService.trackPageView({
        page,
        title: title || document.title,
        referrer: document.referrer,
        user_agent: navigator.userAgent,
        session_id: sessionId,
        user_id: userId
      })

      // Also track as a general event
      await trackEvent({
        event_type: 'page_view',
        event_name: 'page_view',
        page_url: page,
        properties: {
          title: title || document.title,
          referrer: document.referrer
        }
      })
    } catch (error) {
      console.error('Failed to track page view:', error)
    }
  }, [isTracking, sessionId, userId, trackEvent])

  const trackPerformance = useCallback(async (metric: Omit<PerformanceMetric, 'id' | 'timestamp'>) => {
    if (!isTracking) return

    try {
      const fullMetric: PerformanceMetric = {
        ...metric,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        session_id: sessionId,
        user_id: userId
      }

      await analyticsService.trackPerformance(fullMetric)
    } catch (error) {
      console.error('Failed to track performance metric:', error)
    }
  }, [isTracking, sessionId, userId])

  const enableTracking = useCallback(() => {
    setIsTracking(true)
    localStorage.setItem('analytics_enabled', 'true')
  }, [])

  const disableTracking = useCallback(() => {
    setIsTracking(false)
    localStorage.setItem('analytics_enabled', 'false')
    // Clear any pending analytics data
    analyticsService.flush()
  }, [])

  const setUserId = useCallback((newUserId: string | null) => {
    setUserIdState(newUserId)
    if (newUserId) {
      localStorage.setItem('user_id', newUserId)
    } else {
      localStorage.removeItem('user_id')
    }
  }, [])

  const getSessionEvents = useCallback(() => {
    return sessionEvents
  }, [sessionEvents])

  const clearSession = useCallback(() => {
    setSessionEvents([])
  }, [])

  return {
    trackEvent,
    trackUserBehavior,
    trackConversion,
    trackPageView,
    trackPerformance,
    isTracking,
    sessionId,
    userId,
    enableTracking,
    disableTracking,
    setUserId,
    getSessionEvents,
    clearSession
  }
}

// Convenience hooks for specific tracking scenarios
export function useBrokerTracking() {
  const { trackEvent, trackConversion } = useAnalytics()

  const trackBrokerView = useCallback((brokerId: string, brokerName: string) => {
    trackEvent({
      event_type: 'broker_interaction',
      event_name: 'broker_view',
      page_url: window.location.pathname,
      properties: {
        broker_id: brokerId,
        broker_name: brokerName
      }
    })
  }, [trackEvent])

  const trackBrokerComparison = useCallback((brokerIds: string[]) => {
    trackEvent({
      event_type: 'broker_interaction',
      event_name: 'broker_comparison',
      page_url: window.location.pathname,
      properties: {
        broker_ids: brokerIds,
        comparison_count: brokerIds.length
      }
    })
  }, [trackEvent])

  const trackBrokerSignup = useCallback((brokerId: string, brokerName: string, conversionValue?: number) => {
    trackConversion({
      conversion_type: 'broker_signup',
      conversion_name: 'broker_registration',
      conversion_value: conversionValue || 0,
      currency: 'USD',
      properties: {
        broker_id: brokerId,
        broker_name: brokerName
      }
    })
  }, [trackConversion])

  return {
    trackBrokerView,
    trackBrokerComparison,
    trackBrokerSignup
  }
}

export function useSearchTracking() {
  const { trackEvent, trackUserBehavior } = useAnalytics()

  const trackSearch = useCallback((query: string, filters: Record<string, any>, resultCount: number) => {
    trackEvent({
      event_type: 'search',
      event_name: 'search_performed',
      page_url: window.location.pathname,
      properties: {
        search_query: query,
        search_filters: filters,
        result_count: resultCount
      }
    })
  }, [trackEvent])

  const trackSearchResultClick = useCallback((query: string, resultId: string, position: number) => {
    trackUserBehavior({
      behavior_type: 'click',
      element_type: 'search_result',
      element_id: resultId,
      page_url: window.location.pathname,
      properties: {
        search_query: query,
        result_position: position
      }
    })
  }, [trackUserBehavior])

  return {
    trackSearch,
    trackSearchResultClick
  }
}

export function useChatTracking() {
  const { trackEvent, trackUserBehavior } = useAnalytics()

  const trackChatMessage = useCallback((messageType: 'user' | 'assistant', messageLength: number, conversationId: string) => {
    trackEvent({
      event_type: 'chat_interaction',
      event_name: 'chat_message',
      page_url: window.location.pathname,
      properties: {
        message_type: messageType,
        message_length: messageLength,
        conversation_id: conversationId
      }
    })
  }, [trackEvent])

  const trackChatFeedback = useCallback((conversationId: string, messageId: string, feedback: 'positive' | 'negative') => {
    trackUserBehavior({
      behavior_type: 'feedback',
      element_type: 'chat_message',
      element_id: messageId,
      page_url: window.location.pathname,
      properties: {
        conversation_id: conversationId,
        feedback_type: feedback
      }
    })
  }, [trackUserBehavior])

  return {
    trackChatMessage,
    trackChatFeedback
  }
}
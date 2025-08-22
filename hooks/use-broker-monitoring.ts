'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  brokerMonitoringService,
  type MonitoringAlert,
  type AlertSeverity,
  type AlertType,
  type MonitoringConfig
} from '@/lib/broker-monitoring'

interface MonitoringStats {
  total_alerts: number
  unresolved_alerts: number
  critical_alerts: number
  brokers_monitored: number
  average_response_time: number
}

interface UseBrokerMonitoringReturn {
  // State
  alerts: MonitoringAlert[]
  stats: MonitoringStats
  isMonitoring: boolean
  loading: boolean
  error: string | null
  
  // Actions
  startMonitoring: () => Promise<void>
  stopMonitoring: () => void
  refreshData: () => Promise<void>
  resolveAlert: (alertId: string) => Promise<void>
  getFilteredAlerts: (filters: AlertFilters) => MonitoringAlert[]
  
  // Configuration
  config: MonitoringConfig
  updateConfig: (updates: Partial<MonitoringConfig>) => void
}

interface AlertFilters {
  severity?: AlertSeverity
  type?: AlertType
  resolved?: boolean
  search?: string
  brokerId?: string
  limit?: number
}

export function useBrokerMonitoring(): UseBrokerMonitoringReturn {
  const [alerts, setAlerts] = useState<MonitoringAlert[]>([])
  const [stats, setStats] = useState<MonitoringStats>({
    total_alerts: 0,
    unresolved_alerts: 0,
    critical_alerts: 0,
    brokers_monitored: 0,
    average_response_time: 0
  })
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [config, setConfig] = useState<MonitoringConfig>({
    check_interval: 15,
    response_time_threshold: 5000,
    uptime_threshold: 99,
    spread_change_threshold: 20,
    enable_email_alerts: true,
    enable_push_notifications: true,
    alert_recipients: ['admin@brokeranalysis.com']
  })

  const supabase = createClient()

  // Load initial data
  useEffect(() => {
    refreshData()
    loadConfig()
    
    // Set up real-time subscriptions for alerts
    const alertsSubscription = supabase
      .channel('monitoring_alerts')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'monitoring_alerts'
        },
        () => {
          refreshData()
        }
      )
      .subscribe()

    // Set up periodic refresh
    const refreshInterval = setInterval(refreshData, 30000) // Every 30 seconds

    return () => {
      alertsSubscription.unsubscribe()
      clearInterval(refreshInterval)
    }
  }, [])

  const refreshData = useCallback(async () => {
    try {
      setError(null)
      
      // For now, we'll use mock data since we don't have database access
      // In production, this would fetch from the actual database
      const mockAlerts = generateMockAlerts()
      const mockStats = generateMockStats()
      
      setAlerts(mockAlerts)
      setStats(mockStats)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load monitoring data')
      console.error('Error loading monitoring data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const loadConfig = useCallback(async () => {
    try {
      // Load configuration from localStorage for now
      const savedConfig = localStorage.getItem('broker-monitoring-config')
      if (savedConfig) {
        setConfig(JSON.parse(savedConfig))
      }
    } catch (err) {
      console.error('Error loading config:', err)
    }
  }, [])

  const startMonitoring = useCallback(async () => {
    try {
      setError(null)
      await brokerMonitoringService.startMonitoring()
      setIsMonitoring(true)
      
      // Save monitoring state
      localStorage.setItem('broker-monitoring-active', 'true')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start monitoring')
      throw err
    }
  }, [])

  const stopMonitoring = useCallback(() => {
    try {
      brokerMonitoringService.stopMonitoring()
      setIsMonitoring(false)
      
      // Save monitoring state
      localStorage.setItem('broker-monitoring-active', 'false')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to stop monitoring')
    }
  }, [])

  const resolveAlert = useCallback(async (alertId: string) => {
    try {
      setError(null)
      
      // Update local state immediately for better UX
      setAlerts(prev => prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, is_resolved: true, resolved_at: new Date().toISOString() }
          : alert
      ))
      
      // In production, this would update the database
      // await brokerMonitoringService.resolveAlert(alertId)
      
      // Update stats
      setStats(prev => ({
        ...prev,
        unresolved_alerts: Math.max(0, prev.unresolved_alerts - 1)
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resolve alert')
      // Revert local state on error
      await refreshData()
    }
  }, [])

  const getFilteredAlerts = useCallback((filters: AlertFilters): MonitoringAlert[] => {
    return alerts.filter(alert => {
      if (filters.severity && alert.severity !== filters.severity) return false
      if (filters.type && alert.type !== filters.type) return false
      if (filters.resolved !== undefined && alert.is_resolved !== filters.resolved) return false
      if (filters.brokerId && alert.broker_id !== filters.brokerId) return false
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        if (!alert.title.toLowerCase().includes(searchLower) && 
            !alert.message.toLowerCase().includes(searchLower)) {
          return false
        }
      }
      return true
    }).slice(0, filters.limit || alerts.length)
  }, [alerts])

  const updateConfig = useCallback((updates: Partial<MonitoringConfig>) => {
    const newConfig = { ...config, ...updates }
    setConfig(newConfig)
    
    // Save to localStorage
    localStorage.setItem('broker-monitoring-config', JSON.stringify(newConfig))
    
    // If monitoring is active, restart with new config
    if (isMonitoring) {
      stopMonitoring()
      setTimeout(() => startMonitoring(), 1000)
    }
  }, [config, isMonitoring, startMonitoring, stopMonitoring])

  return {
    alerts,
    stats,
    isMonitoring,
    loading,
    error,
    startMonitoring,
    stopMonitoring,
    refreshData,
    resolveAlert,
    getFilteredAlerts,
    config,
    updateConfig
  }
}

// Mock data generators for development
function generateMockAlerts(): MonitoringAlert[] {
  const alertTypes: AlertType[] = ['status_change', 'regulatory_update', 'performance_issue', 'license_expiry', 'spread_change']
  const severities: AlertSeverity[] = ['low', 'medium', 'high', 'critical']
  const brokerNames = ['XM Group', 'IG Markets', 'OANDA', 'Plus500', 'eToro']
  
  return Array.from({ length: 20 }, (_, i) => {
    const type = alertTypes[Math.floor(Math.random() * alertTypes.length)]
    const severity = severities[Math.floor(Math.random() * severities.length)]
    const brokerName = brokerNames[Math.floor(Math.random() * brokerNames.length)]
    const isResolved = Math.random() < 0.3 // 30% chance of being resolved
    const createdAt = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Last 7 days
    
    return {
      id: `alert-${i + 1}`,
      broker_id: `broker-${Math.floor(Math.random() * 5) + 1}`,
      type,
      severity,
      title: generateAlertTitle(type, brokerName),
      message: generateAlertMessage(type, brokerName),
      data: generateAlertData(type),
      is_resolved: isResolved,
      resolved_at: isResolved ? new Date(createdAt.getTime() + Math.random() * 24 * 60 * 60 * 1000).toISOString() : undefined,
      created_at: createdAt.toISOString()
    }
  }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

function generateMockStats(): MonitoringStats {
  const alerts = generateMockAlerts()
  return {
    total_alerts: alerts.length,
    unresolved_alerts: alerts.filter(a => !a.is_resolved).length,
    critical_alerts: alerts.filter(a => a.severity === 'critical').length,
    brokers_monitored: 25,
    average_response_time: Math.random() * 2000 + 1000 // 1-3 seconds
  }
}

function generateAlertTitle(type: AlertType, brokerName: string): string {
  switch (type) {
    case 'status_change':
      return `Broker Status Changed: ${brokerName}`
    case 'regulatory_update':
      return `Regulatory Update: ${brokerName}`
    case 'performance_issue':
      return `Performance Issue: ${brokerName}`
    case 'license_expiry':
      return `License Expiring Soon: ${brokerName}`
    case 'spread_change':
      return `Significant Spread Change: ${brokerName}`
    default:
      return `Alert: ${brokerName}`
  }
}

function generateAlertMessage(type: AlertType, brokerName: string): string {
  switch (type) {
    case 'status_change':
      return `${brokerName} status changed from active to warning due to connectivity issues`
    case 'regulatory_update':
      return `New regulatory filing detected for ${brokerName} - license status updated`
    case 'performance_issue':
      return `${brokerName} response time (${Math.floor(Math.random() * 5000 + 3000)}ms) exceeds threshold`
    case 'license_expiry':
      return `${brokerName} license expires in ${Math.floor(Math.random() * 30 + 1)} days`
    case 'spread_change':
      return `EUR/USD spread for ${brokerName} increased by ${Math.floor(Math.random() * 50 + 20)}%`
    default:
      return `Alert generated for ${brokerName}`
  }
}

function generateAlertData(type: AlertType): any {
  switch (type) {
    case 'status_change':
      return {
        old_status: 'active',
        new_status: 'warning',
        response_time: Math.floor(Math.random() * 5000 + 3000)
      }
    case 'regulatory_update':
      return {
        regulatory_body: 'FCA',
        update_type: 'license_renewal',
        severity: 'medium'
      }
    case 'performance_issue':
      return {
        response_time: Math.floor(Math.random() * 5000 + 3000),
        uptime_percentage: Math.random() * 10 + 85
      }
    case 'license_expiry':
      return {
        expiry_date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        days_until_expiry: Math.floor(Math.random() * 30 + 1)
      }
    case 'spread_change':
      return {
        currency_pair: 'EUR/USD',
        old_spread: 1.2,
        new_spread: 1.8,
        change_percentage: Math.floor(Math.random() * 50 + 20)
      }
    default:
      return {}
  }
}

export type { AlertFilters, MonitoringStats, UseBrokerMonitoringReturn }
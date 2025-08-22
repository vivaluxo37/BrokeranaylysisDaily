import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/supabase'

type BrokerStatus = 'active' | 'inactive' | 'warning' | 'suspended' | 'under_review'
type AlertType = 'status_change' | 'regulatory_update' | 'performance_issue' | 'license_expiry' | 'spread_change'
type AlertSeverity = 'low' | 'medium' | 'high' | 'critical'

interface BrokerMonitoringData {
  broker_id: string
  status: BrokerStatus
  last_checked: string
  response_time: number
  uptime_percentage: number
  regulatory_status: string
  license_expiry: string | null
  spread_changes: SpreadChange[]
  performance_metrics: PerformanceMetrics
}

interface SpreadChange {
  currency_pair: string
  old_spread: number
  new_spread: number
  change_percentage: number
  timestamp: string
}

interface PerformanceMetrics {
  execution_speed: number
  slippage_average: number
  order_fill_rate: number
  customer_satisfaction: number
  complaint_ratio: number
}

interface MonitoringAlert {
  id: string
  broker_id: string
  type: AlertType
  severity: AlertSeverity
  title: string
  message: string
  data: any
  created_at: string
  resolved_at?: string
  is_resolved: boolean
}

interface MonitoringConfig {
  check_interval: number // minutes
  response_time_threshold: number // milliseconds
  uptime_threshold: number // percentage
  spread_change_threshold: number // percentage
  enable_email_alerts: boolean
  enable_push_notifications: boolean
  alert_recipients: string[]
}

class BrokerMonitoringService {
  private supabase = createClient()
  private config: MonitoringConfig
  private monitoringInterval: NodeJS.Timeout | null = null

  constructor(config: MonitoringConfig) {
    this.config = config
  }

  async startMonitoring(): Promise<void> {
    if (this.monitoringInterval) {
      this.stopMonitoring()
    }

    // Initial check
    await this.performMonitoringCheck()

    // Set up recurring checks
    this.monitoringInterval = setInterval(
      () => this.performMonitoringCheck(),
      this.config.check_interval * 60 * 1000
    )

    console.log(`Broker monitoring started with ${this.config.check_interval} minute intervals`)
  }

  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval)
      this.monitoringInterval = null
      console.log('Broker monitoring stopped')
    }
  }

  private async performMonitoringCheck(): Promise<void> {
    try {
      const { data: brokers, error } = await this.supabase
        .from('brokers')
        .select('*')
        .eq('is_active', true)

      if (error) throw error

      for (const broker of brokers || []) {
        await this.checkBrokerStatus(broker)
        await this.checkRegulatoryStatus(broker)
        await this.checkPerformanceMetrics(broker)
        await this.checkSpreadChanges(broker)
        await this.checkLicenseExpiry(broker)
      }
    } catch (error) {
      console.error('Error during monitoring check:', error)
      await this.createAlert({
        broker_id: 'system',
        type: 'performance_issue',
        severity: 'high',
        title: 'Monitoring System Error',
        message: `Error during monitoring check: ${error}`,
        data: { error: error }
      })
    }
  }

  private async checkBrokerStatus(broker: any): Promise<void> {
    const startTime = Date.now()
    
    try {
      // Simulate broker website/API check
      const response = await fetch(broker.website_url, {
        method: 'HEAD',
        timeout: 10000
      })
      
      const responseTime = Date.now() - startTime
      const isOnline = response.ok
      const newStatus: BrokerStatus = isOnline ? 'active' : 'inactive'
      
      // Check if status changed
      if (broker.status !== newStatus) {
        await this.createAlert({
          broker_id: broker.id,
          type: 'status_change',
          severity: newStatus === 'inactive' ? 'critical' : 'medium',
          title: `Broker Status Changed: ${broker.name}`,
          message: `Broker status changed from ${broker.status} to ${newStatus}`,
          data: {
            old_status: broker.status,
            new_status: newStatus,
            response_time: responseTime
          }
        })
      }
      
      // Check response time threshold
      if (responseTime > this.config.response_time_threshold) {
        await this.createAlert({
          broker_id: broker.id,
          type: 'performance_issue',
          severity: 'medium',
          title: `Slow Response Time: ${broker.name}`,
          message: `Response time (${responseTime}ms) exceeds threshold (${this.config.response_time_threshold}ms)`,
          data: { response_time: responseTime }
        })
      }
      
      // Update broker monitoring data
      await this.updateMonitoringData(broker.id, {
        status: newStatus,
        response_time: responseTime,
        last_checked: new Date().toISOString()
      })
      
    } catch (error) {
      await this.createAlert({
        broker_id: broker.id,
        type: 'status_change',
        severity: 'critical',
        title: `Broker Unreachable: ${broker.name}`,
        message: `Failed to reach broker website: ${error}`,
        data: { error: error }
      })
    }
  }

  private async checkRegulatoryStatus(broker: any): Promise<void> {
    try {
      // Check for regulatory updates from external APIs or databases
      const regulatoryData = await this.fetchRegulatoryData(broker.regulatory_bodies)
      
      if (regulatoryData.hasUpdates) {
        await this.createAlert({
          broker_id: broker.id,
          type: 'regulatory_update',
          severity: regulatoryData.severity,
          title: `Regulatory Update: ${broker.name}`,
          message: regulatoryData.message,
          data: regulatoryData
        })
      }
    } catch (error) {
      console.error(`Error checking regulatory status for ${broker.name}:`, error)
    }
  }

  private async checkPerformanceMetrics(broker: any): Promise<void> {
    try {
      const metrics = await this.fetchPerformanceMetrics(broker.id)
      
      // Check various performance thresholds
      const alerts = []
      
      if (metrics.uptime_percentage < this.config.uptime_threshold) {
        alerts.push({
          type: 'performance_issue' as AlertType,
          severity: 'high' as AlertSeverity,
          title: `Low Uptime: ${broker.name}`,
          message: `Uptime (${metrics.uptime_percentage}%) below threshold (${this.config.uptime_threshold}%)`,
          data: metrics
        })
      }
      
      if (metrics.order_fill_rate < 95) {
        alerts.push({
          type: 'performance_issue' as AlertType,
          severity: 'medium' as AlertSeverity,
          title: `Low Order Fill Rate: ${broker.name}`,
          message: `Order fill rate (${metrics.order_fill_rate}%) is concerning`,
          data: metrics
        })
      }
      
      if (metrics.complaint_ratio > 0.1) {
        alerts.push({
          type: 'performance_issue' as AlertType,
          severity: 'medium' as AlertSeverity,
          title: `High Complaint Ratio: ${broker.name}`,
          message: `Complaint ratio (${metrics.complaint_ratio}) is elevated`,
          data: metrics
        })
      }
      
      for (const alert of alerts) {
        await this.createAlert({
          broker_id: broker.id,
          ...alert
        })
      }
      
    } catch (error) {
      console.error(`Error checking performance metrics for ${broker.name}:`, error)
    }
  }

  private async checkSpreadChanges(broker: any): Promise<void> {
    try {
      const currentSpreads = await this.fetchCurrentSpreads(broker.id)
      const previousSpreads = await this.getPreviousSpreads(broker.id)
      
      for (const [pair, currentSpread] of Object.entries(currentSpreads)) {
        const previousSpread = previousSpreads[pair]
        if (previousSpread) {
          const changePercentage = ((currentSpread - previousSpread) / previousSpread) * 100
          
          if (Math.abs(changePercentage) > this.config.spread_change_threshold) {
            await this.createAlert({
              broker_id: broker.id,
              type: 'spread_change',
              severity: Math.abs(changePercentage) > 50 ? 'high' : 'medium',
              title: `Significant Spread Change: ${broker.name}`,
              message: `${pair} spread changed by ${changePercentage.toFixed(2)}%`,
              data: {
                currency_pair: pair,
                old_spread: previousSpread,
                new_spread: currentSpread,
                change_percentage: changePercentage
              }
            })
          }
        }
      }
    } catch (error) {
      console.error(`Error checking spread changes for ${broker.name}:`, error)
    }
  }

  private async checkLicenseExpiry(broker: any): Promise<void> {
    if (!broker.license_expiry) return
    
    const expiryDate = new Date(broker.license_expiry)
    const now = new Date()
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysUntilExpiry <= 30 && daysUntilExpiry > 0) {
      await this.createAlert({
        broker_id: broker.id,
        type: 'license_expiry',
        severity: daysUntilExpiry <= 7 ? 'critical' : 'high',
        title: `License Expiring Soon: ${broker.name}`,
        message: `Broker license expires in ${daysUntilExpiry} days`,
        data: {
          expiry_date: broker.license_expiry,
          days_until_expiry: daysUntilExpiry
        }
      })
    } else if (daysUntilExpiry <= 0) {
      await this.createAlert({
        broker_id: broker.id,
        type: 'license_expiry',
        severity: 'critical',
        title: `License Expired: ${broker.name}`,
        message: `Broker license expired ${Math.abs(daysUntilExpiry)} days ago`,
        data: {
          expiry_date: broker.license_expiry,
          days_since_expiry: Math.abs(daysUntilExpiry)
        }
      })
    }
  }

  private async createAlert(alertData: Omit<MonitoringAlert, 'id' | 'created_at' | 'is_resolved'>): Promise<void> {
    const alert: MonitoringAlert = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      is_resolved: false,
      ...alertData
    }
    
    // Save to database
    const { error } = await this.supabase
      .from('monitoring_alerts')
      .insert(alert)
    
    if (error) {
      console.error('Error creating alert:', error)
      return
    }
    
    // Send notifications
    await this.sendNotifications(alert)
    
    console.log(`Alert created: ${alert.title}`, alert)
  }

  private async sendNotifications(alert: MonitoringAlert): Promise<void> {
    try {
      if (this.config.enable_email_alerts) {
        await this.sendEmailAlert(alert)
      }
      
      if (this.config.enable_push_notifications) {
        await this.sendPushNotification(alert)
      }
    } catch (error) {
      console.error('Error sending notifications:', error)
    }
  }

  private async sendEmailAlert(alert: MonitoringAlert): Promise<void> {
    // Implementation would depend on your email service
    console.log('Email alert sent:', alert.title)
  }

  private async sendPushNotification(alert: MonitoringAlert): Promise<void> {
    // Implementation would depend on your push notification service
    console.log('Push notification sent:', alert.title)
  }

  private async updateMonitoringData(brokerId: string, data: Partial<BrokerMonitoringData>): Promise<void> {
    const { error } = await this.supabase
      .from('broker_monitoring')
      .upsert({
        broker_id: brokerId,
        ...data,
        updated_at: new Date().toISOString()
      })
    
    if (error) {
      console.error('Error updating monitoring data:', error)
    }
  }

  private async fetchRegulatoryData(regulatoryBodies: string[]): Promise<any> {
    // Mock implementation - would integrate with regulatory APIs
    return {
      hasUpdates: Math.random() < 0.1, // 10% chance of updates
      severity: 'medium' as AlertSeverity,
      message: 'Regulatory status updated'
    }
  }

  private async fetchPerformanceMetrics(brokerId: string): Promise<PerformanceMetrics> {
    // Mock implementation - would fetch from real data sources
    return {
      execution_speed: Math.random() * 100 + 50,
      slippage_average: Math.random() * 2,
      order_fill_rate: Math.random() * 10 + 90,
      customer_satisfaction: Math.random() * 2 + 8,
      complaint_ratio: Math.random() * 0.2,
      uptime_percentage: Math.random() * 5 + 95
    }
  }

  private async fetchCurrentSpreads(brokerId: string): Promise<Record<string, number>> {
    // Mock implementation - would fetch from real spread data
    return {
      'EUR/USD': Math.random() * 2 + 0.5,
      'GBP/USD': Math.random() * 3 + 1,
      'USD/JPY': Math.random() * 2 + 0.8
    }
  }

  private async getPreviousSpreads(brokerId: string): Promise<Record<string, number>> {
    // Mock implementation - would fetch from historical data
    return {
      'EUR/USD': Math.random() * 2 + 0.5,
      'GBP/USD': Math.random() * 3 + 1,
      'USD/JPY': Math.random() * 2 + 0.8
    }
  }

  // Public methods for managing alerts
  async getAlerts(filters?: {
    broker_id?: string
    type?: AlertType
    severity?: AlertSeverity
    is_resolved?: boolean
    limit?: number
  }): Promise<MonitoringAlert[]> {
    let query = this.supabase
      .from('monitoring_alerts')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (filters?.broker_id) {
      query = query.eq('broker_id', filters.broker_id)
    }
    
    if (filters?.type) {
      query = query.eq('type', filters.type)
    }
    
    if (filters?.severity) {
      query = query.eq('severity', filters.severity)
    }
    
    if (filters?.is_resolved !== undefined) {
      query = query.eq('is_resolved', filters.is_resolved)
    }
    
    if (filters?.limit) {
      query = query.limit(filters.limit)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Error fetching alerts:', error)
      return []
    }
    
    return data || []
  }

  async resolveAlert(alertId: string): Promise<void> {
    const { error } = await this.supabase
      .from('monitoring_alerts')
      .update({
        is_resolved: true,
        resolved_at: new Date().toISOString()
      })
      .eq('id', alertId)
    
    if (error) {
      console.error('Error resolving alert:', error)
    }
  }

  async getMonitoringStats(): Promise<{
    total_alerts: number
    unresolved_alerts: number
    critical_alerts: number
    brokers_monitored: number
    average_response_time: number
  }> {
    const { data: alerts } = await this.supabase
      .from('monitoring_alerts')
      .select('severity, is_resolved')
    
    const { data: monitoring } = await this.supabase
      .from('broker_monitoring')
      .select('response_time')
    
    const totalAlerts = alerts?.length || 0
    const unresolvedAlerts = alerts?.filter(a => !a.is_resolved).length || 0
    const criticalAlerts = alerts?.filter(a => a.severity === 'critical').length || 0
    const brokersMonitored = monitoring?.length || 0
    const averageResponseTime = monitoring?.reduce((sum, m) => sum + (m.response_time || 0), 0) / (monitoring?.length || 1)
    
    return {
      total_alerts: totalAlerts,
      unresolved_alerts: unresolvedAlerts,
      critical_alerts: criticalAlerts,
      brokers_monitored: brokersMonitored,
      average_response_time: averageResponseTime
    }
  }
}

// Default monitoring configuration
export const defaultMonitoringConfig: MonitoringConfig = {
  check_interval: 15, // 15 minutes
  response_time_threshold: 5000, // 5 seconds
  uptime_threshold: 99, // 99%
  spread_change_threshold: 20, // 20%
  enable_email_alerts: true,
  enable_push_notifications: true,
  alert_recipients: ['admin@brokeranalysis.com']
}

// Export types and service
export type {
  BrokerStatus,
  AlertType,
  AlertSeverity,
  BrokerMonitoringData,
  MonitoringAlert,
  MonitoringConfig,
  PerformanceMetrics,
  SpreadChange
}

export { BrokerMonitoringService }

// Create singleton instance
export const brokerMonitoringService = new BrokerMonitoringService(defaultMonitoringConfig)
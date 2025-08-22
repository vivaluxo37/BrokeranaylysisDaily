'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  TrendingUp,
  TrendingDown,
  Settings,
  Play,
  Pause,
  RefreshCw,
  Filter,
  Search,
  Bell,
  Shield,
  Zap,
  X,
  Eye,
  EyeOff,
  BarChart3
} from 'lucide-react'
import { useBrokerMonitoring, type AlertFilters } from '@/hooks/use-broker-monitoring'
import { type MonitoringAlert, type AlertSeverity, type AlertType } from '@/lib/broker-monitoring'

interface MonitoringStats {
  total_alerts: number
  unresolved_alerts: number
  critical_alerts: number
  brokers_monitored: number
  average_response_time: number
}

const severityColors = {
  low: 'bg-blue-100 text-blue-800 border-blue-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  critical: 'bg-red-100 text-red-800 border-red-200'
}

const severityIcons = {
  low: <Activity className="h-4 w-4" />,
  medium: <Clock className="h-4 w-4" />,
  high: <AlertTriangle className="h-4 w-4" />,
  critical: <AlertTriangle className="h-4 w-4 text-red-600" />
}

const alertTypeIcons = {
  status_change: <Activity className="h-4 w-4" />,
  regulatory_update: <Shield className="h-4 w-4" />,
  performance_issue: <Zap className="h-4 w-4" />,
  license_expiry: <Clock className="h-4 w-4" />,
  spread_change: <TrendingUp className="h-4 w-4" />
}

export default function BrokerMonitoringDashboard() {
  const {
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
  } = useBrokerMonitoring()

  const [filters, setFilters] = useState<AlertFilters>({
    severity: undefined,
    type: undefined,
    resolved: false,
    search: '',
    limit: 50
  })
  const [showResolved, setShowResolved] = useState(false)
  const [selectedAlert, setSelectedAlert] = useState<MonitoringAlert | null>(null)

  // Update filters when showResolved changes
  useEffect(() => {
    setFilters(prev => ({ ...prev, resolved: showResolved ? undefined : false }))
  }, [showResolved])

  const handleToggleMonitoring = async () => {
    try {
      if (isMonitoring) {
        stopMonitoring()
      } else {
        await startMonitoring()
      }
    } catch (error) {
      console.error('Failed to toggle monitoring:', error)
    }
  }

  const handleResolveAlert = async (alertId: string) => {
    try {
      await resolveAlert(alertId)
      setSelectedAlert(null)
    } catch (error) {
      console.error('Failed to resolve alert:', error)
    }
  }

  const filteredAlerts = getFilteredAlerts(filters)

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'destructive'
      case 'high':
        return 'destructive'
      case 'medium':
        return 'default'
      case 'low':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'status_change':
        return <Activity className="h-4 w-4 text-blue-500" />
      case 'regulatory_update':
        return <Shield className="h-4 w-4 text-green-500" />
      case 'performance_issue':
        return <Zap className="h-4 w-4 text-yellow-500" />
      case 'spread_change':
        return <BarChart3 className="h-4 w-4 text-purple-500" />
      case 'system_error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  const formatResponseTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(1)}s`
  }

  const getSeverityColor = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical': return 'destructive'
      case 'high': return 'destructive'
      case 'medium': return 'default'
      case 'low': return 'secondary'
      default: return 'secondary'
    }
  }

  const getSeverityIcon = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4" />
      case 'high': return <AlertTriangle className="h-4 w-4" />
      case 'medium': return <Clock className="h-4 w-4" />
      case 'low': return <CheckCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getTypeIcon = (type: AlertType) => {
    switch (type) {
      case 'status_change': return <Activity className="h-4 w-4" />
      case 'regulatory_update': return <Shield className="h-4 w-4" />
      case 'performance_issue': return <Zap className="h-4 w-4" />
      case 'license_expiry': return <Clock className="h-4 w-4" />
      case 'spread_change': return <TrendingUp className="h-4 w-4" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading monitoring data...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Broker Monitoring</h1>
          <p className="text-muted-foreground">
            Real-time monitoring of broker status, performance, and regulatory compliance
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          {isMonitoring ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleToggleMonitoring}
            >
              <Pause className="h-4 w-4 mr-2" />
              Stop Monitoring
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleToggleMonitoring}
            >
              <Play className="h-4 w-4 mr-2" />
              Start Monitoring
            </Button>
          )}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_alerts}</div>
            <p className="text-xs text-muted-foreground">
              All time alerts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unresolved</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.unresolved_alerts}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total_alerts > 0 ? ((stats.unresolved_alerts / stats.total_alerts) * 100).toFixed(1) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.critical_alerts}</div>
            <p className="text-xs text-muted-foreground">
              Requires immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Brokers Monitored</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.brokers_monitored}</div>
            <p className="text-xs text-muted-foreground">
              Active monitoring
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(stats.average_response_time)}ms</div>
            <p className="text-xs text-muted-foreground">
              {stats.average_response_time < 2000 ? (
                <span className="text-green-600">Good performance</span>
              ) : (
                <span className="text-yellow-600">Needs attention</span>
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="alerts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
        </TabsList>
        
        <TabsContent value="alerts" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search alerts..."
                    value={filters.search || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="w-64"
                  />
                </div>
                
                <Select
                  value={filters.severity || 'all'}
                  onValueChange={(value) => setFilters(prev => ({ 
                    ...prev, 
                    severity: value === 'all' ? undefined : value as AlertSeverity 
                  }))}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select
                  value={filters.type || 'all'}
                  onValueChange={(value) => setFilters(prev => ({ 
                    ...prev, 
                    type: value === 'all' ? undefined : value as AlertType 
                  }))}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Alert Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="status_change">Status Change</SelectItem>
                    <SelectItem value="regulatory_update">Regulatory Update</SelectItem>
                    <SelectItem value="performance_issue">Performance Issue</SelectItem>
                    <SelectItem value="license_expiry">License Expiry</SelectItem>
                    <SelectItem value="spread_change">Spread Change</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="show-resolved"
                    checked={showResolved}
                    onCheckedChange={setShowResolved}
                  />
                  <Label htmlFor="show-resolved">Show resolved</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alerts List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Alerts ({filteredAlerts.length})</span>
                <div className="flex items-center space-x-2">
                  <Badge variant={isMonitoring ? "default" : "secondary"}>
                    {isMonitoring ? "Monitoring Active" : "Monitoring Stopped"}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredAlerts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No alerts found matching your criteria</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-lg border transition-colors cursor-pointer hover:bg-muted/50 ${
                        alert.is_resolved ? 'bg-muted/30 opacity-75' : 'bg-background'
                      } ${
                        alert.severity === 'critical' && !alert.is_resolved ? 'border-red-200 bg-red-50' : ''
                      }`}
                      onClick={() => setSelectedAlert(alert)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {getTypeIcon(alert.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="text-sm font-medium truncate">{alert.title}</h4>
                              <Badge variant={getSeverityColor(alert.severity)} className="text-xs">
                                {alert.severity}
                              </Badge>
                              {alert.is_resolved && (
                                <Badge variant="secondary" className="text-xs">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Resolved
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                              {alert.message}
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <span>{formatTime(alert.created_at)}</span>
                              {alert.resolved_at && (
                                <span>Resolved: {formatTime(alert.resolved_at)}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {!alert.is_resolved && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleResolveAlert(alert.id)
                              }}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Resolve
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedAlert(alert)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Monitoring Configuration
              </CardTitle>
              <CardDescription>
                Configure monitoring intervals, thresholds, and notification settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Monitoring Intervals */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Monitoring Intervals</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="check-interval">Check Interval (minutes)</Label>
                    <Input
                      id="check-interval"
                      type="number"
                      value={config.check_interval}
                      onChange={(e) => updateConfig({ check_interval: parseInt(e.target.value) })}
                      min="1"
                      max="1440"
                    />
                  </div>
                </div>
              </div>

              {/* Thresholds */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Alert Thresholds</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="response-threshold">Response Time Threshold (ms)</Label>
                    <Input
                      id="response-threshold"
                      type="number"
                      value={config.response_time_threshold}
                      onChange={(e) => updateConfig({ response_time_threshold: parseInt(e.target.value) })}
                      min="100"
                      max="30000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="uptime-threshold">Uptime Threshold (%)</Label>
                    <Input
                      id="uptime-threshold"
                      type="number"
                      value={config.uptime_threshold}
                      onChange={(e) => updateConfig({ uptime_threshold: parseInt(e.target.value) })}
                      min="50"
                      max="100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="spread-threshold">Spread Change Threshold (%)</Label>
                    <Input
                      id="spread-threshold"
                      type="number"
                      value={config.spread_change_threshold}
                      onChange={(e) => updateConfig({ spread_change_threshold: parseInt(e.target.value) })}
                      min="1"
                      max="100"
                    />
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Notification Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      <Label htmlFor="email-alerts">Email Alerts</Label>
                    </div>
                    <Switch
                      id="email-alerts"
                      checked={config.enable_email_alerts}
                      onCheckedChange={(checked) => updateConfig({ enable_email_alerts: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={config.enable_push_notifications}
                      onCheckedChange={(checked) => updateConfig({ enable_push_notifications: checked })}
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-4">
                <Button onClick={() => console.log('Configuration saved:', config)}>
                  Save Configuration
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center space-x-3">
                {getTypeIcon(selectedAlert.type)}
                <div>
                  <h3 className="text-lg font-semibold">{selectedAlert.title}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant={getSeverityColor(selectedAlert.severity)}>
                      {selectedAlert.severity}
                    </Badge>
                    <Badge variant="outline">
                      {selectedAlert.type.replace('_', ' ')}
                    </Badge>
                    {selectedAlert.is_resolved && (
                      <Badge variant="secondary">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Resolved
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedAlert(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Message</h4>
                  <p className="text-muted-foreground">{selectedAlert.message}</p>
                </div>
                
                {selectedAlert.broker_id && (
                  <div>
                    <h4 className="font-medium mb-2">Broker ID</h4>
                    <p className="text-muted-foreground">{selectedAlert.broker_id}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Created</h4>
                    <p className="text-muted-foreground">{formatTime(selectedAlert.created_at)}</p>
                  </div>
                  {selectedAlert.resolved_at && (
                    <div>
                      <h4 className="font-medium mb-2">Resolved</h4>
                      <p className="text-muted-foreground">{formatTime(selectedAlert.resolved_at)}</p>
                    </div>
                  )}
                </div>
                
                {selectedAlert.metadata && Object.keys(selectedAlert.metadata).length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Additional Details</h4>
                    <div className="bg-muted rounded-lg p-3">
                      <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {JSON.stringify(selectedAlert.metadata, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-end space-x-2 p-6 border-t bg-muted/50">
              {!selectedAlert.is_resolved && (
                <Button
                  onClick={() => {
                    handleResolveAlert(selectedAlert.id)
                    setSelectedAlert(null)
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Resolve Alert
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => setSelectedAlert(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
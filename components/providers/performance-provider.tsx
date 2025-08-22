'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { performanceMonitor, addResourceHints, type PerformanceMetric } from '@/lib/performance'

interface PerformanceContextType {
  metrics: PerformanceMetric[]
  performanceScore: number
  isMonitoring: boolean
  startMonitoring: () => void
  stopMonitoring: () => void
  getMetricsByName: (name: string) => PerformanceMetric[]
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined)

interface PerformanceProviderProps {
  children: ReactNode
  enableConsoleLogging?: boolean
  enableAnalytics?: boolean
}

export const PerformanceProvider: React.FC<PerformanceProviderProps> = ({
  children,
  enableConsoleLogging = process.env.NODE_ENV === 'development',
  enableAnalytics = process.env.NODE_ENV === 'production'
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([])
  const [performanceScore, setPerformanceScore] = useState(0)
  const [isMonitoring, setIsMonitoring] = useState(false)

  useEffect(() => {
    // Add resource hints for better performance
    addResourceHints()

    // Start monitoring automatically
    startMonitoring()

    return () => {
      stopMonitoring()
    }
  }, [])

  const startMonitoring = () => {
    if (typeof window === 'undefined') return

    setIsMonitoring(true)

    // Start the performance monitor
    performanceMonitor.start()

    // Listen to performance metrics
    performanceMonitor.onMetric((metric) => {
      setMetrics(prev => {
        const updated = [...prev, metric]
        
        // Keep only the latest 100 metrics to prevent memory leaks
        if (updated.length > 100) {
          return updated.slice(-100)
        }
        
        return updated
      })

      // Update performance score
      setPerformanceScore(performanceMonitor.getPerformanceScore())

      // Console logging for development
      if (enableConsoleLogging) {
        console.group(`🚀 Performance Metric: ${metric.name}`)
        console.log(`Value: ${metric.value.toFixed(2)}ms`)
        console.log(`Rating: ${metric.rating}`)
        console.log(`Timestamp: ${new Date(metric.timestamp).toISOString()}`)
        console.groupEnd()
      }

      // Send to analytics in production
      if (enableAnalytics && typeof window !== 'undefined') {
        // Google Analytics 4
        if ('gtag' in window) {
          ;(window as any).gtag('event', 'web_vitals', {
            event_category: 'Performance',
            event_label: metric.name,
            value: Math.round(metric.value),
            custom_parameter_1: metric.rating
          })
        }

        // Custom analytics endpoint (if available)
        if (process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
          fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              type: 'performance_metric',
              metric,
              url: window.location.href,
              userAgent: navigator.userAgent,
              timestamp: Date.now()
            })
          }).catch(error => {
            console.warn('Failed to send performance metric to analytics:', error)
          })
        }
      }
    })
  }

  const stopMonitoring = () => {
    setIsMonitoring(false)
    performanceMonitor.stop()
  }

  const getMetricsByName = (name: string): PerformanceMetric[] => {
    return metrics.filter(metric => metric.name === name)
  }

  const contextValue: PerformanceContextType = {
    metrics,
    performanceScore,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    getMetricsByName
  }

  return (
    <PerformanceContext.Provider value={contextValue}>
      {children}
    </PerformanceContext.Provider>
  )
}

export const usePerformance = (): PerformanceContextType => {
  const context = useContext(PerformanceContext)
  if (context === undefined) {
    throw new Error('usePerformance must be used within a PerformanceProvider')
  }
  return context
}

// Performance debugging component for development
export const PerformanceDebugger: React.FC = () => {
  const { metrics, performanceScore, isMonitoring } = usePerformance()
  const [isVisible, setIsVisible] = useState(false)

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  const latestMetrics = ['LCP', 'INP', 'CLS', 'FCP', 'TTFB'].map(name => {
    const metric = metrics.filter(m => m.name === name).slice(-1)[0]
    return metric ? { name, ...metric } : { name, value: 0, rating: 'unknown' as const }
  })

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good': return 'text-green-600'
      case 'needs-improvement': return 'text-yellow-600'
      case 'poor': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-blue-600 text-white px-3 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
      >
        🚀 Performance
      </button>
      
      {isVisible && (
        <div className="absolute bottom-12 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-4 w-80">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">Performance Metrics</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>
          
          <div className="mb-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Overall Score:</span>
              <span className={`font-bold ${getScoreColor(performanceScore)}`}>
                {performanceScore}/100
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Monitoring:</span>
              <span className={isMonitoring ? 'text-green-600' : 'text-red-600'}>
                {isMonitoring ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            {latestMetrics.map(({ name, value, rating }) => (
              <div key={name} className="flex justify-between items-center text-sm">
                <span className="text-gray-700 dark:text-gray-300">{name}:</span>
                <div className="text-right">
                  <div className="text-gray-900 dark:text-white">
                    {value > 0 ? `${value.toFixed(0)}${name === 'CLS' ? '' : 'ms'}` : 'N/A'}
                  </div>
                  <div className={`text-xs ${getRatingColor(rating)}`}>
                    {rating !== 'unknown' ? rating : 'pending'}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Total metrics collected: {metrics.length}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
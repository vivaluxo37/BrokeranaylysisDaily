import { supabase } from '@/lib/supabase';

export interface PerformanceMetrics {
  operation: string;
  duration_ms: number;
  success: boolean;
  error_type?: string;
  error_message?: string;
  metadata?: any;
  timestamp: Date;
}

export interface QualityMetrics {
  response_id: string;
  query: string;
  intent: string;
  quality_score: number;
  confidence_score: number;
  user_feedback?: 'positive' | 'negative' | 'neutral';
  issues?: string[];
  timestamp: Date;
}

export interface ErrorEvent {
  operation: string;
  error_type: string;
  error_message: string;
  stack_trace?: string;
  user_context?: any;
  request_data?: any;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
}

/**
 * Comprehensive monitoring service for RAG system
 */
export class MonitoringService {
  private performanceBuffer: PerformanceMetrics[] = [];
  private qualityBuffer: QualityMetrics[] = [];
  private errorBuffer: ErrorEvent[] = [];
  private readonly bufferSize = 100;
  private readonly flushInterval = 30000; // 30 seconds

  constructor() {
    // Periodically flush buffers to database
    setInterval(() => this.flushBuffers(), this.flushInterval);
  }

  /**
   * Track performance metrics
   */
  async trackPerformance(metrics: Omit<PerformanceMetrics, 'timestamp'>): Promise<void> {
    const performanceMetric: PerformanceMetrics = {
      ...metrics,
      timestamp: new Date()
    };

    this.performanceBuffer.push(performanceMetric);

    // Log critical performance issues immediately
    if (metrics.duration_ms > 10000 || !metrics.success) {
      console.warn('Performance issue detected:', performanceMetric);
    }

    // Flush buffer if it's getting full
    if (this.performanceBuffer.length >= this.bufferSize) {
      await this.flushPerformanceMetrics();
    }
  }

  /**
   * Track quality metrics
   */
  async trackQuality(metrics: Omit<QualityMetrics, 'timestamp'>): Promise<void> {
    const qualityMetric: QualityMetrics = {
      ...metrics,
      timestamp: new Date()
    };

    this.qualityBuffer.push(qualityMetric);

    // Log quality issues immediately
    if (metrics.quality_score < 0.5 || metrics.confidence_score < 0.5) {
      console.warn('Quality issue detected:', qualityMetric);
    }

    // Flush buffer if it's getting full
    if (this.qualityBuffer.length >= this.bufferSize) {
      await this.flushQualityMetrics();
    }
  }

  /**
   * Track error events
   */
  async trackError(error: Omit<ErrorEvent, 'timestamp'>): Promise<void> {
    const errorEvent: ErrorEvent = {
      ...error,
      timestamp: new Date()
    };

    this.errorBuffer.push(errorEvent);

    // Log errors immediately based on severity
    if (error.severity === 'critical' || error.severity === 'high') {
      console.error('Critical error detected:', errorEvent);
    }

    // Flush buffer if it's getting full or for critical errors
    if (this.errorBuffer.length >= this.bufferSize || error.severity === 'critical') {
      await this.flushErrorEvents();
    }
  }

  /**
   * Create performance tracker for operations
   */
  createPerformanceTracker(operation: string, metadata?: any) {
    const startTime = Date.now();
    
    return {
      success: async (additionalMetadata?: any) => {
        await this.trackPerformance({
          operation,
          duration_ms: Date.now() - startTime,
          success: true,
          metadata: { ...metadata, ...additionalMetadata }
        });
      },
      
      error: async (error: Error, additionalMetadata?: any) => {
        await this.trackPerformance({
          operation,
          duration_ms: Date.now() - startTime,
          success: false,
          error_type: error.constructor.name,
          error_message: error.message,
          metadata: { ...metadata, ...additionalMetadata }
        });

        await this.trackError({
          operation,
          error_type: error.constructor.name,
          error_message: error.message,
          stack_trace: error.stack,
          severity: this.determineSeverity(error, operation),
          user_context: metadata?.userContext,
          request_data: metadata?.requestData
        });
      }
    };
  }

  /**
   * Get performance statistics
   */
  async getPerformanceStats(
    timeRange: { start: Date; end: Date },
    operation?: string
  ): Promise<{
    avg_duration_ms: number;
    success_rate: number;
    total_operations: number;
    error_breakdown: Record<string, number>;
  }> {
    try {
      let query = supabase
        .from('performance_metrics')
        .select('*')
        .gte('timestamp', timeRange.start.toISOString())
        .lte('timestamp', timeRange.end.toISOString());

      if (operation) {
        query = query.eq('operation', operation);
      }

      const { data, error } = await query;
      if (error) throw error;

      const metrics = data || [];
      
      if (metrics.length === 0) {
        return {
          avg_duration_ms: 0,
          success_rate: 0,
          total_operations: 0,
          error_breakdown: {}
        };
      }

      const totalDuration = metrics.reduce((sum, m) => sum + m.duration_ms, 0);
      const successCount = metrics.filter(m => m.success).length;
      const errorBreakdown: Record<string, number> = {};

      metrics.forEach(m => {
        if (!m.success && m.error_type) {
          errorBreakdown[m.error_type] = (errorBreakdown[m.error_type] || 0) + 1;
        }
      });

      return {
        avg_duration_ms: Math.round(totalDuration / metrics.length),
        success_rate: Math.round((successCount / metrics.length) * 100) / 100,
        total_operations: metrics.length,
        error_breakdown: errorBreakdown
      };
    } catch (error) {
      console.error('Error getting performance stats:', error);
      throw new Error('Failed to get performance statistics');
    }
  }

  /**
   * Get quality statistics
   */
  async getQualityStats(
    timeRange: { start: Date; end: Date }
  ): Promise<{
    avg_quality_score: number;
    avg_confidence_score: number;
    total_responses: number;
    feedback_breakdown: Record<string, number>;
    common_issues: string[];
  }> {
    try {
      const { data, error } = await supabase
        .from('quality_metrics')
        .select('*')
        .gte('timestamp', timeRange.start.toISOString())
        .lte('timestamp', timeRange.end.toISOString());

      if (error) throw error;

      const metrics = data || [];
      
      if (metrics.length === 0) {
        return {
          avg_quality_score: 0,
          avg_confidence_score: 0,
          total_responses: 0,
          feedback_breakdown: {},
          common_issues: []
        };
      }

      const totalQuality = metrics.reduce((sum, m) => sum + m.quality_score, 0);
      const totalConfidence = metrics.reduce((sum, m) => sum + m.confidence_score, 0);
      
      const feedbackBreakdown: Record<string, number> = {};
      const issueCount: Record<string, number> = {};

      metrics.forEach(m => {
        if (m.user_feedback) {
          feedbackBreakdown[m.user_feedback] = (feedbackBreakdown[m.user_feedback] || 0) + 1;
        }
        
        if (m.issues) {
          m.issues.forEach((issue: string) => {
            issueCount[issue] = (issueCount[issue] || 0) + 1;
          });
        }
      });

      const commonIssues = Object.entries(issueCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([issue]) => issue);

      return {
        avg_quality_score: Math.round((totalQuality / metrics.length) * 100) / 100,
        avg_confidence_score: Math.round((totalConfidence / metrics.length) * 100) / 100,
        total_responses: metrics.length,
        feedback_breakdown: feedbackBreakdown,
        common_issues: commonIssues
      };
    } catch (error) {
      console.error('Error getting quality stats:', error);
      throw new Error('Failed to get quality statistics');
    }
  }

  /**
   * Flush all buffers to database
   */
  private async flushBuffers(): Promise<void> {
    await Promise.all([
      this.flushPerformanceMetrics(),
      this.flushQualityMetrics(),
      this.flushErrorEvents()
    ]);
  }

  /**
   * Flush performance metrics to database
   */
  private async flushPerformanceMetrics(): Promise<void> {
    if (this.performanceBuffer.length === 0) return;

    try {
      const metrics = [...this.performanceBuffer];
      this.performanceBuffer = [];

      await supabase.from('performance_metrics').insert(
        metrics.map(m => ({
          operation: m.operation,
          duration_ms: m.duration_ms,
          success: m.success,
          error_type: m.error_type,
          error_message: m.error_message,
          metadata: m.metadata,
          timestamp: m.timestamp.toISOString()
        }))
      );
    } catch (error) {
      console.error('Failed to flush performance metrics:', error);
      // Don't throw - monitoring shouldn't break the application
    }
  }

  /**
   * Flush quality metrics to database
   */
  private async flushQualityMetrics(): Promise<void> {
    if (this.qualityBuffer.length === 0) return;

    try {
      const metrics = [...this.qualityBuffer];
      this.qualityBuffer = [];

      await supabase.from('quality_metrics').insert(
        metrics.map(m => ({
          response_id: m.response_id,
          query: m.query,
          intent: m.intent,
          quality_score: m.quality_score,
          confidence_score: m.confidence_score,
          user_feedback: m.user_feedback,
          issues: m.issues,
          timestamp: m.timestamp.toISOString()
        }))
      );
    } catch (error) {
      console.error('Failed to flush quality metrics:', error);
    }
  }

  /**
   * Flush error events to database
   */
  private async flushErrorEvents(): Promise<void> {
    if (this.errorBuffer.length === 0) return;

    try {
      const events = [...this.errorBuffer];
      this.errorBuffer = [];

      await supabase.from('error_events').insert(
        events.map(e => ({
          operation: e.operation,
          error_type: e.error_type,
          error_message: e.error_message,
          stack_trace: e.stack_trace,
          user_context: e.user_context,
          request_data: e.request_data,
          severity: e.severity,
          timestamp: e.timestamp.toISOString()
        }))
      );
    } catch (error) {
      console.error('Failed to flush error events:', error);
    }
  }

  /**
   * Determine error severity based on error type and operation
   */
  private determineSeverity(error: Error, operation: string): ErrorEvent['severity'] {
    // Critical errors that break core functionality
    if (error.message.includes('database') || error.message.includes('connection')) {
      return 'critical';
    }

    // High severity for AI service failures
    if (operation.includes('ai') || operation.includes('embedding')) {
      return 'high';
    }

    // Medium severity for search failures
    if (operation.includes('search') || operation.includes('vector')) {
      return 'medium';
    }

    // Low severity for other errors
    return 'low';
  }
}

// Export singleton instance
export const monitoringService = new MonitoringService();

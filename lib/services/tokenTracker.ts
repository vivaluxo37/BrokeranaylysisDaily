import {
  AIProvider,
  TokenUsage,
  AIServiceMetrics,
  AIResponse,
  AIModel
} from '../types';

/**
 * Token Usage and Cost Tracking System
 * Monitors token consumption and costs across all AI providers
 */
export class TokenTracker {
  private usage: Map<string, TokenUsageRecord>;
  private dailyLimits: Map<AIProvider, DailyLimit>;
  private costRates: Map<string, ModelCostRate>;
  private alerts: TokenAlert[];
  private persistenceEnabled: boolean;

  constructor(options: TokenTrackerOptions = {}) {
    this.usage = new Map();
    this.dailyLimits = new Map();
    this.costRates = new Map();
    this.alerts = [];
    this.persistenceEnabled = options.enablePersistence ?? true;
    
    this.initializeDefaultLimits();
    this.initializeDefaultCostRates();
    
    if (this.persistenceEnabled) {
      this.loadPersistedData();
      this.setupPeriodicSave();
    }
  }

  /**
   * Track token usage from an AI response
   */
  trackUsage(response: AIResponse): void {
    const sessionId = this.getCurrentSessionId();
    const timestamp = new Date();
    const dateKey = this.getDateKey(timestamp);
    
    // Create usage record
    const usageRecord: TokenUsageRecord = {
      sessionId,
      timestamp,
      provider: response.provider,
      model: response.model,
      tokensUsed: response.tokensUsed,
      cost: response.cost,
      requestType: this.determineRequestType(response),
      success: true
    };
    
    // Store usage record
    const recordKey = `${dateKey}_${sessionId}_${Date.now()}`;
    this.usage.set(recordKey, usageRecord);
    
    // Update cost rates if not present
    this.updateCostRates(response.model, response.tokensUsed, response.cost);
    
    // Check limits and trigger alerts
    this.checkLimitsAndAlert(response.provider, dateKey);
    
    // Clean old records
    this.cleanOldRecords();
  }

  /**
   * Track failed request (no tokens used but still counts toward rate limits)
   */
  trackFailedRequest(provider: AIProvider, model: string, error: string): void {
    const sessionId = this.getCurrentSessionId();
    const timestamp = new Date();
    
    const usageRecord: TokenUsageRecord = {
      sessionId,
      timestamp,
      provider,
      model,
      tokensUsed: { input: 0, output: 0, total: 0 },
      cost: 0,
      requestType: 'unknown',
      success: false,
      error
    };
    
    const recordKey = `${this.getDateKey(timestamp)}_${sessionId}_${Date.now()}`;
    this.usage.set(recordKey, usageRecord);
  }

  /**
   * Get usage statistics for a specific time period
   */
  getUsageStats(period: TimePeriod = 'today'): UsageStats {
    const records = this.getRecordsForPeriod(period);
    
    const stats: UsageStats = {
      period,
      totalRequests: records.length,
      successfulRequests: records.filter(r => r.success).length,
      failedRequests: records.filter(r => !r.success).length,
      totalTokens: records.reduce((sum, r) => sum + r.tokensUsed.total, 0),
      totalCost: records.reduce((sum, r) => sum + r.cost, 0),
      providerBreakdown: this.getProviderBreakdown(records),
      modelBreakdown: this.getModelBreakdown(records),
      hourlyDistribution: this.getHourlyDistribution(records),
      averageTokensPerRequest: 0,
      averageCostPerRequest: 0,
      averageResponseTime: 0
    };
    
    // Calculate averages
    if (stats.successfulRequests > 0) {
      const successfulRecords = records.filter(r => r.success);
      stats.averageTokensPerRequest = stats.totalTokens / stats.successfulRequests;
      stats.averageCostPerRequest = stats.totalCost / stats.successfulRequests;
    }
    
    return stats;
  }

  /**
   * Get cost breakdown by provider and model
   */
  getCostBreakdown(period: TimePeriod = 'today'): CostBreakdown {
    const records = this.getRecordsForPeriod(period);
    
    const breakdown: CostBreakdown = {
      period,
      totalCost: records.reduce((sum, r) => sum + r.cost, 0),
      providers: {},
      models: {},
      trends: this.getCostTrends(period)
    };
    
    // Provider breakdown
    for (const provider of Object.values(AIProvider)) {
      const providerRecords = records.filter(r => r.provider === provider);
      breakdown.providers[provider] = {
        cost: providerRecords.reduce((sum, r) => sum + r.cost, 0),
        tokens: providerRecords.reduce((sum, r) => sum + r.tokensUsed.total, 0),
        requests: providerRecords.length,
        averageCostPerToken: 0
      };
      
      if (breakdown.providers[provider].tokens > 0) {
        breakdown.providers[provider].averageCostPerToken = 
          breakdown.providers[provider].cost / breakdown.providers[provider].tokens;
      }
    }
    
    // Model breakdown
    const modelGroups = this.groupBy(records, 'model');
    for (const [model, modelRecords] of Object.entries(modelGroups)) {
      breakdown.models[model] = {
        cost: modelRecords.reduce((sum, r) => sum + r.cost, 0),
        tokens: modelRecords.reduce((sum, r) => sum + r.tokensUsed.total, 0),
        requests: modelRecords.length,
        averageCostPerToken: 0
      };
      
      if (breakdown.models[model].tokens > 0) {
        breakdown.models[model].averageCostPerToken = 
          breakdown.models[model].cost / breakdown.models[model].tokens;
      }
    }
    
    return breakdown;
  }

  /**
   * Set daily spending limit for a provider
   */
  setDailyLimit(provider: AIProvider, limit: DailyLimit): void {
    this.dailyLimits.set(provider, limit);
    this.persistData();
  }

  /**
   * Get current daily usage against limits
   */
  getDailyUsage(provider?: AIProvider): Map<AIProvider, DailyUsage> {
    const today = this.getDateKey(new Date());
    const todayRecords = Array.from(this.usage.values())
      .filter(r => this.getDateKey(r.timestamp) === today);
    
    const usage = new Map<AIProvider, DailyUsage>();
    
    const providers = provider ? [provider] : Object.values(AIProvider);
    
    for (const prov of providers) {
      const providerRecords = todayRecords.filter(r => r.provider === prov);
      const limit = this.dailyLimits.get(prov);
      
      const dailyUsage: DailyUsage = {
        provider: prov,
        date: today,
        tokensUsed: providerRecords.reduce((sum, r) => sum + r.tokensUsed.total, 0),
        costSpent: providerRecords.reduce((sum, r) => sum + r.cost, 0),
        requestCount: providerRecords.length,
        limits: limit || { maxTokens: Infinity, maxCost: Infinity, maxRequests: Infinity },
        percentageUsed: {
          tokens: 0,
          cost: 0,
          requests: 0
        },
        isLimitExceeded: false
      };
      
      // Calculate percentages
      if (limit) {
        dailyUsage.percentageUsed.tokens = 
          limit.maxTokens !== Infinity ? (dailyUsage.tokensUsed / limit.maxTokens) * 100 : 0;
        dailyUsage.percentageUsed.cost = 
          limit.maxCost !== Infinity ? (dailyUsage.costSpent / limit.maxCost) * 100 : 0;
        dailyUsage.percentageUsed.requests = 
          limit.maxRequests !== Infinity ? (dailyUsage.requestCount / limit.maxRequests) * 100 : 0;
        
        dailyUsage.isLimitExceeded = 
          dailyUsage.tokensUsed >= limit.maxTokens ||
          dailyUsage.costSpent >= limit.maxCost ||
          dailyUsage.requestCount >= limit.maxRequests;
      }
      
      usage.set(prov, dailyUsage);
    }
    
    return usage;
  }

  /**
   * Get alerts for usage limits
   */
  getAlerts(): TokenAlert[] {
    return [...this.alerts].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Clear alerts
   */
  clearAlerts(): void {
    this.alerts = [];
    this.persistData();
  }

  /**
   * Export usage data
   */
  exportData(format: 'json' | 'csv' = 'json', period: TimePeriod = 'all'): string {
    const records = this.getRecordsForPeriod(period);
    
    if (format === 'csv') {
      return this.exportToCSV(records);
    }
    
    return JSON.stringify({
      exportDate: new Date().toISOString(),
      period,
      recordCount: records.length,
      records: records.map(r => ({
        ...r,
        timestamp: r.timestamp.toISOString()
      }))
    }, null, 2);
  }

  /**
   * Get estimated cost for a request
   */
  estimateCost(model: string, estimatedTokens: number): number {
    const costRate = this.costRates.get(model);
    if (!costRate) {
      return 0;
    }
    
    // Estimate input/output split (70% input, 30% output)
    const inputTokens = Math.floor(estimatedTokens * 0.7);
    const outputTokens = Math.floor(estimatedTokens * 0.3);
    
    return (inputTokens * costRate.inputCostPerToken) + (outputTokens * costRate.outputCostPerToken);
  }

  /**
   * Check if request would exceed daily limits
   */
  wouldExceedLimits(provider: AIProvider, estimatedTokens: number, estimatedCost: number): boolean {
    const dailyUsage = this.getDailyUsage(provider).get(provider);
    if (!dailyUsage) {
      return false;
    }
    
    const limits = dailyUsage.limits;
    
    return (
      (dailyUsage.tokensUsed + estimatedTokens) >= limits.maxTokens ||
      (dailyUsage.costSpent + estimatedCost) >= limits.maxCost ||
      (dailyUsage.requestCount + 1) >= limits.maxRequests
    );
  }

  // Private methods
  private getCurrentSessionId(): string {
    // Generate or retrieve session ID
    if (typeof window !== 'undefined') {
      let sessionId = sessionStorage.getItem('ai_session_id');
      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('ai_session_id', sessionId);
      }
      return sessionId;
    }
    return `server_session_${Date.now()}`;
  }

  private getDateKey(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private determineRequestType(response: AIResponse): string {
    // Determine request type based on response characteristics
    if (response.model.includes('embedding')) {
      return 'embedding';
    }
    if (response.tokensUsed.output > response.tokensUsed.input * 2) {
      return 'generation';
    }
    return 'chat';
  }

  private getRecordsForPeriod(period: TimePeriod): TokenUsageRecord[] {
    const now = new Date();
    const records = Array.from(this.usage.values());
    
    switch (period) {
      case 'today':
        return records.filter(r => this.getDateKey(r.timestamp) === this.getDateKey(now));
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return records.filter(r => r.timestamp >= weekAgo);
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return records.filter(r => r.timestamp >= monthAgo);
      case 'all':
      default:
        return records;
    }
  }

  private getProviderBreakdown(records: TokenUsageRecord[]): Record<AIProvider, ProviderStats> {
    const breakdown: Record<AIProvider, ProviderStats> = {} as any;
    
    for (const provider of Object.values(AIProvider)) {
      const providerRecords = records.filter(r => r.provider === provider);
      breakdown[provider] = {
        requests: providerRecords.length,
        tokens: providerRecords.reduce((sum, r) => sum + r.tokensUsed.total, 0),
        cost: providerRecords.reduce((sum, r) => sum + r.cost, 0),
        errors: providerRecords.filter(r => !r.success).length
      };
    }
    
    return breakdown;
  }

  private getModelBreakdown(records: TokenUsageRecord[]): Record<string, ModelStats> {
    const breakdown: Record<string, ModelStats> = {};
    const modelGroups = this.groupBy(records, 'model');
    
    for (const [model, modelRecords] of Object.entries(modelGroups)) {
      breakdown[model] = {
        requests: modelRecords.length,
        tokens: modelRecords.reduce((sum, r) => sum + r.tokensUsed.total, 0),
        cost: modelRecords.reduce((sum, r) => sum + r.cost, 0),
        errors: modelRecords.filter(r => !r.success).length
      };
    }
    
    return breakdown;
  }

  private getHourlyDistribution(records: TokenUsageRecord[]): Record<number, number> {
    const distribution: Record<number, number> = {};
    
    for (let hour = 0; hour < 24; hour++) {
      distribution[hour] = 0;
    }
    
    for (const record of records) {
      const hour = record.timestamp.getHours();
      distribution[hour]++;
    }
    
    return distribution;
  }

  private getCostTrends(period: TimePeriod): CostTrend[] {
    const records = this.getRecordsForPeriod(period);
    const dailyGroups = this.groupBy(records, r => this.getDateKey(r.timestamp));
    
    return Object.entries(dailyGroups).map(([date, dayRecords]) => ({
      date,
      cost: dayRecords.reduce((sum, r) => sum + r.cost, 0),
      tokens: dayRecords.reduce((sum, r) => sum + r.tokensUsed.total, 0),
      requests: dayRecords.length
    })).sort((a, b) => a.date.localeCompare(b.date));
  }

  private groupBy<T>(array: T[], keyFn: string | ((item: T) => string)): Record<string, T[]> {
    return array.reduce((groups, item) => {
      const key = typeof keyFn === 'string' ? (item as any)[keyFn] : keyFn(item);
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    }, {} as Record<string, T[]>);
  }

  private updateCostRates(model: string, tokensUsed: TokenUsage, cost: number): void {
    if (!this.costRates.has(model) && tokensUsed.total > 0) {
      // Estimate input/output cost split
      const inputRatio = tokensUsed.input / tokensUsed.total;
      const outputRatio = tokensUsed.output / tokensUsed.total;
      
      this.costRates.set(model, {
        model,
        inputCostPerToken: (cost * inputRatio) / tokensUsed.input || 0,
        outputCostPerToken: (cost * outputRatio) / tokensUsed.output || 0,
        lastUpdated: new Date()
      });
    }
  }

  private checkLimitsAndAlert(provider: AIProvider, dateKey: string): void {
    const dailyUsage = this.getDailyUsage(provider).get(provider);
    if (!dailyUsage || !dailyUsage.isLimitExceeded) {
      return;
    }
    
    // Check if we already have an alert for today
    const existingAlert = this.alerts.find(a => 
      a.provider === provider && 
      this.getDateKey(a.timestamp) === dateKey &&
      a.type === 'limit_exceeded'
    );
    
    if (!existingAlert) {
      this.alerts.push({
        id: `alert_${Date.now()}`,
        type: 'limit_exceeded',
        provider,
        message: `Daily limit exceeded for ${provider}`,
        timestamp: new Date(),
        severity: 'high',
        data: dailyUsage
      });
    }
  }

  private cleanOldRecords(): void {
    const cutoffDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000); // 90 days
    
    for (const [key, record] of this.usage.entries()) {
      if (record.timestamp < cutoffDate) {
        this.usage.delete(key);
      }
    }
  }

  private initializeDefaultLimits(): void {
    // Set conservative default limits
    this.dailyLimits.set(AIProvider.OPENAI, {
      maxTokens: 100000,
      maxCost: 10.00,
      maxRequests: 1000
    });
    
    this.dailyLimits.set(AIProvider.GROQ, {
      maxTokens: 50000,
      maxCost: 5.00,
      maxRequests: 500
    });
    
    this.dailyLimits.set(AIProvider.OPENROUTER, {
      maxTokens: 75000,
      maxCost: 7.50,
      maxRequests: 750
    });
  }

  private initializeDefaultCostRates(): void {
    // Initialize with known cost rates
    const defaultRates: ModelCostRate[] = [
      {
        model: 'gpt-4o-mini',
        inputCostPerToken: 0.00000015,
        outputCostPerToken: 0.0000006,
        lastUpdated: new Date()
      },
      {
        model: 'gpt-4o',
        inputCostPerToken: 0.000005,
        outputCostPerToken: 0.000015,
        lastUpdated: new Date()
      },
      {
        model: 'llama-3.1-70b-versatile',
        inputCostPerToken: 0.00000059,
        outputCostPerToken: 0.00000079,
        lastUpdated: new Date()
      }
    ];
    
    for (const rate of defaultRates) {
      this.costRates.set(rate.model, rate);
    }
  }

  private loadPersistedData(): void {
    if (typeof localStorage === 'undefined') return;
    
    try {
      const data = localStorage.getItem('ai_token_tracker');
      if (data) {
        const parsed = JSON.parse(data);
        
        // Load usage records
        if (parsed.usage) {
          for (const [key, record] of Object.entries(parsed.usage as any)) {
            this.usage.set(key, {
              ...record,
              timestamp: new Date(record.timestamp)
            });
          }
        }
        
        // Load alerts
        if (parsed.alerts) {
          this.alerts = parsed.alerts.map((alert: any) => ({
            ...alert,
            timestamp: new Date(alert.timestamp)
          }));
        }
      }
    } catch (error) {
      console.error('Failed to load persisted token tracker data:', error);
    }
  }

  private persistData(): void {
    if (!this.persistenceEnabled || typeof localStorage === 'undefined') return;
    
    try {
      const data = {
        usage: Object.fromEntries(this.usage.entries()),
        alerts: this.alerts,
        lastSaved: new Date().toISOString()
      };
      
      localStorage.setItem('ai_token_tracker', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to persist token tracker data:', error);
    }
  }

  private setupPeriodicSave(): void {
    // Save data every 5 minutes
    setInterval(() => {
      this.persistData();
    }, 5 * 60 * 1000);
  }

  private exportToCSV(records: TokenUsageRecord[]): string {
    const headers = [
      'Timestamp',
      'Provider',
      'Model',
      'Input Tokens',
      'Output Tokens',
      'Total Tokens',
      'Cost',
      'Request Type',
      'Success',
      'Error'
    ];
    
    const rows = records.map(record => [
      record.timestamp.toISOString(),
      record.provider,
      record.model,
      record.tokensUsed.input.toString(),
      record.tokensUsed.output.toString(),
      record.tokensUsed.total.toString(),
      record.cost.toString(),
      record.requestType,
      record.success.toString(),
      record.error || ''
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }
}

// Type definitions
interface TokenTrackerOptions {
  enablePersistence?: boolean;
}

interface TokenUsageRecord {
  sessionId: string;
  timestamp: Date;
  provider: AIProvider;
  model: string;
  tokensUsed: TokenUsage;
  cost: number;
  requestType: string;
  success: boolean;
  error?: string;
}

interface DailyLimit {
  maxTokens: number;
  maxCost: number;
  maxRequests: number;
}

interface DailyUsage {
  provider: AIProvider;
  date: string;
  tokensUsed: number;
  costSpent: number;
  requestCount: number;
  limits: DailyLimit;
  percentageUsed: {
    tokens: number;
    cost: number;
    requests: number;
  };
  isLimitExceeded: boolean;
}

interface ModelCostRate {
  model: string;
  inputCostPerToken: number;
  outputCostPerToken: number;
  lastUpdated: Date;
}

interface TokenAlert {
  id: string;
  type: 'limit_exceeded' | 'high_usage' | 'cost_spike';
  provider: AIProvider;
  message: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high';
  data?: any;
}

type TimePeriod = 'today' | 'week' | 'month' | 'all';

interface UsageStats {
  period: TimePeriod;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  totalTokens: number;
  totalCost: number;
  providerBreakdown: Record<AIProvider, ProviderStats>;
  modelBreakdown: Record<string, ModelStats>;
  hourlyDistribution: Record<number, number>;
  averageTokensPerRequest: number;
  averageCostPerRequest: number;
  averageResponseTime: number;
}

interface ProviderStats {
  requests: number;
  tokens: number;
  cost: number;
  errors: number;
}

interface ModelStats {
  requests: number;
  tokens: number;
  cost: number;
  errors: number;
}

interface CostBreakdown {
  period: TimePeriod;
  totalCost: number;
  providers: Record<AIProvider, {
    cost: number;
    tokens: number;
    requests: number;
    averageCostPerToken: number;
  }>;
  models: Record<string, {
    cost: number;
    tokens: number;
    requests: number;
    averageCostPerToken: number;
  }>;
  trends: CostTrend[];
}

interface CostTrend {
  date: string;
  cost: number;
  tokens: number;
  requests: number;
}

// Export default instance
export const tokenTracker = new TokenTracker();
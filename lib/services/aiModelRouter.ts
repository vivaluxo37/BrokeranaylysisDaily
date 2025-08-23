import {
  AIProvider,
  AIRequest,
  AIResponse,
  AIModel,
  ModelRouterConfig,
  AIServiceError,
  RateLimitStatus,
  AIServiceMetrics
} from '../types';
import { BaseAIProvider, AIServiceFactory } from './aiServiceAbstraction';

/**
 * AI Model Router with failover logic and load balancing
 * Manages routing requests across multiple AI providers and models
 */
export class AIModelRouter {
  private providers: Map<AIProvider, BaseAIProvider>;
  private config: ModelRouterConfig;
  private metrics: AIServiceMetrics;
  private healthStatus: Map<string, boolean>;
  private loadBalancingState: {
    roundRobinIndex: number;
    modelUsageCount: Map<string, number>;
  };

  constructor(config: ModelRouterConfig, providers: Map<AIProvider, BaseAIProvider>) {
    this.config = config;
    this.providers = providers;
    this.healthStatus = new Map();
    this.loadBalancingState = {
      roundRobinIndex: 0,
      modelUsageCount: new Map()
    };
    
    this.initializeMetrics();
    this.initializeHealthChecks();
  }

  /**
   * Route AI request to the best available model
   */
  async routeRequest(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();
    let lastError: AIServiceError | null = null;

    // Get available models based on request preferences
    const availableModels = this.getAvailableModels(request);
    
    if (availableModels.length === 0) {
      throw new Error('No available models for this request');
    }

    // Try models in priority order with failover
    for (const model of availableModels) {
      try {
        const provider = this.providers.get(model.provider);
        if (!provider) {
          continue;
        }

        // Check rate limits
        const rateLimitStatus = provider.getRateLimitStatus();
        if (rateLimitStatus.isLimited) {
          console.warn(`Provider ${model.provider} is rate limited, trying next model`);
          continue;
        }

        // Check model health
        if (!this.isModelHealthy(model.id)) {
          console.warn(`Model ${model.id} is unhealthy, trying next model`);
          continue;
        }

        // Execute request
        const requestWithModel = { ...request, model: model.id };
        const response = await provider.generateResponse(requestWithModel);
        
        // Update metrics and load balancing state
        this.updateMetrics(response, true);
        this.updateLoadBalancingState(model.id);
        
        return response;

      } catch (error) {
        lastError = error as AIServiceError;
        console.error(`Model ${model.id} failed:`, error);
        
        // Update metrics for failed request
        this.updateMetrics(null, false, model.provider, model.id);
        
        // Mark model as unhealthy if error is not retryable
        if (!lastError.retryable) {
          this.markModelUnhealthy(model.id);
        }
        
        // Continue to next model in failover chain
        continue;
      }
    }

    // All models failed
    throw lastError || new Error('All available models failed');
  }

  /**
   * Route embedding request to appropriate provider
   */
  async routeEmbeddingRequest(text: string): Promise<number[]> {
    // Find providers that support embeddings
    const embeddingProviders = Array.from(this.providers.entries())
      .filter(([provider, _]) => {
        const models = this.config.models.filter(m => 
          m.provider === provider && m.type === 'embedding'
        );
        return models.length > 0;
      });

    if (embeddingProviders.length === 0) {
      throw new Error('No embedding providers available');
    }

    // Try providers in order
    for (const [providerType, provider] of embeddingProviders) {
      try {
        const rateLimitStatus = provider.getRateLimitStatus();
        if (rateLimitStatus.isLimited) {
          continue;
        }

        return await provider.generateEmbedding(text);
      } catch (error) {
        console.error(`Embedding failed for provider ${providerType}:`, error);
        continue;
      }
    }

    throw new Error('All embedding providers failed');
  }

  /**
   * Get available models based on request preferences and health status
   */
  private getAvailableModels(request: AIRequest): AIModel[] {
    let models = this.config.models.filter(model => {
      // Filter by model type (chat, completion, etc.)
      if (request.template && !this.isModelSuitableForTemplate(model, request.template)) {
        return false;
      }

      // Filter by provider preference
      if (request.provider && model.provider !== request.provider) {
        return false;
      }

      // Filter by specific model preference
      if (request.model && model.id !== request.model) {
        return false;
      }

      // Filter by availability
      if (!model.isAvailable) {
        return false;
      }

      // Check if provider is available
      if (!this.providers.has(model.provider)) {
        return false;
      }

      return true;
    });

    // Apply load balancing strategy
    if (this.config.loadBalancing.enabled && models.length > 1) {
      models = this.applyLoadBalancing(models);
    }

    // Sort by priority (lower number = higher priority)
    models.sort((a, b) => a.priority - b.priority);

    return models;
  }

  /**
   * Apply load balancing strategy to model selection
   */
  private applyLoadBalancing(models: AIModel[]): AIModel[] {
    switch (this.config.loadBalancing.strategy) {
      case 'round_robin':
        return this.applyRoundRobin(models);
      case 'least_loaded':
        return this.applyLeastLoaded(models);
      case 'random':
        return this.applyRandom(models);
      default:
        return models;
    }
  }

  /**
   * Round robin load balancing
   */
  private applyRoundRobin(models: AIModel[]): AIModel[] {
    if (models.length === 0) return models;
    
    const index = this.loadBalancingState.roundRobinIndex % models.length;
    this.loadBalancingState.roundRobinIndex++;
    
    // Move selected model to front
    const selectedModel = models[index];
    return [selectedModel, ...models.filter((_, i) => i !== index)];
  }

  /**
   * Least loaded load balancing
   */
  private applyLeastLoaded(models: AIModel[]): AIModel[] {
    return models.sort((a, b) => {
      const aUsage = this.loadBalancingState.modelUsageCount.get(a.id) || 0;
      const bUsage = this.loadBalancingState.modelUsageCount.get(b.id) || 0;
      return aUsage - bUsage;
    });
  }

  /**
   * Random load balancing
   */
  private applyRandom(models: AIModel[]): AIModel[] {
    const shuffled = [...models];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Check if model is suitable for the given template
   */
  private isModelSuitableForTemplate(model: AIModel, template: string): boolean {
    const templateRequirements: Record<string, string[]> = {
      'chat': ['chat', 'completion'],
      'recommendation': ['chat', 'completion'],
      'summarization': ['chat', 'completion'],
      'rag': ['chat', 'completion'],
      'broker_analysis': ['chat', 'completion']
    };

    const requiredCapabilities = templateRequirements[template] || ['chat'];
    return requiredCapabilities.some(cap => model.capabilities.includes(cap));
  }

  /**
   * Check if model is healthy
   */
  private isModelHealthy(modelId: string): boolean {
    return this.healthStatus.get(modelId) !== false;
  }

  /**
   * Mark model as unhealthy
   */
  private markModelUnhealthy(modelId: string): void {
    this.healthStatus.set(modelId, false);
    
    // Schedule health check recovery
    setTimeout(() => {
      this.healthStatus.delete(modelId);
    }, 60000); // Recover after 1 minute
  }

  /**
   * Update load balancing state
   */
  private updateLoadBalancingState(modelId: string): void {
    const currentCount = this.loadBalancingState.modelUsageCount.get(modelId) || 0;
    this.loadBalancingState.modelUsageCount.set(modelId, currentCount + 1);
  }

  /**
   * Initialize metrics tracking
   */
  private initializeMetrics(): void {
    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      totalTokensUsed: 0,
      totalCost: 0,
      providerStats: {} as Record<AIProvider, any>,
      modelStats: {}
    };

    // Initialize provider stats
    for (const provider of Object.values(AIProvider)) {
      this.metrics.providerStats[provider] = {
        requests: 0,
        errors: 0,
        avgResponseTime: 0,
        tokensUsed: 0,
        cost: 0
      };
    }
  }

  /**
   * Update metrics after request
   */
  private updateMetrics(
    response: AIResponse | null, 
    success: boolean, 
    provider?: AIProvider, 
    modelId?: string
  ): void {
    this.metrics.totalRequests++;
    
    if (success && response) {
      this.metrics.successfulRequests++;
      this.metrics.totalTokensUsed += response.tokensUsed.total;
      this.metrics.totalCost += response.cost;
      
      // Update average response time
      const totalResponseTime = this.metrics.averageResponseTime * (this.metrics.totalRequests - 1);
      this.metrics.averageResponseTime = (totalResponseTime + response.responseTime) / this.metrics.totalRequests;
      
      // Update provider stats
      const providerStats = this.metrics.providerStats[response.provider];
      providerStats.requests++;
      providerStats.tokensUsed += response.tokensUsed.total;
      providerStats.cost += response.cost;
      providerStats.avgResponseTime = (
        (providerStats.avgResponseTime * (providerStats.requests - 1)) + response.responseTime
      ) / providerStats.requests;
      
      // Update model stats
      if (!this.metrics.modelStats[response.model]) {
        this.metrics.modelStats[response.model] = {
          requests: 0,
          errors: 0,
          avgResponseTime: 0,
          tokensUsed: 0,
          cost: 0
        };
      }
      
      const modelStats = this.metrics.modelStats[response.model];
      modelStats.requests++;
      modelStats.tokensUsed += response.tokensUsed.total;
      modelStats.cost += response.cost;
      modelStats.avgResponseTime = (
        (modelStats.avgResponseTime * (modelStats.requests - 1)) + response.responseTime
      ) / modelStats.requests;
      
    } else {
      this.metrics.failedRequests++;
      
      if (provider) {
        this.metrics.providerStats[provider].errors++;
      }
      
      if (modelId && this.metrics.modelStats[modelId]) {
        this.metrics.modelStats[modelId].errors++;
      }
    }
  }

  /**
   * Initialize health checks for models
   */
  private initializeHealthChecks(): void {
    if (!this.config.healthCheck.enabled) {
      return;
    }

    setInterval(async () => {
      await this.performHealthChecks();
    }, this.config.healthCheck.intervalMs);
  }

  /**
   * Perform health checks on all providers
   */
  private async performHealthChecks(): Promise<void> {
    const healthCheckPromises = Array.from(this.providers.entries()).map(
      async ([providerType, provider]) => {
        try {
          const isHealthy = await Promise.race([
            provider.testConnection(),
            new Promise<boolean>((_, reject) => 
              setTimeout(() => reject(new Error('Health check timeout')), 
                this.config.healthCheck.timeoutMs)
            )
          ]);
          
          // Update health status for all models of this provider
          const providerModels = this.config.models.filter(m => m.provider === providerType);
          for (const model of providerModels) {
            if (isHealthy) {
              this.healthStatus.delete(model.id); // Remove unhealthy status
            } else {
              this.healthStatus.set(model.id, false);
            }
          }
          
        } catch (error) {
          console.error(`Health check failed for provider ${providerType}:`, error);
          
          // Mark all models of this provider as unhealthy
          const providerModels = this.config.models.filter(m => m.provider === providerType);
          for (const model of providerModels) {
            this.healthStatus.set(model.id, false);
          }
        }
      }
    );

    await Promise.allSettled(healthCheckPromises);
  }

  /**
   * Get current metrics
   */
  getMetrics(): AIServiceMetrics {
    return { ...this.metrics };
  }

  /**
   * Get rate limit status for all providers
   */
  getRateLimitStatus(): Map<AIProvider, RateLimitStatus> {
    const status = new Map<AIProvider, RateLimitStatus>();
    
    for (const [providerType, provider] of this.providers) {
      status.set(providerType, provider.getRateLimitStatus());
    }
    
    return status;
  }

  /**
   * Get health status for all models
   */
  getHealthStatus(): Map<string, boolean> {
    const status = new Map<string, boolean>();
    
    for (const model of this.config.models) {
      status.set(model.id, this.isModelHealthy(model.id));
    }
    
    return status;
  }

  /**
   * Reset metrics
   */
  resetMetrics(): void {
    this.initializeMetrics();
  }

  /**
   * Add new model to router
   */
  addModel(model: AIModel): void {
    this.config.models.push(model);
  }

  /**
   * Remove model from router
   */
  removeModel(modelId: string): void {
    this.config.models = this.config.models.filter(m => m.id !== modelId);
    this.healthStatus.delete(modelId);
    delete this.metrics.modelStats[modelId];
  }

  /**
   * Update model configuration
   */
  updateModel(modelId: string, updates: Partial<AIModel>): void {
    const modelIndex = this.config.models.findIndex(m => m.id === modelId);
    if (modelIndex !== -1) {
      this.config.models[modelIndex] = { ...this.config.models[modelIndex], ...updates };
    }
  }
}

/**
 * Default model configurations for 15+ AI models
 */
export const DEFAULT_AI_MODELS: AIModel[] = [
  // Groq Models
  {
    id: 'llama-3.1-70b-versatile',
    name: 'Llama 3.1 70B Versatile',
    provider: AIProvider.GROQ,
    type: 'chat' as any,
    maxTokens: 8192,
    costPerToken: { input: 0.00000059, output: 0.00000079 },
    contextWindow: 131072,
    isAvailable: true,
    priority: 1,
    capabilities: ['chat', 'completion'],
    rateLimit: { requestsPerMinute: 30, tokensPerMinute: 6000 }
  },
  {
    id: 'llama-3.1-8b-instant',
    name: 'Llama 3.1 8B Instant',
    provider: AIProvider.GROQ,
    type: 'chat' as any,
    maxTokens: 8192,
    costPerToken: { input: 0.00000005, output: 0.00000008 },
    contextWindow: 131072,
    isAvailable: true,
    priority: 2,
    capabilities: ['chat', 'completion'],
    rateLimit: { requestsPerMinute: 30, tokensPerMinute: 6000 }
  },
  {
    id: 'mixtral-8x7b-32768',
    name: 'Mixtral 8x7B',
    provider: AIProvider.GROQ,
    type: 'chat' as any,
    maxTokens: 32768,
    costPerToken: { input: 0.00000024, output: 0.00000024 },
    contextWindow: 32768,
    isAvailable: true,
    priority: 3,
    capabilities: ['chat', 'completion'],
    rateLimit: { requestsPerMinute: 30, tokensPerMinute: 6000 }
  },
  {
    id: 'gemma2-9b-it',
    name: 'Gemma 2 9B IT',
    provider: AIProvider.GROQ,
    type: 'chat' as any,
    maxTokens: 8192,
    costPerToken: { input: 0.0000002, output: 0.0000002 },
    contextWindow: 8192,
    isAvailable: true,
    priority: 4,
    capabilities: ['chat', 'completion'],
    rateLimit: { requestsPerMinute: 30, tokensPerMinute: 6000 }
  },
  
  // OpenRouter Models
  {
    id: 'anthropic/claude-3-haiku',
    name: 'Claude 3 Haiku',
    provider: AIProvider.OPENROUTER,
    type: 'chat' as any,
    maxTokens: 4096,
    costPerToken: { input: 0.00000025, output: 0.00000125 },
    contextWindow: 200000,
    isAvailable: true,
    priority: 1,
    capabilities: ['chat', 'completion'],
    rateLimit: { requestsPerMinute: 20, tokensPerMinute: 4000 }
  },
  {
    id: 'anthropic/claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    provider: AIProvider.OPENROUTER,
    type: 'chat' as any,
    maxTokens: 4096,
    costPerToken: { input: 0.000003, output: 0.000015 },
    contextWindow: 200000,
    isAvailable: true,
    priority: 2,
    capabilities: ['chat', 'completion'],
    rateLimit: { requestsPerMinute: 20, tokensPerMinute: 4000 }
  },
  {
    id: 'openai/gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: AIProvider.OPENROUTER,
    type: 'chat' as any,
    maxTokens: 16384,
    costPerToken: { input: 0.00000015, output: 0.0000006 },
    contextWindow: 128000,
    isAvailable: true,
    priority: 3,
    capabilities: ['chat', 'completion'],
    rateLimit: { requestsPerMinute: 20, tokensPerMinute: 4000 }
  },
  {
    id: 'openai/gpt-4o',
    name: 'GPT-4o',
    provider: AIProvider.OPENROUTER,
    type: 'chat' as any,
    maxTokens: 4096,
    costPerToken: { input: 0.000005, output: 0.000015 },
    contextWindow: 128000,
    isAvailable: true,
    priority: 4,
    capabilities: ['chat', 'completion'],
    rateLimit: { requestsPerMinute: 20, tokensPerMinute: 4000 }
  },
  {
    id: 'google/gemini-pro-1.5',
    name: 'Gemini Pro 1.5',
    provider: AIProvider.OPENROUTER,
    type: 'chat' as any,
    maxTokens: 8192,
    costPerToken: { input: 0.00000125, output: 0.00000375 },
    contextWindow: 2000000,
    isAvailable: true,
    priority: 5,
    capabilities: ['chat', 'completion'],
    rateLimit: { requestsPerMinute: 20, tokensPerMinute: 4000 }
  },
  {
    id: 'meta-llama/llama-3.1-405b-instruct',
    name: 'Llama 3.1 405B Instruct',
    provider: AIProvider.OPENROUTER,
    type: 'chat' as any,
    maxTokens: 4096,
    costPerToken: { input: 0.000005, output: 0.000015 },
    contextWindow: 131072,
    isAvailable: true,
    priority: 6,
    capabilities: ['chat', 'completion'],
    rateLimit: { requestsPerMinute: 10, tokensPerMinute: 2000 }
  },
  {
    id: 'mistralai/mistral-large',
    name: 'Mistral Large',
    provider: AIProvider.OPENROUTER,
    type: 'chat' as any,
    maxTokens: 8192,
    costPerToken: { input: 0.000004, output: 0.000012 },
    contextWindow: 128000,
    isAvailable: true,
    priority: 7,
    capabilities: ['chat', 'completion'],
    rateLimit: { requestsPerMinute: 20, tokensPerMinute: 4000 }
  },
  
  // OpenAI Models
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: AIProvider.OPENAI,
    type: 'chat' as any,
    maxTokens: 16384,
    costPerToken: { input: 0.00000015, output: 0.0000006 },
    contextWindow: 128000,
    isAvailable: true,
    priority: 1,
    capabilities: ['chat', 'completion'],
    rateLimit: { requestsPerMinute: 500, tokensPerMinute: 200000 }
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: AIProvider.OPENAI,
    type: 'chat' as any,
    maxTokens: 4096,
    costPerToken: { input: 0.000005, output: 0.000015 },
    contextWindow: 128000,
    isAvailable: true,
    priority: 2,
    capabilities: ['chat', 'completion'],
    rateLimit: { requestsPerMinute: 500, tokensPerMinute: 30000 }
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: AIProvider.OPENAI,
    type: 'chat' as any,
    maxTokens: 4096,
    costPerToken: { input: 0.0000005, output: 0.0000015 },
    contextWindow: 16385,
    isAvailable: true,
    priority: 3,
    capabilities: ['chat', 'completion'],
    rateLimit: { requestsPerMinute: 3500, tokensPerMinute: 90000 }
  },
  {
    id: 'text-embedding-3-small',
    name: 'Text Embedding 3 Small',
    provider: AIProvider.OPENAI,
    type: 'embedding' as any,
    maxTokens: 8191,
    costPerToken: { input: 0.00000002, output: 0 },
    contextWindow: 8191,
    isAvailable: true,
    priority: 1,
    capabilities: ['embedding'],
    rateLimit: { requestsPerMinute: 3000, tokensPerMinute: 1000000 }
  },
  {
    id: 'text-embedding-3-large',
    name: 'Text Embedding 3 Large',
    provider: AIProvider.OPENAI,
    type: 'embedding' as any,
    maxTokens: 8191,
    costPerToken: { input: 0.00000013, output: 0 },
    contextWindow: 8191,
    isAvailable: true,
    priority: 2,
    capabilities: ['embedding'],
    rateLimit: { requestsPerMinute: 3000, tokensPerMinute: 1000000 }
  }
];
import {
  AIProvider,
  AIModel,
  AIModelType,
  PromptTemplate,
  AIProviderConfig,
  ModelRouterConfig,
  AIServiceConfig
} from '../types';

/**
 * AI Service Configuration Management
 * Centralized configuration for all AI providers, models, and settings
 */
export class AIConfigManager {
  private config: AIServiceConfig;
  private environmentOverrides: Partial<AIServiceConfig>;
  private runtimeConfig: Map<string, any>;

  constructor(initialConfig?: Partial<AIServiceConfig>) {
    this.config = this.getDefaultConfig();
    this.environmentOverrides = {};
    this.runtimeConfig = new Map();
    
    if (initialConfig) {
      this.updateConfig(initialConfig);
    }
    
    this.loadEnvironmentOverrides();
  }

  /**
   * Get complete AI service configuration
   */
  getConfig(): AIServiceConfig {
    return {
      ...this.config,
      ...this.environmentOverrides
    };
  }

  /**
   * Get provider configuration
   */
  getProviderConfig(provider: AIProvider): AIProviderConfig {
    const config = this.getConfig();
    return config.providers[provider];
  }

  /**
   * Get model configuration
   */
  getModelConfig(modelId: string): AIModel | undefined {
    const config = this.getConfig();
    return config.models.find(model => model.id === modelId);
  }

  /**
   * Get models by provider
   */
  getModelsByProvider(provider: AIProvider): AIModel[] {
    const config = this.getConfig();
    return config.models.filter(model => model.provider === provider);
  }

  /**
   * Get models by type
   */
  getModelsByType(type: AIModelType): AIModel[] {
    const config = this.getConfig();
    return config.models.filter(model => model.type === type);
  }

  /**
   * Get router configuration
   */
  getRouterConfig(): ModelRouterConfig {
    return this.getConfig().router;
  }

  /**
   * Update configuration
   */
  updateConfig(updates: Partial<AIServiceConfig>): void {
    this.config = {
      ...this.config,
      ...updates,
      providers: {
        ...this.config.providers,
        ...(updates.providers || {})
      },
      models: updates.models || this.config.models,
      router: {
        ...this.config.router,
        ...(updates.router || {})
      }
    };
  }

  /**
   * Update provider configuration
   */
  updateProviderConfig(provider: AIProvider, config: Partial<AIProviderConfig>): void {
    this.config.providers[provider] = {
      ...this.config.providers[provider],
      ...config
    };
  }

  /**
   * Add or update model configuration
   */
  updateModelConfig(model: AIModel): void {
    const existingIndex = this.config.models.findIndex(m => m.id === model.id);
    
    if (existingIndex >= 0) {
      this.config.models[existingIndex] = model;
    } else {
      this.config.models.push(model);
    }
  }

  /**
   * Remove model configuration
   */
  removeModelConfig(modelId: string): void {
    this.config.models = this.config.models.filter(model => model.id !== modelId);
  }

  /**
   * Get API key for provider
   */
  getApiKey(provider: AIProvider): string | undefined {
    const providerConfig = this.getProviderConfig(provider);
    return providerConfig?.apiKey;
  }

  /**
   * Set API key for provider
   */
  setApiKey(provider: AIProvider, apiKey: string): void {
    this.updateProviderConfig(provider, { apiKey });
  }

  /**
   * Get base URL for provider
   */
  getBaseUrl(provider: AIProvider): string {
    const providerConfig = this.getProviderConfig(provider);
    return providerConfig?.baseUrl || this.getDefaultBaseUrl(provider);
  }

  /**
   * Validate configuration
   */
  validateConfig(): ConfigValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const config = this.getConfig();

    // Validate providers
    for (const [provider, providerConfig] of Object.entries(config.providers)) {
      if (!providerConfig.apiKey) {
        errors.push(`Missing API key for provider: ${provider}`);
      }
      
      if (!providerConfig.baseUrl) {
        warnings.push(`No base URL configured for provider: ${provider}, using default`);
      }
    }

    // Validate models
    if (config.models.length === 0) {
      errors.push('No models configured');
    }

    for (const model of config.models) {
      if (!model.id || !model.name || !model.provider) {
        errors.push(`Invalid model configuration: ${JSON.stringify(model)}`);
      }
      
      if (!config.providers[model.provider]) {
        errors.push(`Model ${model.id} references unknown provider: ${model.provider}`);
      }
    }

    // Validate router configuration
    if (config.router.defaultModel && !this.getModelConfig(config.router.defaultModel)) {
      errors.push(`Default model not found: ${config.router.defaultModel}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Get runtime configuration value
   */
  getRuntimeConfig(key: string): any {
    return this.runtimeConfig.get(key);
  }

  /**
   * Set runtime configuration value
   */
  setRuntimeConfig(key: string, value: any): void {
    this.runtimeConfig.set(key, value);
  }

  /**
   * Export configuration to JSON
   */
  exportConfig(): string {
    const exportConfig = {
      ...this.config,
      // Remove sensitive data
      providers: Object.fromEntries(
        Object.entries(this.config.providers).map(([key, provider]) => [
          key,
          {
            ...provider,
            apiKey: provider.apiKey ? '[REDACTED]' : undefined
          }
        ])
      )
    };
    
    return JSON.stringify(exportConfig, null, 2);
  }

  /**
   * Import configuration from JSON
   */
  importConfig(configJson: string): void {
    try {
      const importedConfig = JSON.parse(configJson) as Partial<AIServiceConfig>;
      this.updateConfig(importedConfig);
    } catch (error) {
      throw new Error(`Failed to import configuration: ${error}`);
    }
  }

  /**
   * Reset to default configuration
   */
  resetToDefaults(): void {
    this.config = this.getDefaultConfig();
    this.environmentOverrides = {};
    this.runtimeConfig.clear();
    this.loadEnvironmentOverrides();
  }

  /**
   * Get configuration summary
   */
  getConfigSummary(): ConfigSummary {
    const config = this.getConfig();
    
    return {
      totalProviders: Object.keys(config.providers).length,
      totalModels: config.models.length,
      modelsByProvider: Object.fromEntries(
        Object.values(AIProvider).map(provider => [
          provider,
          this.getModelsByProvider(provider).length
        ])
      ),
      modelsByType: Object.fromEntries(
        Object.values(AIModelType).map(type => [
          type,
          this.getModelsByType(type).length
        ])
      ),
      defaultModel: config.router.defaultModel,
      enabledFeatures: {
        rateLimiting: config.router.enableRateLimiting,
        fallbacks: config.router.enableFallbacks,
        loadBalancing: config.router.enableLoadBalancing,
        healthChecks: config.router.enableHealthChecks
      }
    };
  }

  // Private methods
  private getDefaultConfig(): AIServiceConfig {
    return {
      providers: {
        [AIProvider.GROQ]: {
          apiKey: process.env.GROQ_API_KEY || '',
          baseUrl: 'https://api.groq.com/openai/v1',
          timeout: 30000,
          retryAttempts: 3,
          rateLimits: {
            requestsPerMinute: 30,
            tokensPerMinute: 30000
          }
        },
        [AIProvider.OPENROUTER]: {
          apiKey: process.env.OPENROUTER_API_KEY || '',
          baseUrl: 'https://openrouter.ai/api/v1',
          timeout: 45000,
          retryAttempts: 3,
          rateLimits: {
            requestsPerMinute: 20,
            tokensPerMinute: 20000
          }
        },
        [AIProvider.OPENAI]: {
          apiKey: process.env.OPENAI_API_KEY || '',
          baseUrl: 'https://api.openai.com/v1',
          timeout: 60000,
          retryAttempts: 3,
          rateLimits: {
            requestsPerMinute: 500,
            tokensPerMinute: 150000
          }
        }
      },
      models: this.getDefaultModels(),
      router: {
        defaultModel: 'groq-llama-3.1-70b',
        fallbackModels: ['openrouter-llama-3.1-70b', 'openai-gpt-4'],
        enableRateLimiting: true,
        enableFallbacks: true,
        enableLoadBalancing: true,
        enableHealthChecks: true,
        healthCheckInterval: 300000, // 5 minutes
        maxConcurrentRequests: 10,
        requestTimeout: 30000
      }
    };
  }

  private getDefaultModels(): AIModel[] {
    return [
      // Groq Models
      {
        id: 'groq-llama-3.1-70b',
        name: 'Llama 3.1 70B',
        provider: AIProvider.GROQ,
        type: AIModelType.CHAT,
        contextLength: 131072,
        maxTokens: 8192,
        costPer1kTokens: { input: 0.00059, output: 0.00079 },
        capabilities: ['chat', 'reasoning', 'code'],
        isAvailable: true,
        priority: 1
      },
      {
        id: 'groq-llama-3.1-8b',
        name: 'Llama 3.1 8B',
        provider: AIProvider.GROQ,
        type: AIModelType.CHAT,
        contextLength: 131072,
        maxTokens: 8192,
        costPer1kTokens: { input: 0.00005, output: 0.00008 },
        capabilities: ['chat', 'reasoning'],
        isAvailable: true,
        priority: 2
      },
      {
        id: 'groq-mixtral-8x7b',
        name: 'Mixtral 8x7B',
        provider: AIProvider.GROQ,
        type: AIModelType.CHAT,
        contextLength: 32768,
        maxTokens: 8192,
        costPer1kTokens: { input: 0.00024, output: 0.00024 },
        capabilities: ['chat', 'reasoning', 'multilingual'],
        isAvailable: true,
        priority: 3
      },
      {
        id: 'groq-gemma-7b',
        name: 'Gemma 7B',
        provider: AIProvider.GROQ,
        type: AIModelType.CHAT,
        contextLength: 8192,
        maxTokens: 8192,
        costPer1kTokens: { input: 0.00007, output: 0.00007 },
        capabilities: ['chat', 'reasoning'],
        isAvailable: true,
        priority: 4
      },
      
      // OpenRouter Models
      {
        id: 'openrouter-llama-3.1-70b',
        name: 'Llama 3.1 70B (OpenRouter)',
        provider: AIProvider.OPENROUTER,
        type: AIModelType.CHAT,
        contextLength: 131072,
        maxTokens: 8192,
        costPer1kTokens: { input: 0.00088, output: 0.00088 },
        capabilities: ['chat', 'reasoning', 'code'],
        isAvailable: true,
        priority: 1
      },
      {
        id: 'openrouter-claude-3.5-sonnet',
        name: 'Claude 3.5 Sonnet',
        provider: AIProvider.OPENROUTER,
        type: AIModelType.CHAT,
        contextLength: 200000,
        maxTokens: 8192,
        costPer1kTokens: { input: 0.003, output: 0.015 },
        capabilities: ['chat', 'reasoning', 'code', 'analysis'],
        isAvailable: true,
        priority: 2
      },
      {
        id: 'openrouter-gpt-4o',
        name: 'GPT-4o (OpenRouter)',
        provider: AIProvider.OPENROUTER,
        type: AIModelType.CHAT,
        contextLength: 128000,
        maxTokens: 4096,
        costPer1kTokens: { input: 0.005, output: 0.015 },
        capabilities: ['chat', 'reasoning', 'code', 'vision'],
        isAvailable: true,
        priority: 3
      },
      {
        id: 'openrouter-mistral-large',
        name: 'Mistral Large',
        provider: AIProvider.OPENROUTER,
        type: AIModelType.CHAT,
        contextLength: 128000,
        maxTokens: 8192,
        costPer1kTokens: { input: 0.008, output: 0.024 },
        capabilities: ['chat', 'reasoning', 'code', 'multilingual'],
        isAvailable: true,
        priority: 4
      },
      {
        id: 'openrouter-qwen-2.5-72b',
        name: 'Qwen 2.5 72B',
        provider: AIProvider.OPENROUTER,
        type: AIModelType.CHAT,
        contextLength: 131072,
        maxTokens: 8192,
        costPer1kTokens: { input: 0.0009, output: 0.0009 },
        capabilities: ['chat', 'reasoning', 'code', 'multilingual'],
        isAvailable: true,
        priority: 5
      },
      
      // OpenAI Models
      {
        id: 'openai-gpt-4',
        name: 'GPT-4',
        provider: AIProvider.OPENAI,
        type: AIModelType.CHAT,
        contextLength: 8192,
        maxTokens: 4096,
        costPer1kTokens: { input: 0.03, output: 0.06 },
        capabilities: ['chat', 'reasoning', 'code'],
        isAvailable: true,
        priority: 1
      },
      {
        id: 'openai-gpt-4-turbo',
        name: 'GPT-4 Turbo',
        provider: AIProvider.OPENAI,
        type: AIModelType.CHAT,
        contextLength: 128000,
        maxTokens: 4096,
        costPer1kTokens: { input: 0.01, output: 0.03 },
        capabilities: ['chat', 'reasoning', 'code', 'vision'],
        isAvailable: true,
        priority: 2
      },
      {
        id: 'openai-gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        provider: AIProvider.OPENAI,
        type: AIModelType.CHAT,
        contextLength: 16385,
        maxTokens: 4096,
        costPer1kTokens: { input: 0.0015, output: 0.002 },
        capabilities: ['chat', 'reasoning'],
        isAvailable: true,
        priority: 3
      },
      
      // Embedding Models
      {
        id: 'openai-text-embedding-3-large',
        name: 'Text Embedding 3 Large',
        provider: AIProvider.OPENAI,
        type: AIModelType.EMBEDDING,
        contextLength: 8191,
        maxTokens: 8191,
        costPer1kTokens: { input: 0.00013, output: 0 },
        capabilities: ['embedding', 'similarity'],
        isAvailable: true,
        priority: 1
      },
      {
        id: 'openai-text-embedding-3-small',
        name: 'Text Embedding 3 Small',
        provider: AIProvider.OPENAI,
        type: AIModelType.EMBEDDING,
        contextLength: 8191,
        maxTokens: 8191,
        costPer1kTokens: { input: 0.00002, output: 0 },
        capabilities: ['embedding', 'similarity'],
        isAvailable: true,
        priority: 2
      },
      
      // Specialized Models
      {
        id: 'openrouter-perplexity-llama-3.1-sonar-large',
        name: 'Perplexity Llama 3.1 Sonar Large',
        provider: AIProvider.OPENROUTER,
        type: AIModelType.CHAT,
        contextLength: 127072,
        maxTokens: 8192,
        costPer1kTokens: { input: 0.001, output: 0.001 },
        capabilities: ['chat', 'search', 'realtime'],
        isAvailable: true,
        priority: 1
      }
    ];
  }

  private getDefaultBaseUrl(provider: AIProvider): string {
    switch (provider) {
      case AIProvider.GROQ:
        return 'https://api.groq.com/openai/v1';
      case AIProvider.OPENROUTER:
        return 'https://openrouter.ai/api/v1';
      case AIProvider.OPENAI:
        return 'https://api.openai.com/v1';
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  }

  private loadEnvironmentOverrides(): void {
    // Load configuration from environment variables
    const envConfig: Partial<AIServiceConfig> = {};
    
    // Provider overrides
    if (process.env.AI_DEFAULT_MODEL) {
      envConfig.router = {
        ...this.config.router,
        defaultModel: process.env.AI_DEFAULT_MODEL
      };
    }
    
    if (process.env.AI_ENABLE_FALLBACKS === 'false') {
      envConfig.router = {
        ...envConfig.router,
        ...this.config.router,
        enableFallbacks: false
      };
    }
    
    if (process.env.AI_MAX_CONCURRENT_REQUESTS) {
      envConfig.router = {
        ...envConfig.router,
        ...this.config.router,
        maxConcurrentRequests: parseInt(process.env.AI_MAX_CONCURRENT_REQUESTS)
      };
    }
    
    this.environmentOverrides = envConfig;
  }
}

// Type definitions
interface ConfigValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

interface ConfigSummary {
  totalProviders: number;
  totalModels: number;
  modelsByProvider: Record<string, number>;
  modelsByType: Record<string, number>;
  defaultModel: string;
  enabledFeatures: {
    rateLimiting: boolean;
    fallbacks: boolean;
    loadBalancing: boolean;
    healthChecks: boolean;
  };
}

// Export default instance
export const aiConfig = new AIConfigManager();

// Export configuration utilities
export class ConfigUtils {
  /**
   * Get model by capability
   */
  static getModelsByCapability(capability: string): AIModel[] {
    const config = aiConfig.getConfig();
    return config.models.filter(model => 
      model.capabilities.includes(capability)
    );
  }

  /**
   * Get cheapest model for a task
   */
  static getCheapestModel(type: AIModelType, provider?: AIProvider): AIModel | null {
    let models = aiConfig.getModelsByType(type);
    
    if (provider) {
      models = models.filter(model => model.provider === provider);
    }
    
    if (models.length === 0) {
      return null;
    }
    
    return models.reduce((cheapest, current) => {
      const cheapestCost = cheapest.costPer1kTokens.input + cheapest.costPer1kTokens.output;
      const currentCost = current.costPer1kTokens.input + current.costPer1kTokens.output;
      
      return currentCost < cheapestCost ? current : cheapest;
    });
  }

  /**
   * Get fastest model for a task
   */
  static getFastestModel(type: AIModelType, provider?: AIProvider): AIModel | null {
    let models = aiConfig.getModelsByType(type);
    
    if (provider) {
      models = models.filter(model => model.provider === provider);
    }
    
    if (models.length === 0) {
      return null;
    }
    
    // Sort by priority (lower number = higher priority = faster)
    return models.sort((a, b) => a.priority - b.priority)[0];
  }

  /**
   * Get model recommendations based on requirements
   */
  static getModelRecommendations(requirements: ModelRequirements): AIModel[] {
    const config = aiConfig.getConfig();
    let models = config.models.filter(model => model.isAvailable);
    
    // Filter by type
    if (requirements.type) {
      models = models.filter(model => model.type === requirements.type);
    }
    
    // Filter by provider
    if (requirements.provider) {
      models = models.filter(model => model.provider === requirements.provider);
    }
    
    // Filter by capabilities
    if (requirements.capabilities) {
      models = models.filter(model => 
        requirements.capabilities!.every(cap => model.capabilities.includes(cap))
      );
    }
    
    // Filter by context length
    if (requirements.minContextLength) {
      models = models.filter(model => model.contextLength >= requirements.minContextLength!);
    }
    
    // Filter by cost
    if (requirements.maxCostPer1kTokens) {
      models = models.filter(model => {
        const totalCost = model.costPer1kTokens.input + model.costPer1kTokens.output;
        return totalCost <= requirements.maxCostPer1kTokens!;
      });
    }
    
    // Sort by priority and cost
    return models.sort((a, b) => {
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }
      
      const aCost = a.costPer1kTokens.input + a.costPer1kTokens.output;
      const bCost = b.costPer1kTokens.input + b.costPer1kTokens.output;
      
      return aCost - bCost;
    });
  }

  /**
   * Validate API keys
   */
  static async validateApiKeys(): Promise<Record<AIProvider, boolean>> {
    const results: Record<AIProvider, boolean> = {} as any;
    const config = aiConfig.getConfig();
    
    for (const [provider, providerConfig] of Object.entries(config.providers)) {
      try {
        // Simple validation - check if API key exists and has correct format
        const apiKey = providerConfig.apiKey;
        
        if (!apiKey) {
          results[provider as AIProvider] = false;
          continue;
        }
        
        // Basic format validation
        switch (provider as AIProvider) {
          case AIProvider.OPENAI:
            results[provider as AIProvider] = apiKey.startsWith('sk-');
            break;
          case AIProvider.GROQ:
            results[provider as AIProvider] = apiKey.startsWith('gsk_');
            break;
          case AIProvider.OPENROUTER:
            results[provider as AIProvider] = apiKey.startsWith('sk-or-');
            break;
          default:
            results[provider as AIProvider] = apiKey.length > 10;
        }
      } catch (error) {
        results[provider as AIProvider] = false;
      }
    }
    
    return results;
  }
}

// Model requirements interface
interface ModelRequirements {
  type?: AIModelType;
  provider?: AIProvider;
  capabilities?: string[];
  minContextLength?: number;
  maxCostPer1kTokens?: number;
}

// Export configuration presets
export const ConfigPresets = {
  DEVELOPMENT: {
    router: {
      enableRateLimiting: false,
      enableFallbacks: true,
      enableLoadBalancing: false,
      enableHealthChecks: false,
      maxConcurrentRequests: 5
    }
  },
  
  PRODUCTION: {
    router: {
      enableRateLimiting: true,
      enableFallbacks: true,
      enableLoadBalancing: true,
      enableHealthChecks: true,
      maxConcurrentRequests: 20
    }
  },
  
  COST_OPTIMIZED: {
    router: {
      defaultModel: 'groq-llama-3.1-8b',
      fallbackModels: ['groq-gemma-7b', 'openai-gpt-3.5-turbo']
    }
  },
  
  PERFORMANCE_OPTIMIZED: {
    router: {
      defaultModel: 'groq-llama-3.1-70b',
      fallbackModels: ['openrouter-claude-3.5-sonnet', 'openai-gpt-4-turbo']
    }
  }
};
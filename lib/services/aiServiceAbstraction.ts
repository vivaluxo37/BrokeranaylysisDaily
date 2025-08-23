import { 
  AIProvider, 
  AIRequest, 
  AIResponse, 
  AIProviderConfig, 
  AIServiceError, 
  TokenUsage, 
  RateLimitStatus,
  AIModel,
  PromptTemplate
} from '../types';

/**
 * Abstract base class for AI service providers
 * Provides a unified interface for different AI providers
 */
export abstract class BaseAIProvider {
  protected config: AIProviderConfig;
  protected rateLimitStatus: RateLimitStatus;
  
  constructor(config: AIProviderConfig) {
    this.config = config;
    this.rateLimitStatus = {
      provider: config.provider,
      requestsRemaining: config.rateLimits.requestsPerMinute,
      tokensRemaining: config.rateLimits.tokensPerMinute,
      resetTime: new Date(Date.now() + 60000), // Reset in 1 minute
      isLimited: false
    };
  }

  /**
   * Generate AI response for the given request
   */
  abstract generateResponse(request: AIRequest): Promise<AIResponse>;

  /**
   * Generate embeddings for the given text
   */
  abstract generateEmbedding(text: string): Promise<number[]>;

  /**
   * Test provider connectivity and availability
   */
  abstract testConnection(): Promise<boolean>;

  /**
   * Get available models for this provider
   */
  abstract getAvailableModels(): Promise<AIModel[]>;

  /**
   * Check rate limit status
   */
  getRateLimitStatus(): RateLimitStatus {
    return { ...this.rateLimitStatus };
  }

  /**
   * Update rate limit status after a request
   */
  protected updateRateLimit(tokensUsed: number): void {
    this.rateLimitStatus.requestsRemaining = Math.max(0, this.rateLimitStatus.requestsRemaining - 1);
    this.rateLimitStatus.tokensRemaining = Math.max(0, this.rateLimitStatus.tokensRemaining - tokensUsed);
    
    if (this.rateLimitStatus.requestsRemaining === 0 || this.rateLimitStatus.tokensRemaining === 0) {
      this.rateLimitStatus.isLimited = true;
    }

    // Reset rate limits every minute
    if (Date.now() >= this.rateLimitStatus.resetTime.getTime()) {
      this.rateLimitStatus.requestsRemaining = this.config.rateLimits.requestsPerMinute;
      this.rateLimitStatus.tokensRemaining = this.config.rateLimits.tokensPerMinute;
      this.rateLimitStatus.isLimited = false;
      this.rateLimitStatus.resetTime = new Date(Date.now() + 60000);
    }
  }

  /**
   * Generate a unique request ID
   */
  protected generateRequestId(): string {
    return `${this.config.provider}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Calculate cost based on token usage
   */
  protected calculateCost(model: AIModel, inputTokens: number, outputTokens: number): number {
    return (inputTokens * model.costPerToken.input) + (outputTokens * model.costPerToken.output);
  }

  /**
   * Handle API errors and convert to standardized format
   */
  protected handleError(error: any, requestId?: string): AIServiceError {
    return {
      code: error.code || 'UNKNOWN_ERROR',
      message: error.message || 'An unknown error occurred',
      provider: this.config.provider,
      retryable: this.isRetryableError(error),
      timestamp: new Date(),
      requestId
    };
  }

  /**
   * Determine if an error is retryable
   */
  protected isRetryableError(error: any): boolean {
    const retryableCodes = ['RATE_LIMIT', 'TIMEOUT', 'SERVER_ERROR', 'NETWORK_ERROR'];
    return retryableCodes.includes(error.code) || 
           (error.status >= 500 && error.status < 600) ||
           error.code === 'ECONNRESET' ||
           error.code === 'ETIMEDOUT';
  }
}

/**
 * Groq AI Provider Implementation
 */
export class GroqProvider extends BaseAIProvider {
  private baseUrl = 'https://api.groq.com/openai/v1';

  async generateResponse(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();
    const requestId = this.generateRequestId();

    try {
      if (this.rateLimitStatus.isLimited) {
        throw new Error('Rate limit exceeded');
      }

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: request.model || this.config.defaultModel,
          messages: [
            { role: 'user', content: request.prompt }
          ],
          temperature: request.temperature || 0.7,
          max_tokens: request.maxTokens || 1000,
          stream: false
        }),
        signal: AbortSignal.timeout(this.config.timeout)
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const responseTime = Date.now() - startTime;
      
      const tokensUsed = {
        input: data.usage?.prompt_tokens || 0,
        output: data.usage?.completion_tokens || 0,
        total: data.usage?.total_tokens || 0
      };

      this.updateRateLimit(tokensUsed.total);

      // Mock model for cost calculation - in real implementation, get from config
      const mockModel: AIModel = {
        id: request.model || this.config.defaultModel,
        name: request.model || this.config.defaultModel,
        provider: AIProvider.GROQ,
        type: 'chat' as any,
        maxTokens: 8192,
        costPerToken: { input: 0.0000001, output: 0.0000002 },
        contextWindow: 8192,
        isAvailable: true,
        priority: 1,
        capabilities: ['chat'],
        rateLimit: { requestsPerMinute: 30, tokensPerMinute: 6000 }
      };

      return {
        content: data.choices[0].message.content,
        model: request.model || this.config.defaultModel,
        provider: AIProvider.GROQ,
        responseTime,
        tokensUsed,
        cost: this.calculateCost(mockModel, tokensUsed.input, tokensUsed.output),
        conversationId: request.conversationId,
        requestId,
        timestamp: new Date(),
        metadata: request.metadata
      };

    } catch (error) {
      throw this.handleError(error, requestId);
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    // Groq doesn't support embeddings, throw error or fallback
    throw new Error('Groq provider does not support embeddings');
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: { 'Authorization': `Bearer ${this.config.apiKey}` },
        signal: AbortSignal.timeout(5000)
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  async getAvailableModels(): Promise<AIModel[]> {
    // Return predefined Groq models
    return [
      {
        id: 'llama-3.1-70b-versatile',
        name: 'Llama 3.1 70B Versatile',
        provider: AIProvider.GROQ,
        type: 'chat' as any,
        maxTokens: 8192,
        costPerToken: { input: 0.0000001, output: 0.0000002 },
        contextWindow: 8192,
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
        costPerToken: { input: 0.00000005, output: 0.0000001 },
        contextWindow: 8192,
        isAvailable: true,
        priority: 2,
        capabilities: ['chat', 'completion'],
        rateLimit: { requestsPerMinute: 30, tokensPerMinute: 6000 }
      }
    ];
  }
}

/**
 * OpenRouter AI Provider Implementation
 */
export class OpenRouterProvider extends BaseAIProvider {
  private baseUrl = 'https://openrouter.ai/api/v1';

  async generateResponse(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();
    const requestId = this.generateRequestId();

    try {
      if (this.rateLimitStatus.isLimited) {
        throw new Error('Rate limit exceeded');
      }

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://brokeranalysis.com',
          'X-Title': 'Brokeranalysis AI Service'
        },
        body: JSON.stringify({
          model: request.model || this.config.defaultModel,
          messages: [
            { role: 'user', content: request.prompt }
          ],
          temperature: request.temperature || 0.7,
          max_tokens: request.maxTokens || 1000
        }),
        signal: AbortSignal.timeout(this.config.timeout)
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const responseTime = Date.now() - startTime;
      
      const tokensUsed = {
        input: data.usage?.prompt_tokens || 0,
        output: data.usage?.completion_tokens || 0,
        total: data.usage?.total_tokens || 0
      };

      this.updateRateLimit(tokensUsed.total);

      // Mock model for cost calculation
      const mockModel: AIModel = {
        id: request.model || this.config.defaultModel,
        name: request.model || this.config.defaultModel,
        provider: AIProvider.OPENROUTER,
        type: 'chat' as any,
        maxTokens: 4096,
        costPerToken: { input: 0.0000005, output: 0.000001 },
        contextWindow: 4096,
        isAvailable: true,
        priority: 1,
        capabilities: ['chat'],
        rateLimit: { requestsPerMinute: 20, tokensPerMinute: 4000 }
      };

      return {
        content: data.choices[0].message.content,
        model: request.model || this.config.defaultModel,
        provider: AIProvider.OPENROUTER,
        responseTime,
        tokensUsed,
        cost: this.calculateCost(mockModel, tokensUsed.input, tokensUsed.output),
        conversationId: request.conversationId,
        requestId,
        timestamp: new Date(),
        metadata: request.metadata
      };

    } catch (error) {
      throw this.handleError(error, requestId);
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    // OpenRouter supports some embedding models
    const response = await fetch(`${this.baseUrl}/embeddings`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://brokeranalysis.com',
        'X-Title': 'Brokeranalysis AI Service'
      },
      body: JSON.stringify({
        model: 'text-embedding-ada-002',
        input: text.replace(/\n/g, ' ').trim()
      }),
      signal: AbortSignal.timeout(this.config.timeout)
    });

    if (!response.ok) {
      throw new Error(`OpenRouter embedding error: ${response.status}`);
    }

    const data = await response.json();
    return data.data[0].embedding;
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: { 'Authorization': `Bearer ${this.config.apiKey}` },
        signal: AbortSignal.timeout(5000)
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  async getAvailableModels(): Promise<AIModel[]> {
    // Return predefined OpenRouter models
    return [
      {
        id: 'anthropic/claude-3-haiku',
        name: 'Claude 3 Haiku',
        provider: AIProvider.OPENROUTER,
        type: 'chat' as any,
        maxTokens: 4096,
        costPerToken: { input: 0.0000005, output: 0.000001 },
        contextWindow: 200000,
        isAvailable: true,
        priority: 1,
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
        priority: 2,
        capabilities: ['chat', 'completion'],
        rateLimit: { requestsPerMinute: 20, tokensPerMinute: 4000 }
      }
    ];
  }
}

/**
 * OpenAI Provider Implementation
 */
export class OpenAIProvider extends BaseAIProvider {
  private openai: any;

  constructor(config: AIProviderConfig) {
    super(config);
    // Dynamic import to avoid issues if OpenAI is not installed
    this.initializeOpenAI();
  }

  private async initializeOpenAI() {
    try {
      const OpenAI = (await import('openai')).default;
      this.openai = new OpenAI({
        apiKey: this.config.apiKey,
      });
    } catch (error) {
      console.error('Failed to initialize OpenAI:', error);
    }
  }

  async generateResponse(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();
    const requestId = this.generateRequestId();

    try {
      if (!this.openai) {
        throw new Error('OpenAI client not initialized');
      }

      if (this.rateLimitStatus.isLimited) {
        throw new Error('Rate limit exceeded');
      }

      const response = await this.openai.chat.completions.create({
        model: request.model || this.config.defaultModel,
        messages: [
          { role: 'user', content: request.prompt }
        ],
        temperature: request.temperature || 0.7,
        max_tokens: request.maxTokens || 1000
      });

      const responseTime = Date.now() - startTime;
      
      const tokensUsed = {
        input: response.usage?.prompt_tokens || 0,
        output: response.usage?.completion_tokens || 0,
        total: response.usage?.total_tokens || 0
      };

      this.updateRateLimit(tokensUsed.total);

      // Mock model for cost calculation
      const mockModel: AIModel = {
        id: request.model || this.config.defaultModel,
        name: request.model || this.config.defaultModel,
        provider: AIProvider.OPENAI,
        type: 'chat' as any,
        maxTokens: 4096,
        costPerToken: { input: 0.000001, output: 0.000002 },
        contextWindow: 16384,
        isAvailable: true,
        priority: 1,
        capabilities: ['chat'],
        rateLimit: { requestsPerMinute: 60, tokensPerMinute: 10000 }
      };

      return {
        content: response.choices[0].message.content || '',
        model: request.model || this.config.defaultModel,
        provider: AIProvider.OPENAI,
        responseTime,
        tokensUsed,
        cost: this.calculateCost(mockModel, tokensUsed.input, tokensUsed.output),
        conversationId: request.conversationId,
        requestId,
        timestamp: new Date(),
        metadata: request.metadata
      };

    } catch (error) {
      throw this.handleError(error, requestId);
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    if (!this.openai) {
      throw new Error('OpenAI client not initialized');
    }

    const response = await this.openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text.replace(/\n/g, ' ').trim(),
      encoding_format: 'float'
    });

    return response.data[0].embedding;
  }

  async testConnection(): Promise<boolean> {
    try {
      if (!this.openai) return false;
      await this.openai.models.list();
      return true;
    } catch {
      return false;
    }
  }

  async getAvailableModels(): Promise<AIModel[]> {
    return [
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
        rateLimit: { requestsPerMinute: 60, tokensPerMinute: 10000 }
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
      }
    ];
  }
}

/**
 * AI Service Factory for creating provider instances
 */
export class AIServiceFactory {
  static createProvider(config: AIProviderConfig): BaseAIProvider {
    switch (config.provider) {
      case AIProvider.GROQ:
        return new GroqProvider(config);
      case AIProvider.OPENROUTER:
        return new OpenRouterProvider(config);
      case AIProvider.OPENAI:
        return new OpenAIProvider(config);
      default:
        throw new Error(`Unsupported AI provider: ${config.provider}`);
    }
  }

  static createMultipleProviders(configs: AIProviderConfig[]): Map<AIProvider, BaseAIProvider> {
    const providers = new Map<AIProvider, BaseAIProvider>();
    
    for (const config of configs) {
      try {
        const provider = this.createProvider(config);
        providers.set(config.provider, provider);
      } catch (error) {
        console.error(`Failed to create provider ${config.provider}:`, error);
      }
    }
    
    return providers;
  }
}
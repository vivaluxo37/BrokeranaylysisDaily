import {
  AIProvider,
  AIModelType,
  AIRequest,
  AIResponse,
  PromptTemplate,
  AIServiceConfig,
  ConversationContext,
  AIServiceMetrics,
  TokenUsage
} from '../types';
import { AIModelRouter } from './aiModelRouter';
import { PromptTemplateManager } from './promptTemplates';
import { TokenTracker } from './tokenTracker';
import { RateLimiter, ErrorHandler } from './rateLimiter';
import { aiConfig, AIConfigManager } from './aiConfig';
import { BaseAIProvider, AIServiceFactory } from './aiServiceAbstraction';
import { aiServiceTests, runQuickTests, runComprehensiveTests } from './aiServiceTests';

/**
 * Main AI Service Integration Class
 * Provides a unified interface for all AI operations in Brokeranalysis
 * Supports multiple providers, model routing, prompt templates, and comprehensive monitoring
 */
export class AIServiceIntegration {
  private router: AIModelRouter;
  private promptManager: PromptTemplateManager;
  private tokenTracker: TokenTracker;
  private rateLimiter: RateLimiter;
  private configManager: AIConfigManager;
  private isInitialized: boolean = false;
  private conversationContexts: Map<string, ConversationContext> = new Map();

  constructor(config?: Partial<AIServiceConfig>) {
    this.configManager = aiConfig;
    
    // Apply custom configuration if provided
    if (config) {
      this.configManager.updateConfig(config);
    }

    this.router = new AIModelRouter();
    this.promptManager = new PromptTemplateManager();
    this.tokenTracker = new TokenTracker();
    this.rateLimiter = new RateLimiter();
  }

  /**
   * Initialize the AI service integration
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    console.log('🤖 Initializing AI Service Integration...');

    try {
      // Validate configuration
      const validation = this.configManager.validateConfig();
      if (!validation.isValid) {
        throw new Error(`Configuration validation failed: ${validation.errors.join(', ')}`);
      }

      // Initialize components
      await this.router.initialize();
      await this.promptManager.initialize();
      
      // Test provider connectivity
      await this.testProviderConnectivity();
      
      this.isInitialized = true;
      console.log('✅ AI Service Integration initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize AI Service Integration:', error);
      throw error;
    }
  }

  /**
   * Generate AI response for various use cases
   */
  async generateResponse(
    request: AIRequest,
    conversationId?: string
  ): Promise<AIResponse> {
    await this.ensureInitialized();

    try {
      // Check rate limits
      const selectedModel = await this.router.selectModel(request);
      if (!selectedModel) {
        throw new Error('No available model for request');
      }

      const canMakeRequest = await this.rateLimiter.canMakeRequest(selectedModel.provider);
      if (!canMakeRequest) {
        throw new Error(`Rate limit exceeded for provider ${selectedModel.provider}`);
      }

      // Build conversation context if provided
      let enhancedPrompt = request.prompt;
      if (conversationId) {
        const context = this.getConversationContext(conversationId);
        enhancedPrompt = this.promptManager.buildConversationContext(request.prompt, context);
      }

      // Create enhanced request
      const enhancedRequest: AIRequest = {
        ...request,
        prompt: enhancedPrompt,
        preferredModel: selectedModel.id
      };

      // Generate response using router
      const response = await this.router.generateResponse(enhancedRequest);

      // Record request for rate limiting
      this.rateLimiter.recordRequest(selectedModel.provider);

      // Track token usage
      if (response.usage) {
        this.tokenTracker.trackUsage({
          provider: response.provider,
          model: response.model,
          inputTokens: response.usage.inputTokens,
          outputTokens: response.usage.outputTokens,
          totalTokens: response.usage.totalTokens,
          cost: this.tokenTracker.estimateCost(
            response.provider,
            response.model,
            response.usage.inputTokens,
            response.usage.outputTokens
          ),
          timestamp: new Date(),
          requestId: this.generateRequestId()
        });
      }

      // Update conversation context
      if (conversationId) {
        this.updateConversationContext(conversationId, request.prompt, response.content);
      }

      return response;
    } catch (error) {
      // Handle and classify error
      const classifiedError = ErrorHandler.classifyError(error);
      
      // Record failure for rate limiting
      const selectedModel = await this.router.selectModel(request);
      if (selectedModel) {
        this.rateLimiter.recordFailure(selectedModel.provider, classifiedError);
      }

      // Track failed request
      this.tokenTracker.trackFailedRequest({
        provider: selectedModel?.provider || AIProvider.GROQ,
        model: selectedModel?.id || 'unknown',
        error: classifiedError.type,
        timestamp: new Date(),
        requestId: this.generateRequestId()
      });

      throw new Error(ErrorHandler.createUserMessage(classifiedError));
    }
  }

  /**
   * Generate chat response
   */
  async generateChatResponse(
    message: string,
    conversationId?: string,
    context?: any
  ): Promise<AIResponse> {
    const prompt = this.promptManager.buildPrompt(PromptTemplate.CHAT, {
      userMessage: message,
      context
    });

    return this.generateResponse({
      prompt,
      type: 'chat',
      maxTokens: 1000,
      temperature: 0.7
    }, conversationId);
  }

  /**
   * Generate broker recommendation
   */
  async generateBrokerRecommendation(
    userQuery: string,
    brokerData: any[],
    userPreferences: any
  ): Promise<AIResponse> {
    const prompt = this.promptManager.buildPrompt(PromptTemplate.RECOMMENDATION, {
      userQuery,
      brokerData,
      userPreferences
    });

    return this.generateResponse({
      prompt,
      type: 'recommendation',
      maxTokens: 1500,
      temperature: 0.3
    });
  }

  /**
   * Generate content summary
   */
  async generateSummary(
    content: string,
    summaryType: 'article' | 'broker' | 'market' = 'article'
  ): Promise<AIResponse> {
    const prompt = this.promptManager.buildPrompt(PromptTemplate.SUMMARIZATION, {
      content,
      summaryType
    });

    return this.generateResponse({
      prompt,
      type: 'summarization',
      maxTokens: 500,
      temperature: 0.2
    });
  }

  /**
   * Generate RAG response with context
   */
  async generateRAGResponse(
    query: string,
    context: string[],
    metadata?: any
  ): Promise<AIResponse> {
    const prompt = this.promptManager.buildPrompt(PromptTemplate.RAG, {
      query,
      context,
      metadata
    });

    return this.generateResponse({
      prompt,
      type: 'rag',
      maxTokens: 1200,
      temperature: 0.4
    });
  }

  /**
   * Generate broker analysis
   */
  async generateBrokerAnalysis(
    brokerData: any,
    analysisType: 'overview' | 'detailed' | 'comparison' = 'overview'
  ): Promise<AIResponse> {
    const prompt = this.promptManager.buildPrompt(PromptTemplate.BROKER_ANALYSIS, {
      brokerData,
      analysisType
    });

    return this.generateResponse({
      prompt,
      type: 'analysis',
      maxTokens: 2000,
      temperature: 0.2
    });
  }

  /**
   * Generate market analysis
   */
  async generateMarketAnalysis(
    marketData: any,
    timeframe: string = '1d'
  ): Promise<AIResponse> {
    const prompt = this.promptManager.buildPrompt(PromptTemplate.MARKET_ANALYSIS, {
      marketData,
      timeframe
    });

    return this.generateResponse({
      prompt,
      type: 'market_analysis',
      maxTokens: 1500,
      temperature: 0.3
    });
  }

  /**
   * Generate educational content
   */
  async generateEducationalContent(
    topic: string,
    level: 'beginner' | 'intermediate' | 'advanced' = 'beginner',
    format: 'article' | 'guide' | 'faq' = 'article'
  ): Promise<AIResponse> {
    const prompt = this.promptManager.buildPrompt(PromptTemplate.EDUCATIONAL, {
      topic,
      level,
      format
    });

    return this.generateResponse({
      prompt,
      type: 'educational',
      maxTokens: 2500,
      temperature: 0.4
    });
  }

  /**
   * Generate SEO-optimized content
   */
  async generateSEOContent(
    topic: string,
    keywords: string[],
    contentType: 'meta' | 'description' | 'title' | 'content' = 'content'
  ): Promise<AIResponse> {
    const prompt = this.promptManager.buildPrompt(PromptTemplate.SEO_CONTENT, {
      topic,
      keywords,
      contentType
    });

    return this.generateResponse({
      prompt,
      type: 'seo',
      maxTokens: contentType === 'content' ? 3000 : 200,
      temperature: 0.3
    });
  }

  /**
   * Generate embeddings for text
   */
  async generateEmbeddings(
    texts: string[],
    provider: AIProvider = AIProvider.OPENAI
  ): Promise<number[][]> {
    await this.ensureInitialized();

    try {
      const providerInstance = AIServiceFactory.createProvider(provider);
      const embeddings = await providerInstance.generateEmbeddings(texts);

      // Track embedding usage
      const totalTokens = texts.reduce((sum, text) => 
        sum + this.promptManager.estimateTokens(text), 0
      );

      this.tokenTracker.trackUsage({
        provider,
        model: 'text-embedding-ada-002', // Default embedding model
        inputTokens: totalTokens,
        outputTokens: 0,
        totalTokens,
        cost: this.tokenTracker.estimateCost(provider, 'text-embedding-ada-002', totalTokens, 0),
        timestamp: new Date(),
        requestId: this.generateRequestId()
      });

      return embeddings;
    } catch (error) {
      console.error('Failed to generate embeddings:', error);
      throw error;
    }
  }

  /**
   * Conversation management
   */
  createConversation(userId: string, context?: any): string {
    const conversationId = this.generateConversationId(userId);
    
    this.conversationContexts.set(conversationId, {
      id: conversationId,
      userId,
      messages: [],
      context: context || {},
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return conversationId;
  }

  getConversationContext(conversationId: string): ConversationContext | undefined {
    return this.conversationContexts.get(conversationId);
  }

  updateConversationContext(
    conversationId: string,
    userMessage: string,
    aiResponse: string
  ): void {
    const context = this.conversationContexts.get(conversationId);
    if (context) {
      context.messages.push(
        { role: 'user', content: userMessage, timestamp: new Date() },
        { role: 'assistant', content: aiResponse, timestamp: new Date() }
      );
      context.updatedAt = new Date();
      
      // Keep only last 10 messages to manage memory
      if (context.messages.length > 20) {
        context.messages = context.messages.slice(-20);
      }
    }
  }

  clearConversation(conversationId: string): void {
    this.conversationContexts.delete(conversationId);
  }

  /**
   * Monitoring and analytics
   */
  getServiceMetrics(): AIServiceMetrics {
    const tokenStats = this.tokenTracker.getUsageStats();
    const routerStatus = this.router.getStatus();
    
    return {
      tokenUsage: tokenStats,
      routerStatus,
      activeConversations: this.conversationContexts.size,
      rateLimitStatus: {
        groq: this.rateLimiter.getRateLimitStatus(AIProvider.GROQ),
        openrouter: this.rateLimiter.getRateLimitStatus(AIProvider.OPENROUTER),
        openai: this.rateLimiter.getRateLimitStatus(AIProvider.OPENAI)
      },
      timestamp: new Date()
    };
  }

  getUsageStats() {
    return this.tokenTracker.getUsageStats();
  }

  getCostBreakdown() {
    return this.tokenTracker.getCostBreakdown();
  }

  exportUsageData(format: 'json' | 'csv' = 'json') {
    return this.tokenTracker.exportData(format);
  }

  /**
   * Configuration management
   */
  updateConfiguration(config: Partial<AIServiceConfig>): void {
    this.configManager.updateConfig(config);
    
    // Reinitialize components if needed
    if (this.isInitialized) {
      this.router.updateConfig(config.router);
    }
  }

  getConfiguration() {
    return this.configManager.getConfig();
  }

  resetConfiguration(): void {
    this.configManager.resetToDefaults();
  }

  /**
   * Health checks and testing
   */
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    details: any;
  }> {
    try {
      const providerHealth = await this.testProviderConnectivity();
      const configValid = this.configManager.validateConfig();
      const routerStatus = await this.router.getStatus();
      
      const healthyProviders = Object.values(providerHealth).filter(Boolean).length;
      const totalProviders = Object.keys(providerHealth).length;
      
      let status: 'healthy' | 'degraded' | 'unhealthy';
      if (healthyProviders === totalProviders && configValid.isValid) {
        status = 'healthy';
      } else if (healthyProviders > 0) {
        status = 'degraded';
      } else {
        status = 'unhealthy';
      }
      
      return {
        status,
        details: {
          providers: providerHealth,
          configuration: configValid,
          router: routerStatus,
          healthyProviders,
          totalProviders
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        details: { error: error.message }
      };
    }
  }

  async runTests(type: 'quick' | 'comprehensive' = 'quick') {
    if (type === 'quick') {
      return await runQuickTests();
    } else {
      return await runComprehensiveTests();
    }
  }

  /**
   * Utility methods
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }
  }

  private async testProviderConnectivity(): Promise<Record<string, boolean>> {
    const providers = Object.values(AIProvider);
    const results: Record<string, boolean> = {};
    
    for (const provider of providers) {
      try {
        const providerInstance = AIServiceFactory.createProvider(provider);
        results[provider] = await providerInstance.testConnection();
      } catch (error) {
        results[provider] = false;
        console.warn(`Provider ${provider} connectivity test failed:`, error.message);
      }
    }
    
    return results;
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateConversationId(userId: string): string {
    return `conv_${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Cleanup and shutdown
   */
  async shutdown(): Promise<void> {
    console.log('🔄 Shutting down AI Service Integration...');
    
    // Clear conversations
    this.conversationContexts.clear();
    
    // Export final usage data
    const finalStats = this.tokenTracker.getUsageStats();
    console.log('📊 Final usage stats:', finalStats);
    
    this.isInitialized = false;
    console.log('✅ AI Service Integration shutdown complete');
  }
}

// Export singleton instance
export const aiService = new AIServiceIntegration();

// Export convenience functions
export async function initializeAIService(config?: Partial<AIServiceConfig>): Promise<void> {
  if (config) {
    aiService.updateConfiguration(config);
  }
  await aiService.initialize();
}

export async function generateChatResponse(
  message: string,
  conversationId?: string,
  context?: any
): Promise<AIResponse> {
  return aiService.generateChatResponse(message, conversationId, context);
}

export async function generateBrokerRecommendation(
  userQuery: string,
  brokerData: any[],
  userPreferences: any
): Promise<AIResponse> {
  return aiService.generateBrokerRecommendation(userQuery, brokerData, userPreferences);
}

export async function generateSummary(
  content: string,
  summaryType?: 'article' | 'broker' | 'market'
): Promise<AIResponse> {
  return aiService.generateSummary(content, summaryType);
}

export async function generateRAGResponse(
  query: string,
  context: string[],
  metadata?: any
): Promise<AIResponse> {
  return aiService.generateRAGResponse(query, context, metadata);
}

export async function generateBrokerAnalysis(
  brokerData: any,
  analysisType?: 'overview' | 'detailed' | 'comparison'
): Promise<AIResponse> {
  return aiService.generateBrokerAnalysis(brokerData, analysisType);
}

export async function generateMarketAnalysis(
  marketData: any,
  timeframe?: string
): Promise<AIResponse> {
  return aiService.generateMarketAnalysis(marketData, timeframe);
}

export async function generateEducationalContent(
  topic: string,
  level?: 'beginner' | 'intermediate' | 'advanced',
  format?: 'article' | 'guide' | 'faq'
): Promise<AIResponse> {
  return aiService.generateEducationalContent(topic, level, format);
}

export async function generateSEOContent(
  topic: string,
  keywords: string[],
  contentType?: 'meta' | 'description' | 'title' | 'content'
): Promise<AIResponse> {
  return aiService.generateSEOContent(topic, keywords, contentType);
}

export async function generateEmbeddings(
  texts: string[],
  provider?: AIProvider
): Promise<number[][]> {
  return aiService.generateEmbeddings(texts, provider);
}

export function createConversation(userId: string, context?: any): string {
  return aiService.createConversation(userId, context);
}

export function getServiceMetrics(): AIServiceMetrics {
  return aiService.getServiceMetrics();
}

export async function runAIServiceHealthCheck() {
  return aiService.healthCheck();
}

// Export types for external use
export type {
  AIRequest,
  AIResponse,
  AIServiceConfig,
  ConversationContext,
  AIServiceMetrics,
  TokenUsage
} from '../types';

// Export all components for advanced usage
export {
  AIModelRouter,
  PromptTemplateManager,
  TokenTracker,
  RateLimiter,
  ErrorHandler,
  AIConfigManager,
  BaseAIProvider,
  AIServiceFactory,
  aiServiceTests
};
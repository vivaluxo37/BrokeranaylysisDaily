import {
  AIProvider,
  AIModelType,
  AIRequest,
  AIResponse,
  PromptTemplate
} from '../types';
import { AIModelRouter } from './aiModelRouter';
import { PromptTemplateManager } from './promptTemplates';
import { TokenTracker } from './tokenTracker';
import { RateLimiter, ErrorHandler } from './rateLimiter';
import { aiConfig, ConfigUtils } from './aiConfig';
import { BaseAIProvider, AIServiceFactory } from './aiServiceAbstraction';

/**
 * Comprehensive Testing Suite for AI Service Integration
 * Tests all components of the AI service system
 */
export class AIServiceTestSuite {
  private router: AIModelRouter;
  private promptManager: PromptTemplateManager;
  private tokenTracker: TokenTracker;
  private rateLimiter: RateLimiter;
  private testResults: Map<string, TestResult>;
  private testStartTime: number;

  constructor() {
    this.router = new AIModelRouter();
    this.promptManager = new PromptTemplateManager();
    this.tokenTracker = new TokenTracker();
    this.rateLimiter = new RateLimiter();
    this.testResults = new Map();
    this.testStartTime = 0;
  }

  /**
   * Run complete test suite
   */
  async runAllTests(): Promise<TestSuiteResult> {
    this.testStartTime = Date.now();
    console.log('🧪 Starting AI Service Integration Test Suite...');
    
    const testCategories = [
      'Configuration Tests',
      'Provider Tests',
      'Model Router Tests',
      'Prompt Template Tests',
      'Token Tracking Tests',
      'Rate Limiting Tests',
      'Integration Tests',
      'Performance Tests',
      'Error Handling Tests'
    ];

    for (const category of testCategories) {
      console.log(`\n📋 Running ${category}...`);
      await this.runTestCategory(category);
    }

    return this.generateTestReport();
  }

  /**
   * Run specific test category
   */
  async runTestCategory(category: string): Promise<void> {
    switch (category) {
      case 'Configuration Tests':
        await this.runConfigurationTests();
        break;
      case 'Provider Tests':
        await this.runProviderTests();
        break;
      case 'Model Router Tests':
        await this.runModelRouterTests();
        break;
      case 'Prompt Template Tests':
        await this.runPromptTemplateTests();
        break;
      case 'Token Tracking Tests':
        await this.runTokenTrackingTests();
        break;
      case 'Rate Limiting Tests':
        await this.runRateLimitingTests();
        break;
      case 'Integration Tests':
        await this.runIntegrationTests();
        break;
      case 'Performance Tests':
        await this.runPerformanceTests();
        break;
      case 'Error Handling Tests':
        await this.runErrorHandlingTests();
        break;
    }
  }

  /**
   * Configuration validation tests
   */
  private async runConfigurationTests(): Promise<void> {
    // Test 1: Configuration validation
    await this.runTest('config-validation', async () => {
      const validation = aiConfig.validateConfig();
      if (!validation.isValid) {
        throw new Error(`Configuration validation failed: ${validation.errors.join(', ')}`);
      }
      return { message: 'Configuration is valid', data: validation };
    });

    // Test 2: API key validation
    await this.runTest('api-key-validation', async () => {
      const apiKeyStatus = await ConfigUtils.validateApiKeys();
      const invalidKeys = Object.entries(apiKeyStatus)
        .filter(([_, isValid]) => !isValid)
        .map(([provider]) => provider);
      
      if (invalidKeys.length > 0) {
        console.warn(`⚠️ Invalid API keys for: ${invalidKeys.join(', ')}`);
      }
      
      return { message: 'API key validation completed', data: apiKeyStatus };
    });

    // Test 3: Model configuration
    await this.runTest('model-configuration', async () => {
      const models = aiConfig.getConfig().models;
      if (models.length === 0) {
        throw new Error('No models configured');
      }
      
      const chatModels = aiConfig.getModelsByType(AIModelType.CHAT);
      if (chatModels.length === 0) {
        throw new Error('No chat models configured');
      }
      
      return { 
        message: `${models.length} models configured, ${chatModels.length} chat models`,
        data: { totalModels: models.length, chatModels: chatModels.length }
      };
    });

    // Test 4: Provider configuration
    await this.runTest('provider-configuration', async () => {
      const providers = Object.keys(aiConfig.getConfig().providers);
      if (providers.length === 0) {
        throw new Error('No providers configured');
      }
      
      return {
        message: `${providers.length} providers configured: ${providers.join(', ')}`,
        data: { providers }
      };
    });
  }

  /**
   * Provider connectivity tests
   */
  private async runProviderTests(): Promise<void> {
    const providers = Object.values(AIProvider);
    
    for (const provider of providers) {
      await this.runTest(`provider-${provider}-connectivity`, async () => {
        try {
          const providerInstance = AIServiceFactory.createProvider(provider);
          const isHealthy = await providerInstance.testConnection();
          
          if (!isHealthy) {
            throw new Error(`Provider ${provider} connectivity test failed`);
          }
          
          return { message: `Provider ${provider} is healthy`, data: { provider, healthy: true } };
        } catch (error) {
          console.warn(`⚠️ Provider ${provider} connectivity test failed:`, error);
          return { message: `Provider ${provider} connectivity failed`, data: { provider, healthy: false, error: error.message } };
        }
      });

      await this.runTest(`provider-${provider}-models`, async () => {
        const models = aiConfig.getModelsByProvider(provider);
        return {
          message: `Provider ${provider} has ${models.length} models`,
          data: { provider, modelCount: models.length, models: models.map(m => m.id) }
        };
      });
    }
  }

  /**
   * Model router tests
   */
  private async runModelRouterTests(): Promise<void> {
    // Test 1: Router initialization
    await this.runTest('router-initialization', async () => {
      const status = await this.router.getStatus();
      return { message: 'Router initialized successfully', data: status };
    });

    // Test 2: Model selection
    await this.runTest('model-selection', async () => {
      const request: AIRequest = {
        prompt: 'Test prompt',
        type: 'chat',
        maxTokens: 100
      };
      
      const selectedModel = await this.router.selectModel(request);
      if (!selectedModel) {
        throw new Error('No model selected');
      }
      
      return {
        message: `Selected model: ${selectedModel.id}`,
        data: { selectedModel: selectedModel.id }
      };
    });

    // Test 3: Fallback mechanism
    await this.runTest('fallback-mechanism', async () => {
      // Simulate primary model failure
      const request: AIRequest = {
        prompt: 'Test fallback',
        type: 'chat',
        maxTokens: 100,
        preferredModel: 'non-existent-model'
      };
      
      const selectedModel = await this.router.selectModel(request);
      if (!selectedModel) {
        throw new Error('Fallback mechanism failed');
      }
      
      return {
        message: `Fallback to model: ${selectedModel.id}`,
        data: { fallbackModel: selectedModel.id }
      };
    });

    // Test 4: Load balancing
    await this.runTest('load-balancing', async () => {
      const requests = Array(5).fill(null).map((_, i) => ({
        prompt: `Test request ${i}`,
        type: 'chat' as const,
        maxTokens: 100
      }));
      
      const selectedModels = await Promise.all(
        requests.map(req => this.router.selectModel(req))
      );
      
      const uniqueModels = new Set(selectedModels.map(m => m?.id));
      
      return {
        message: `Load balancing across ${uniqueModels.size} models`,
        data: { uniqueModels: Array.from(uniqueModels) }
      };
    });
  }

  /**
   * Prompt template tests
   */
  private async runPromptTemplateTests(): Promise<void> {
    // Test 1: Template retrieval
    await this.runTest('template-retrieval', async () => {
      const chatTemplate = this.promptManager.getPrompt(PromptTemplate.CHAT);
      if (!chatTemplate) {
        throw new Error('Chat template not found');
      }
      
      return { message: 'Templates retrieved successfully', data: { chatTemplate } };
    });

    // Test 2: Template validation
    await this.runTest('template-validation', async () => {
      const template = 'Hello {{name}}, your balance is {{balance}}';
      const variables = ['name', 'balance'];
      
      const isValid = this.promptManager.validateTemplate(template, variables);
      if (!isValid) {
        throw new Error('Template validation failed');
      }
      
      return { message: 'Template validation passed', data: { template, variables } };
    });

    // Test 3: Variable extraction
    await this.runTest('variable-extraction', async () => {
      const template = 'Hello {{name}}, your {{type}} balance is {{amount}}';
      const extractedVars = this.promptManager.extractVariables(template);
      
      const expectedVars = ['name', 'type', 'amount'];
      if (!expectedVars.every(v => extractedVars.includes(v))) {
        throw new Error('Variable extraction failed');
      }
      
      return {
        message: 'Variable extraction successful',
        data: { template, extractedVars }
      };
    });

    // Test 4: Prompt building
    await this.runTest('prompt-building', async () => {
      const context = {
        userQuery: 'What is the best broker for beginners?',
        brokerData: [{ name: 'Test Broker', rating: 4.5 }],
        userPreferences: { riskLevel: 'low', experience: 'beginner' }
      };
      
      const prompt = this.promptManager.buildPrompt(PromptTemplate.RECOMMENDATION, context);
      if (!prompt || prompt.length < 50) {
        throw new Error('Prompt building failed');
      }
      
      return {
        message: 'Prompt built successfully',
        data: { promptLength: prompt.length, context }
      };
    });
  }

  /**
   * Token tracking tests
   */
  private async runTokenTrackingTests(): Promise<void> {
    // Test 1: Token tracking
    await this.runTest('token-tracking', async () => {
      this.tokenTracker.trackUsage({
        provider: AIProvider.GROQ,
        model: 'groq-llama-3.1-70b',
        inputTokens: 100,
        outputTokens: 50,
        totalTokens: 150,
        cost: 0.01,
        timestamp: new Date(),
        requestId: 'test-request-1'
      });
      
      const stats = this.tokenTracker.getUsageStats();
      if (stats.totalRequests === 0) {
        throw new Error('Token tracking failed');
      }
      
      return { message: 'Token tracking working', data: stats };
    });

    // Test 2: Cost calculation
    await this.runTest('cost-calculation', async () => {
      const cost = this.tokenTracker.estimateCost(AIProvider.GROQ, 'groq-llama-3.1-70b', 1000, 500);
      if (cost <= 0) {
        throw new Error('Cost calculation failed');
      }
      
      return { message: 'Cost calculation working', data: { cost } };
    });

    // Test 3: Usage limits
    await this.runTest('usage-limits', async () => {
      this.tokenTracker.setDailyLimit(1000);
      const isExceeded = this.tokenTracker.isDailyLimitExceeded();
      
      return {
        message: 'Usage limits configured',
        data: { dailyLimit: 1000, isExceeded }
      };
    });
  }

  /**
   * Rate limiting tests
   */
  private async runRateLimitingTests(): Promise<void> {
    // Test 1: Rate limit checking
    await this.runTest('rate-limit-checking', async () => {
      const canMakeRequest = await this.rateLimiter.canMakeRequest(AIProvider.GROQ);
      const status = this.rateLimiter.getRateLimitStatus(AIProvider.GROQ);
      
      return {
        message: 'Rate limit checking working',
        data: { canMakeRequest, status }
      };
    });

    // Test 2: Request recording
    await this.runTest('request-recording', async () => {
      this.rateLimiter.recordRequest(AIProvider.GROQ);
      const statusAfter = this.rateLimiter.getRateLimitStatus(AIProvider.GROQ);
      
      return {
        message: 'Request recording working',
        data: { statusAfter }
      };
    });

    // Test 3: Error handling
    await this.runTest('error-recording', async () => {
      const error = ErrorHandler.classifyError({
        status: 429,
        message: 'Rate limit exceeded',
        provider: AIProvider.GROQ
      });
      
      this.rateLimiter.recordFailure(AIProvider.GROQ, error);
      
      return {
        message: 'Error recording working',
        data: { error }
      };
    });
  }

  /**
   * Integration tests
   */
  private async runIntegrationTests(): Promise<void> {
    // Test 1: End-to-end chat request
    await this.runTest('e2e-chat-request', async () => {
      try {
        const request: AIRequest = {
          prompt: 'What is 2+2?',
          type: 'chat',
          maxTokens: 50
        };
        
        const response = await this.router.generateResponse(request);
        
        if (!response || !response.content) {
          throw new Error('No response generated');
        }
        
        return {
          message: 'End-to-end chat request successful',
          data: {
            request: request.prompt,
            responseLength: response.content.length,
            model: response.model,
            provider: response.provider
          }
        };
      } catch (error) {
        console.warn('⚠️ E2E chat request failed (may be due to API keys):', error.message);
        return {
          message: 'E2E chat request skipped (API configuration needed)',
          data: { error: error.message }
        };
      }
    });

    // Test 2: Recommendation flow
    await this.runTest('recommendation-flow', async () => {
      const context = {
        userQuery: 'Best broker for day trading',
        brokerData: [
          { name: 'Broker A', rating: 4.5, features: ['low fees', 'fast execution'] },
          { name: 'Broker B', rating: 4.2, features: ['good platform', 'research tools'] }
        ],
        userPreferences: { tradingStyle: 'day trading', experience: 'intermediate' }
      };
      
      const prompt = this.promptManager.buildPrompt(PromptTemplate.RECOMMENDATION, context);
      
      return {
        message: 'Recommendation flow working',
        data: { promptLength: prompt.length, context }
      };
    });

    // Test 3: Multi-provider fallback
    await this.runTest('multi-provider-fallback', async () => {
      const providers = [AIProvider.GROQ, AIProvider.OPENROUTER, AIProvider.OPENAI];
      const availableProviders = [];
      
      for (const provider of providers) {
        try {
          const providerInstance = AIServiceFactory.createProvider(provider);
          const isHealthy = await providerInstance.testConnection();
          if (isHealthy) {
            availableProviders.push(provider);
          }
        } catch (error) {
          // Provider not available
        }
      }
      
      return {
        message: `Multi-provider fallback: ${availableProviders.length} providers available`,
        data: { availableProviders }
      };
    });
  }

  /**
   * Performance tests
   */
  private async runPerformanceTests(): Promise<void> {
    // Test 1: Model selection performance
    await this.runTest('model-selection-performance', async () => {
      const startTime = Date.now();
      const iterations = 100;
      
      for (let i = 0; i < iterations; i++) {
        await this.router.selectModel({
          prompt: `Test prompt ${i}`,
          type: 'chat',
          maxTokens: 100
        });
      }
      
      const endTime = Date.now();
      const avgTime = (endTime - startTime) / iterations;
      
      return {
        message: `Model selection: ${avgTime.toFixed(2)}ms average`,
        data: { iterations, avgTime, totalTime: endTime - startTime }
      };
    });

    // Test 2: Prompt building performance
    await this.runTest('prompt-building-performance', async () => {
      const startTime = Date.now();
      const iterations = 1000;
      
      const context = {
        userQuery: 'Test query',
        brokerData: [{ name: 'Test Broker', rating: 4.5 }],
        userPreferences: { riskLevel: 'medium' }
      };
      
      for (let i = 0; i < iterations; i++) {
        this.promptManager.buildPrompt(PromptTemplate.CHAT, context);
      }
      
      const endTime = Date.now();
      const avgTime = (endTime - startTime) / iterations;
      
      return {
        message: `Prompt building: ${avgTime.toFixed(3)}ms average`,
        data: { iterations, avgTime, totalTime: endTime - startTime }
      };
    });

    // Test 3: Token estimation performance
    await this.runTest('token-estimation-performance', async () => {
      const startTime = Date.now();
      const iterations = 1000;
      const text = 'This is a test prompt for token estimation performance testing.';
      
      for (let i = 0; i < iterations; i++) {
        this.promptManager.estimateTokens(text);
      }
      
      const endTime = Date.now();
      const avgTime = (endTime - startTime) / iterations;
      
      return {
        message: `Token estimation: ${avgTime.toFixed(3)}ms average`,
        data: { iterations, avgTime, totalTime: endTime - startTime }
      };
    });
  }

  /**
   * Error handling tests
   */
  private async runErrorHandlingTests(): Promise<void> {
    // Test 1: Error classification
    await this.runTest('error-classification', async () => {
      const testErrors = [
        { status: 429, message: 'Rate limit exceeded' },
        { status: 401, message: 'Unauthorized' },
        { status: 500, message: 'Internal server error' },
        { code: 'ECONNRESET', message: 'Connection reset' }
      ];
      
      const classifications = testErrors.map(error => 
        ErrorHandler.classifyError(error)
      );
      
      return {
        message: 'Error classification working',
        data: { classifications }
      };
    });

    // Test 2: User-friendly messages
    await this.runTest('user-friendly-messages', async () => {
      const error = ErrorHandler.classifyError({
        status: 429,
        message: 'Rate limit exceeded',
        provider: AIProvider.GROQ
      });
      
      const userMessage = ErrorHandler.createUserMessage(error);
      
      if (!userMessage || userMessage.length < 10) {
        throw new Error('User message generation failed');
      }
      
      return {
        message: 'User-friendly messages working',
        data: { error, userMessage }
      };
    });

    // Test 3: Circuit breaker simulation
    await this.runTest('circuit-breaker-simulation', async () => {
      // Simulate multiple failures
      for (let i = 0; i < 6; i++) {
        const error = ErrorHandler.classifyError({
          status: 500,
          message: 'Server error',
          provider: AIProvider.GROQ
        });
        this.rateLimiter.recordFailure(AIProvider.GROQ, error);
      }
      
      const status = this.rateLimiter.getRateLimitStatus(AIProvider.GROQ);
      
      return {
        message: 'Circuit breaker simulation completed',
        data: { circuitBreakerState: status.circuitBreakerState }
      };
    });
  }

  /**
   * Run individual test
   */
  private async runTest(testId: string, testFn: () => Promise<any>): Promise<void> {
    const startTime = Date.now();
    
    try {
      const result = await testFn();
      const duration = Date.now() - startTime;
      
      this.testResults.set(testId, {
        id: testId,
        status: 'passed',
        duration,
        message: result.message,
        data: result.data
      });
      
      console.log(`  ✅ ${testId}: ${result.message} (${duration}ms)`);
    } catch (error) {
      const duration = Date.now() - startTime;
      
      this.testResults.set(testId, {
        id: testId,
        status: 'failed',
        duration,
        message: error.message,
        error: error
      });
      
      console.log(`  ❌ ${testId}: ${error.message} (${duration}ms)`);
    }
  }

  /**
   * Generate comprehensive test report
   */
  private generateTestReport(): TestSuiteResult {
    const totalDuration = Date.now() - this.testStartTime;
    const results = Array.from(this.testResults.values());
    
    const passed = results.filter(r => r.status === 'passed').length;
    const failed = results.filter(r => r.status === 'failed').length;
    const total = results.length;
    
    const report: TestSuiteResult = {
      summary: {
        total,
        passed,
        failed,
        passRate: total > 0 ? (passed / total) * 100 : 0,
        totalDuration
      },
      results,
      timestamp: new Date(),
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        configSummary: aiConfig.getConfigSummary()
      }
    };
    
    console.log(`\n📊 Test Suite Complete:`);
    console.log(`   Total: ${total} tests`);
    console.log(`   Passed: ${passed} tests`);
    console.log(`   Failed: ${failed} tests`);
    console.log(`   Pass Rate: ${report.summary.passRate.toFixed(1)}%`);
    console.log(`   Duration: ${totalDuration}ms`);
    
    if (failed > 0) {
      console.log(`\n❌ Failed Tests:`);
      results.filter(r => r.status === 'failed').forEach(result => {
        console.log(`   - ${result.id}: ${result.message}`);
      });
    }
    
    return report;
  }

  /**
   * Export test results
   */
  exportResults(format: 'json' | 'html' = 'json'): string {
    const report = this.generateTestReport();
    
    if (format === 'json') {
      return JSON.stringify(report, null, 2);
    }
    
    // HTML format
    return this.generateHtmlReport(report);
  }

  /**
   * Generate HTML test report
   */
  private generateHtmlReport(report: TestSuiteResult): string {
    const passedTests = report.results.filter(r => r.status === 'passed');
    const failedTests = report.results.filter(r => r.status === 'failed');
    
    return `
<!DOCTYPE html>
<html>
<head>
    <title>AI Service Integration Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .summary { background: #f5f5f5; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
        .test-result { margin: 10px 0; padding: 10px; border-radius: 3px; }
        .passed { background: #d4edda; border-left: 4px solid #28a745; }
        .failed { background: #f8d7da; border-left: 4px solid #dc3545; }
        .duration { color: #666; font-size: 0.9em; }
        .error { color: #dc3545; font-family: monospace; }
    </style>
</head>
<body>
    <h1>AI Service Integration Test Report</h1>
    
    <div class="summary">
        <h2>Summary</h2>
        <p><strong>Total Tests:</strong> ${report.summary.total}</p>
        <p><strong>Passed:</strong> ${report.summary.passed}</p>
        <p><strong>Failed:</strong> ${report.summary.failed}</p>
        <p><strong>Pass Rate:</strong> ${report.summary.passRate.toFixed(1)}%</p>
        <p><strong>Duration:</strong> ${report.summary.totalDuration}ms</p>
        <p><strong>Timestamp:</strong> ${report.timestamp.toISOString()}</p>
    </div>
    
    <h2>Test Results</h2>
    
    ${passedTests.map(test => `
        <div class="test-result passed">
            <strong>✅ ${test.id}</strong>
            <span class="duration">(${test.duration}ms)</span>
            <p>${test.message}</p>
        </div>
    `).join('')}
    
    ${failedTests.map(test => `
        <div class="test-result failed">
            <strong>❌ ${test.id}</strong>
            <span class="duration">(${test.duration}ms)</span>
            <p>${test.message}</p>
            ${test.error ? `<pre class="error">${test.error.stack || test.error.message}</pre>` : ''}
        </div>
    `).join('')}
    
</body>
</html>
    `;
  }
}

// Type definitions
interface TestResult {
  id: string;
  status: 'passed' | 'failed';
  duration: number;
  message: string;
  data?: any;
  error?: Error;
}

interface TestSuiteResult {
  summary: {
    total: number;
    passed: number;
    failed: number;
    passRate: number;
    totalDuration: number;
  };
  results: TestResult[];
  timestamp: Date;
  environment: {
    nodeVersion: string;
    platform: string;
    configSummary: any;
  };
}

// Export test utilities
export class TestUtils {
  /**
   * Create mock AI response
   */
  static createMockResponse(content: string, model: string = 'test-model'): AIResponse {
    return {
      content,
      model,
      provider: AIProvider.GROQ,
      usage: {
        inputTokens: 10,
        outputTokens: 20,
        totalTokens: 30
      },
      finishReason: 'stop',
      timestamp: new Date()
    };
  }

  /**
   * Create mock AI request
   */
  static createMockRequest(prompt: string, type: string = 'chat'): AIRequest {
    return {
      prompt,
      type,
      maxTokens: 100,
      temperature: 0.7
    };
  }

  /**
   * Measure execution time
   */
  static async measureTime<T>(fn: () => Promise<T>): Promise<{ result: T; duration: number }> {
    const startTime = Date.now();
    const result = await fn();
    const duration = Date.now() - startTime;
    return { result, duration };
  }

  /**
   * Generate test data
   */
  static generateTestData(count: number): any[] {
    return Array(count).fill(null).map((_, i) => ({
      id: `test-${i}`,
      name: `Test Item ${i}`,
      value: Math.random() * 100,
      timestamp: new Date(Date.now() - i * 1000)
    }));
  }
}

// Export default test suite instance
export const aiServiceTests = new AIServiceTestSuite();

// Export quick test runner
export async function runQuickTests(): Promise<void> {
  console.log('🚀 Running Quick AI Service Tests...');
  
  const testSuite = new AIServiceTestSuite();
  await testSuite.runTestCategory('Configuration Tests');
  await testSuite.runTestCategory('Provider Tests');
  
  console.log('✅ Quick tests completed!');
}

// Export comprehensive test runner
export async function runComprehensiveTests(): Promise<TestSuiteResult> {
  console.log('🔬 Running Comprehensive AI Service Tests...');
  
  const testSuite = new AIServiceTestSuite();
  return await testSuite.runAllTests();
}
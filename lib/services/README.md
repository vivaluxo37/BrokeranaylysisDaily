# AI Service Integration

A comprehensive AI service integration for the Brokeranalysis platform, supporting multiple AI providers with advanced features like model routing, prompt templates, token tracking, and rate limiting.

## 🚀 Features

### Core Capabilities
- **Multi-Provider Support**: Groq, OpenRouter, and OpenAI integration
- **Model Router**: 15+ AI models with intelligent failover and load balancing
- **Prompt Templates**: Pre-built templates for various use cases
- **Token Tracking**: Comprehensive usage monitoring and cost analysis
- **Rate Limiting**: Advanced rate limiting with circuit breakers
- **Error Handling**: Robust error handling with fallback mechanisms
- **Health Monitoring**: Real-time service health checks and metrics

### Supported Use Cases
- **Chat Support**: Customer service and general inquiries
- **Broker Recommendations**: Personalized broker suggestions
- **RAG Responses**: Knowledge base queries with context
- **Broker Analysis**: Detailed broker reviews and comparisons
- **Market Analysis**: Technical and fundamental market insights
- **Educational Content**: Trading guides and tutorials
- **SEO Content**: Search-optimized articles and pages
- **Embeddings**: Semantic search and similarity matching

## 📁 File Structure

```
lib/services/
├── aiService.ts                 # Legacy service with new integration
├── aiServiceIntegration.ts      # Main integration orchestrator
├── aiServiceAbstraction.ts      # Provider abstraction layer
├── aiModelRouter.ts             # Model routing and load balancing
├── promptTemplates.ts           # Template management system
├── tokenTracker.ts              # Usage and cost tracking
├── rateLimiter.ts               # Rate limiting and circuit breaking
├── aiConfig.ts                  # Configuration management
├── aiServiceTests.ts            # Comprehensive testing suite
├── aiServiceExample.ts          # Usage examples and demos
└── README.md                    # This documentation
```

## 🛠️ Installation & Setup

### 1. Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# AI Provider API Keys
GROQ_API_KEY=your_groq_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
OPENAI_API_KEY=your_openai_api_key

# Optional: Custom API endpoints
GROQ_BASE_URL=https://api.groq.com/openai/v1
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENAI_BASE_URL=https://api.openai.com/v1

# Optional: Rate limiting configuration
AI_RATE_LIMIT_REQUESTS_PER_MINUTE=60
AI_RATE_LIMIT_TOKENS_PER_MINUTE=100000
```

### 2. Initialize the Service

```typescript
import { initializeAIService } from './lib/services/aiService';

// Initialize during app startup
await initializeAIService();
```

## 📖 Usage Examples

### Basic Chat Response

```typescript
import { generateNewChatResponse } from './lib/services/aiService';

const response = await generateNewChatResponse(
  'What are the best forex brokers for beginners?',
  {
    conversationId: 'conv_123',
    context: 'Customer support inquiry',
    userPreferences: {
      experience: 'beginner',
      budget: 'low'
    }
  }
);

console.log(response.content);
```

### Broker Recommendation

```typescript
import { generateNewBrokerRecommendation } from './lib/services/aiService';

const brokerData = [
  {
    name: 'IG Markets',
    regulation: ['FCA', 'ASIC'],
    minDeposit: 250,
    trustScore: 9.2
  }
];

const userPreferences = {
  experience: 'intermediate',
  tradingStyle: 'scalping',
  regulationImportance: 'high'
};

const recommendation = await generateNewBrokerRecommendation(
  'Which broker is best for scalping?',
  brokerData,
  userPreferences
);
```

### RAG (Retrieval-Augmented Generation)

```typescript
import { generateNewRAGResponse } from './lib/services/aiService';

const context = [
  'Forex trading involves currency exchange...',
  'The forex market is the largest financial market...'
];

const response = await generateNewRAGResponse(
  'What is forex trading?',
  context,
  {
    maxTokens: 500,
    temperature: 0.7
  }
);
```

### Generate Embeddings

```typescript
import { generateEmbedding, generateEmbeddingsBatch } from './lib/services/aiService';

// Single embedding
const embedding = await generateEmbedding('Best forex brokers');

// Batch embeddings
const texts = ['Forex trading', 'CFD trading', 'Stock trading'];
const embeddings = await generateEmbeddingsBatch(texts);
```

### Service Monitoring

```typescript
import { 
  getServiceMetrics, 
  runAIServiceHealthCheck, 
  testAIServices 
} from './lib/services/aiService';

// Get usage metrics
const metrics = await getServiceMetrics();
console.log('Token usage:', metrics.tokenUsage);
console.log('Cost breakdown:', metrics.costs);

// Health check
const health = await runAIServiceHealthCheck();
console.log('Service status:', health.status);

// Test all providers
const tests = await testAIServices();
console.log('Provider status:', tests);
```

## 🔧 Configuration

### Model Configuration

The service supports 15+ AI models with automatic failover:

```typescript
// Available models (configured in aiModelRouter.ts)
const models = [
  // Groq models
  'llama-3.1-405b-reasoning',
  'llama-3.1-70b-versatile',
  'llama-3.1-8b-instant',
  'mixtral-8x7b-32768',
  'gemma2-9b-it',
  
  // OpenRouter models
  'anthropic/claude-3.5-sonnet',
  'anthropic/claude-3-haiku',
  'google/gemini-pro-1.5',
  'meta-llama/llama-3.1-405b-instruct',
  'mistralai/mixtral-8x22b-instruct',
  
  // OpenAI models
  'gpt-4o',
  'gpt-4o-mini',
  'gpt-4-turbo',
  'gpt-3.5-turbo',
  'text-embedding-3-small'
];
```

### Prompt Templates

Customize prompts for different use cases:

```typescript
import { PromptTemplateManager } from './lib/services/promptTemplates';

const templateManager = new PromptTemplateManager();

// Set custom template
templateManager.setTemplate('custom_chat', {
  system: 'You are a helpful financial advisor...',
  user: 'User question: {{question}}\nContext: {{context}}',
  variables: ['question', 'context'],
  maxTokens: 1000,
  temperature: 0.7
});
```

### Rate Limiting

Configure rate limits per provider:

```typescript
import { RateLimiter } from './lib/services/rateLimiter';

const rateLimiter = new RateLimiter({
  groq: {
    requestsPerMinute: 30,
    tokensPerMinute: 50000,
    requestsPerDay: 14400,
    tokensPerDay: 2000000
  },
  openrouter: {
    requestsPerMinute: 20,
    tokensPerMinute: 40000,
    requestsPerDay: 10000,
    tokensPerDay: 1000000
  }
});
```

## 📊 Monitoring & Analytics

### Token Usage Tracking

```typescript
import { TokenTracker } from './lib/services/tokenTracker';

const tracker = new TokenTracker();

// Get usage statistics
const stats = tracker.getUsageStats('daily');
console.log('Daily token usage:', stats.totalTokens);
console.log('Daily cost:', stats.totalCost);

// Get cost breakdown by provider
const costs = tracker.getCostBreakdown('monthly');
console.log('Monthly costs by provider:', costs);

// Check if approaching limits
const alerts = tracker.getAlerts();
if (alerts.length > 0) {
  console.warn('Usage alerts:', alerts);
}
```

### Health Monitoring

```typescript
// Comprehensive health check
const health = await runAIServiceHealthCheck();

if (health.status === 'healthy') {
  console.log('✅ All systems operational');
} else if (health.status === 'degraded') {
  console.warn('⚠️ Some providers experiencing issues');
  console.log('Issues:', health.issues);
} else {
  console.error('❌ Service unavailable');
  console.log('Critical issues:', health.issues);
}
```

## 🧪 Testing

### Run Test Suite

```typescript
import { AIServiceTestSuite } from './lib/services/aiServiceTests';

const testSuite = new AIServiceTestSuite();

// Run all tests
const results = await testSuite.runAllTests();
console.log('Test results:', results);

// Run specific test categories
const providerTests = await testSuite.runProviderTests();
const performanceTests = await testSuite.runPerformanceTests();
```

### Example Test Output

```json
{
  "summary": {
    "total": 45,
    "passed": 43,
    "failed": 2,
    "skipped": 0,
    "duration": 12.5
  },
  "categories": {
    "configuration": { "passed": 8, "failed": 0 },
    "providers": { "passed": 12, "failed": 1 },
    "modelRouter": { "passed": 6, "failed": 0 },
    "promptTemplates": { "passed": 5, "failed": 0 },
    "tokenTracking": { "passed": 4, "failed": 0 },
    "rateLimiting": { "passed": 3, "failed": 1 },
    "integration": { "passed": 3, "failed": 0 },
    "performance": { "passed": 2, "failed": 0 }
  }
}
```

## 🔒 Security & Best Practices

### API Key Management
- Store API keys in environment variables
- Never commit API keys to version control
- Use different keys for development and production
- Regularly rotate API keys

### Rate Limiting
- Configure appropriate rate limits for each provider
- Monitor usage to avoid hitting API limits
- Implement exponential backoff for retries
- Use circuit breakers to prevent cascading failures

### Error Handling
- Always implement fallback mechanisms
- Log errors for monitoring and debugging
- Provide meaningful error messages to users
- Handle network timeouts gracefully

### Cost Management
- Set daily/monthly spending limits
- Monitor token usage regularly
- Use cost-effective models for appropriate tasks
- Implement usage alerts and notifications

## 🚨 Troubleshooting

### Common Issues

#### 1. API Key Errors
```
Error: Invalid API key for provider 'groq'
```
**Solution**: Check that your API keys are correctly set in environment variables.

#### 2. Rate Limit Exceeded
```
Error: Rate limit exceeded for provider 'openrouter'
```
**Solution**: The service will automatically retry with exponential backoff. Consider upgrading your API plan or adjusting rate limits.

#### 3. Model Not Available
```
Error: Model 'gpt-4o' not available
```
**Solution**: The model router will automatically fallback to available models. Check provider status and model availability.

#### 4. Network Timeouts
```
Error: Request timeout after 30000ms
```
**Solution**: The service implements automatic retries. Check your network connection and provider status.

### Debug Mode

Enable debug logging:

```typescript
// Set environment variable
process.env.AI_SERVICE_DEBUG = 'true';

// Or enable programmatically
import { aiService } from './lib/services/aiService';
aiService.setDebugMode(true);
```

## 📈 Performance Optimization

### Model Selection
- Use faster models (e.g., `llama-3.1-8b-instant`) for simple tasks
- Use more capable models (e.g., `gpt-4o`) for complex analysis
- Leverage the model router's automatic selection

### Caching
- Implement response caching for repeated queries
- Cache embeddings for frequently used content
- Use conversation context efficiently

### Batch Processing
- Use batch embedding generation for multiple texts
- Process multiple requests concurrently when possible
- Implement request queuing for high-volume scenarios

## 🔄 Migration from Legacy Service

The new AI service maintains backward compatibility with the legacy `aiService.ts`:

```typescript
// Legacy usage (still works)
import { generateRAGResponse } from './lib/services/aiService';
const response = await generateRAGResponse(request);

// New usage (recommended)
import { generateNewRAGResponse } from './lib/services/aiService';
const response = await generateNewRAGResponse(query, context, options);

// Enhanced service (best)
import { enhancedAIService } from './lib/services/aiService';
const response = await enhancedAIService.generateRAGResponse(query, context, options);
```

## 📚 API Reference

For detailed API documentation, see the TypeScript interfaces in `lib/types.ts` and individual service files.

## 🤝 Contributing

1. Follow the existing code style and patterns
2. Add comprehensive tests for new features
3. Update documentation for any API changes
4. Ensure backward compatibility when possible
5. Test with all supported AI providers

## 📄 License

This AI service integration is part of the Brokeranalysis platform and follows the project's licensing terms.
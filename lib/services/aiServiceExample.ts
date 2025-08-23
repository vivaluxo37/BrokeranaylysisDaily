/**
 * AI Service Integration Example
 * 
 * This file demonstrates how to use the new AI service integration
 * alongside legacy functions for various use cases in the Brokeranalysis platform.
 */

import {
  enhancedAIService,
  generateRAGResponse,
  generateRecommendationResponse,
  generateEmbedding,
  generateEmbeddingsBatch,
  testAIServices,
  generateConversationId,
  generateNewChatResponse,
  generateNewBrokerRecommendation,
  generateNewSummary,
  generateNewRAGResponse,
  generateBrokerAnalysis,
  generateMarketAnalysis,
  generateEducationalContent,
  generateSEOContent,
  createConversation,
  getServiceMetrics,
  runAIServiceHealthCheck,
  initializeAIService,
} from './aiService';

import { AIProvider, PromptTemplate } from '../types';

/**
 * Example: Initialize the AI service
 */
export async function initializeAIServiceExample() {
  try {
    console.log('Initializing AI service...');
    await initializeAIService();
    console.log('AI service initialized successfully');
    
    // Run health check
    const healthCheck = await runAIServiceHealthCheck();
    console.log('Health check results:', healthCheck);
    
    return true;
  } catch (error) {
    console.error('Failed to initialize AI service:', error);
    return false;
  }
}

/**
 * Example: Generate chat responses for customer support
 */
export async function chatSupportExample() {
  try {
    const conversationId = generateConversationId();
    
    // Create a new conversation
    const conversation = await createConversation({
      userId: 'user123',
      type: 'support',
      metadata: {
        source: 'website_chat',
        userAgent: 'Mozilla/5.0...',
      },
    });
    
    // Generate chat response using new service
    const response = await generateNewChatResponse(
      'What are the best forex brokers for beginners?',
      {
        conversationId: conversation.id,
        context: 'Customer is asking about beginner-friendly forex brokers',
        userPreferences: {
          experience: 'beginner',
          tradingStyle: 'conservative',
          budget: 'low',
        },
      }
    );
    
    console.log('Chat response:', response);
    return response;
  } catch (error) {
    console.error('Chat support example failed:', error);
    throw error;
  }
}

/**
 * Example: Generate broker recommendations
 */
export async function brokerRecommendationExample() {
  try {
    const brokerData = [
      {
        name: 'IG Markets',
        regulation: ['FCA', 'ASIC'],
        minDeposit: 250,
        spreads: 'Variable from 0.6 pips',
        platforms: ['MetaTrader 4', 'ProRealTime', 'IG Trading Platform'],
        trustScore: 9.2,
      },
      {
        name: 'XM',
        regulation: ['CySEC', 'ASIC'],
        minDeposit: 5,
        spreads: 'Variable from 1.0 pips',
        platforms: ['MetaTrader 4', 'MetaTrader 5'],
        trustScore: 8.8,
      },
    ];
    
    const userPreferences = {
      experience: 'intermediate',
      tradingStyle: 'scalping',
      budget: 'medium',
      preferredPlatform: 'MetaTrader 4',
      regulationImportance: 'high',
    };
    
    // Using new service
    const newRecommendation = await generateNewBrokerRecommendation(
      'Which broker would be best for scalping EUR/USD?',
      brokerData,
      userPreferences
    );
    
    // Using legacy service for comparison
    const legacyRecommendation = await generateRecommendationResponse({
      query: 'Which broker would be best for scalping EUR/USD?',
      brokerData,
      userPreferences,
    });
    
    console.log('New service recommendation:', newRecommendation);
    console.log('Legacy service recommendation:', legacyRecommendation);
    
    return { newRecommendation, legacyRecommendation };
  } catch (error) {
    console.error('Broker recommendation example failed:', error);
    throw error;
  }
}

/**
 * Example: Generate RAG responses for knowledge base queries
 */
export async function ragResponseExample() {
  try {
    const context = [
      'Forex trading involves the exchange of currencies in the foreign exchange market.',
      'The forex market is the largest financial market in the world with daily trading volume exceeding $6 trillion.',
      'Major currency pairs include EUR/USD, GBP/USD, USD/JPY, and USD/CHF.',
      'Leverage in forex trading can amplify both profits and losses.',
    ];
    
    const query = 'What is forex trading and what are the risks involved?';
    
    // Using new service
    const newRAGResponse = await generateNewRAGResponse(
      query,
      context,
      {
        conversationId: generateConversationId(),
        maxTokens: 500,
        temperature: 0.7,
      }
    );
    
    // Using legacy service for comparison
    const legacyRAGResponse = await generateRAGResponse({
      query,
      context,
      conversationId: generateConversationId(),
    });
    
    console.log('New RAG response:', newRAGResponse);
    console.log('Legacy RAG response:', legacyRAGResponse);
    
    return { newRAGResponse, legacyRAGResponse };
  } catch (error) {
    console.error('RAG response example failed:', error);
    throw error;
  }
}

/**
 * Example: Generate embeddings for semantic search
 */
export async function embeddingExample() {
  try {
    const texts = [
      'Best forex brokers for beginners',
      'MetaTrader 4 vs MetaTrader 5 comparison',
      'How to choose a regulated forex broker',
      'Forex trading strategies for scalping',
      'Understanding forex spreads and commissions',
    ];
    
    // Generate single embedding
    const singleEmbedding = await generateEmbedding(texts[0]);
    console.log('Single embedding dimensions:', singleEmbedding.length);
    
    // Generate batch embeddings
    const batchEmbeddings = await generateEmbeddingsBatch(texts);
    console.log('Batch embeddings count:', batchEmbeddings.length);
    
    return { singleEmbedding, batchEmbeddings };
  } catch (error) {
    console.error('Embedding example failed:', error);
    throw error;
  }
}

/**
 * Example: Generate broker analysis content
 */
export async function brokerAnalysisExample() {
  try {
    const brokerData = {
      name: 'IG Markets',
      founded: 1974,
      headquarters: 'London, UK',
      regulation: ['FCA', 'ASIC', 'MAS'],
      tradingPlatforms: ['MetaTrader 4', 'ProRealTime', 'IG Trading Platform'],
      instruments: ['Forex', 'CFDs', 'Spread Betting', 'Options'],
      minDeposit: 250,
      maxLeverage: '30:1 (EU), 500:1 (Non-EU)',
      spreads: 'Variable from 0.6 pips',
      commissions: 'No commission on forex',
      trustScore: 9.2,
      pros: ['Strong regulation', 'Wide range of instruments', 'Advanced platforms'],
      cons: ['Higher minimum deposit', 'Complex fee structure'],
    };
    
    const analysis = await generateBrokerAnalysis(
      'IG Markets',
      brokerData,
      {
        focusAreas: ['regulation', 'trading_costs', 'platforms'],
        targetAudience: 'intermediate_traders',
        includeComparison: true,
      }
    );
    
    console.log('Broker analysis:', analysis);
    return analysis;
  } catch (error) {
    console.error('Broker analysis example failed:', error);
    throw error;
  }
}

/**
 * Example: Generate market analysis content
 */
export async function marketAnalysisExample() {
  try {
    const marketData = {
      pair: 'EUR/USD',
      currentPrice: 1.0850,
      dailyChange: 0.0025,
      dailyChangePercent: 0.23,
      volume: 1250000,
      high24h: 1.0875,
      low24h: 1.0820,
      technicalIndicators: {
        rsi: 65.2,
        macd: 'bullish',
        movingAverages: {
          sma20: 1.0835,
          sma50: 1.0815,
          sma200: 1.0780,
        },
      },
      fundamentalFactors: [
        'ECB interest rate decision pending',
        'US inflation data released',
        'Geopolitical tensions affecting USD',
      ],
    };
    
    const analysis = await generateMarketAnalysis(
      'EUR/USD Daily Analysis',
      marketData,
      {
        analysisType: 'daily',
        includeForecasts: true,
        targetAudience: 'retail_traders',
      }
    );
    
    console.log('Market analysis:', analysis);
    return analysis;
  } catch (error) {
    console.error('Market analysis example failed:', error);
    throw error;
  }
}

/**
 * Example: Generate educational content
 */
export async function educationalContentExample() {
  try {
    const content = await generateEducationalContent(
      'Understanding Forex Spreads',
      {
        topic: 'forex_basics',
        difficulty: 'beginner',
        format: 'article',
        wordCount: 800,
        includeExamples: true,
      }
    );
    
    console.log('Educational content:', content);
    return content;
  } catch (error) {
    console.error('Educational content example failed:', error);
    throw error;
  }
}

/**
 * Example: Generate SEO-optimized content
 */
export async function seoContentExample() {
  try {
    const content = await generateSEOContent(
      'Best Forex Brokers 2024',
      {
        targetKeywords: ['best forex brokers', 'forex trading platforms', 'regulated brokers'],
        contentType: 'comparison_article',
        wordCount: 2000,
        includeSchema: true,
        targetAudience: 'forex_traders',
      }
    );
    
    console.log('SEO content:', content);
    return content;
  } catch (error) {
    console.error('SEO content example failed:', error);
    throw error;
  }
}

/**
 * Example: Monitor service metrics and performance
 */
export async function monitoringExample() {
  try {
    // Get service metrics
    const metrics = await getServiceMetrics();
    console.log('Service metrics:', metrics);
    
    // Test all AI services
    const testResults = await testAIServices();
    console.log('Service test results:', testResults);
    
    // Run comprehensive health check
    const healthCheck = await runAIServiceHealthCheck();
    console.log('Health check:', healthCheck);
    
    return { metrics, testResults, healthCheck };
  } catch (error) {
    console.error('Monitoring example failed:', error);
    throw error;
  }
}

/**
 * Example: Run all examples in sequence
 */
export async function runAllExamples() {
  console.log('🚀 Starting AI Service Integration Examples...');
  
  try {
    // Initialize service
    await initializeAIServiceExample();
    
    // Run examples
    console.log('\n📞 Running chat support example...');
    await chatSupportExample();
    
    console.log('\n🏦 Running broker recommendation example...');
    await brokerRecommendationExample();
    
    console.log('\n🔍 Running RAG response example...');
    await ragResponseExample();
    
    console.log('\n🧮 Running embedding example...');
    await embeddingExample();
    
    console.log('\n📊 Running broker analysis example...');
    await brokerAnalysisExample();
    
    console.log('\n📈 Running market analysis example...');
    await marketAnalysisExample();
    
    console.log('\n📚 Running educational content example...');
    await educationalContentExample();
    
    console.log('\n🔍 Running SEO content example...');
    await seoContentExample();
    
    console.log('\n📊 Running monitoring example...');
    await monitoringExample();
    
    console.log('\n✅ All examples completed successfully!');
  } catch (error) {
    console.error('❌ Examples failed:', error);
    throw error;
  }
}

// Export enhanced AI service for easy access
export { enhancedAIService };

// Export individual functions for specific use cases
export {
  generateRAGResponse,
  generateRecommendationResponse,
  generateEmbedding,
  generateEmbeddingsBatch,
  testAIServices,
  generateConversationId,
  generateNewChatResponse,
  generateNewBrokerRecommendation,
  generateNewSummary,
  generateNewRAGResponse,
  generateBrokerAnalysis,
  generateMarketAnalysis,
  generateEducationalContent,
  generateSEOContent,
  createConversation,
  getServiceMetrics,
  runAIServiceHealthCheck,
};
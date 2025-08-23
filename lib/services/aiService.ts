import OpenAI from 'openai';
import Groq from 'groq-sdk';
import { 
  aiService, 
  initializeAIService,
  generateChatResponse,
  generateBrokerRecommendation,
  generateSummary,
  generateRAGResponse as generateNewRAGResponse,
  generateBrokerAnalysis,
  generateMarketAnalysis,
  generateEducationalContent,
  generateSEOContent,
  generateEmbeddings,
  createConversation,
  getServiceMetrics,
  runAIServiceHealthCheck,
  AIResponse
} from './aiServiceIntegration';
import { AIProvider } from '../types';

// API Keys
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Initialize clients (legacy support)
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const groq = new Groq({
  apiKey: GROQ_API_KEY,
});

// OpenRouter client (using OpenAI SDK with custom base URL)
const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "https://brokeranalysis.com",
    "X-Title": "Brokeranalysis AI Service",
  },
});

// Groq client for fast inference
const GROQ_BASE_URL = 'https://api.groq.com/openai/v1';

// OpenRouter for model diversity
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

// Initialize the new AI service integration
let isNewServiceInitialized = false;

async function ensureNewServiceInitialized() {
  if (!isNewServiceInitialized) {
    try {
      await initializeAIService();
      isNewServiceInitialized = true;
      console.log('✅ New AI Service Integration initialized');
    } catch (error) {
      console.warn('⚠️ New AI Service Integration failed to initialize, falling back to legacy service:', error.message);
    }
  }
}

interface AIResponse {
  content: string;
  model: string;
  responseTime: number;
  conversationId?: string;
}

interface RAGRequest {
  question: string;
  context: string;
  conversationId?: string;
}

interface RecommendationRequest {
  userPreferences: any;
  question: string;
  recommendedBrokers: any[];
  searchQuery: string;
}

/**
 * Generate embeddings using new AI service integration with legacy fallback
 * This provides 1536-dimensional embeddings optimized for semantic search
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    // Try new AI service integration first
    await ensureNewServiceInitialized();
    
    if (isNewServiceInitialized) {
      const embeddings = await generateEmbeddings([text], AIProvider.OPENAI);
      return embeddings[0];
    }
  } catch (error) {
    console.warn('New AI service embedding failed, falling back to legacy:', error.message);
  }

  // Legacy fallback implementation
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text.replace(/\n/g, ' ').trim(),
      encoding_format: 'float'
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw new Error('Failed to generate embedding');
  }
}

/**
 * Generate embeddings in batch for multiple texts using new AI service integration with legacy fallback
 */
export async function generateEmbeddingsBatch(texts: string[]): Promise<number[][]> {
  try {
    // Try new AI service integration first
    await ensureNewServiceInitialized();
    
    if (isNewServiceInitialized) {
      return await generateEmbeddings(texts, AIProvider.OPENAI);
    }
  } catch (error) {
    console.warn('New AI service embeddings batch failed, falling back to legacy:', error.message);
  }

  // Legacy fallback implementation
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: texts.map(text => text.replace(/\n/g, ' ').trim()),
      encoding_format: 'float'
    });

    return response.data.map(item => item.embedding);
  } catch (error) {
    console.error('Error generating batch embeddings:', error);
    throw new Error('Failed to generate batch embeddings');
  }
}

/**
 * Generate RAG response using new AI service integration with legacy fallback
 */
export async function generateRAGResponse(request: RAGRequest): Promise<AIResponse> {
  const startTime = Date.now();
  
  try {
    // Try new AI service integration first
    await ensureNewServiceInitialized();
    
    if (isNewServiceInitialized) {
      const response = await generateNewRAGResponse(
        request.question,
        request.context,
        { conversationId: request.conversationId }
      );
      
      // Convert to legacy format
      return {
        content: response.content,
        model: response.model,
        responseTime: Date.now() - startTime,
        conversationId: request.conversationId || generateConversationId()
      };
    }
  } catch (error) {
    console.warn('New AI service RAG failed, falling back to legacy:', error.message);
  }

  // Legacy fallback implementation
  try {
    const systemPrompt = `You are an expert financial advisor and broker analyst for Brokeranalysis.com. 
You help traders and investors find the best brokers and trading platforms based on their needs.

Key guidelines:
- Provide accurate, helpful, and unbiased information
- Always cite sources when referencing specific broker information
- Be transparent about limitations and risks
- Focus on factual analysis rather than promotional content
- Include relevant regulatory and safety considerations
- Suggest multiple options when appropriate

Context from our database:
${request.context}

Please provide a comprehensive, helpful response based on this context.`;

    const response = await fetch(`${GROQ_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: request.question }
        ],
        temperature: 0.7,
        max_tokens: 1000,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data = await response.json();
    const responseTime = Date.now() - startTime;

    return {
      content: data.choices[0].message.content,
      model: 'llama-3.1-70b-versatile',
      responseTime,
      conversationId: request.conversationId || generateConversationId()
    };

  } catch (error) {
    console.error('Error generating RAG response:', error);
    
    // Fallback to OpenRouter if Groq fails
    return await generateRAGResponseFallback(request, startTime);
  }
}

/**
 * Fallback RAG response using OpenRouter
 */
async function generateRAGResponseFallback(request: RAGRequest, startTime: number): Promise<AIResponse> {
  try {
    const systemPrompt = `You are an expert financial advisor and broker analyst for Brokeranalysis.com.
Provide accurate, helpful broker recommendations and trading insights.

Context: ${request.context}`;

    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://brokeranalysis.com',
        'X-Title': 'Brokeranalysis RAG System'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-haiku',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: request.question }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    const data = await response.json();
    const responseTime = Date.now() - startTime;

    return {
      content: data.choices[0].message.content,
      model: 'claude-3-haiku',
      responseTime,
      conversationId: request.conversationId || generateConversationId()
    };

  } catch (error) {
    console.error('Error in fallback RAG response:', error);
    throw new Error('Failed to generate AI response');
  }
}

/**
 * Generate broker recommendation response using new AI service integration with legacy fallback
 */
export async function generateRecommendationResponse(request: RecommendationRequest): Promise<AIResponse> {
  const startTime = Date.now();
  
  try {
    // Try new AI service integration first
    await ensureNewServiceInitialized();
    
    if (isNewServiceInitialized) {
      const response = await generateBrokerRecommendation(
        request.question,
        request.recommendedBrokers,
        request.userPreferences
      );
      
      // Convert to legacy format
      return {
        content: response.content,
        model: response.model,
        responseTime: Date.now() - startTime
      };
    }
  } catch (error) {
    console.warn('New AI service recommendation failed, falling back to legacy:', error.message);
  }

  // Legacy fallback implementation
  try {
    const systemPrompt = `You are an expert broker analyst for Brokeranalysis.com.
Analyze user preferences and explain why the recommended brokers are suitable.

User Preferences: ${JSON.stringify(request.userPreferences, null, 2)}
User Question: ${request.question}
Search Query: ${request.searchQuery}

Recommended Brokers:
${request.recommendedBrokers.map(broker => 
  `- ${broker.name}: Trust Score ${broker.trust_score}/10, Rating ${broker.overall_rating}/5
    Pros: ${broker.pros?.join(', ') || 'N/A'}
    Best For: ${broker.best_for?.join(', ') || 'N/A'}`
).join('\n')}

Provide a clear explanation of why these brokers match the user's needs.`;

    const response = await fetch(`${GROQ_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: 'Please explain these broker recommendations.' }
        ],
        temperature: 0.7,
        max_tokens: 800
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data = await response.json();
    const responseTime = Date.now() - startTime;

    return {
      content: data.choices[0].message.content,
      model: 'llama-3.1-70b-versatile',
      responseTime
    };

  } catch (error) {
    console.error('Error generating recommendation response:', error);
    
    // Simple fallback response
    return {
      content: `Based on your preferences, I've found ${request.recommendedBrokers.length} suitable brokers. These brokers match your criteria and have strong trust scores and ratings. Please review each broker's details to make an informed decision.`,
      model: 'fallback',
      responseTime: Date.now() - startTime
    };
  }
}

/**
 * Generate a unique conversation ID
 */
function generateConversationId(): string {
  return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Test AI service connectivity using new AI service integration with legacy fallback
 */
export async function testAIServices(): Promise<{
  groq: boolean;
  openrouter: boolean;
  openai: boolean;
  newService?: any;
}> {
  const results = {
    groq: false,
    openrouter: false,
    openai: false,
    newService: undefined as any,
  };

  // Test new AI service integration first
  try {
    await ensureNewServiceInitialized();
    
    if (isNewServiceInitialized) {
      const healthCheck = await runAIServiceHealthCheck();
      results.newService = healthCheck;
      
      // If new service is healthy, return its results
      if (healthCheck.status === 'healthy' || healthCheck.status === 'degraded') {
        return {
          groq: healthCheck.details.providers?.groq || false,
          openrouter: healthCheck.details.providers?.openrouter || false,
          openai: healthCheck.details.providers?.openai || false,
          newService: healthCheck,
        };
      }
    }
  } catch (error) {
    console.warn('New AI service test failed, falling back to legacy tests:', error.message);
  }

  // Legacy fallback tests
  // Test Groq
  try {
    const response = await fetch(`${GROQ_BASE_URL}/models`, {
      headers: { 'Authorization': `Bearer ${GROQ_API_KEY}` }
    });
    results.groq = response.ok;
  } catch (error) {
    console.error('Groq test failed:', error);
  }

  // Test OpenRouter
  try {
    const response = await fetch(`${OPENROUTER_BASE_URL}/models`, {
      headers: { 'Authorization': `Bearer ${OPENROUTER_API_KEY}` }
    });
    results.openrouter = response.ok;
  } catch (error) {
    console.error('OpenRouter test failed:', error);
  }

  // Test OpenAI
  try {
    await openai.models.list();
    results.openai = true;
  } catch (error) {
    console.error('OpenAI test failed:', error);
  }

  return results;
}
import OpenAI from 'openai';

// Initialize OpenAI client for embeddings
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Groq client for fast inference
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_BASE_URL = 'https://api.groq.com/openai/v1';

// OpenRouter for model diversity
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

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
 * Generate embeddings using OpenAI's text-embedding-3-small model
 * This provides 1536-dimensional embeddings optimized for semantic search
 */
export async function generateEmbedding(text: string): Promise<number[]> {
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
 * Generate embeddings in batch for multiple texts
 */
export async function generateEmbeddingsBatch(texts: string[]): Promise<number[][]> {
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
 * Generate RAG response using Groq for fast inference
 */
export async function generateRAGResponse(request: RAGRequest): Promise<AIResponse> {
  const startTime = Date.now();
  
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
 * Generate broker recommendation response
 */
export async function generateRecommendationResponse(request: RecommendationRequest): Promise<AIResponse> {
  const startTime = Date.now();
  
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
 * Test AI service connectivity
 */
export async function testAIServices(): Promise<{
  groq: boolean;
  openrouter: boolean;
  openai: boolean;
}> {
  const results = {
    groq: false,
    openrouter: false,
    openai: false
  };

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
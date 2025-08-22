import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { aiService } from '@/lib/services/aiService';
import { vectorService } from '@/lib/services/vectorService';

export async function POST(request: NextRequest) {
  try {
    const { message, conversationId } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    // Generate embedding for the user's query
    const queryEmbedding = await aiService.generateEmbedding(message);
    
    // Search for relevant documents and brokers
    const [documents, brokers] = await Promise.all([
      vectorService.searchSimilarDocuments(queryEmbedding, {
        threshold: 0.7,
        limit: 5
      }),
      vectorService.searchSimilarBrokers(queryEmbedding, {
        threshold: 0.7,
        limit: 3
      })
    ]);

    // Combine and format context
    const context = [
      ...documents.map(doc => ({
        type: 'document',
        title: doc.title,
        content: doc.content,
        url: doc.url,
        similarity: doc.similarity
      })),
      ...brokers.map(broker => ({
        type: 'broker',
        title: broker.name,
        content: `${broker.name} - Trust Score: ${broker.trust_score}/10, Rating: ${broker.overall_rating}/5, Regulation: ${broker.regulation?.join(', ') || 'N/A'}`,
        url: `/brokers/${broker.slug}`,
        similarity: broker.similarity
      }))
    ];

    // Generate AI response using RAG
    const aiResponse = await aiService.generateRAGResponse(message, context);

    // Prepare sources for the response
    const sources = context.slice(0, 5).map((item, index) => ({
      id: `source-${index}`,
      title: item.title,
      url: item.url,
      similarity: Math.round(item.similarity * 100) / 100
    }));

    // Log the interaction
    const newConversationId = conversationId || aiService.generateConversationId();
    
    try {
      await supabase.from('ai_usage_logs').insert({
        conversation_id: newConversationId,
        user_message: message,
        ai_response: aiResponse.content,
        model_used: aiResponse.model,
        sources_count: sources.length,
        response_time_ms: Date.now() - Date.now(), // This would be calculated properly in production
        metadata: {
          sources: sources,
          context_items: context.length
        }
      });
    } catch (logError) {
      console.error('Failed to log AI interaction:', logError);
      // Don't fail the request if logging fails
    }

    return NextResponse.json({
      response: aiResponse.content,
      sources,
      model: aiResponse.model,
      conversationId: newConversationId
    });

  } catch (error) {
    console.error('Error in /api/ask:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to process your request. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  try {
    // Test AI services connectivity
    const healthCheck = await aiService.testAIServices();
    
    return NextResponse.json({
      status: 'healthy',
      services: healthCheck,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
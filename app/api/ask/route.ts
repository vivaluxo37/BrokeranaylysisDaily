import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import * as aiService from '@/lib/services/aiService';
import * as vectorService from '@/lib/services/vectorService';
import { contextService, UserContext } from '@/lib/services/contextService';
import { promptTemplateService } from '@/lib/services/promptTemplateService';
import { responseFormattingService } from '@/lib/services/responseFormattingService';
import { monitoringService } from '@/lib/services/monitoringService';

interface EnhancedRAGRequest {
  message: string;
  conversationId?: string;
  userContext?: UserContext;
  options?: {
    max_sources?: number;
    include_confidence?: boolean;
    response_format?: 'standard' | 'detailed' | 'concise';
  };
}

interface EnhancedRAGResponse {
  response: string;
  formatted_response?: {
    content: string;
    structure: {
      sections: Array<{
        title: string;
        content: string;
        citations: number[];
      }>;
      summary?: string;
      recommendations?: string[];
      warnings?: string[];
    };
    quality_metrics: {
      readability_score: number;
      citation_count: number;
      section_count: number;
      word_count: number;
      has_recommendations: boolean;
      has_warnings: boolean;
    };
    seo_metadata?: {
      title: string;
      description: string;
      keywords: string[];
    };
  };
  sources: Array<{
    id: string;
    title: string;
    url?: string;
    type: 'document' | 'broker';
    similarity: number;
    relevance_score?: number;
    excerpt: string;
  }>;
  metadata: {
    query_analysis: {
      intent: string;
      confidence: number;
      keywords: string[];
    };
    context_selection: {
      total_available: number;
      selected_count: number;
      diversity_score: number;
      coverage_score: number;
    };
    ai_response: {
      model: string;
      tokens_used?: number;
      response_time_ms: number;
      confidence_score?: number;
      quality_analysis?: {
        intent_match: number;
        completeness: number;
        citation_quality: number;
        structure_quality: number;
        overall_quality: number;
      };
    };
    performance: {
      total_time_ms: number;
      cache_hit: boolean;
      search_time_ms: number;
    };
  };
  conversationId: string;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const performanceTracker = monitoringService.createPerformanceTracker('rag_chat_api');

  let message: string = '';
  let conversationId: string | undefined;
  let userContext: UserContext | undefined;
  let options: any = {};

  try {
    const requestData: EnhancedRAGRequest = await request.json();
    message = requestData.message;
    conversationId = requestData.conversationId;
    userContext = requestData.userContext;
    options = requestData.options || {};

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    const {
      max_sources = 6,
      include_confidence = true,
      response_format = 'standard'
    } = options;

    const include_formatting = response_format !== 'concise';

    // Enhanced context retrieval with intelligent selection
    const contextTracker = monitoringService.createPerformanceTracker('context_retrieval');
    let contextSelection;

    try {
      contextSelection = await contextService.retrieveContext(
        message,
        userContext,
        {
          max_chunks: max_sources + 2, // Get a few extra for better selection
          diversity_threshold: 0.7,
          include_brokers: true,
          include_documents: true
        }
      );
      await contextTracker.success({ chunks_retrieved: contextSelection.chunks.length });
    } catch (error) {
      await contextTracker.error(error as Error);
      throw error;
    }

    // Analyze query intent
    const queryAnalysis = vectorService.analyzeQuery(message);

    // Generate optimized prompt using template service
    const promptTemplate = promptTemplateService.generatePrompt({
      query: message,
      intent: queryAnalysis.intent,
      userContext,
      sources: contextSelection.chunks.map(chunk => ({
        id: chunk.id,
        title: chunk.title,
        content: chunk.content,
        type: chunk.type,
        metadata: chunk.metadata
      })),
      responseFormat: response_format
    });

    // Generate AI response with enhanced context
    const aiResponseStart = Date.now();
    const aiTracker = monitoringService.createPerformanceTracker('ai_response_generation');
    let aiResponse;

    try {
      aiResponse = await aiService.generateRAGResponse({
        question: promptTemplate.userPromptTemplate,
        context: promptTemplate.systemPrompt,
        conversationId
      });
      const aiResponseTime = Date.now() - aiResponseStart;
      await aiTracker.success({
        response_length: aiResponse.content.length,
        model: aiResponse.model
      });
    } catch (error) {
      await aiTracker.error(error as Error);
      throw error;
    }

    const aiResponseTime = Date.now() - aiResponseStart;

    // Prepare enhanced sources with excerpts
    const enhancedSources = contextSelection.chunks.slice(0, max_sources).map((chunk, index) => ({
      id: `source-${index + 1}`,
      title: chunk.title,
      url: chunk.url,
      type: chunk.type,
      similarity: Math.round(chunk.similarity * 100) / 100,
      relevance_score: chunk.relevance_score ? Math.round(chunk.relevance_score * 100) / 100 : undefined,
      excerpt: generateExcerpt(chunk.content, 150)
    }));

    // Format and analyze response
    let formattedResponse;
    let qualityAnalysis;

    if (include_formatting) {
      formattedResponse = responseFormattingService.formatResponse(
        aiResponse.content,
        queryAnalysis.intent,
        enhancedSources,
        message
      );

      qualityAnalysis = responseFormattingService.analyzeResponse(
        aiResponse.content,
        queryAnalysis.intent,
        enhancedSources,
        message
      );
    }

    // Calculate confidence score if requested
    let confidenceScore: number | undefined;
    if (include_confidence) {
      confidenceScore = calculateResponseConfidence(
        contextSelection,
        enhancedSources,
        aiResponse,
        qualityAnalysis
      );
    }

    // Log enhanced interaction and track quality
    const newConversationId = conversationId || 'conv_' + crypto.randomUUID();
    const totalTime = Date.now() - startTime;

    try {
      // Log to existing ai_usage_logs table
      await supabase.from('ai_usage_logs').insert({
        conversation_id: newConversationId,
        user_message: message,
        ai_response: aiResponse.content,
        model_used: aiResponse.model,
        sources_count: enhancedSources.length,
        response_time_ms: aiResponseTime,
        metadata: {
          query_analysis: {
            intent: queryAnalysis.intent,
            confidence: queryAnalysis.confidence,
            keywords: queryAnalysis.keywords
          },
          context_selection: {
            total_available: contextSelection.total_available,
            selected_count: contextSelection.chunks.length,
            diversity_score: contextSelection.diversity_score,
            coverage_score: contextSelection.coverage_score
          },
          prompt_template: {
            max_tokens: promptTemplate.maxTokens,
            temperature: promptTemplate.temperature,
            citation_format: promptTemplate.citationFormat
          },
          user_context: userContext,
          confidence_score: confidenceScore,
          total_time_ms: totalTime
        }
      });

      // Track quality metrics
      if (qualityAnalysis) {
        await monitoringService.trackQuality({
          response_id: newConversationId,
          query: message,
          intent: queryAnalysis.intent,
          quality_score: qualityAnalysis.overall_quality,
          confidence_score: confidenceScore || 0
        });
      }

    } catch (logError) {
      console.error('Failed to log AI interaction:', logError);
      await monitoringService.trackError({
        operation: 'logging',
        error_type: 'LoggingError',
        error_message: logError instanceof Error ? logError.message : String(logError),
        severity: 'medium'
      });
      // Don't fail the request if logging fails
    }

    const response: EnhancedRAGResponse = {
      response: aiResponse.content,
      formatted_response: formattedResponse,
      sources: enhancedSources,
      metadata: {
        query_analysis: {
          intent: queryAnalysis.intent,
          confidence: queryAnalysis.confidence,
          keywords: queryAnalysis.keywords
        },
        context_selection: {
          total_available: contextSelection.total_available,
          selected_count: contextSelection.chunks.length,
          diversity_score: Math.round(contextSelection.diversity_score * 100) / 100,
          coverage_score: Math.round(contextSelection.coverage_score * 100) / 100
        },
        ai_response: {
          model: aiResponse.model,
          response_time_ms: aiResponseTime,
          confidence_score: confidenceScore,
          quality_analysis: qualityAnalysis
        },
        performance: {
          total_time_ms: totalTime,
          cache_hit: false, // This would come from the search service
          search_time_ms: 0 // This would come from the search service
        }
      },
      conversationId: newConversationId
    };

    // Track successful completion
    await performanceTracker.success({
      total_time_ms: totalTime,
      sources_count: enhancedSources.length,
      confidence_score: confidenceScore
    });

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error in /api/ask:', error);

    // Track error
    await performanceTracker.error(error as Error, {
      user_context: userContext,
      request_data: { message: message || '', options }
    });

    const errMessage = (error instanceof Error) ? error.message : String(error);

    // Provide graceful degradation based on error type
    let fallbackResponse = 'Failed to process your request. Please try again.';
    let statusCode = 500;

    if (errMessage.includes('embedding')) {
      fallbackResponse = 'Unable to process your query at the moment. Our search service is temporarily unavailable.';
    } else if (errMessage.includes('ai') || errMessage.includes('model')) {
      fallbackResponse = 'Our AI service is temporarily unavailable. Please try again in a few moments.';
    } else if (errMessage.includes('timeout')) {
      fallbackResponse = 'Your request is taking longer than expected. Please try a simpler query.';
      statusCode = 408;
    }

    return NextResponse.json(
      {
        error: fallbackResponse,
        details: process.env.NODE_ENV === 'development' ? errMessage : undefined,
        error_code: error instanceof Error ? error.constructor.name : 'UnknownError'
      },
      { status: statusCode }
    );
  }
}



/**
 * Generate excerpt from content
 */
function generateExcerpt(content: string, maxLength: number = 150): string {
  if (content.length <= maxLength) return content;

  // Try to break at sentence boundary
  const truncated = content.substring(0, maxLength);
  const lastSentence = truncated.lastIndexOf('.');
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSentence > maxLength * 0.7) {
    return content.substring(0, lastSentence + 1);
  } else if (lastSpace > maxLength * 0.8) {
    return content.substring(0, lastSpace) + '...';
  } else {
    return truncated + '...';
  }
}

/**
 * Calculate response confidence score with quality analysis
 */
function calculateResponseConfidence(
  contextSelection: any,
  sources: any[],
  aiResponse: any,
  qualityAnalysis?: any
): number {
  let confidence = 0.4; // Base confidence

  // Factor 1: Context quality (25%)
  const contextQuality = (contextSelection.diversity_score + contextSelection.coverage_score) / 2;
  confidence += contextQuality * 0.25;

  // Factor 2: Source relevance (20%)
  const avgSimilarity = sources.reduce((sum, s) => sum + s.similarity, 0) / sources.length;
  confidence += avgSimilarity * 0.2;

  // Factor 3: Number of sources (15%)
  const sourceScore = Math.min(sources.length / 5, 1); // Optimal around 5 sources
  confidence += sourceScore * 0.15;

  // Factor 4: Response quality analysis (25%)
  if (qualityAnalysis) {
    const qualityScore = qualityAnalysis.overall_quality;
    confidence += qualityScore * 0.25;
  } else {
    // Fallback: Response length appropriateness
    const responseLength = aiResponse.content.length;
    const lengthScore = responseLength > 100 && responseLength < 2000 ? 1 : 0.7;
    confidence += lengthScore * 0.25;
  }

  // Factor 5: Query intent match (15%)
  if (qualityAnalysis) {
    confidence += qualityAnalysis.intent_match * 0.15;
  } else {
    const intentScore = contextSelection.chunks.length > 0 ? 1 : 0.5;
    confidence += intentScore * 0.15;
  }

  return Math.min(Math.max(confidence, 0), 1); // Clamp between 0 and 1
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
    const errMessage = (error instanceof Error) ? error.message : String(error)
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: errMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
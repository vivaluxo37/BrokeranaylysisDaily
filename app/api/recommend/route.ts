import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateEmbedding, generateRecommendationResponse } from '@/lib/services/aiService';
import { searchSimilarBrokers } from '@/lib/services/vectorService';

interface RecommendationRequest {
  user_preferences: {
    trading_experience?: 'beginner' | 'intermediate' | 'advanced';
    account_size?: 'small' | 'medium' | 'large';
    trading_style?: 'scalping' | 'day_trading' | 'swing_trading' | 'position_trading';
    instruments?: string[];
    regulation_preference?: string[];
    platform_preference?: string[];
    deposit_method?: string[];
    location?: string;
    priority_features?: string[];
  };
  question?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { user_preferences, question }: RecommendationRequest = await request.json();

    if (!user_preferences && !question) {
      return NextResponse.json(
        { error: 'Either user_preferences or question is required' },
        { status: 400 }
      );
    }

    let relevantBrokers = [];
    let searchQuery = '';

    if (question) {
      // If user asked a question, use semantic search
      searchQuery = question;
      const queryEmbedding = await generateEmbedding(question);
      relevantBrokers = await searchSimilarBrokers(queryEmbedding, {
        limit: 10,
        threshold: 0.6
      });
    } else {
      // Use preference-based filtering
      searchQuery = Object.entries(user_preferences)
        .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
        .join('; ');
      
      const queryEmbedding = await generateEmbedding(searchQuery);
      relevantBrokers = await searchSimilarBrokers(queryEmbedding, {
        limit: 10,
        threshold: 0.5
      });
    }

    // Apply additional filtering based on preferences
    let filteredBrokers = relevantBrokers;
    
    if (user_preferences.regulation_preference?.length) {
      filteredBrokers = filteredBrokers.filter(broker => 
        user_preferences.regulation_preference!.some(reg => 
          broker.regulation_info?.some((r: any) => 
            r.regulator?.toLowerCase().includes(reg.toLowerCase())
          )
        )
      );
    }

    if (user_preferences.instruments?.length) {
      filteredBrokers = filteredBrokers.filter(broker => 
        user_preferences.instruments!.some(instrument => 
          broker.instruments_offered?.includes(instrument)
        )
      );
    }

    if (user_preferences.platform_preference?.length) {
      filteredBrokers = filteredBrokers.filter(broker => 
        user_preferences.platform_preference!.some(platform => 
          broker.trading_platforms?.includes(platform)
        )
      );
    }

    // Sort by trust score and overall rating
    filteredBrokers.sort((a, b) => {
      const scoreA = (a.trust_score || 0) * 0.6 + (a.overall_rating || 0) * 0.4;
      const scoreB = (b.trust_score || 0) * 0.6 + (b.overall_rating || 0) * 0.4;
      return scoreB - scoreA;
    });

    // Take top 5 recommendations
    const topRecommendations = filteredBrokers.slice(0, 5);

    // Generate AI explanation for the recommendations
    const aiExplanation = await generateRecommendationResponse({
      userPreferences: user_preferences,
      question: question || '',
      recommendedBrokers: topRecommendations,
      searchQuery
    });

    // Log the recommendation request
    await supabase.from('ai_usage_logs').insert({
      user_message: question || `Preferences: ${searchQuery}`,
      ai_response: aiExplanation.content,
      documents_used: topRecommendations.map(broker => broker.id),
      response_time_ms: aiExplanation.responseTime,
      model_used: aiExplanation.model,
      request_type: 'recommendation',
      created_at: new Date().toISOString()
    });

    return NextResponse.json({
      recommendations: topRecommendations.map(broker => ({
        id: broker.id,
        name: broker.name,
        slug: broker.slug,
        logo_url: broker.logo_url,
        overall_rating: broker.overall_rating,
        trust_score: broker.trust_score,
        minimum_deposit: broker.minimum_deposit,
        regulation_info: broker.regulation_info,
        trading_platforms: broker.trading_platforms,
        pros: broker.pros?.slice(0, 3), // Top 3 pros
        best_for: broker.best_for?.slice(0, 3), // Top 3 use cases
        similarity_score: broker.similarity
      })),
      explanation: aiExplanation.content,
      search_query: searchQuery,
      total_matches: relevantBrokers.length,
      filtered_matches: filteredBrokers.length,
      model_used: aiExplanation.model
    });

  } catch (error) {
    console.error('Recommendation API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint for health check
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    service: 'Broker Recommendation API',
    timestamp: new Date().toISOString()
  });
}
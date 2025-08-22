import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateEmbedding } from '@/lib/services/aiService';
import { searchSimilarDocuments, searchSimilarBrokers } from '@/lib/services/vectorService';

interface SearchRequest {
  query: string;
  type?: 'documents' | 'brokers' | 'all';
  limit?: number;
  threshold?: number;
  filters?: {
    category?: string;
    author?: string;
    broker_id?: string;
    date_range?: {
      start: string;
      end: string;
    };
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const type = searchParams.get('type') as 'documents' | 'brokers' | 'all' || 'all';
  const limit = parseInt(searchParams.get('limit') || '10');
  const threshold = parseFloat(searchParams.get('threshold') || '0.6');

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter "q" is required' },
      { status: 400 }
    );
  }

  try {
    // Generate embedding for the search query
    const queryEmbedding = await generateEmbedding(query);

    let results: any = {};

    if (type === 'documents' || type === 'all') {
      const documents = await searchSimilarDocuments(queryEmbedding, {
        limit,
        threshold
      });
      results.documents = documents;
    }

    if (type === 'brokers' || type === 'all') {
      const brokers = await searchSimilarBrokers(queryEmbedding, {
        limit,
        threshold
      });
      results.brokers = brokers;
    }

    return NextResponse.json({
      query,
      type,
      results,
      total_results: {
        documents: results.documents?.length || 0,
        brokers: results.brokers?.length || 0
      },
      search_params: {
        limit,
        threshold
      }
    });

  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { query, type = 'all', limit = 10, threshold = 0.6, filters }: SearchRequest = await request.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      );
    }

    // Generate embedding for the search query
    const queryEmbedding = await generateEmbedding(query);

    let results: any = {};

    if (type === 'documents' || type === 'all') {
      const documents = await searchSimilarDocuments(queryEmbedding, {
        limit,
        threshold,
        filters
      });
      results.documents = documents;
    }

    if (type === 'brokers' || type === 'all') {
      const brokers = await searchSimilarBrokers(queryEmbedding, {
        limit,
        threshold,
        filters
      });
      results.brokers = brokers;
    }

    // Log the search for analytics
    await supabase.from('ai_usage_logs').insert({
      user_message: query,
      request_type: 'search',
      documents_used: [
        ...(results.documents?.map((doc: any) => doc.id) || []),
        ...(results.brokers?.map((broker: any) => broker.id) || [])
      ],
      created_at: new Date().toISOString()
    });

    return NextResponse.json({
      query,
      type,
      results,
      total_results: {
        documents: results.documents?.length || 0,
        brokers: results.brokers?.length || 0
      },
      search_params: {
        limit,
        threshold,
        filters
      }
    });

  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
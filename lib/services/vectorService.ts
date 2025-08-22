import { supabase } from '@/lib/supabase';

interface SearchOptions {
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

interface DocumentResult {
  id: string;
  title: string;
  content: string;
  url?: string;
  category?: string;
  author?: string;
  created_at: string;
  similarity: number;
}

interface BrokerResult {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  overall_rating?: number;
  trust_score?: number;
  regulation_info?: any;
  trading_platforms?: string[];
  instruments_offered?: string[];
  pros?: string[];
  cons?: string[];
  best_for?: string[];
  minimum_deposit?: number;
  similarity: number;
}

/**
 * Search for similar documents using vector similarity
 * Uses pgvector's cosine similarity with HNSW index for fast retrieval
 */
export async function searchSimilarDocuments(
  queryEmbedding: number[],
  options: SearchOptions = {}
): Promise<DocumentResult[]> {
  const { limit = 10, threshold = 0.6, filters } = options;

  try {
    let query = supabase
      .rpc('search_documents', {
        query_embedding: queryEmbedding,
        match_threshold: threshold,
        match_count: limit
      });

    // Apply filters if provided
    if (filters?.category) {
      query = query.eq('category', filters.category);
    }

    if (filters?.author) {
      query = query.eq('author', filters.author);
    }

    if (filters?.date_range) {
      query = query
        .gte('created_at', filters.date_range.start)
        .lte('created_at', filters.date_range.end);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error searching documents:', error);
      throw new Error('Failed to search documents');
    }

    return data || [];
  } catch (error) {
    console.error('Vector search error:', error);
    throw new Error('Failed to perform vector search');
  }
}

/**
 * Search for similar brokers using vector similarity
 * Searches broker descriptions, features, and metadata
 */
export async function searchSimilarBrokers(
  queryEmbedding: number[],
  options: SearchOptions = {}
): Promise<BrokerResult[]> {
  const { limit = 10, threshold = 0.5, filters } = options;

  try {
    let query = supabase
      .rpc('search_brokers', {
        query_embedding: queryEmbedding,
        match_threshold: threshold,
        match_count: limit
      });

    // Apply filters if provided
    if (filters?.broker_id) {
      query = query.eq('id', filters.broker_id);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error searching brokers:', error);
      throw new Error('Failed to search brokers');
    }

    return data || [];
  } catch (error) {
    console.error('Broker vector search error:', error);
    throw new Error('Failed to perform broker vector search');
  }
}

/**
 * Search across all content types (documents and brokers)
 */
export async function searchAllContent(
  queryEmbedding: number[],
  options: SearchOptions = {}
): Promise<{
  documents: DocumentResult[];
  brokers: BrokerResult[];
}> {
  try {
    const [documents, brokers] = await Promise.all([
      searchSimilarDocuments(queryEmbedding, options),
      searchSimilarBrokers(queryEmbedding, options)
    ]);

    return { documents, brokers };
  } catch (error) {
    console.error('Error searching all content:', error);
    throw new Error('Failed to search all content');
  }
}

/**
 * Get document by ID with its embedding
 */
export async function getDocumentWithEmbedding(documentId: string): Promise<DocumentResult | null> {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single();

    if (error) {
      console.error('Error fetching document:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error getting document with embedding:', error);
    return null;
  }
}

/**
 * Get broker by ID with its embedding
 */
export async function getBrokerWithEmbedding(brokerId: string): Promise<BrokerResult | null> {
  try {
    const { data, error } = await supabase
      .from('brokers')
      .select('*')
      .eq('id', brokerId)
      .single();

    if (error) {
      console.error('Error fetching broker:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error getting broker with embedding:', error);
    return null;
  }
}

/**
 * Store document embedding in the database
 */
export async function storeDocumentEmbedding(
  documentId: string,
  embedding: number[]
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('documents')
      .update({ embedding })
      .eq('id', documentId);

    if (error) {
      console.error('Error storing document embedding:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error storing document embedding:', error);
    return false;
  }
}

/**
 * Store broker embedding in the database
 */
export async function storeBrokerEmbedding(
  brokerId: string,
  embedding: number[]
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('brokers')
      .update({ embedding })
      .eq('id', brokerId);

    if (error) {
      console.error('Error storing broker embedding:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error storing broker embedding:', error);
    return false;
  }
}

/**
 * Batch update embeddings for multiple documents
 */
export async function batchUpdateDocumentEmbeddings(
  updates: Array<{ id: string; embedding: number[] }>
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('documents')
      .upsert(updates, { onConflict: 'id' });

    if (error) {
      console.error('Error batch updating document embeddings:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error batch updating document embeddings:', error);
    return false;
  }
}

/**
 * Batch update embeddings for multiple brokers
 */
export async function batchUpdateBrokerEmbeddings(
  updates: Array<{ id: string; embedding: number[] }>
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('brokers')
      .upsert(updates, { onConflict: 'id' });

    if (error) {
      console.error('Error batch updating broker embeddings:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error batch updating broker embeddings:', error);
    return false;
  }
}

/**
 * Get statistics about vector search performance
 */
export async function getVectorSearchStats(): Promise<{
  total_documents: number;
  total_brokers: number;
  documents_with_embeddings: number;
  brokers_with_embeddings: number;
}> {
  try {
    const [documentsCount, brokersCount, documentsWithEmbeddings, brokersWithEmbeddings] = await Promise.all([
      supabase.from('documents').select('id', { count: 'exact', head: true }),
      supabase.from('brokers').select('id', { count: 'exact', head: true }),
      supabase.from('documents').select('id', { count: 'exact', head: true }).not('embedding', 'is', null),
      supabase.from('brokers').select('id', { count: 'exact', head: true }).not('embedding', 'is', null)
    ]);

    return {
      total_documents: documentsCount.count || 0,
      total_brokers: brokersCount.count || 0,
      documents_with_embeddings: documentsWithEmbeddings.count || 0,
      brokers_with_embeddings: brokersWithEmbeddings.count || 0
    };
  } catch (error) {
    console.error('Error getting vector search stats:', error);
    return {
      total_documents: 0,
      total_brokers: 0,
      documents_with_embeddings: 0,
      brokers_with_embeddings: 0
    };
  }
}
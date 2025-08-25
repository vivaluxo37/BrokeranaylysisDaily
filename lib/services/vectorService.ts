import { supabase } from '@/lib/supabase';

// Simple in-memory cache for search results
interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
}

class SearchCache {
  private cache = new Map<string, CacheEntry>();
  private readonly defaultTTL = 5 * 60 * 1000; // 5 minutes

  set(key: string, data: any, ttl: number = this.defaultTTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  // Clean expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// Global cache instance
const searchCache = new SearchCache();

// Cleanup expired cache entries every 10 minutes
setInterval(() => searchCache.cleanup(), 10 * 60 * 1000);

interface SearchOptions {
  limit?: number;
  threshold?: number;
  filters?: {
    category?: string;
    author?: string;
    broker_id?: string;
    content_type?: string[];
    source_type?: string[];
    date_range?: {
      start: string;
      end: string;
    };
    country?: string;
    regulation?: string;
    min_trust_score?: number;
    min_rating?: number;
  };
  ranking?: {
    boost_recent?: boolean;
    boost_authority?: boolean;
    boost_quality?: boolean;
    recency_weight?: number;
    authority_weight?: number;
    quality_weight?: number;
  };
  include_metadata?: boolean;
}

interface DocumentResult {
  id: string;
  title: string;
  content: string;
  url?: string;
  category?: string;
  author?: string;
  source_type?: string;
  broker_id?: string;
  created_at: string;
  updated_at?: string;
  similarity: number;
  relevance_score?: number;
  metadata?: any;
  chunk_index?: number;
  parent_document_id?: string;
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
  country?: string;
  regulatory_status?: string;
  similarity: number;
  relevance_score?: number;
  metadata?: any;
}

interface SearchResult {
  documents: DocumentResult[];
  brokers: BrokerResult[];
  total_results: number;
  search_time_ms: number;
  query_metadata: {
    query_embedding_generated: boolean;
    filters_applied: string[];
    ranking_applied: boolean;
  };
}

/**
 * Search for similar documents using vector similarity with advanced filtering and ranking
 * Uses pgvector's cosine similarity with HNSW index for fast retrieval
 */
export async function searchSimilarDocuments(
  queryEmbedding: number[],
  options: SearchOptions = {}
): Promise<DocumentResult[]> {
  const {
    limit = 10,
    threshold = 0.6,
    filters,
    ranking,
    include_metadata = false
  } = options;

  try {
    // Use enhanced search function with advanced filtering
    let query = supabase
      .rpc('search_documents_enhanced', {
        query_embedding: queryEmbedding,
        match_threshold: threshold,
        match_count: limit,
        include_metadata: include_metadata
      });

    // Apply content type filters
    if (filters?.source_type && filters.source_type.length > 0) {
      query = query.in('source_type', filters.source_type);
    }

    // Apply category filter
    if (filters?.category) {
      query = query.eq('category', filters.category);
    }

    // Apply author filter
    if (filters?.author) {
      query = query.eq('author', filters.author);
    }

    // Apply broker filter
    if (filters?.broker_id) {
      query = query.eq('broker_id', filters.broker_id);
    }

    // Apply date range filter
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

    let results = data || [];

    // Apply ranking if specified
    if (ranking && results.length > 0) {
      results = applyDocumentRanking(results, ranking);
    }

    return results;
  } catch (error) {
    console.error('Vector search error:', error);
    throw new Error('Failed to perform vector search');
  }
}

/**
 * Search for similar brokers using vector similarity with advanced filtering and ranking
 * Searches broker descriptions, features, and metadata
 */
export async function searchSimilarBrokers(
  queryEmbedding: number[],
  options: SearchOptions = {}
): Promise<BrokerResult[]> {
  const {
    limit = 10,
    threshold = 0.5,
    filters,
    ranking,
    include_metadata = false
  } = options;

  try {
    // Use enhanced search function with advanced filtering
    let query = supabase
      .rpc('search_brokers_enhanced', {
        query_embedding: queryEmbedding,
        match_threshold: threshold,
        match_count: limit,
        include_metadata: include_metadata
      });

    // Apply broker-specific filters
    if (filters?.broker_id) {
      query = query.eq('id', filters.broker_id);
    }

    // Apply country filter
    if (filters?.country) {
      query = query.eq('country', filters.country);
    }

    // Apply regulation filter
    if (filters?.regulation) {
      query = query.ilike('regulatory_status', `%${filters.regulation}%`);
    }

    // Apply minimum trust score filter
    if (filters?.min_trust_score) {
      query = query.gte('trust_score', filters.min_trust_score);
    }

    // Apply minimum rating filter
    if (filters?.min_rating) {
      query = query.gte('overall_rating', filters.min_rating);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error searching brokers:', error);
      throw new Error('Failed to search brokers');
    }

    let results = data || [];

    // Apply ranking if specified
    if (ranking && results.length > 0) {
      results = applyBrokerRanking(results, ranking);
    }

    return results;
  } catch (error) {
    console.error('Broker vector search error:', error);
    throw new Error('Failed to perform broker vector search');
  }
}

/**
 * Apply ranking algorithm to document results
 */
function applyDocumentRanking(
  documents: DocumentResult[],
  ranking: NonNullable<SearchOptions['ranking']>
): DocumentResult[] {
  const {
    boost_recent = true,
    boost_authority = true,
    boost_quality = true,
    recency_weight = 0.2,
    authority_weight = 0.15,
    quality_weight = 0.1
  } = ranking;

  return documents.map(doc => {
    let relevance_score = doc.similarity;

    // Apply recency boost
    if (boost_recent) {
      const daysSinceCreated = (Date.now() - new Date(doc.created_at).getTime()) / (1000 * 60 * 60 * 24);
      const recencyBoost = Math.max(0, 1 - (daysSinceCreated / 365)) * recency_weight;
      relevance_score += recencyBoost;
    }

    // Apply authority boost (based on author or source)
    if (boost_authority && doc.author) {
      const authorityBoost = getAuthorityScore(doc.author) * authority_weight;
      relevance_score += authorityBoost;
    }

    // Apply quality boost (based on content length and structure)
    if (boost_quality) {
      const qualityBoost = getQualityScore(doc) * quality_weight;
      relevance_score += qualityBoost;
    }

    return {
      ...doc,
      relevance_score: Math.min(1, relevance_score) // Cap at 1.0
    };
  }).sort((a, b) => (b.relevance_score || b.similarity) - (a.relevance_score || a.similarity));
}

/**
 * Apply ranking algorithm to broker results
 */
function applyBrokerRanking(
  brokers: BrokerResult[],
  ranking: NonNullable<SearchOptions['ranking']>
): BrokerResult[] {
  const {
    boost_authority = true,
    boost_quality = true,
    authority_weight = 0.2,
    quality_weight = 0.15
  } = ranking;

  return brokers.map(broker => {
    let relevance_score = broker.similarity;

    // Apply authority boost (based on trust score and regulation)
    if (boost_authority && broker.trust_score) {
      const authorityBoost = (broker.trust_score / 100) * authority_weight;
      relevance_score += authorityBoost;
    }

    // Apply quality boost (based on rating and features)
    if (boost_quality && broker.overall_rating) {
      const qualityBoost = (broker.overall_rating / 5) * quality_weight;
      relevance_score += qualityBoost;
    }

    return {
      ...broker,
      relevance_score: Math.min(1, relevance_score) // Cap at 1.0
    };
  }).sort((a, b) => (b.relevance_score || b.similarity) - (a.relevance_score || a.similarity));
}

/**
 * Get authority score for an author
 */
function getAuthorityScore(author: string): number {
  // Simple authority scoring - can be enhanced with a proper authority database
  const authorityMap: Record<string, number> = {
    'admin': 0.9,
    'editor': 0.8,
    'analyst': 0.7,
    'contributor': 0.5
  };

  return authorityMap[author.toLowerCase()] || 0.3;
}

/**
 * Get quality score for a document
 */
function getQualityScore(doc: DocumentResult): number {
  let score = 0.5; // Base score

  // Boost for longer content (indicates comprehensive coverage)
  if (doc.content.length > 1000) score += 0.2;
  if (doc.content.length > 2000) score += 0.1;

  // Boost for structured content (has headings, lists, etc.)
  if (doc.content.includes('#') || doc.content.includes('*') || doc.content.includes('-')) {
    score += 0.1;
  }

  // Boost for having URL (indicates it's a published article)
  if (doc.url) score += 0.1;

  return Math.min(1, score);
}

/**
 * Search across all content types (documents and brokers) with enhanced capabilities
 */
export async function searchAllContent(
  queryEmbedding: number[],
  options: SearchOptions = {}
): Promise<SearchResult> {
  const startTime = Date.now();

  try {
    const [documents, brokers] = await Promise.all([
      searchSimilarDocuments(queryEmbedding, options),
      searchSimilarBrokers(queryEmbedding, options)
    ]);

    const searchTime = Date.now() - startTime;
    const filtersApplied = getAppliedFilters(options.filters);

    return {
      documents,
      brokers,
      total_results: documents.length + brokers.length,
      search_time_ms: searchTime,
      query_metadata: {
        query_embedding_generated: true,
        filters_applied: filtersApplied,
        ranking_applied: !!options.ranking
      }
    };
  } catch (error) {
    console.error('Error searching all content:', error);
    throw new Error('Failed to search all content');
  }
}

/**
 * Get list of applied filters for metadata
 */
function getAppliedFilters(filters?: SearchOptions['filters']): string[] {
  if (!filters) return [];

  const applied: string[] = [];

  if (filters.category) applied.push('category');
  if (filters.author) applied.push('author');
  if (filters.broker_id) applied.push('broker_id');
  if (filters.content_type?.length) applied.push('content_type');
  if (filters.source_type?.length) applied.push('source_type');
  if (filters.date_range) applied.push('date_range');
  if (filters.country) applied.push('country');
  if (filters.regulation) applied.push('regulation');
  if (filters.min_trust_score) applied.push('min_trust_score');
  if (filters.min_rating) applied.push('min_rating');

  return applied;
}

/**
 * Query intent detection for context-aware search
 */
export enum QueryIntent {
  BROKER_COMPARISON = 'broker_comparison',
  BROKER_RECOMMENDATION = 'broker_recommendation',
  TRADING_STRATEGY = 'trading_strategy',
  PLATFORM_FEATURES = 'platform_features',
  REGULATION_INFO = 'regulation_info',
  EDUCATIONAL = 'educational',
  NEWS_UPDATES = 'news_updates',
  GENERAL = 'general'
}

interface QueryAnalysis {
  intent: QueryIntent;
  confidence: number;
  keywords: string[];
  entities: {
    brokers: string[];
    countries: string[];
    instruments: string[];
    platforms: string[];
  };
}

/**
 * Analyze query to detect intent and extract entities
 */
export function analyzeQuery(query: string): QueryAnalysis {
  const lowerQuery = query.toLowerCase();
  const keywords = lowerQuery.split(/\s+/).filter(word => word.length > 2);

  // Intent detection patterns
  const intentPatterns = {
    [QueryIntent.BROKER_COMPARISON]: [
      'compare', 'vs', 'versus', 'difference', 'better', 'best between'
    ],
    [QueryIntent.BROKER_RECOMMENDATION]: [
      'recommend', 'suggest', 'best broker', 'which broker', 'good broker'
    ],
    [QueryIntent.TRADING_STRATEGY]: [
      'strategy', 'trading', 'scalping', 'swing', 'day trading', 'forex strategy'
    ],
    [QueryIntent.PLATFORM_FEATURES]: [
      'platform', 'mt4', 'mt5', 'features', 'tools', 'interface'
    ],
    [QueryIntent.REGULATION_INFO]: [
      'regulation', 'regulated', 'license', 'fca', 'cysec', 'asic', 'safety'
    ],
    [QueryIntent.EDUCATIONAL]: [
      'learn', 'how to', 'tutorial', 'guide', 'beginner', 'education'
    ],
    [QueryIntent.NEWS_UPDATES]: [
      'news', 'update', 'latest', 'recent', 'announcement'
    ]
  };

  // Calculate intent scores
  let bestIntent = QueryIntent.GENERAL;
  let bestScore = 0;

  for (const [intent, patterns] of Object.entries(intentPatterns)) {
    const score = patterns.reduce((acc, pattern) => {
      return acc + (lowerQuery.includes(pattern) ? 1 : 0);
    }, 0) / patterns.length;

    if (score > bestScore) {
      bestScore = score;
      bestIntent = intent as QueryIntent;
    }
  }

  // Entity extraction
  const brokerNames = [
    'ig', 'etoro', 'plus500', 'xtb', 'pepperstone', 'oanda', 'fxpro',
    'avatrade', 'forex.com', 'city index', 'admiral markets'
  ];

  const countries = [
    'uk', 'usa', 'australia', 'cyprus', 'germany', 'france', 'canada'
  ];

  const instruments = [
    'forex', 'stocks', 'indices', 'commodities', 'crypto', 'cfd'
  ];

  const platforms = [
    'mt4', 'mt5', 'ctrader', 'proprietary', 'web trader'
  ];

  const extractEntities = (entities: string[]) =>
    entities.filter(entity => lowerQuery.includes(entity));

  return {
    intent: bestIntent,
    confidence: bestScore,
    keywords,
    entities: {
      brokers: extractEntities(brokerNames),
      countries: extractEntities(countries),
      instruments: extractEntities(instruments),
      platforms: extractEntities(platforms)
    }
  };
}

/**
 * Context-aware search with intent detection and adaptive ranking
 */
export async function searchWithContext(
  query: string,
  queryEmbedding: number[],
  userContext?: {
    country?: string;
    experience_level?: 'beginner' | 'intermediate' | 'advanced';
    trading_style?: string;
    preferred_instruments?: string[];
  },
  options: SearchOptions = {}
): Promise<SearchResult & { query_analysis: QueryAnalysis }> {
  const queryAnalysis = analyzeQuery(query);

  // Adapt search options based on intent
  const adaptedOptions = adaptSearchOptionsForIntent(options, queryAnalysis, userContext);

  // Perform search with adapted options
  const searchResult = await searchAllContent(queryEmbedding, adaptedOptions);

  return {
    ...searchResult,
    query_analysis: queryAnalysis
  };
}

/**
 * Adapt search options based on query intent and user context
 */
function adaptSearchOptionsForIntent(
  options: SearchOptions,
  analysis: QueryAnalysis,
  userContext?: any
): SearchOptions {
  const adapted = { ...options };

  // Adjust ranking weights based on intent
  if (!adapted.ranking) {
    adapted.ranking = {};
  }

  switch (analysis.intent) {
    case QueryIntent.BROKER_COMPARISON:
    case QueryIntent.BROKER_RECOMMENDATION:
      adapted.ranking.boost_authority = true;
      adapted.ranking.authority_weight = 0.3;
      adapted.ranking.boost_quality = true;
      adapted.ranking.quality_weight = 0.2;
      break;

    case QueryIntent.NEWS_UPDATES:
      adapted.ranking.boost_recent = true;
      adapted.ranking.recency_weight = 0.4;
      break;

    case QueryIntent.EDUCATIONAL:
      adapted.ranking.boost_quality = true;
      adapted.ranking.quality_weight = 0.3;
      break;
  }

  // Apply entity-based filters
  if (analysis.entities.countries.length > 0 && userContext?.country) {
    if (!adapted.filters) adapted.filters = {};
    adapted.filters.country = userContext.country;
  }

  // Adjust content type preferences
  if (analysis.intent === QueryIntent.BROKER_COMPARISON ||
      analysis.intent === QueryIntent.BROKER_RECOMMENDATION) {
    if (!adapted.filters) adapted.filters = {};
    adapted.filters.source_type = ['review', 'analysis', 'guide'];
  }

  return adapted;
}

/**
 * Performance monitoring and analytics
 */
interface SearchAnalytics {
  query: string;
  intent: QueryIntent;
  search_time_ms: number;
  results_count: number;
  cache_hit: boolean;
  filters_applied: string[];
  user_context?: any;
  timestamp: Date;
}

/**
 * Log search analytics for performance monitoring
 */
async function logSearchAnalytics(analytics: SearchAnalytics): Promise<void> {
  try {
    await supabase.from('search_analytics').insert({
      query: analytics.query,
      intent: analytics.intent,
      search_time_ms: analytics.search_time_ms,
      results_count: analytics.results_count,
      cache_hit: analytics.cache_hit,
      filters_applied: analytics.filters_applied,
      user_context: analytics.user_context,
      created_at: analytics.timestamp.toISOString()
    });
  } catch (error) {
    console.error('Failed to log search analytics:', error);
    // Don't throw - analytics logging shouldn't break search
  }
}

/**
 * Generate cache key for search results
 */
function generateCacheKey(
  queryEmbedding: number[],
  options: SearchOptions
): string {
  // Create a hash of the embedding (first 10 values) and options
  const embeddingHash = queryEmbedding.slice(0, 10).map(v => v.toFixed(4)).join(',');
  const optionsHash = JSON.stringify({
    limit: options.limit,
    threshold: options.threshold,
    filters: options.filters,
    ranking: options.ranking
  });

  return `search:${Buffer.from(embeddingHash + optionsHash).toString('base64')}`;
}

/**
 * Optimized search with caching and analytics
 */
export async function searchWithOptimizations(
  query: string,
  queryEmbedding: number[],
  options: SearchOptions = {},
  userContext?: any
): Promise<SearchResult & {
  query_analysis: QueryAnalysis;
  performance: {
    cache_hit: boolean;
    search_time_ms: number;
    total_time_ms: number;
  };
}> {
  const startTime = Date.now();
  const cacheKey = generateCacheKey(queryEmbedding, options);

  // Check cache first
  const cachedResult = searchCache.get(cacheKey);
  if (cachedResult) {
    const totalTime = Date.now() - startTime;

    // Log analytics for cache hit
    await logSearchAnalytics({
      query,
      intent: cachedResult.query_analysis.intent,
      search_time_ms: 0, // Cache hit
      results_count: cachedResult.total_results,
      cache_hit: true,
      filters_applied: getAppliedFilters(options.filters),
      user_context: userContext,
      timestamp: new Date()
    });

    return {
      ...cachedResult,
      performance: {
        cache_hit: true,
        search_time_ms: 0,
        total_time_ms: totalTime
      }
    };
  }

  // Perform search with context
  const searchStartTime = Date.now();
  const result = await searchWithContext(query, queryEmbedding, userContext, options);
  const searchTime = Date.now() - searchStartTime;
  const totalTime = Date.now() - startTime;

  // Cache the result
  searchCache.set(cacheKey, result, 5 * 60 * 1000); // 5 minutes TTL

  // Log analytics
  await logSearchAnalytics({
    query,
    intent: result.query_analysis.intent,
    search_time_ms: searchTime,
    results_count: result.total_results,
    cache_hit: false,
    filters_applied: getAppliedFilters(options.filters),
    user_context: userContext,
    timestamp: new Date()
  });

  return {
    ...result,
    performance: {
      cache_hit: false,
      search_time_ms: searchTime,
      total_time_ms: totalTime
    }
  };
}

/**
 * Get search performance metrics
 */
export async function getSearchMetrics(
  timeRange: { start: Date; end: Date }
): Promise<{
  total_searches: number;
  avg_search_time_ms: number;
  cache_hit_rate: number;
  popular_queries: Array<{ query: string; count: number }>;
  intent_distribution: Record<QueryIntent, number>;
}> {
  try {
    const { data, error } = await supabase
      .from('search_analytics')
      .select('*')
      .gte('created_at', timeRange.start.toISOString())
      .lte('created_at', timeRange.end.toISOString());

    if (error) throw error;

    const metrics = data || [];
    const totalSearches = metrics.length;

    if (totalSearches === 0) {
      return {
        total_searches: 0,
        avg_search_time_ms: 0,
        cache_hit_rate: 0,
        popular_queries: [],
        intent_distribution: {} as Record<QueryIntent, number>
      };
    }

    const avgSearchTime = metrics.reduce((sum, m) => sum + m.search_time_ms, 0) / totalSearches;
    const cacheHits = metrics.filter(m => m.cache_hit).length;
    const cacheHitRate = cacheHits / totalSearches;

    // Popular queries
    const queryCount = new Map<string, number>();
    metrics.forEach(m => {
      queryCount.set(m.query, (queryCount.get(m.query) || 0) + 1);
    });

    const popularQueries = Array.from(queryCount.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([query, count]) => ({ query, count }));

    // Intent distribution
    const intentDistribution = {} as Record<QueryIntent, number>;
    metrics.forEach(m => {
      intentDistribution[m.intent as QueryIntent] =
        (intentDistribution[m.intent as QueryIntent] || 0) + 1;
    });

    return {
      total_searches: totalSearches,
      avg_search_time_ms: Math.round(avgSearchTime),
      cache_hit_rate: Math.round(cacheHitRate * 100) / 100,
      popular_queries: popularQueries,
      intent_distribution: intentDistribution
    };
  } catch (error) {
    console.error('Error getting search metrics:', error);
    throw new Error('Failed to get search metrics');
  }
}

/**
 * Clear search cache (useful for testing or manual cache invalidation)
 */
export function clearSearchCache(): void {
  searchCache.clear();
}

/**
 * Get cache statistics
 */
export function getCacheStats(): {
  size: number;
  hit_rate_estimate: number;
} {
  return {
    size: searchCache.size(),
    hit_rate_estimate: 0.3 // This would need to be tracked separately for accuracy
  };
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
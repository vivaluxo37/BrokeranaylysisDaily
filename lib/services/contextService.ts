import { QueryIntent, analyzeQuery, searchWithOptimizations } from './vectorService';
import { generateEmbedding } from './aiService';

export interface ContextChunk {
  id: string;
  title: string;
  content: string;
  url?: string;
  type: 'document' | 'broker';
  similarity: number;
  relevance_score?: number;
  metadata?: any;
  source_info: {
    author?: string;
    category?: string;
    broker_name?: string;
    trust_score?: number;
    created_at?: string;
  };
}

export interface ContextSelection {
  chunks: ContextChunk[];
  total_available: number;
  selection_strategy: string;
  diversity_score: number;
  coverage_score: number;
}

export interface UserContext {
  country?: string;
  experience_level?: 'beginner' | 'intermediate' | 'advanced';
  trading_style?: string;
  preferred_instruments?: string[];
  risk_tolerance?: 'low' | 'medium' | 'high';
  account_size?: 'small' | 'medium' | 'large';
}

/**
 * Enhanced context retrieval service for RAG
 */
export class ContextService {
  
  /**
   * Retrieve and rank context for a user query
   */
  async retrieveContext(
    query: string,
    userContext?: UserContext,
    options: {
      max_chunks?: number;
      diversity_threshold?: number;
      include_brokers?: boolean;
      include_documents?: boolean;
    } = {}
  ): Promise<ContextSelection> {
    const {
      max_chunks = 8,
      diversity_threshold = 0.7,
      include_brokers = true,
      include_documents = true
    } = options;

    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query);
    
    // Analyze query intent
    const queryAnalysis = analyzeQuery(query);
    
    // Determine search strategy based on intent
    const searchOptions = this.getSearchOptionsForIntent(queryAnalysis.intent, userContext);
    
    // Perform optimized search
    const searchResult = await searchWithOptimizations(
      query,
      queryEmbedding,
      searchOptions,
      userContext
    );

    // Convert search results to context chunks
    let allChunks: ContextChunk[] = [];
    
    if (include_documents) {
      const documentChunks = searchResult.documents.map(doc => this.convertDocumentToChunk(doc));
      allChunks.push(...documentChunks);
    }
    
    if (include_brokers) {
      const brokerChunks = searchResult.brokers.map(broker => this.convertBrokerToChunk(broker));
      allChunks.push(...brokerChunks);
    }

    // Apply intelligent selection and diversity filtering
    const selectedChunks = this.selectDiverseChunks(
      allChunks,
      max_chunks,
      diversity_threshold,
      queryAnalysis.intent
    );

    // Calculate metrics
    const diversityScore = this.calculateDiversityScore(selectedChunks);
    const coverageScore = this.calculateCoverageScore(selectedChunks, queryAnalysis);

    return {
      chunks: selectedChunks,
      total_available: allChunks.length,
      selection_strategy: this.getSelectionStrategy(queryAnalysis.intent),
      diversity_score: diversityScore,
      coverage_score: coverageScore
    };
  }

  /**
   * Get search options optimized for specific query intent
   */
  private getSearchOptionsForIntent(intent: QueryIntent, userContext?: UserContext) {
    const baseOptions = {
      limit: 15, // Get more results for better selection
      threshold: 0.6,
      include_metadata: true,
      ranking: {
        boost_recent: false,
        boost_authority: true,
        boost_quality: true,
        recency_weight: 0.1,
        authority_weight: 0.2,
        quality_weight: 0.15
      }
    };

    switch (intent) {
      case QueryIntent.BROKER_COMPARISON:
      case QueryIntent.BROKER_RECOMMENDATION:
        return {
          ...baseOptions,
          filters: {
            source_type: ['review', 'analysis', 'guide'],
            country: userContext?.country
          },
          ranking: {
            ...baseOptions.ranking,
            boost_authority: true,
            authority_weight: 0.3
          }
        };

      case QueryIntent.NEWS_UPDATES:
        return {
          ...baseOptions,
          filters: {
            source_type: ['news', 'analysis'],
            date_range: {
              start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // Last 30 days
              end: new Date().toISOString()
            }
          },
          ranking: {
            ...baseOptions.ranking,
            boost_recent: true,
            recency_weight: 0.4
          }
        };

      case QueryIntent.EDUCATIONAL:
        return {
          ...baseOptions,
          filters: {
            source_type: ['guide', 'article'],
            category: 'education'
          },
          ranking: {
            ...baseOptions.ranking,
            boost_quality: true,
            quality_weight: 0.3
          }
        };

      case QueryIntent.REGULATION_INFO:
        return {
          ...baseOptions,
          filters: {
            source_type: ['analysis', 'guide'],
            category: 'regulation'
          }
        };

      default:
        return baseOptions;
    }
  }

  /**
   * Convert document search result to context chunk
   */
  private convertDocumentToChunk(doc: any): ContextChunk {
    return {
      id: doc.id,
      title: doc.title,
      content: doc.content,
      url: doc.url,
      type: 'document',
      similarity: doc.similarity,
      relevance_score: doc.relevance_score,
      metadata: doc.metadata,
      source_info: {
        author: doc.author,
        category: doc.category,
        created_at: doc.created_at
      }
    };
  }

  /**
   * Convert broker search result to context chunk
   */
  private convertBrokerToChunk(broker: any): ContextChunk {
    const content = this.formatBrokerContent(broker);
    
    return {
      id: broker.id,
      title: broker.name,
      content,
      url: `/brokers/${broker.slug}`,
      type: 'broker',
      similarity: broker.similarity,
      relevance_score: broker.relevance_score,
      metadata: broker.metadata,
      source_info: {
        broker_name: broker.name,
        trust_score: broker.trust_score
      }
    };
  }

  /**
   * Format broker information into readable content
   */
  private formatBrokerContent(broker: any): string {
    const parts = [
      `${broker.name} is a forex and CFD broker`,
      broker.description && `Description: ${broker.description}`,
      broker.trust_score && `Trust Score: ${broker.trust_score}/100`,
      broker.overall_rating && `Overall Rating: ${broker.overall_rating}/5`,
      broker.minimum_deposit && `Minimum Deposit: $${broker.minimum_deposit}`,
      broker.regulatory_status && `Regulation: ${broker.regulatory_status}`,
      broker.trading_platforms?.length && `Platforms: ${broker.trading_platforms.join(', ')}`,
      broker.best_for?.length && `Best For: ${broker.best_for.join(', ')}`
    ].filter(Boolean);

    return parts.join('. ') + '.';
  }

  /**
   * Select diverse chunks to avoid redundancy
   */
  private selectDiverseChunks(
    chunks: ContextChunk[],
    maxChunks: number,
    diversityThreshold: number,
    intent: QueryIntent
  ): ContextChunk[] {
    if (chunks.length <= maxChunks) {
      return chunks.sort((a, b) => (b.relevance_score || b.similarity) - (a.relevance_score || a.similarity));
    }

    const selected: ContextChunk[] = [];
    const remaining = [...chunks].sort((a, b) => (b.relevance_score || b.similarity) - (a.relevance_score || a.similarity));

    // Always include the top result
    if (remaining.length > 0) {
      selected.push(remaining.shift()!);
    }

    // Select remaining chunks with diversity consideration
    while (selected.length < maxChunks && remaining.length > 0) {
      let bestChunk: ContextChunk | null = null;
      let bestScore = -1;

      for (const chunk of remaining) {
        const diversityScore = this.calculateChunkDiversity(chunk, selected);
        const relevanceScore = chunk.relevance_score || chunk.similarity;
        
        // Combined score: relevance + diversity
        const combinedScore = relevanceScore * 0.7 + diversityScore * 0.3;
        
        if (combinedScore > bestScore) {
          bestScore = combinedScore;
          bestChunk = chunk;
        }
      }

      if (bestChunk) {
        selected.push(bestChunk);
        remaining.splice(remaining.indexOf(bestChunk), 1);
      } else {
        break;
      }
    }

    return selected;
  }

  /**
   * Calculate diversity score for a chunk against selected chunks
   */
  private calculateChunkDiversity(chunk: ContextChunk, selected: ContextChunk[]): number {
    if (selected.length === 0) return 1.0;

    let minSimilarity = 1.0;
    
    for (const selectedChunk of selected) {
      // Simple content similarity check
      const similarity = this.calculateContentSimilarity(chunk.content, selectedChunk.content);
      minSimilarity = Math.min(minSimilarity, similarity);
    }

    return 1.0 - minSimilarity; // Higher diversity = lower similarity
  }

  /**
   * Simple content similarity calculation
   */
  private calculateContentSimilarity(content1: string, content2: string): number {
    const words1 = new Set(content1.toLowerCase().split(/\s+/));
    const words2 = new Set(content2.toLowerCase().split(/\s+/));
    
    const intersection = new Set([...words1].filter(word => words2.has(word)));
    const union = new Set([...words1, ...words2]);
    
    return intersection.size / union.size; // Jaccard similarity
  }

  /**
   * Calculate overall diversity score for selected chunks
   */
  private calculateDiversityScore(chunks: ContextChunk[]): number {
    if (chunks.length <= 1) return 1.0;

    let totalSimilarity = 0;
    let comparisons = 0;

    for (let i = 0; i < chunks.length; i++) {
      for (let j = i + 1; j < chunks.length; j++) {
        totalSimilarity += this.calculateContentSimilarity(chunks[i].content, chunks[j].content);
        comparisons++;
      }
    }

    const avgSimilarity = totalSimilarity / comparisons;
    return 1.0 - avgSimilarity; // Higher diversity = lower average similarity
  }

  /**
   * Calculate coverage score based on query intent
   */
  private calculateCoverageScore(chunks: ContextChunk[], queryAnalysis: any): number {
    // Simple coverage calculation based on content types and sources
    const types = new Set(chunks.map(c => c.type));
    const sources = new Set(chunks.map(c => c.source_info.category || c.source_info.broker_name).filter(Boolean));
    
    // Base score from type diversity
    let score = types.size / 2; // Max 2 types (document, broker)
    
    // Bonus for source diversity
    score += Math.min(sources.size / 5, 0.5); // Up to 0.5 bonus for source diversity
    
    return Math.min(score, 1.0);
  }

  /**
   * Get selection strategy description
   */
  private getSelectionStrategy(intent: QueryIntent): string {
    switch (intent) {
      case QueryIntent.BROKER_COMPARISON:
        return 'authority_focused_with_diversity';
      case QueryIntent.NEWS_UPDATES:
        return 'recency_focused_with_diversity';
      case QueryIntent.EDUCATIONAL:
        return 'quality_focused_with_diversity';
      default:
        return 'balanced_with_diversity';
    }
  }
}

// Export singleton instance
export const contextService = new ContextService();

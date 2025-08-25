import { QueryIntent } from './vectorService';

export interface FormattedResponse {
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
}

export interface ResponseAnalysis {
  intent_match: number;
  completeness: number;
  citation_quality: number;
  structure_quality: number;
  overall_quality: number;
}

/**
 * Service for formatting and analyzing AI responses
 */
export class ResponseFormattingService {

  /**
   * Format and analyze AI response
   */
  formatResponse(
    rawResponse: string,
    intent: QueryIntent,
    sources: Array<{ id: string; title: string; url?: string }>,
    query: string
  ): FormattedResponse {
    const structure = this.parseResponseStructure(rawResponse);
    const qualityMetrics = this.calculateQualityMetrics(rawResponse, structure, sources);
    const seoMetadata = this.generateSEOMetadata(query, rawResponse, intent);

    return {
      content: this.enhanceResponseFormatting(rawResponse, intent),
      structure,
      quality_metrics: qualityMetrics,
      seo_metadata: seoMetadata
    };
  }

  /**
   * Analyze response quality
   */
  analyzeResponse(
    response: string,
    intent: QueryIntent,
    sources: any[],
    userQuery: string
  ): ResponseAnalysis {
    const intentMatch = this.calculateIntentMatch(response, intent);
    const completeness = this.calculateCompleteness(response, intent);
    const citationQuality = this.calculateCitationQuality(response, sources);
    const structureQuality = this.calculateStructureQuality(response, intent);
    
    const overallQuality = (
      intentMatch * 0.3 +
      completeness * 0.25 +
      citationQuality * 0.25 +
      structureQuality * 0.2
    );

    return {
      intent_match: Math.round(intentMatch * 100) / 100,
      completeness: Math.round(completeness * 100) / 100,
      citation_quality: Math.round(citationQuality * 100) / 100,
      structure_quality: Math.round(structureQuality * 100) / 100,
      overall_quality: Math.round(overallQuality * 100) / 100
    };
  }

  /**
   * Parse response into structured sections
   */
  private parseResponseStructure(response: string): FormattedResponse['structure'] {
    const sections: Array<{ title: string; content: string; citations: number[] }> = [];
    let summary: string | undefined;
    const recommendations: string[] = [];
    const warnings: string[] = [];

    // Split by common section headers
    const sectionRegex = /(?:^|\n)(?:#{1,3}\s*(.+)|(\d+\.\s*.+)|(\*\*(.+)\*\*))/gm;
    const parts = response.split(sectionRegex).filter(Boolean);

    let currentSection = { title: 'Introduction', content: '', citations: [] as number[] };
    
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]?.trim();
      if (!part) continue;

      // Check if this is a section header
      if (this.isSectionHeader(part)) {
        if (currentSection.content.trim()) {
          currentSection.citations = this.extractCitations(currentSection.content);
          sections.push({ ...currentSection });
        }
        currentSection = { title: this.cleanSectionTitle(part), content: '', citations: [] };
      } else {
        currentSection.content += part + '\n';
      }
    }

    // Add the last section
    if (currentSection.content.trim()) {
      currentSection.citations = this.extractCitations(currentSection.content);
      sections.push(currentSection);
    }

    // Extract summary (usually first or last section)
    if (sections.length > 0) {
      const firstSection = sections[0];
      if (firstSection.title.toLowerCase().includes('summary') || 
          firstSection.title.toLowerCase().includes('overview') ||
          sections.length === 1) {
        summary = firstSection.content.trim();
      }
    }

    // Extract recommendations and warnings
    const recommendationKeywords = ['recommend', 'suggest', 'best choice', 'should consider'];
    const warningKeywords = ['warning', 'caution', 'risk', 'be aware', 'important note'];

    sections.forEach(section => {
      const lowerContent = section.content.toLowerCase();
      
      if (recommendationKeywords.some(keyword => lowerContent.includes(keyword))) {
        const recs = this.extractRecommendations(section.content);
        recommendations.push(...recs);
      }
      
      if (warningKeywords.some(keyword => lowerContent.includes(keyword))) {
        const warns = this.extractWarnings(section.content);
        warnings.push(...warns);
      }
    });

    return {
      sections,
      summary,
      recommendations: recommendations.length > 0 ? recommendations : undefined,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  }

  /**
   * Check if text is a section header
   */
  private isSectionHeader(text: string): boolean {
    return /^#{1,3}\s+/.test(text) || 
           /^\d+\.\s+/.test(text) || 
           /^\*\*.*\*\*$/.test(text) ||
           text.length < 100 && text.includes(':');
  }

  /**
   * Clean section title
   */
  private cleanSectionTitle(title: string): string {
    return title
      .replace(/^#{1,3}\s*/, '')
      .replace(/^\d+\.\s*/, '')
      .replace(/^\*\*|\*\*$/g, '')
      .replace(/:$/, '')
      .trim();
  }

  /**
   * Extract citation numbers from text
   */
  private extractCitations(text: string): number[] {
    const citations = text.match(/\[(\d+)\]/g);
    if (!citations) return [];
    
    return citations
      .map(citation => parseInt(citation.replace(/[\[\]]/g, '')))
      .filter(num => !isNaN(num))
      .sort((a, b) => a - b);
  }

  /**
   * Extract recommendations from text
   */
  private extractRecommendations(text: string): string[] {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const recommendationKeywords = ['recommend', 'suggest', 'best choice', 'should consider', 'ideal for'];
    
    return sentences
      .filter(sentence => 
        recommendationKeywords.some(keyword => 
          sentence.toLowerCase().includes(keyword)
        )
      )
      .map(sentence => sentence.trim())
      .slice(0, 3); // Limit to 3 recommendations
  }

  /**
   * Extract warnings from text
   */
  private extractWarnings(text: string): string[] {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const warningKeywords = ['warning', 'caution', 'risk', 'be aware', 'important note', 'however'];
    
    return sentences
      .filter(sentence => 
        warningKeywords.some(keyword => 
          sentence.toLowerCase().includes(keyword)
        )
      )
      .map(sentence => sentence.trim())
      .slice(0, 3); // Limit to 3 warnings
  }

  /**
   * Calculate quality metrics
   */
  private calculateQualityMetrics(
    response: string,
    structure: FormattedResponse['structure'],
    sources: any[]
  ): FormattedResponse['quality_metrics'] {
    const wordCount = response.split(/\s+/).length;
    const citationCount = this.extractCitations(response).length;
    const sectionCount = structure.sections.length;
    
    // Simple readability score (based on sentence length and word complexity)
    const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgSentenceLength = wordCount / sentences.length;
    const readabilityScore = Math.max(0, Math.min(1, 1 - (avgSentenceLength - 15) / 20));

    return {
      readability_score: Math.round(readabilityScore * 100) / 100,
      citation_count: citationCount,
      section_count: sectionCount,
      word_count: wordCount,
      has_recommendations: !!structure.recommendations?.length,
      has_warnings: !!structure.warnings?.length
    };
  }

  /**
   * Generate SEO metadata
   */
  private generateSEOMetadata(
    query: string,
    response: string,
    intent: QueryIntent
  ): FormattedResponse['seo_metadata'] {
    const title = this.generateSEOTitle(query, intent);
    const description = this.generateSEODescription(response);
    const keywords = this.extractKeywords(query, response);

    return { title, description, keywords };
  }

  /**
   * Generate SEO title
   */
  private generateSEOTitle(query: string, intent: QueryIntent): string {
    const baseTitle = query.length > 50 ? query.substring(0, 47) + '...' : query;
    
    switch (intent) {
      case QueryIntent.BROKER_COMPARISON:
        return `${baseTitle} - Broker Comparison | Brokeranalysis`;
      case QueryIntent.BROKER_RECOMMENDATION:
        return `${baseTitle} - Best Broker Recommendations | Brokeranalysis`;
      case QueryIntent.EDUCATIONAL:
        return `${baseTitle} - Trading Guide | Brokeranalysis`;
      default:
        return `${baseTitle} | Brokeranalysis`;
    }
  }

  /**
   * Generate SEO description
   */
  private generateSEODescription(response: string): string {
    const firstSentences = response.split(/[.!?]+/).slice(0, 2).join('. ');
    const description = firstSentences.length > 150 
      ? firstSentences.substring(0, 147) + '...'
      : firstSentences;
    
    return description.trim();
  }

  /**
   * Extract keywords from query and response
   */
  private extractKeywords(query: string, response: string): string[] {
    const commonWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'must']);
    
    const allText = (query + ' ' + response).toLowerCase();
    const words = allText.match(/\b[a-z]{3,}\b/g) || [];
    
    const wordFreq = new Map<string, number>();
    words.forEach(word => {
      if (!commonWords.has(word)) {
        wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
      }
    });
    
    return Array.from(wordFreq.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
  }

  /**
   * Enhance response formatting
   */
  private enhanceResponseFormatting(response: string, intent: QueryIntent): string {
    let enhanced = response;

    // Add proper markdown formatting
    enhanced = this.improveMarkdownFormatting(enhanced);
    
    // Add intent-specific enhancements
    switch (intent) {
      case QueryIntent.BROKER_COMPARISON:
        enhanced = this.enhanceComparisonFormatting(enhanced);
        break;
      case QueryIntent.BROKER_RECOMMENDATION:
        enhanced = this.enhanceRecommendationFormatting(enhanced);
        break;
    }

    return enhanced;
  }

  /**
   * Improve markdown formatting
   */
  private improveMarkdownFormatting(text: string): string {
    // Ensure proper spacing around headers
    text = text.replace(/\n(#{1,3}[^#\n]+)\n/g, '\n\n$1\n\n');
    
    // Ensure proper list formatting
    text = text.replace(/\n([*-]\s+)/g, '\n\n$1');
    
    // Clean up multiple newlines
    text = text.replace(/\n{3,}/g, '\n\n');
    
    return text.trim();
  }

  /**
   * Enhance comparison formatting
   */
  private enhanceComparisonFormatting(text: string): string {
    // Add comparison table formatting if not present
    if (!text.includes('|') && text.includes('vs')) {
      // This could be enhanced to automatically create comparison tables
    }
    return text;
  }

  /**
   * Enhance recommendation formatting
   */
  private enhanceRecommendationFormatting(text: string): string {
    // Highlight key recommendations
    text = text.replace(/(recommend|suggest|best choice)/gi, '**$1**');
    return text;
  }

  // Quality calculation methods
  private calculateIntentMatch(response: string, intent: QueryIntent): number {
    const intentKeywords = this.getIntentKeywords(intent);
    const lowerResponse = response.toLowerCase();
    
    const matches = intentKeywords.filter(keyword => 
      lowerResponse.includes(keyword.toLowerCase())
    ).length;
    
    return Math.min(matches / intentKeywords.length, 1);
  }

  private calculateCompleteness(response: string, intent: QueryIntent): number {
    const minWordCount = this.getMinWordCountForIntent(intent);
    const wordCount = response.split(/\s+/).length;
    
    return Math.min(wordCount / minWordCount, 1);
  }

  private calculateCitationQuality(response: string, sources: any[]): number {
    const citations = this.extractCitations(response);
    const uniqueCitations = new Set(citations);
    
    if (sources.length === 0) return 1; // No sources available
    
    const citationRate = uniqueCitations.size / Math.min(sources.length, 5);
    return Math.min(citationRate, 1);
  }

  private calculateStructureQuality(response: string, intent: QueryIntent): number {
    const expectedSections = this.getExpectedSectionsForIntent(intent);
    const actualSections = this.parseResponseStructure(response).sections.length;
    
    return Math.min(actualSections / expectedSections, 1);
  }

  private getIntentKeywords(intent: QueryIntent): string[] {
    switch (intent) {
      case QueryIntent.BROKER_COMPARISON:
        return ['compare', 'difference', 'versus', 'pros', 'cons', 'better'];
      case QueryIntent.BROKER_RECOMMENDATION:
        return ['recommend', 'suggest', 'best', 'suitable', 'ideal'];
      case QueryIntent.EDUCATIONAL:
        return ['learn', 'understand', 'how to', 'guide', 'tutorial'];
      default:
        return ['broker', 'trading', 'platform'];
    }
  }

  private getMinWordCountForIntent(intent: QueryIntent): number {
    switch (intent) {
      case QueryIntent.BROKER_COMPARISON:
        return 300;
      case QueryIntent.BROKER_RECOMMENDATION:
        return 250;
      case QueryIntent.EDUCATIONAL:
        return 400;
      default:
        return 200;
    }
  }

  private getExpectedSectionsForIntent(intent: QueryIntent): number {
    switch (intent) {
      case QueryIntent.BROKER_COMPARISON:
        return 4; // Overview, Comparison, Pros/Cons, Recommendation
      case QueryIntent.BROKER_RECOMMENDATION:
        return 3; // Recommendation, Benefits, Next Steps
      case QueryIntent.EDUCATIONAL:
        return 5; // Overview, Steps, Examples, Tips, Conclusion
      default:
        return 3;
    }
  }
}

// Export singleton instance
export const responseFormattingService = new ResponseFormattingService();

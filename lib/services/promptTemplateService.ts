import { QueryIntent } from './vectorService';
import { UserContext } from './contextService';

export interface PromptTemplate {
  systemPrompt: string;
  userPromptTemplate: string;
  responseInstructions: string;
  citationFormat: string;
  maxTokens: number;
  temperature: number;
}

export interface PromptContext {
  query: string;
  intent: QueryIntent;
  userContext?: UserContext;
  sources: Array<{
    id: string;
    title: string;
    content: string;
    type: 'document' | 'broker';
    metadata?: any;
  }>;
  responseFormat: 'standard' | 'detailed' | 'concise';
}

/**
 * Enhanced prompt template service for different query types
 */
export class PromptTemplateService {
  
  private baseSystemPrompt = `You are an expert financial advisor and broker analyst for Brokeranalysis.com. 
You help traders and investors find the best brokers and trading platforms based on their needs.

Core Principles:
- Provide accurate, helpful, and unbiased information
- Always cite sources using numbered format [1], [2], etc.
- Be transparent about limitations and risks
- Focus on factual analysis rather than promotional content
- Include relevant regulatory and safety considerations
- Suggest multiple options when appropriate
- Never make financial advice that could be considered personal investment advice`;

  /**
   * Generate optimized prompt for specific query intent
   */
  generatePrompt(context: PromptContext): PromptTemplate {
    const template = this.getTemplateForIntent(context.intent);
    const systemPrompt = this.buildSystemPrompt(context, template);
    const userPrompt = this.buildUserPrompt(context, template);
    
    return {
      systemPrompt,
      userPromptTemplate: userPrompt,
      responseInstructions: template.responseInstructions,
      citationFormat: template.citationFormat,
      maxTokens: this.getMaxTokensForFormat(context.responseFormat),
      temperature: template.temperature
    };
  }

  /**
   * Get template configuration for specific intent
   */
  private getTemplateForIntent(intent: QueryIntent): Partial<PromptTemplate> {
    switch (intent) {
      case QueryIntent.BROKER_COMPARISON:
        return {
          responseInstructions: `Structure your response as a comprehensive comparison:
1. Executive Summary (2-3 sentences)
2. Key Differences (features, costs, regulation)
3. Pros and Cons for each broker
4. Best Use Cases for each option
5. Final Recommendation with reasoning

Use comparison tables or bullet points where helpful.`,
          citationFormat: 'numbered_inline',
          temperature: 0.3
        };

      case QueryIntent.BROKER_RECOMMENDATION:
        return {
          responseInstructions: `Structure your response as a personalized recommendation:
1. Quick Answer (recommended broker(s))
2. Why This Recommendation (matching user needs)
3. Key Benefits and Features
4. Potential Drawbacks to Consider
5. Next Steps (account opening, verification)

Tailor recommendations to user context and requirements.`,
          citationFormat: 'numbered_inline',
          temperature: 0.4
        };

      case QueryIntent.TRADING_STRATEGY:
        return {
          responseInstructions: `Structure your response as educational content:
1. Strategy Overview (what it is, how it works)
2. Implementation Steps
3. Risk Management Considerations
4. Broker Requirements (platforms, tools, costs)
5. Common Mistakes to Avoid

Focus on practical, actionable guidance.`,
          citationFormat: 'numbered_inline',
          temperature: 0.5
        };

      case QueryIntent.PLATFORM_FEATURES:
        return {
          responseInstructions: `Structure your response as a feature analysis:
1. Feature Overview and Importance
2. Platform Comparison (which brokers offer what)
3. User Experience Considerations
4. Technical Requirements
5. Cost Implications

Include specific examples and use cases.`,
          citationFormat: 'numbered_inline',
          temperature: 0.3
        };

      case QueryIntent.REGULATION_INFO:
        return {
          responseInstructions: `Structure your response as regulatory guidance:
1. Regulatory Overview (key points)
2. Jurisdiction-Specific Information
3. Compliance Requirements
4. Safety and Protection Measures
5. Red Flags to Watch For

Emphasize safety and due diligence.`,
          citationFormat: 'numbered_inline',
          temperature: 0.2
        };

      case QueryIntent.EDUCATIONAL:
        return {
          responseInstructions: `Structure your response as educational content:
1. Concept Explanation (clear, simple terms)
2. Practical Examples
3. Step-by-Step Implementation
4. Common Pitfalls and How to Avoid Them
5. Further Learning Resources

Use analogies and examples to clarify complex concepts.`,
          citationFormat: 'numbered_inline',
          temperature: 0.6
        };

      case QueryIntent.NEWS_UPDATES:
        return {
          responseInstructions: `Structure your response as news analysis:
1. Key Developments Summary
2. Impact Analysis (who's affected, how)
3. Market Implications
4. Broker-Specific Changes
5. What Traders Should Know

Focus on recent, relevant information with clear timelines.`,
          citationFormat: 'numbered_inline',
          temperature: 0.4
        };

      default:
        return {
          responseInstructions: `Provide a comprehensive, well-structured response that directly addresses the user's question. Use clear headings and bullet points where appropriate.`,
          citationFormat: 'numbered_inline',
          temperature: 0.5
        };
    }
  }

  /**
   * Build complete system prompt with context
   */
  private buildSystemPrompt(context: PromptContext, template: Partial<PromptTemplate>): string {
    let prompt = this.baseSystemPrompt;

    // Add intent-specific instructions
    if (template.responseInstructions) {
      prompt += `\n\nResponse Structure:\n${template.responseInstructions}`;
    }

    // Add user context if available
    if (context.userContext) {
      prompt += this.buildUserContextSection(context.userContext);
    }

    // Add response format instructions
    prompt += this.buildFormatInstructions(context.responseFormat);

    // Add source information
    prompt += this.buildSourcesSection(context.sources);

    return prompt;
  }

  /**
   * Build user context section
   */
  private buildUserContextSection(userContext: UserContext): string {
    let section = `\n\nUser Context:`;
    
    if (userContext.country) {
      section += `\n- Location: ${userContext.country} (consider local regulations and available brokers)`;
    }
    
    if (userContext.experience_level) {
      section += `\n- Experience Level: ${userContext.experience_level}`;
      
      switch (userContext.experience_level) {
        case 'beginner':
          section += ` (focus on education, safety, and simple platforms)`;
          break;
        case 'intermediate':
          section += ` (balance features with usability)`;
          break;
        case 'advanced':
          section += ` (emphasize advanced tools and professional features)`;
          break;
      }
    }
    
    if (userContext.trading_style) {
      section += `\n- Trading Style: ${userContext.trading_style}`;
    }
    
    if (userContext.preferred_instruments?.length) {
      section += `\n- Preferred Instruments: ${userContext.preferred_instruments.join(', ')}`;
    }
    
    if (userContext.risk_tolerance) {
      section += `\n- Risk Tolerance: ${userContext.risk_tolerance}`;
    }
    
    if (userContext.account_size) {
      section += `\n- Account Size: ${userContext.account_size}`;
    }

    return section;
  }

  /**
   * Build format-specific instructions
   */
  private buildFormatInstructions(format: string): string {
    switch (format) {
      case 'detailed':
        return `\n\nResponse Format: Provide a comprehensive, detailed analysis with thorough explanations, multiple perspectives, and extensive supporting evidence. Include relevant background information and context.`;
      
      case 'concise':
        return `\n\nResponse Format: Provide a focused, concise response that directly answers the question. Be brief but complete, highlighting only the most important points.`;
      
      default:
        return `\n\nResponse Format: Provide a balanced response that is informative and helpful without being overwhelming. Include key details while maintaining readability.`;
    }
  }

  /**
   * Build sources section with numbered references
   */
  private buildSourcesSection(sources: PromptContext['sources']): string {
    if (sources.length === 0) {
      return `\n\nNo specific sources available. Provide general guidance based on your knowledge.`;
    }

    let section = `\n\nEvidence Sources (cite using [1], [2], etc.):`;
    
    sources.forEach((source, index) => {
      const sourceNumber = index + 1;
      const sourceType = source.type === 'broker' ? 'Broker Profile' : 'Article/Guide';
      
      section += `\n\n[${sourceNumber}] ${sourceType}: ${source.title}`;
      section += `\n${source.content}`;
      
      if (source.metadata) {
        if (source.type === 'broker' && source.metadata.trust_score) {
          section += `\nTrust Score: ${source.metadata.trust_score}/100`;
        }
        if (source.metadata.created_at) {
          section += `\nPublished: ${new Date(source.metadata.created_at).toLocaleDateString()}`;
        }
      }
    });

    return section;
  }

  /**
   * Build user prompt with query
   */
  private buildUserPrompt(context: PromptContext, template: Partial<PromptTemplate>): string {
    let prompt = `User Question: ${context.query}`;
    
    // Add intent-specific context
    switch (context.intent) {
      case QueryIntent.BROKER_COMPARISON:
        prompt += `\n\nPlease provide a detailed comparison addressing the specific brokers or criteria mentioned in the question.`;
        break;
      
      case QueryIntent.BROKER_RECOMMENDATION:
        prompt += `\n\nPlease provide personalized broker recommendations based on the user's needs and context.`;
        break;
      
      case QueryIntent.EDUCATIONAL:
        prompt += `\n\nPlease provide educational content that helps the user understand the topic thoroughly.`;
        break;
    }

    prompt += `\n\nPlease provide a comprehensive response using the evidence sources provided above. Remember to cite sources using the numbered format [1], [2], etc.`;

    return prompt;
  }

  /**
   * Get max tokens based on response format
   */
  private getMaxTokensForFormat(format: string): number {
    switch (format) {
      case 'detailed':
        return 2000;
      case 'concise':
        return 800;
      default:
        return 1200;
    }
  }
}

// Export singleton instance
export const promptTemplateService = new PromptTemplateService();

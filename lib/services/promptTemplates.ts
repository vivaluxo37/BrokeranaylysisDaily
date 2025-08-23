import { PromptTemplate, PromptTemplateConfig, ConversationContext } from '../types';

/**
 * Prompt Template Manager for different AI use cases
 * Handles chat, recommendation, summarization, and broker analysis prompts
 */
export class PromptTemplateManager {
  private templates: Map<PromptTemplate, PromptTemplateConfig>;

  constructor() {
    this.templates = new Map();
    this.initializeDefaultTemplates();
  }

  /**
   * Get formatted prompt for a specific template
   */
  getPrompt(
    template: PromptTemplate,
    variables: Record<string, any>,
    context?: ConversationContext
  ): string {
    const templateConfig = this.templates.get(template);
    if (!templateConfig) {
      throw new Error(`Template ${template} not found`);
    }

    let prompt = templateConfig.template;

    // Replace variables in template
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`;
      prompt = prompt.replace(new RegExp(placeholder, 'g'), String(value));
    }

    // Add context if provided
    if (context && context.previousMessages.length > 0) {
      const contextPrompt = this.buildContextPrompt(context);
      prompt = `${contextPrompt}\n\n${prompt}`;
    }

    return prompt;
  }

  /**
   * Get template configuration
   */
  getTemplateConfig(template: PromptTemplate): PromptTemplateConfig | undefined {
    return this.templates.get(template);
  }

  /**
   * Add or update a template
   */
  setTemplate(template: PromptTemplate, config: PromptTemplateConfig): void {
    this.templates.set(template, config);
  }

  /**
   * Remove a template
   */
  removeTemplate(template: PromptTemplate): void {
    this.templates.delete(template);
  }

  /**
   * Get all available templates
   */
  getAvailableTemplates(): PromptTemplate[] {
    return Array.from(this.templates.keys());
  }

  /**
   * Validate template variables
   */
  validateVariables(template: PromptTemplate, variables: Record<string, any>): boolean {
    const templateConfig = this.templates.get(template);
    if (!templateConfig) {
      return false;
    }

    // Check required variables
    for (const requiredVar of templateConfig.requiredVariables) {
      if (!(requiredVar in variables) || variables[requiredVar] === undefined) {
        return false;
      }
    }

    return true;
  }

  /**
   * Build context prompt from conversation history
   */
  private buildContextPrompt(context: ConversationContext): string {
    const messages = context.previousMessages.slice(-5); // Last 5 messages for context
    const contextLines = messages.map(msg => 
      `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
    );
    
    return `Previous conversation context:\n${contextLines.join('\n')}`;
  }

  /**
   * Initialize default prompt templates
   */
  private initializeDefaultTemplates(): void {
    // Chat Template
    this.templates.set(PromptTemplate.CHAT, {
      name: 'General Chat',
      description: 'General purpose chat conversation',
      template: `You are a helpful AI assistant for Broker Analysis, a leading financial services comparison platform. You provide accurate, helpful, and professional responses about trading, brokers, and financial markets.

User Query: {{query}}

Please provide a comprehensive and helpful response. If the query is about brokers or trading, include relevant information about regulations, features, and considerations for traders.`,
      requiredVariables: ['query'],
      optionalVariables: ['user_context', 'broker_context'],
      maxTokens: 4096,
      temperature: 0.7,
      systemPrompt: 'You are a knowledgeable financial services assistant for Broker Analysis.'
    });

    // Recommendation Template
    this.templates.set(PromptTemplate.RECOMMENDATION, {
      name: 'Broker Recommendation',
      description: 'Generate personalized broker recommendations',
      template: `You are an expert financial advisor helping users find the best trading broker based on their specific needs and preferences.

User Profile:
- Trading Experience: {{experience_level}}
- Account Type: {{account_type}}
- Trading Style: {{trading_style}}
- Preferred Markets: {{preferred_markets}}
- Budget/Deposit: {{budget}}
- Location: {{location}}
- Special Requirements: {{special_requirements}}

Available Brokers Data:
{{brokers_data}}

Based on the user profile and available brokers, provide:
1. Top 3 recommended brokers with detailed explanations
2. Key features that match the user's needs
3. Potential drawbacks or considerations
4. Specific account types or platforms to consider
5. Next steps for the user

Ensure recommendations are objective, well-reasoned, and include regulatory information.`,
      requiredVariables: [
        'experience_level',
        'account_type', 
        'trading_style',
        'preferred_markets',
        'budget',
        'location',
        'brokers_data'
      ],
      optionalVariables: ['special_requirements', 'risk_tolerance'],
      maxTokens: 6144,
      temperature: 0.3,
      systemPrompt: 'You are an expert broker recommendation system for Broker Analysis.'
    });

    // Summarization Template
    this.templates.set(PromptTemplate.SUMMARIZATION, {
      name: 'Content Summarization',
      description: 'Summarize broker reviews, articles, or market content',
      template: `Please provide a comprehensive summary of the following {{content_type}}:

Content to Summarize:
{{content}}

Summary Requirements:
- Length: {{summary_length}} (brief/medium/detailed)
- Focus Areas: {{focus_areas}}
- Target Audience: {{target_audience}}

Provide a well-structured summary that:
1. Captures the main points and key insights
2. Highlights important facts, figures, and conclusions
3. Maintains objectivity and accuracy
4. Uses clear, professional language
5. Includes relevant regulatory or compliance information if applicable

Format the summary with clear headings and bullet points where appropriate.`,
      requiredVariables: ['content', 'content_type', 'summary_length'],
      optionalVariables: ['focus_areas', 'target_audience'],
      maxTokens: 4096,
      temperature: 0.2,
      systemPrompt: 'You are a professional content summarization assistant for financial services.'
    });

    // RAG Template
    this.templates.set(PromptTemplate.RAG, {
      name: 'RAG Query Response',
      description: 'Answer questions using retrieved context',
      template: `You are answering a question about brokers and trading using the provided context from Broker Analysis knowledge base.

User Question: {{question}}

Relevant Context:
{{context}}

Instructions:
1. Answer the question accurately based on the provided context
2. If the context doesn't contain enough information, clearly state this
3. Include specific details, numbers, and facts from the context
4. Maintain objectivity and avoid speculation
5. If discussing brokers, include regulatory information when available
6. Cite specific sources or sections when referencing context

Provide a comprehensive, well-structured answer that directly addresses the user's question.`,
      requiredVariables: ['question', 'context'],
      optionalVariables: ['source_urls', 'confidence_score'],
      maxTokens: 4096,
      temperature: 0.1,
      systemPrompt: 'You are a knowledgeable assistant providing accurate information from the Broker Analysis knowledge base.'
    });

    // Broker Analysis Template
    this.templates.set(PromptTemplate.BROKER_ANALYSIS, {
      name: 'Detailed Broker Analysis',
      description: 'Comprehensive broker analysis and comparison',
      template: `Provide a detailed analysis of the following broker(s) for Broker Analysis platform:

Broker Information:
{{broker_data}}

Analysis Requirements:
- Analysis Type: {{analysis_type}} (review/comparison/rating)
- Focus Areas: {{focus_areas}}
- Target Audience: {{target_audience}}
- Regulatory Jurisdiction: {{jurisdiction}}

Please provide a comprehensive analysis covering:

1. **Overview & Background**
   - Company history and ownership
   - Regulatory status and licenses
   - Market reputation and trust score

2. **Trading Conditions**
   - Account types and minimum deposits
   - Spreads, commissions, and fees
   - Available instruments and markets
   - Leverage and margin requirements

3. **Platform & Technology**
   - Trading platforms available
   - Mobile app features and usability
   - Execution speed and reliability
   - Advanced trading tools

4. **Customer Support & Education**
   - Support channels and availability
   - Educational resources
   - Account management features

5. **Pros & Cons**
   - Key advantages
   - Notable limitations
   - Comparison with competitors

6. **Verdict & Recommendations**
   - Overall rating and reasoning
   - Best suited for (trader types)
   - Final recommendations

Ensure the analysis is objective, fact-based, and includes specific data points and regulatory information.`,
      requiredVariables: ['broker_data', 'analysis_type'],
      optionalVariables: [
        'focus_areas',
        'target_audience', 
        'jurisdiction',
        'comparison_brokers'
      ],
      maxTokens: 8192,
      temperature: 0.2,
      systemPrompt: 'You are an expert financial analyst specializing in broker evaluation for Broker Analysis.'
    });

    // Market Analysis Template
    this.templates.set(PromptTemplate.MARKET_ANALYSIS, {
      name: 'Market Analysis',
      description: 'Financial market analysis and insights',
      template: `Provide a professional market analysis for Broker Analysis readers:

Market Data:
{{market_data}}

Analysis Parameters:
- Market/Instrument: {{market_instrument}}
- Time Frame: {{time_frame}}
- Analysis Type: {{analysis_type}} (technical/fundamental/sentiment)
- Target Audience: {{target_audience}}

Please provide:

1. **Market Overview**
   - Current market conditions
   - Key price levels and trends
   - Recent significant events

2. **Technical Analysis** (if applicable)
   - Chart patterns and indicators
   - Support and resistance levels
   - Trend analysis and momentum

3. **Fundamental Factors**
   - Economic indicators impact
   - News and events influence
   - Long-term outlook factors

4. **Trading Implications**
   - Potential opportunities
   - Risk considerations
   - Broker-specific considerations

5. **Conclusion**
   - Key takeaways
   - Actionable insights
   - Risk warnings

Maintain objectivity and include appropriate risk disclaimers.`,
      requiredVariables: ['market_data', 'market_instrument', 'time_frame'],
      optionalVariables: ['analysis_type', 'target_audience'],
      maxTokens: 6144,
      temperature: 0.3,
      systemPrompt: 'You are a professional market analyst providing insights for Broker Analysis.'
    });

    // Educational Content Template
    this.templates.set(PromptTemplate.EDUCATIONAL, {
      name: 'Educational Content',
      description: 'Educational content about trading and brokers',
      template: `Create educational content for Broker Analysis platform:

Topic: {{topic}}
Content Type: {{content_type}} (guide/tutorial/explanation/FAQ)
Target Audience: {{target_audience}} (beginner/intermediate/advanced)
Content Length: {{content_length}}

Content Requirements:
{{requirements}}

Please create comprehensive educational content that:

1. **Introduction**
   - Clear topic overview
   - Learning objectives
   - Prerequisites (if any)

2. **Main Content**
   - Step-by-step explanations
   - Practical examples
   - Real-world applications
   - Common mistakes to avoid

3. **Broker-Specific Information**
   - How different brokers handle this topic
   - Platform-specific features
   - Regulatory considerations

4. **Practical Tips**
   - Best practices
   - Tools and resources
   - Next steps for learning

5. **Summary**
   - Key takeaways
   - Action items
   - Further reading suggestions

Use clear, accessible language appropriate for the target audience level.`,
      requiredVariables: ['topic', 'content_type', 'target_audience'],
      optionalVariables: ['content_length', 'requirements', 'examples'],
      maxTokens: 8192,
      temperature: 0.4,
      systemPrompt: 'You are an expert educator creating content for Broker Analysis educational platform.'
    });

    // SEO Content Template
    this.templates.set(PromptTemplate.SEO_CONTENT, {
      name: 'SEO-Optimized Content',
      description: 'SEO-friendly content for broker and trading topics',
      template: `Create SEO-optimized content for Broker Analysis:

SEO Parameters:
- Primary Keyword: {{primary_keyword}}
- Secondary Keywords: {{secondary_keywords}}
- Target Word Count: {{word_count}}
- Content Type: {{content_type}}
- Search Intent: {{search_intent}} (informational/commercial/transactional)

Content Topic: {{topic}}
Target Audience: {{target_audience}}

Create content that:

1. **SEO-Optimized Structure**
   - Compelling title with primary keyword
   - Clear H2/H3 headings with keywords
   - Meta description (150-160 characters)
   - Natural keyword integration

2. **Valuable Content**
   - Comprehensive topic coverage
   - Expert insights and analysis
   - Actionable information
   - Up-to-date and accurate data

3. **User Experience**
   - Clear, scannable formatting
   - Logical content flow
   - Engaging introduction and conclusion
   - Call-to-action where appropriate

4. **E-A-T Optimization**
   - Expert authoritativeness
   - Trustworthy information
   - Proper citations and sources
   - Regulatory compliance mentions

Ensure content serves user intent while being optimized for search engines.`,
      requiredVariables: [
        'primary_keyword',
        'topic',
        'content_type',
        'target_audience'
      ],
      optionalVariables: [
        'secondary_keywords',
        'word_count',
        'search_intent',
        'competitor_analysis'
      ],
      maxTokens: 8192,
      temperature: 0.3,
      systemPrompt: 'You are an expert SEO content creator for Broker Analysis financial platform.'
    });
  }
}

/**
 * Utility functions for prompt template management
 */
export class PromptUtils {
  /**
   * Extract variables from a template string
   */
  static extractVariables(template: string): string[] {
    const variableRegex = /{{(\w+)}}/g;
    const variables: string[] = [];
    let match;
    
    while ((match = variableRegex.exec(template)) !== null) {
      if (!variables.includes(match[1])) {
        variables.push(match[1]);
      }
    }
    
    return variables;
  }

  /**
   * Validate template syntax
   */
  static validateTemplate(template: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Check for unmatched braces
    const openBraces = (template.match(/{/g) || []).length;
    const closeBraces = (template.match(/}/g) || []).length;
    
    if (openBraces !== closeBraces) {
      errors.push('Unmatched braces in template');
    }
    
    // Check for invalid variable syntax
    const invalidVariables = template.match(/{[^{]|[^}]}/g);
    if (invalidVariables) {
      errors.push('Invalid variable syntax found');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Estimate token count for a prompt
   */
  static estimateTokenCount(text: string): number {
    // Rough estimation: ~4 characters per token
    return Math.ceil(text.length / 4);
  }

  /**
   * Truncate text to fit within token limit
   */
  static truncateToTokenLimit(text: string, maxTokens: number): string {
    const estimatedTokens = this.estimateTokenCount(text);
    
    if (estimatedTokens <= maxTokens) {
      return text;
    }
    
    const ratio = maxTokens / estimatedTokens;
    const targetLength = Math.floor(text.length * ratio * 0.9); // 10% buffer
    
    return text.substring(0, targetLength) + '...';
  }

  /**
   * Clean and sanitize user input for templates
   */
  static sanitizeInput(input: string): string {
    return input
      .replace(/[<>"'&]/g, '') // Remove potentially harmful characters
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }

  /**
   * Format currency values for display
   */
  static formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  /**
   * Format percentage values
   */
  static formatPercentage(value: number, decimals: number = 2): string {
    return `${(value * 100).toFixed(decimals)}%`;
  }

  /**
   * Generate context-aware system prompts
   */
  static generateSystemPrompt(
    role: string,
    context: string,
    guidelines: string[] = []
  ): string {
    const basePrompt = `You are ${role} for Broker Analysis, ${context}.`;
    
    if (guidelines.length > 0) {
      const guidelineText = guidelines.map(g => `- ${g}`).join('\n');
      return `${basePrompt}\n\nGuidelines:\n${guidelineText}`;
    }
    
    return basePrompt;
  }
}

// Export default instance
export const promptTemplateManager = new PromptTemplateManager();
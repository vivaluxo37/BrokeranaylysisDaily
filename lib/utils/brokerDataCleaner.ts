/**
 * Utility functions for cleaning and formatting broker data from the database
 */

/**
 * Clean and format pros/cons data that may contain long unformatted text
 */
export function cleanProsCons(items: string[]): string[] {
  if (!items || !Array.isArray(items)) return [];
  
  const cleanedItems: string[] = [];
  
  items.forEach(item => {
    if (typeof item !== 'string') return;
    
    // Split long text into sentences and extract meaningful pros/cons
    const sentences = item
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 10 && s.length < 200); // Filter reasonable length sentences
    
    sentences.forEach(sentence => {
      // Look for positive indicators for pros
      const prosIndicators = [
        'excellent', 'outstanding', 'competitive', 'low spreads', 'fast execution',
        'regulated', 'trusted', 'reliable', 'good', 'best', 'top', 'superior',
        'advanced', 'comprehensive', 'wide range', 'multiple', 'flexible'
      ];
      
      // Look for negative indicators for cons
      const consIndicators = [
        'high', 'expensive', 'limited', 'poor', 'slow', 'lack', 'no',
        'restricted', 'complex', 'difficult', 'issues', 'problems'
      ];
      
      const lowerSentence = sentence.toLowerCase();
      
      // Check if sentence contains meaningful information
      const hasProsIndicator = prosIndicators.some(indicator => 
        lowerSentence.includes(indicator)
      );
      
      const hasConsIndicator = consIndicators.some(indicator => 
        lowerSentence.includes(indicator)
      );
      
      if (hasProsIndicator || hasConsIndicator) {
        // Clean up the sentence
        const cleaned = sentence
          .replace(/^[^A-Za-z]*/, '') // Remove leading non-letters
          .replace(/[^.!?]*$/, '') // Remove trailing incomplete text
          .trim();
        
        if (cleaned.length > 15 && cleaned.length < 150) {
          cleanedItems.push(cleaned);
        }
      }
    });
  });
  
  // Remove duplicates and return first 5 items
  return [...new Set(cleanedItems)].slice(0, 5);
}

/**
 * Extract meaningful pros from broker data
 */
export function extractPros(broker: any): string[] {
  const rawPros = broker.pros || [];
  const cleaned = cleanProsCons(rawPros);
  
  // If no meaningful pros found, generate some based on broker data
  if (cleaned.length === 0) {
    const generatedPros: string[] = [];
    
    if (broker.overall_rating && parseFloat(broker.overall_rating) >= 4.0) {
      generatedPros.push('High overall rating and customer satisfaction');
    }
    
    if (broker.minimum_deposit && parseFloat(broker.minimum_deposit) <= 100) {
      generatedPros.push('Low minimum deposit requirement');
    }
    
    if (broker.regulation_info) {
      generatedPros.push('Well-regulated and compliant broker');
    }
    
    return generatedPros.slice(0, 3);
  }
  
  return cleaned;
}

/**
 * Extract meaningful cons from broker data
 */
export function extractCons(broker: any): string[] {
  const rawCons = broker.cons || [];
  const cleaned = cleanProsCons(rawCons);
  
  // If no meaningful cons found, generate some based on broker data
  if (cleaned.length === 0) {
    const generatedCons: string[] = [];
    
    if (broker.overall_rating && parseFloat(broker.overall_rating) < 3.0) {
      generatedCons.push('Below average customer ratings');
    }
    
    if (broker.minimum_deposit && parseFloat(broker.minimum_deposit) > 1000) {
      generatedCons.push('High minimum deposit requirement');
    }
    
    return generatedCons.slice(0, 3);
  }
  
  return cleaned;
}

/**
 * Clean and format broker description
 */
export function cleanDescription(description: string): string {
  if (!description || typeof description !== 'string') return '';
  
  // Take first 2-3 sentences that make sense
  const sentences = description
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 20 && s.length < 300)
    .slice(0, 3);
  
  return sentences.join('. ') + (sentences.length > 0 ? '.' : '');
}

/**
 * Format spreads information
 */
export function formatSpreads(spreadsInfo: any): { [key: string]: string } {
  if (!spreadsInfo || typeof spreadsInfo !== 'object') {
    return {
      'EUR/USD': 'N/A',
      'GBP/USD': 'N/A',
      'USD/JPY': 'N/A'
    };
  }
  
  return {
    'EUR/USD': spreadsInfo.eurusd || spreadsInfo['EUR/USD'] || 'N/A',
    'GBP/USD': spreadsInfo.gbpusd || spreadsInfo['GBP/USD'] || 'N/A',
    'USD/JPY': spreadsInfo.usdjpy || spreadsInfo['USD/JPY'] || 'N/A'
  };
}

/**
 * Clean and format regulation information
 */
export function formatRegulation(regulationInfo: any): string[] {
  if (!regulationInfo) return [];
  
  if (Array.isArray(regulationInfo)) {
    return regulationInfo.filter(reg => typeof reg === 'string' && reg.length > 0);
  }
  
  if (typeof regulationInfo === 'object') {
    const regulators = [];
    
    // Extract common regulator fields
    if (regulationInfo.primary) regulators.push(regulationInfo.primary);
    if (regulationInfo.secondary) regulators.push(regulationInfo.secondary);
    if (regulationInfo.regulators && Array.isArray(regulationInfo.regulators)) {
      regulators.push(...regulationInfo.regulators);
    }
    
    return regulators.filter(reg => typeof reg === 'string' && reg.length > 0);
  }
  
  if (typeof regulationInfo === 'string') {
    return [regulationInfo];
  }
  
  return [];
}

/**
 * Main function to clean and format broker data
 */
export function cleanBrokerData(broker: any) {
  return {
    ...broker,
    pros: extractPros(broker),
    cons: extractCons(broker),
    description: cleanDescription(broker.description),
    spreads: formatSpreads(broker.spreads_info),
    regulation: formatRegulation(broker.regulation_info),
    trustScore: broker.trust_score || 0,
    rating: parseFloat(broker.overall_rating) || 0,
    minDeposit: parseFloat(broker.minimum_deposit) || 0
  };
}
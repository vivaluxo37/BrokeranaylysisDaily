import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// Trust Score Weights
const TRUST_SCORE_WEIGHTS = {
  regulation: 0.30,
  financial_stability: 0.25,
  user_feedback: 0.20,
  transparency: 0.15,
  platform_reliability: 0.10
};

interface TrustScoreFactors {
  [key: string]: any;
}

interface TrustScoreComponent {
  score: number;
  weight: number;
  factors: TrustScoreFactors;
}

interface TrustScoreResult {
  overall: number;
  regulation: TrustScoreComponent;
  financial_stability: TrustScoreComponent;
  user_feedback: TrustScoreComponent;
  transparency: TrustScoreComponent;
  platform_reliability: TrustScoreComponent;
  last_updated: string;
  methodology: string;
}

function calculateRegulationScore(factors: TrustScoreFactors): number {
  let score = 0;
  
  // Primary regulator scoring (40 points)
  const regulatorScores: { [key: string]: number } = {
    'FCA': 40, 'CFTC': 40, 'BaFin': 40,
    'ASIC': 38, 'FINMA': 38, 'MAS': 38,
    'CySEC': 35, 'FSA': 35,
    'FSCA': 32,
    'CIMA': 25,
    'VFSC': 20,
    'FSC': 18
  };
  
  const primaryRegulator = factors.primary_regulator || 'Unknown';
  score += regulatorScores[primaryRegulator] || 15;
  
  // Additional licenses bonus (15 points)
  const additionalLicenses = factors.additional_licenses || [];
  if (Array.isArray(additionalLicenses)) {
    score += Math.min(additionalLicenses.length * 3, 15);
  }
  
  // Regulatory history (25 points)
  const historyScores: { [key: string]: number } = {
    'clean': 25,
    'minor_issues': 15,
    'major_issues': 5
  };
  const regulatoryHistory = factors.regulatory_history || 'clean';
  score += historyScores[regulatoryHistory] || 15;
  
  // Jurisdiction tier (20 points)
  const jurisdictionScores: { [key: string]: number } = {
    'tier1': 20,
    'tier2': 15,
    'tier3': 10,
    'offshore': 5
  };
  const jurisdictionTier = factors.jurisdiction_tier || 'tier3';
  score += jurisdictionScores[jurisdictionTier] || 10;
  
  return Math.min(score, 100);
}

function calculateFinancialStabilityScore(factors: TrustScoreFactors): number {
  let score = 0;
  
  // Public trading status (20 points)
  if (factors.publicly_traded) {
    score += 20;
  } else if (factors.parent_company && factors.parent_company !== 'Independent') {
    score += 15;
  } else {
    score += 10;
  }
  
  // Capital adequacy (30 points)
  const capitalScores: { [key: string]: number } = {
    'strong': 30,
    'adequate': 20,
    'weak': 10
  };
  const capitalAdequacy = factors.capital_adequacy || 'adequate';
  score += capitalScores[capitalAdequacy] || 20;
  
  // Insurance coverage (25 points)
  const insuranceCoverage = factors.insurance_coverage || 0;
  if (insuranceCoverage >= 1000000) {
    score += 25;
  } else if (insuranceCoverage >= 500000) {
    score += 20;
  } else if (insuranceCoverage >= 100000) {
    score += 15;
  } else if (insuranceCoverage > 0) {
    score += 10;
  }
  
  // Years in business (25 points)
  const yearsInBusiness = factors.years_in_business || 0;
  if (yearsInBusiness >= 20) {
    score += 25;
  } else if (yearsInBusiness >= 10) {
    score += 20;
  } else if (yearsInBusiness >= 5) {
    score += 15;
  } else if (yearsInBusiness >= 2) {
    score += 10;
  } else {
    score += 5;
  }
  
  return Math.min(score, 100);
}

function calculateUserFeedbackScore(factors: TrustScoreFactors): number {
  let score = 0;
  
  // Average rating (40 points)
  const averageRating = factors.average_rating || 3.0;
  score += (averageRating / 5.0) * 40;
  
  // Review volume credibility (20 points)
  const totalReviews = factors.total_reviews || 0;
  if (totalReviews >= 1000) {
    score += 20;
  } else if (totalReviews >= 500) {
    score += 18;
  } else if (totalReviews >= 100) {
    score += 15;
  } else if (totalReviews >= 50) {
    score += 12;
  } else if (totalReviews >= 10) {
    score += 8;
  } else {
    score += 5;
  }
  
  // Recent trend (15 points)
  const trendScores: { [key: string]: number } = {
    'improving': 15,
    'stable': 10,
    'declining': 5
  };
  const recentTrend = factors.recent_trend || 'stable';
  score += trendScores[recentTrend] || 10;
  
  // Withdrawal complaints penalty (15 points)
  const withdrawalComplaints = factors.withdrawal_complaints || 0;
  const withdrawalPenalty = Math.min(withdrawalComplaints * 2, 15);
  score += Math.max(15 - withdrawalPenalty, 0);
  
  // Support rating (10 points)
  const supportRating = factors.support_rating || 3.0;
  score += (supportRating / 5.0) * 10;
  
  return Math.min(score, 100);
}

function calculateTransparencyScore(factors: TrustScoreFactors): number {
  let score = 0;
  
  // Each factor worth 20 points
  if (factors.pricing_clarity) score += 20;
  if (factors.terms_accessibility !== false) score += 20; // Default to true
  if (factors.regulatory_disclosures) score += 20;
  if (factors.fee_transparency) score += 20;
  if (factors.conflict_of_interest) score += 20;
  
  return Math.min(score, 100);
}

function calculatePlatformReliabilityScore(factors: TrustScoreFactors): number {
  let score = 0;
  
  // Uptime percentage (40 points)
  const uptimePercentage = factors.uptime_percentage || 99.5;
  if (uptimePercentage >= 99.9) {
    score += 40;
  } else if (uptimePercentage >= 99.5) {
    score += 35;
  } else if (uptimePercentage >= 99.0) {
    score += 30;
  } else if (uptimePercentage >= 98.0) {
    score += 20;
  } else {
    score += 10;
  }
  
  // Execution quality (30 points)
  const executionScores: { [key: string]: number } = {
    'excellent': 30,
    'good': 25,
    'average': 15,
    'poor': 5
  };
  const executionQuality = factors.execution_quality || 'good';
  score += executionScores[executionQuality] || 15;
  
  // Technical issues penalty (20 points)
  const technicalIssues = factors.technical_issues || 1;
  const issuesPenalty = Math.min(technicalIssues * 3, 20);
  score += Math.max(20 - issuesPenalty, 0);
  
  // Server locations bonus (10 points)
  const serverLocations = factors.server_locations || 1;
  const locationBonus = Math.min(serverLocations * 2, 10);
  score += locationBonus;
  
  return Math.min(score, 100);
}

function extractTrustScoreFactors(broker: any): { [key: string]: TrustScoreFactors } {
  const regulationInfo = broker.regulation_info || {};
  const currentYear = new Date().getFullYear();
  const foundedYear = broker.founded_year;
  const yearsInBusiness = foundedYear ? currentYear - foundedYear : 0;
  
  // Regulation factors
  const regulationFactors = {
    primary_regulator: regulationInfo.primary_regulator || 'Unknown',
    additional_licenses: regulationInfo.additional_licenses || [],
    regulatory_history: regulationInfo.regulatory_history || 'clean',
    jurisdiction_tier: regulationInfo.jurisdiction_tier || 'tier3'
  };
  
  // Financial stability factors
  const financialStabilityFactors = {
    parent_company: broker.parent_company || 'Independent',
    publicly_traded: broker.publicly_traded || false,
    capital_adequacy: regulationInfo.capital_adequacy || 'adequate',
    insurance_coverage: regulationInfo.insurance_coverage || 0,
    years_in_business: yearsInBusiness
  };
  
  // User feedback factors
  const userFeedbackFactors = {
    average_rating: broker.user_reviews_average || 3.0,
    total_reviews: broker.user_reviews_count || 0,
    recent_trend: 'stable', // Default
    withdrawal_complaints: 0, // Default
    support_rating: broker.customer_service_score || 3.0
  };
  
  // Transparency factors
  const transparencyFactors = {
    pricing_clarity: (broker.transparency_score || 0) >= 70,
    terms_accessibility: true, // Default assumption
    regulatory_disclosures: broker.regulatory_compliance || false,
    fee_transparency: (broker.fees_score || 0) >= 70,
    conflict_of_interest: broker.third_party_audits || false
  };
  
  // Platform reliability factors
  const serverLocations = broker.server_locations || [];
  const platformReliabilityFactors = {
    uptime_percentage: 99.5, // Default assumption
    execution_quality: 'good', // Default assumption
    technical_issues: 1, // Default assumption
    slippage_reports: 0,
    server_locations: Array.isArray(serverLocations) ? serverLocations.length : 1
  };
  
  return {
    regulation: regulationFactors,
    financial_stability: financialStabilityFactors,
    user_feedback: userFeedbackFactors,
    transparency: transparencyFactors,
    platform_reliability: platformReliabilityFactors
  };
}

function calculateBrokerTrustScore(broker: any): TrustScoreResult {
  const factors = extractTrustScoreFactors(broker);
  
  // Calculate individual component scores
  const regulationScore = calculateRegulationScore(factors.regulation);
  const financialStabilityScore = calculateFinancialStabilityScore(factors.financial_stability);
  const userFeedbackScore = calculateUserFeedbackScore(factors.user_feedback);
  const transparencyScore = calculateTransparencyScore(factors.transparency);
  const platformReliabilityScore = calculatePlatformReliabilityScore(factors.platform_reliability);
  
  // Calculate weighted overall score
  const overallScore = (
    regulationScore * TRUST_SCORE_WEIGHTS.regulation +
    financialStabilityScore * TRUST_SCORE_WEIGHTS.financial_stability +
    userFeedbackScore * TRUST_SCORE_WEIGHTS.user_feedback +
    transparencyScore * TRUST_SCORE_WEIGHTS.transparency +
    platformReliabilityScore * TRUST_SCORE_WEIGHTS.platform_reliability
  );
  
  return {
    overall: Math.round(overallScore * 100) / 100,
    regulation: {
      score: regulationScore,
      weight: TRUST_SCORE_WEIGHTS.regulation,
      factors: factors.regulation
    },
    financial_stability: {
      score: financialStabilityScore,
      weight: TRUST_SCORE_WEIGHTS.financial_stability,
      factors: factors.financial_stability
    },
    user_feedback: {
      score: userFeedbackScore,
      weight: TRUST_SCORE_WEIGHTS.user_feedback,
      factors: factors.user_feedback
    },
    transparency: {
      score: transparencyScore,
      weight: TRUST_SCORE_WEIGHTS.transparency,
      factors: factors.transparency
    },
    platform_reliability: {
      score: platformReliabilityScore,
      weight: TRUST_SCORE_WEIGHTS.platform_reliability,
      factors: factors.platform_reliability
    },
    last_updated: new Date().toISOString(),
    methodology: 'Broker Analysis Trust Score v1.0 - Evidence-based scoring across 5 key dimensions'
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Use Supabase client directly
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return res.status(500).json({ error: 'Missing Supabase configuration' });
    }
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Get all brokers
    const { data: brokers, error: fetchError } = await supabase
      .from('brokers')
      .select('*');
    
    if (fetchError) {
      console.error('Error fetching brokers:', fetchError);
      return res.status(500).json({ error: 'Failed to fetch brokers' });
    }
    
    if (!brokers || brokers.length === 0) {
      return res.status(404).json({ error: 'No brokers found' });
    }
    
    let updatedCount = 0;
    let errorCount = 0;
    const results = [];
    
    // Update trust scores for all brokers
    for (const broker of brokers) {
      try {
        const trustScoreComponents = calculateBrokerTrustScore(broker);
        
        // Update broker using Supabase client
        const { error: updateError } = await supabase
          .from('brokers')
          .update({
            trust_score: trustScoreComponents.overall,
            trust_score_components: trustScoreComponents,
            updated_at: new Date().toISOString()
          })
          .eq('id', broker.id);
        
        if (updateError) {
          console.error(`Error updating ${broker.name}:`, updateError);
          errorCount++;
        } else {
          updatedCount++;
          results.push({
            id: broker.id,
            name: broker.name,
            trust_score: trustScoreComponents.overall
          });
        }
        
      } catch (error) {
        console.error(`Error calculating trust score for ${broker.name}:`, error);
        errorCount++;
      }
    }
    
    return res.status(200).json({
      success: true,
      message: `Trust scores updated successfully`,
      updated_count: updatedCount,
      error_count: errorCount,
      total_brokers: brokers.length,
      results: results.slice(0, 10) // Return first 10 results as sample
    });
    
  } catch (error) {
    console.error('Error updating trust scores:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
import { Broker } from '@/lib/supabase'
import { supabase } from '@/lib/supabase'

// Trust Score Component Weights (must sum to 1.0)
export const TRUST_SCORE_WEIGHTS = {
  regulation: 0.30,        // 30% - Regulatory oversight and compliance
  financialStability: 0.25, // 25% - Financial strength and stability
  userFeedback: 0.20,      // 20% - User reviews and satisfaction
  transparency: 0.15,      // 15% - Business transparency and disclosure
  platformReliability: 0.10 // 10% - Platform uptime and execution quality
} as const

// Trust Score Thresholds
export const TRUST_SCORE_THRESHOLDS = {
  excellent: 90,
  good: 80,
  fair: 70,
  poor: 0
} as const

// Regulation Score Factors
interface RegulationFactors {
  primaryRegulator: string
  additionalLicenses: string[]
  regulatoryHistory: 'clean' | 'minor_issues' | 'major_issues'
  jurisdictionTier: 'tier1' | 'tier2' | 'tier3' | 'offshore'
}

// Financial Stability Factors
interface FinancialStabilityFactors {
  parentCompany: string
  publiclyTraded: boolean
  capitalAdequacy: 'strong' | 'adequate' | 'weak'
  insuranceCoverage: number
  yearsInBusiness: number
}

// User Feedback Factors
interface UserFeedbackFactors {
  averageRating: number
  totalReviews: number
  recentTrend: 'improving' | 'stable' | 'declining'
  withdrawalComplaints: number
  supportRating: number
}

// Transparency Factors
interface TransparencyFactors {
  pricingClarity: boolean
  termsAccessibility: boolean
  regulatoryDisclosures: boolean
  feeTransparency: boolean
  conflictOfInterest: boolean
}

// Platform Reliability Factors
interface PlatformReliabilityFactors {
  uptimePercentage: number
  executionQuality: 'excellent' | 'good' | 'average' | 'poor'
  technicalIssues: number // incidents per month
  slippageReports: number
  serverLocations: number
}

// Complete Trust Score Components
export interface TrustScoreComponents {
  overall: number
  regulation: {
    score: number
    weight: number
    factors: RegulationFactors
  }
  financialStability: {
    score: number
    weight: number
    factors: FinancialStabilityFactors
  }
  userFeedback: {
    score: number
    weight: number
    factors: UserFeedbackFactors
  }
  transparency: {
    score: number
    weight: number
    factors: TransparencyFactors
  }
  platformReliability: {
    score: number
    weight: number
    factors: PlatformReliabilityFactors
  }
  lastUpdated: string
  methodology: string
}

/**
 * Calculate regulation score based on regulatory oversight and compliance
 */
export function calculateRegulationScore(factors: RegulationFactors): number {
  let score = 0
  
  // Primary regulator scoring (40 points)
  const regulatorScores: Record<string, number> = {
    'FCA': 40,      // UK Financial Conduct Authority
    'CFTC': 40,     // US Commodity Futures Trading Commission
    'ASIC': 38,     // Australian Securities and Investments Commission
    'CySEC': 35,    // Cyprus Securities and Exchange Commission
    'BaFin': 40,    // German Federal Financial Supervisory Authority
    'FINMA': 38,    // Swiss Financial Market Supervisory Authority
    'FSA': 35,      // Financial Services Agency (Japan)
    'MAS': 38,      // Monetary Authority of Singapore
    'FSCA': 32,     // Financial Sector Conduct Authority (South Africa)
    'CIMA': 25,     // Cayman Islands Monetary Authority
    'VFSC': 20,     // Vanuatu Financial Services Commission
    'FSC': 18       // Financial Services Commission (various offshore)
  }
  
  score += regulatorScores[factors.primaryRegulator] || 15
  
  // Additional licenses bonus (15 points)
  const additionalLicenseBonus = Math.min(factors.additionalLicenses.length * 3, 15)
  score += additionalLicenseBonus
  
  // Regulatory history (25 points)
  const historyScores = {
    'clean': 25,
    'minor_issues': 15,
    'major_issues': 5
  }
  score += historyScores[factors.regulatoryHistory]
  
  // Jurisdiction tier (20 points)
  const jurisdictionScores = {
    'tier1': 20,    // Major financial centers (US, UK, EU, Australia, etc.)
    'tier2': 15,    // Regulated but less stringent (Cyprus, Malta, etc.)
    'tier3': 10,    // Emerging markets with regulation
    'offshore': 5   // Offshore jurisdictions
  }
  score += jurisdictionScores[factors.jurisdictionTier]
  
  return Math.min(score, 100)
}

/**
 * Calculate financial stability score
 */
export function calculateFinancialStabilityScore(factors: FinancialStabilityFactors): number {
  let score = 0
  
  // Public trading status (20 points)
  if (factors.publiclyTraded) {
    score += 20
  } else if (factors.parentCompany && factors.parentCompany !== 'Independent') {
    score += 15 // Has parent company backing
  } else {
    score += 10 // Independent private company
  }
  
  // Capital adequacy (30 points)
  const capitalScores = {
    'strong': 30,
    'adequate': 20,
    'weak': 10
  }
  score += capitalScores[factors.capitalAdequacy]
  
  // Insurance coverage (25 points)
  if (factors.insuranceCoverage >= 1000000) {
    score += 25 // $1M+ coverage
  } else if (factors.insuranceCoverage >= 500000) {
    score += 20 // $500K+ coverage
  } else if (factors.insuranceCoverage >= 100000) {
    score += 15 // $100K+ coverage
  } else if (factors.insuranceCoverage > 0) {
    score += 10 // Some coverage
  }
  
  // Years in business (25 points)
  if (factors.yearsInBusiness >= 20) {
    score += 25
  } else if (factors.yearsInBusiness >= 10) {
    score += 20
  } else if (factors.yearsInBusiness >= 5) {
    score += 15
  } else if (factors.yearsInBusiness >= 2) {
    score += 10
  } else {
    score += 5
  }
  
  return Math.min(score, 100)
}

/**
 * Calculate user feedback score
 */
export function calculateUserFeedbackScore(factors: UserFeedbackFactors): number {
  let score = 0
  
  // Average rating (40 points)
  score += (factors.averageRating / 5) * 40
  
  // Review volume credibility (20 points)
  if (factors.totalReviews >= 1000) {
    score += 20
  } else if (factors.totalReviews >= 500) {
    score += 18
  } else if (factors.totalReviews >= 100) {
    score += 15
  } else if (factors.totalReviews >= 50) {
    score += 12
  } else if (factors.totalReviews >= 10) {
    score += 8
  } else {
    score += 5
  }
  
  // Recent trend (15 points)
  const trendScores = {
    'improving': 15,
    'stable': 10,
    'declining': 5
  }
  score += trendScores[factors.recentTrend]
  
  // Withdrawal complaints penalty (15 points)
  const withdrawalPenalty = Math.min(factors.withdrawalComplaints * 2, 15)
  score += Math.max(15 - withdrawalPenalty, 0)
  
  // Support rating (10 points)
  score += (factors.supportRating / 5) * 10
  
  return Math.min(score, 100)
}

/**
 * Calculate transparency score
 */
export function calculateTransparencyScore(factors: TransparencyFactors): number {
  let score = 0
  
  // Each factor worth 20 points
  if (factors.pricingClarity) score += 20
  if (factors.termsAccessibility) score += 20
  if (factors.regulatoryDisclosures) score += 20
  if (factors.feeTransparency) score += 20
  if (factors.conflictOfInterest) score += 20
  
  return Math.min(score, 100)
}

/**
 * Calculate platform reliability score
 */
export function calculatePlatformReliabilityScore(factors: PlatformReliabilityFactors): number {
  let score = 0
  
  // Uptime percentage (40 points)
  if (factors.uptimePercentage >= 99.9) {
    score += 40
  } else if (factors.uptimePercentage >= 99.5) {
    score += 35
  } else if (factors.uptimePercentage >= 99.0) {
    score += 30
  } else if (factors.uptimePercentage >= 98.0) {
    score += 20
  } else {
    score += 10
  }
  
  // Execution quality (30 points)
  const executionScores = {
    'excellent': 30,
    'good': 25,
    'average': 15,
    'poor': 5
  }
  score += executionScores[factors.executionQuality]
  
  // Technical issues penalty (20 points)
  const issuesPenalty = Math.min(factors.technicalIssues * 3, 20)
  score += Math.max(20 - issuesPenalty, 0)
  
  // Server locations bonus (10 points)
  const locationBonus = Math.min(factors.serverLocations * 2, 10)
  score += locationBonus
  
  return Math.min(score, 100)
}

/**
 * Calculate overall trust score from components
 */
export function calculateOverallTrustScore(components: Omit<TrustScoreComponents, 'overall' | 'lastUpdated' | 'methodology'>): number {
  const weightedScore = 
    (components.regulation.score * TRUST_SCORE_WEIGHTS.regulation) +
    (components.financialStability.score * TRUST_SCORE_WEIGHTS.financialStability) +
    (components.userFeedback.score * TRUST_SCORE_WEIGHTS.userFeedback) +
    (components.transparency.score * TRUST_SCORE_WEIGHTS.transparency) +
    (components.platformReliability.score * TRUST_SCORE_WEIGHTS.platformReliability)
  
  return Math.round(weightedScore * 100) / 100 // Round to 2 decimal places
}

/**
 * Extract trust score factors from broker data
 */
export function extractTrustScoreFactors(broker: Broker): {
  regulation: RegulationFactors
  financialStability: FinancialStabilityFactors
  userFeedback: UserFeedbackFactors
  transparency: TransparencyFactors
  platformReliability: PlatformReliabilityFactors
} {
  // Extract regulation info
  const regulationInfo = broker.regulation_info || {}
  const regulation: RegulationFactors = {
    primaryRegulator: regulationInfo.primary_regulator || 'Unknown',
    additionalLicenses: regulationInfo.additional_licenses || [],
    regulatoryHistory: regulationInfo.regulatory_history || 'clean',
    jurisdictionTier: regulationInfo.jurisdiction_tier || 'tier3'
  }
  
  // Extract financial stability info
  const currentYear = new Date().getFullYear()
  const yearsInBusiness = broker.founded_year ? currentYear - broker.founded_year : 0
  
  const financialStability: FinancialStabilityFactors = {
    parentCompany: broker.parent_company || 'Independent',
    publiclyTraded: broker.publicly_traded || false,
    capitalAdequacy: regulationInfo.capital_adequacy || 'adequate',
    insuranceCoverage: regulationInfo.insurance_coverage || 0,
    yearsInBusiness
  }
  
  // Extract user feedback info
  const userFeedback: UserFeedbackFactors = {
    averageRating: broker.user_reviews_average || 3.0,
    totalReviews: broker.user_reviews_count || 0,
    recentTrend: 'stable', // This would come from trend analysis
    withdrawalComplaints: 0, // This would come from complaint tracking
    supportRating: broker.customer_service_score || 3.0
  }
  
  // Extract transparency info
  const transparency: TransparencyFactors = {
    pricingClarity: broker.transparency_score ? broker.transparency_score >= 70 : false,
    termsAccessibility: true, // Default assumption
    regulatoryDisclosures: broker.regulatory_compliance || false,
    feeTransparency: broker.fees_score ? broker.fees_score >= 70 : false,
    conflictOfInterest: broker.third_party_audits || false
  }
  
  // Extract platform reliability info
  const platformReliability: PlatformReliabilityFactors = {
    uptimePercentage: 99.5, // Default assumption
    executionQuality: 'good', // Default assumption
    technicalIssues: 1, // Default assumption
    slippageReports: 0,
    serverLocations: broker.server_locations?.length || 1
  }
  
  return {
    regulation,
    financialStability,
    userFeedback,
    transparency,
    platformReliability
  }
}

/**
 * Calculate complete trust score for a broker
 */
export function calculateBrokerTrustScore(broker: Broker): TrustScoreComponents {
  const factors = extractTrustScoreFactors(broker)
  
  const regulation = {
    score: calculateRegulationScore(factors.regulation),
    weight: TRUST_SCORE_WEIGHTS.regulation,
    factors: factors.regulation
  }
  
  const financialStability = {
    score: calculateFinancialStabilityScore(factors.financialStability),
    weight: TRUST_SCORE_WEIGHTS.financialStability,
    factors: factors.financialStability
  }
  
  const userFeedback = {
    score: calculateUserFeedbackScore(factors.userFeedback),
    weight: TRUST_SCORE_WEIGHTS.userFeedback,
    factors: factors.userFeedback
  }
  
  const transparency = {
    score: calculateTransparencyScore(factors.transparency),
    weight: TRUST_SCORE_WEIGHTS.transparency,
    factors: factors.transparency
  }
  
  const platformReliability = {
    score: calculatePlatformReliabilityScore(factors.platformReliability),
    weight: TRUST_SCORE_WEIGHTS.platformReliability,
    factors: factors.platformReliability
  }
  
  const components = {
    regulation,
    financialStability,
    userFeedback,
    transparency,
    platformReliability
  }
  
  const overall = calculateOverallTrustScore(components)
  
  return {
    overall,
    ...components,
    lastUpdated: new Date().toISOString(),
    methodology: 'Broker Analysis Trust Score v1.0 - Evidence-based scoring across 5 key dimensions'
  }
}

/**
 * Update trust score for a broker in the database
 */
export async function updateBrokerTrustScore(brokerId: string): Promise<TrustScoreComponents | null> {
  try {
    // Get broker data
    const { data: broker, error: fetchError } = await supabase
      .from('brokers')
      .select('*')
      .eq('id', brokerId)
      .single()
    
    if (fetchError || !broker) {
      console.error('Error fetching broker:', fetchError)
      return null
    }
    
    // Calculate trust score
    const trustScoreComponents = calculateBrokerTrustScore(broker)
    
    // Update broker with new trust score and components
    const { error: updateError } = await supabase
      .from('brokers')
      .update({
        trust_score: trustScoreComponents.overall,
        trust_score_components: trustScoreComponents,
        updated_at: new Date().toISOString()
      })
      .eq('id', brokerId)
    
    if (updateError) {
      console.error('Error updating trust score:', updateError)
      return null
    }
    
    return trustScoreComponents
  } catch (error) {
    console.error('Error in updateBrokerTrustScore:', error)
    return null
  }
}

/**
 * Update trust scores for all brokers
 */
export async function updateAllBrokerTrustScores(): Promise<{ updated: number; errors: number }> {
  let updated = 0
  let errors = 0
  
  try {
    // Get all brokers
    const { data: brokers, error: fetchError } = await supabase
      .from('brokers')
      .select('id')
    
    if (fetchError || !brokers) {
      console.error('Error fetching brokers:', fetchError)
      return { updated: 0, errors: 1 }
    }
    
    // Update each broker's trust score
    for (const broker of brokers) {
      const result = await updateBrokerTrustScore(broker.id)
      if (result) {
        updated++
      } else {
        errors++
      }
    }
    
    console.log(`Trust score update complete: ${updated} updated, ${errors} errors`)
    return { updated, errors }
  } catch (error) {
    console.error('Error in updateAllBrokerTrustScores:', error)
    return { updated, errors: errors + 1 }
  }
}

/**
 * Get trust score label based on score
 */
export function getTrustScoreLabel(score: number): string {
  if (score >= TRUST_SCORE_THRESHOLDS.excellent) return 'Excellent'
  if (score >= TRUST_SCORE_THRESHOLDS.good) return 'Good'
  if (score >= TRUST_SCORE_THRESHOLDS.fair) return 'Fair'
  return 'Poor'
}

/**
 * Get trust score color class based on score
 */
export function getTrustScoreColorClass(score: number): string {
  if (score >= TRUST_SCORE_THRESHOLDS.excellent) return 'trust-score-excellent'
  if (score >= TRUST_SCORE_THRESHOLDS.good) return 'trust-score-good'
  if (score >= TRUST_SCORE_THRESHOLDS.fair) return 'trust-score-fair'
  return 'trust-score-poor'
}

/**
 * Get trust score background color class based on score
 */
export function getTrustScoreBgColorClass(score: number): string {
  if (score >= TRUST_SCORE_THRESHOLDS.excellent) return 'bg-green-50 border-green-200'
  if (score >= TRUST_SCORE_THRESHOLDS.good) return 'bg-blue-50 border-blue-200'
  if (score >= TRUST_SCORE_THRESHOLDS.fair) return 'bg-yellow-50 border-yellow-200'
  return 'bg-red-50 border-red-200'
}
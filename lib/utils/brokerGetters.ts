/**
 * Utility functions for extracting broker data from various object shapes
 * These functions handle the different data formats that might come from the database
 */

export const getBrokerTrustScore = (broker: any): number => {
  return broker.trustScore ?? broker.trust_score ?? 0
}

export const getBrokerSpread = (broker: any): number => {
  return broker.spreads?.['EUR/USD'] ?? 
         broker.spreads_info?.EURUSD ?? 
         broker.spreads?.eurusd ?? 
         broker.spreads?.EURUSD ?? 
         999
}

export const getBrokerRating = (broker: any): number => {
  return broker.rating ?? broker.overall_rating ?? 0
}

export const getBrokerMinDeposit = (broker: any): number => {
  return broker.minDeposit ?? broker.minimum_deposit ?? 0
}

export const getBrokerExecutionSpeed = (broker: any): number | null => {
  return broker.executionSpeed ?? broker.execution_speed_ms ?? broker.execution ?? null
}

export const getBrokerCommission = (broker: any): number | null => {
  return broker.commission ?? 
         broker.commissions?.per_lot ?? 
         broker.commissions?.perLot ?? 
         broker.commissions?.standard ?? 
         null
}

export const getBrokerReviewsCount = (broker: any): number | null => {
  return broker.user_reviews_count ?? broker.reviews ?? null
}

export const getBrokerRegulationList = (broker: any): string[] => {
  return broker.regulation ?? broker.regulatory_bodies ?? broker.regulation_info ?? []
}

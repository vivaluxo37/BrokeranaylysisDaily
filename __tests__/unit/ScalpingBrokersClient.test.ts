// Extract the getter functions for testing
// Since they're inside the component, we'll create a separate utility file for them
// and test that file instead

// First, let's create the utility file
import { 
  getBrokerTrustScore,
  getBrokerSpread,
  getBrokerRating,
  getBrokerMinDeposit,
  getBrokerExecutionSpeed,
  getBrokerCommission,
  getBrokerReviewsCount,
  getBrokerRegulationList
} from '@/lib/utils/brokerGetters'

describe('ScalpingBrokersClient Getters', () => {
  describe('getBrokerTrustScore', () => {
    it('should return trustScore when available', () => {
      const broker = { trustScore: 95 }
      expect(getBrokerTrustScore(broker)).toBe(95)
    })

    it('should return trust_score when trustScore not available', () => {
      const broker = { trust_score: 85 }
      expect(getBrokerTrustScore(broker)).toBe(85)
    })

    it('should return 0 when neither is available', () => {
      const broker = {}
      expect(getBrokerTrustScore(broker)).toBe(0)
    })

    it('should prioritize trustScore over trust_score', () => {
      const broker = { trustScore: 95, trust_score: 85 }
      expect(getBrokerTrustScore(broker)).toBe(95)
    })
  })

  describe('getBrokerSpread', () => {
    it('should return spread from spreads.EUR/USD', () => {
      const broker = { spreads: { 'EUR/USD': 0.1 } }
      expect(getBrokerSpread(broker)).toBe(0.1)
    })

    it('should return spread from spreads_info.EURUSD', () => {
      const broker = { spreads_info: { EURUSD: 0.2 } }
      expect(getBrokerSpread(broker)).toBe(0.2)
    })

    it('should return spread from spreads.eurusd', () => {
      const broker = { spreads: { eurusd: 0.3 } }
      expect(getBrokerSpread(broker)).toBe(0.3)
    })

    it('should return spread from spreads.EURUSD', () => {
      const broker = { spreads: { EURUSD: 0.4 } }
      expect(getBrokerSpread(broker)).toBe(0.4)
    })

    it('should return 999 when no spread data available', () => {
      const broker = {}
      expect(getBrokerSpread(broker)).toBe(999)
    })

    it('should prioritize EUR/USD format', () => {
      const broker = { 
        spreads: { 'EUR/USD': 0.1, eurusd: 0.3, EURUSD: 0.4 },
        spreads_info: { EURUSD: 0.2 }
      }
      expect(getBrokerSpread(broker)).toBe(0.1)
    })
  })

  describe('getBrokerRating', () => {
    it('should return rating when available', () => {
      const broker = { rating: 4.5 }
      expect(getBrokerRating(broker)).toBe(4.5)
    })

    it('should return overall_rating when rating not available', () => {
      const broker = { overall_rating: 4.2 }
      expect(getBrokerRating(broker)).toBe(4.2)
    })

    it('should return 0 when neither is available', () => {
      const broker = {}
      expect(getBrokerRating(broker)).toBe(0)
    })
  })

  describe('getBrokerMinDeposit', () => {
    it('should return minDeposit when available', () => {
      const broker = { minDeposit: 100 }
      expect(getBrokerMinDeposit(broker)).toBe(100)
    })

    it('should return minimum_deposit when minDeposit not available', () => {
      const broker = { minimum_deposit: 200 }
      expect(getBrokerMinDeposit(broker)).toBe(200)
    })

    it('should return 0 when neither is available', () => {
      const broker = {}
      expect(getBrokerMinDeposit(broker)).toBe(0)
    })
  })

  describe('getBrokerExecutionSpeed', () => {
    it('should return executionSpeed when available', () => {
      const broker = { executionSpeed: 15 }
      expect(getBrokerExecutionSpeed(broker)).toBe(15)
    })

    it('should return execution_speed_ms when executionSpeed not available', () => {
      const broker = { execution_speed_ms: 20 }
      expect(getBrokerExecutionSpeed(broker)).toBe(20)
    })

    it('should return execution when other fields not available', () => {
      const broker = { execution: 25 }
      expect(getBrokerExecutionSpeed(broker)).toBe(25)
    })

    it('should return null when no execution data available', () => {
      const broker = {}
      expect(getBrokerExecutionSpeed(broker)).toBeNull()
    })

    it('should handle zero values correctly', () => {
      const broker = { executionSpeed: 0 }
      expect(getBrokerExecutionSpeed(broker)).toBe(0)
    })
  })

  describe('getBrokerCommission', () => {
    it('should return commission when available', () => {
      const broker = { commission: 3.5 }
      expect(getBrokerCommission(broker)).toBe(3.5)
    })

    it('should return commissions.per_lot when commission not available', () => {
      const broker = { commissions: { per_lot: 4.0 } }
      expect(getBrokerCommission(broker)).toBe(4.0)
    })

    it('should return commissions.perLot when other formats not available', () => {
      const broker = { commissions: { perLot: 4.5 } }
      expect(getBrokerCommission(broker)).toBe(4.5)
    })

    it('should return commissions.standard when other formats not available', () => {
      const broker = { commissions: { standard: 5.0 } }
      expect(getBrokerCommission(broker)).toBe(5.0)
    })

    it('should return null when no commission data available', () => {
      const broker = {}
      expect(getBrokerCommission(broker)).toBeNull()
    })

    it('should handle zero commission correctly', () => {
      const broker = { commission: 0 }
      expect(getBrokerCommission(broker)).toBe(0)
    })
  })

  describe('getBrokerReviewsCount', () => {
    it('should return user_reviews_count when available', () => {
      const broker = { user_reviews_count: 150 }
      expect(getBrokerReviewsCount(broker)).toBe(150)
    })

    it('should return reviews when user_reviews_count not available', () => {
      const broker = { reviews: 200 }
      expect(getBrokerReviewsCount(broker)).toBe(200)
    })

    it('should return null when no review count available', () => {
      const broker = {}
      expect(getBrokerReviewsCount(broker)).toBeNull()
    })
  })

  describe('getBrokerRegulationList', () => {
    it('should return regulation array when available', () => {
      const broker = { regulation: ['FCA', 'CySEC'] }
      expect(getBrokerRegulationList(broker)).toEqual(['FCA', 'CySEC'])
    })

    it('should return regulatory_bodies when regulation not available', () => {
      const broker = { regulatory_bodies: ['ASIC', 'FSA'] }
      expect(getBrokerRegulationList(broker)).toEqual(['ASIC', 'FSA'])
    })

    it('should return regulation_info when other formats not available', () => {
      const broker = { regulation_info: ['CFTC', 'NFA'] }
      expect(getBrokerRegulationList(broker)).toEqual(['CFTC', 'NFA'])
    })

    it('should return empty array when no regulation data available', () => {
      const broker = {}
      expect(getBrokerRegulationList(broker)).toEqual([])
    })

    it('should handle non-array regulation data', () => {
      const broker = { regulation: 'FCA' }
      expect(getBrokerRegulationList(broker)).toBe('FCA')
    })
  })

  describe('Edge cases and data variations', () => {
    it('should handle null and undefined values gracefully', () => {
      const broker = {
        trustScore: null,
        trust_score: undefined,
        spreads: null,
        rating: undefined,
        minDeposit: null
      }

      expect(getBrokerTrustScore(broker)).toBe(0)
      expect(getBrokerSpread(broker)).toBe(999)
      expect(getBrokerRating(broker)).toBe(0)
      expect(getBrokerMinDeposit(broker)).toBe(0)
    })

    it('should handle complex nested objects', () => {
      const broker = {
        spreads: {
          'EUR/USD': 0.1,
          'GBP/USD': 0.2,
          eurusd: 0.3
        },
        commissions: {
          per_lot: 3.5,
          perLot: 4.0,
          standard: 5.0,
          premium: 2.5
        },
        regulation_info: ['FCA', 'CySEC', 'ASIC']
      }

      expect(getBrokerSpread(broker)).toBe(0.1)
      expect(getBrokerCommission(broker)).toBe(3.5)
      expect(getBrokerRegulationList(broker)).toEqual(['FCA', 'CySEC', 'ASIC'])
    })

    it('should handle mixed data types', () => {
      const broker = {
        trustScore: '95',
        rating: '4.5',
        minDeposit: '100',
        executionSpeed: '15'
      }

      // These should work with string values too
      expect(getBrokerTrustScore(broker)).toBe('95')
      expect(getBrokerRating(broker)).toBe('4.5')
      expect(getBrokerMinDeposit(broker)).toBe('100')
      expect(getBrokerExecutionSpeed(broker)).toBe('15')
    })
  })
})

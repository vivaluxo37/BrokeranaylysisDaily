import { searchAllContent } from '@/lib/services/vectorService'

// Mock Supabase
const mockSupabase = {
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    textSearch: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
  }))
}

jest.mock('@/lib/supabase', () => ({
  supabase: mockSupabase
}))

describe('vectorService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('searchAllContent', () => {
    it('should return formatted search results for brokers', async () => {
      const mockBrokerResults = [
        {
          id: 'broker-1',
          name: 'IC Markets',
          slug: 'ic-markets',
          description: 'Leading ECN broker with tight spreads',
          trust_score: 95,
          overall_rating: 4.8,
          minimum_deposit: 200,
          regulation_info: ['ASIC', 'CySEC'],
        }
      ]

      const mockArticleResults = [
        {
          id: 'article-1',
          title: 'Best Forex Brokers 2024',
          slug: 'best-forex-brokers-2024',
          excerpt: 'Complete guide to choosing the best forex broker',
          category: 'Education',
        }
      ]

      // Mock broker search
      mockSupabase.from.mockImplementationOnce(() => ({
        select: jest.fn().mockReturnThis(),
        textSearch: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: mockBrokerResults,
          error: null
        })
      }))

      // Mock article search
      mockSupabase.from.mockImplementationOnce(() => ({
        select: jest.fn().mockReturnThis(),
        textSearch: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: mockArticleResults,
          error: null
        })
      }))

      const results = await searchAllContent('forex broker', 10)

      expect(results).toHaveLength(2)
      
      // Check broker result formatting
      const brokerResult = results.find(r => r.type === 'broker')
      expect(brokerResult).toEqual({
        type: 'broker',
        title: 'IC Markets',
        content: 'IC Markets - Trust Score: 95/100, Rating: 4.8/5',
        url: '/brokers/ic-markets',
        similarity: 1.0
      })

      // Check article result formatting
      const articleResult = results.find(r => r.type === 'article')
      expect(articleResult).toEqual({
        type: 'article',
        title: 'Best Forex Brokers 2024',
        content: 'Complete guide to choosing the best forex broker',
        url: '/articles/best-forex-brokers-2024',
        similarity: 1.0
      })
    })

    it('should handle brokers with missing data gracefully', async () => {
      const mockBrokerResults = [
        {
          id: 'broker-1',
          name: 'Test Broker',
          slug: 'test-broker',
          description: null,
          trust_score: null,
          overall_rating: null,
          minimum_deposit: null,
          regulation_info: null,
        }
      ]

      mockSupabase.from.mockImplementationOnce(() => ({
        select: jest.fn().mockReturnThis(),
        textSearch: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: mockBrokerResults,
          error: null
        })
      }))

      mockSupabase.from.mockImplementationOnce(() => ({
        select: jest.fn().mockReturnThis(),
        textSearch: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: [],
          error: null
        })
      }))

      const results = await searchAllContent('test', 10)

      expect(results).toHaveLength(1)
      expect(results[0]).toEqual({
        type: 'broker',
        title: 'Test Broker',
        content: 'Test Broker - Trust Score: N/A/100, Rating: N/A/5',
        url: '/brokers/test-broker',
        similarity: 1.0
      })
    })

    it('should handle database errors gracefully', async () => {
      const mockError = new Error('Database connection failed')

      mockSupabase.from.mockImplementation(() => ({
        select: jest.fn().mockReturnThis(),
        textSearch: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: null,
          error: mockError
        })
      }))

      const results = await searchAllContent('test query', 10)

      expect(results).toEqual([])
    })

    it('should respect the limit parameter', async () => {
      const mockBrokerResults = Array.from({ length: 10 }, (_, i) => ({
        id: `broker-${i}`,
        name: `Broker ${i}`,
        slug: `broker-${i}`,
        description: `Description ${i}`,
        trust_score: 80 + i,
        overall_rating: 4.0 + (i * 0.1),
      }))

      mockSupabase.from.mockImplementation(() => ({
        select: jest.fn().mockReturnThis(),
        textSearch: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: mockBrokerResults.slice(0, 5), // Simulate limit
          error: null
        })
      }))

      const results = await searchAllContent('broker', 5)

      expect(results).toHaveLength(5)
    })

    it('should handle empty search results', async () => {
      mockSupabase.from.mockImplementation(() => ({
        select: jest.fn().mockReturnThis(),
        textSearch: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: [],
          error: null
        })
      }))

      const results = await searchAllContent('nonexistent query', 10)

      expect(results).toEqual([])
    })

    it('should format article results correctly', async () => {
      const mockArticleResults = [
        {
          id: 'article-1',
          title: 'Trading Strategies Guide',
          slug: 'trading-strategies-guide',
          excerpt: 'Learn effective trading strategies',
          category: 'Education',
        },
        {
          id: 'article-2',
          title: 'Market Analysis',
          slug: 'market-analysis',
          excerpt: null, // Test null excerpt
          category: 'Analysis',
        }
      ]

      mockSupabase.from.mockImplementationOnce(() => ({
        select: jest.fn().mockReturnThis(),
        textSearch: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: [],
          error: null
        })
      }))

      mockSupabase.from.mockImplementationOnce(() => ({
        select: jest.fn().mockReturnThis(),
        textSearch: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: mockArticleResults,
          error: null
        })
      }))

      const results = await searchAllContent('trading', 10)

      expect(results).toHaveLength(2)
      
      expect(results[0]).toEqual({
        type: 'article',
        title: 'Trading Strategies Guide',
        content: 'Learn effective trading strategies',
        url: '/articles/trading-strategies-guide',
        similarity: 1.0
      })

      expect(results[1]).toEqual({
        type: 'article',
        title: 'Market Analysis',
        content: 'Market Analysis',
        url: '/articles/market-analysis',
        similarity: 1.0
      })
    })

    it('should handle concurrent database calls', async () => {
      const mockBrokerResults = [{ id: 'broker-1', name: 'Broker 1', slug: 'broker-1' }]
      const mockArticleResults = [{ id: 'article-1', title: 'Article 1', slug: 'article-1' }]

      let callCount = 0
      mockSupabase.from.mockImplementation(() => {
        callCount++
        const isFirstCall = callCount === 1
        
        return {
          select: jest.fn().mockReturnThis(),
          textSearch: jest.fn().mockReturnThis(),
          limit: jest.fn().mockReturnThis(),
          order: jest.fn().mockResolvedValue({
            data: isFirstCall ? mockBrokerResults : mockArticleResults,
            error: null
          })
        }
      })

      const results = await searchAllContent('test', 10)

      expect(results).toHaveLength(2)
      expect(mockSupabase.from).toHaveBeenCalledTimes(2)
      expect(mockSupabase.from).toHaveBeenCalledWith('brokers')
      expect(mockSupabase.from).toHaveBeenCalledWith('articles')
    })
  })
})

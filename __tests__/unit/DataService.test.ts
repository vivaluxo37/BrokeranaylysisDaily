import { DataService } from '@/lib/services/dataService'

// Mock Supabase
const mockSupabase = {
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    single: jest.fn(),
    range: jest.fn().mockReturnThis(),
    ilike: jest.fn().mockReturnThis(),
    in: jest.fn().mockReturnThis(),
  }))
}

jest.mock('@/lib/supabase', () => ({
  supabase: mockSupabase
}))

describe('DataService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('broker methods', () => {
    describe('getTopBrokers', () => {
      it('should fetch top brokers with default limit', async () => {
        const mockBrokers = [
          { id: '1', name: 'Broker 1', trust_score: 95 },
          { id: '2', name: 'Broker 2', trust_score: 90 }
        ]

        mockSupabase.from.mockReturnValue({
          select: jest.fn().mockReturnThis(),
          order: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue({
            data: mockBrokers,
            error: null
          })
        })

        const result = await DataService.broker.getTopBrokers()

        expect(mockSupabase.from).toHaveBeenCalledWith('brokers')
        expect(result).toEqual(mockBrokers)
      })

      it('should fetch top brokers with custom limit', async () => {
        const mockBrokers = [
          { id: '1', name: 'Broker 1', trust_score: 95 }
        ]

        const mockChain = {
          select: jest.fn().mockReturnThis(),
          order: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue({
            data: mockBrokers,
            error: null
          })
        }

        mockSupabase.from.mockReturnValue(mockChain)

        const result = await DataService.broker.getTopBrokers(1)

        expect(mockChain.limit).toHaveBeenCalledWith(1)
        expect(result).toEqual(mockBrokers)
      })

      it('should handle database errors', async () => {
        const mockError = new Error('Database error')

        mockSupabase.from.mockReturnValue({
          select: jest.fn().mockReturnThis(),
          order: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue({
            data: null,
            error: mockError
          })
        })

        await expect(DataService.broker.getTopBrokers()).rejects.toThrow('Database error')
      })
    })

    describe('getBrokerBySlug', () => {
      it('should fetch broker by slug successfully', async () => {
        const mockBroker = { id: '1', name: 'Test Broker', slug: 'test-broker' }

        mockSupabase.from.mockReturnValue({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: mockBroker,
            error: null
          })
        })

        const result = await DataService.broker.getBrokerBySlug('test-broker')

        expect(mockSupabase.from).toHaveBeenCalledWith('brokers')
        expect(result).toEqual(mockBroker)
      })

      it('should handle broker not found', async () => {
        mockSupabase.from.mockReturnValue({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: null,
            error: { code: 'PGRST116', message: 'No rows found' }
          })
        })

        await expect(DataService.broker.getBrokerBySlug('nonexistent')).rejects.toThrow('No rows found')
      })
    })

    describe('searchBrokers', () => {
      it('should search brokers by query', async () => {
        const mockBrokers = [
          { id: '1', name: 'Forex Broker', slug: 'forex-broker' }
        ]

        mockSupabase.from.mockReturnValue({
          select: jest.fn().mockReturnThis(),
          ilike: jest.fn().mockReturnThis(),
          order: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue({
            data: mockBrokers,
            error: null
          })
        })

        const result = await DataService.broker.searchBrokers('forex')

        expect(result).toEqual(mockBrokers)
      })

      it('should handle empty search results', async () => {
        mockSupabase.from.mockReturnValue({
          select: jest.fn().mockReturnThis(),
          ilike: jest.fn().mockReturnThis(),
          order: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue({
            data: [],
            error: null
          })
        })

        const result = await DataService.broker.searchBrokers('nonexistent')

        expect(result).toEqual([])
      })
    })

    describe('getBrokersByIds', () => {
      it('should fetch multiple brokers by IDs', async () => {
        const mockBrokers = [
          { id: '1', name: 'Broker 1' },
          { id: '2', name: 'Broker 2' }
        ]

        mockSupabase.from.mockReturnValue({
          select: jest.fn().mockReturnThis(),
          in: jest.fn().mockReturnThis(),
          order: jest.fn().mockResolvedValue({
            data: mockBrokers,
            error: null
          })
        })

        const result = await DataService.broker.getBrokersByIds(['1', '2'])

        expect(result).toEqual(mockBrokers)
      })

      it('should handle empty ID array', async () => {
        const result = await DataService.broker.getBrokersByIds([])

        expect(result).toEqual([])
        expect(mockSupabase.from).not.toHaveBeenCalled()
      })
    })
  })

  describe('article methods', () => {
    describe('getArticles', () => {
      it('should fetch articles with pagination', async () => {
        const mockArticles = [
          { id: '1', title: 'Article 1', slug: 'article-1' },
          { id: '2', title: 'Article 2', slug: 'article-2' }
        ]

        mockSupabase.from.mockReturnValue({
          select: jest.fn().mockReturnThis(),
          order: jest.fn().mockReturnThis(),
          range: jest.fn().mockResolvedValue({
            data: mockArticles,
            error: null,
            count: 2
          })
        })

        const result = await DataService.article.getArticles(1, 10)

        expect(result).toEqual({
          data: mockArticles,
          count: 2
        })
      })

      it('should handle pagination correctly', async () => {
        const mockChain = {
          select: jest.fn().mockReturnThis(),
          order: jest.fn().mockReturnThis(),
          range: jest.fn().mockResolvedValue({
            data: [],
            error: null,
            count: 0
          })
        }

        mockSupabase.from.mockReturnValue(mockChain)

        await DataService.article.getArticles(2, 5)

        expect(mockChain.range).toHaveBeenCalledWith(5, 9) // (page-1)*limit, page*limit-1
      })
    })

    describe('getArticleBySlug', () => {
      it('should fetch article by slug', async () => {
        const mockArticle = { id: '1', title: 'Test Article', slug: 'test-article' }

        mockSupabase.from.mockReturnValue({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: mockArticle,
            error: null
          })
        })

        const result = await DataService.article.getArticleBySlug('test-article')

        expect(result).toEqual(mockArticle)
      })
    })

    describe('getArticlesByCategory', () => {
      it('should fetch articles by category', async () => {
        const mockArticles = [
          { id: '1', title: 'Education Article', category: 'education' }
        ]

        mockSupabase.from.mockReturnValue({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          order: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue({
            data: mockArticles,
            error: null
          })
        })

        const result = await DataService.article.getArticlesByCategory('education')

        expect(result).toEqual(mockArticles)
      })
    })
  })

  describe('error handling', () => {
    it('should throw errors with proper context', async () => {
      const mockError = new Error('Connection timeout')

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({
          data: null,
          error: mockError
        })
      })

      await expect(DataService.broker.getTopBrokers()).rejects.toThrow('Connection timeout')
    })

    it('should handle network errors gracefully', async () => {
      mockSupabase.from.mockImplementation(() => {
        throw new Error('Network error')
      })

      await expect(DataService.broker.getTopBrokers()).rejects.toThrow('Network error')
    })
  })

  describe('data transformation', () => {
    it('should return data as-is when successful', async () => {
      const mockData = { 
        id: '1', 
        name: 'Test Broker',
        trust_score: 95,
        created_at: '2024-01-01T00:00:00Z'
      }

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockData,
          error: null
        })
      })

      const result = await DataService.broker.getBrokerBySlug('test-broker')

      expect(result).toEqual(mockData)
      expect(result.trust_score).toBe(95)
      expect(result.created_at).toBe('2024-01-01T00:00:00Z')
    })
  })
})

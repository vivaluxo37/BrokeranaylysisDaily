import { POST, GET } from '@/app/api/ask/route'
import { NextRequest } from 'next/server'

// Mock the vector service
jest.mock('@/lib/services/vectorService', () => ({
  searchAllContent: jest.fn()
}))

import { searchAllContent } from '@/lib/services/vectorService'
const mockSearchAllContent = searchAllContent as jest.MockedFunction<typeof searchAllContent>

describe('/api/ask route', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST /api/ask', () => {
    it('should return search results for valid query', async () => {
      const mockResults = [
        {
          type: 'broker',
          title: 'IC Markets',
          content: 'IC Markets - Trust Score: 95/100, Rating: 4.8/5',
          url: '/brokers/ic-markets',
          similarity: 0.95
        },
        {
          type: 'article',
          title: 'Best Forex Brokers 2024',
          content: 'Complete guide to choosing the best forex broker',
          url: '/articles/best-forex-brokers-2024',
          similarity: 0.90
        }
      ]

      mockSearchAllContent.mockResolvedValue(mockResults)

      const request = new NextRequest('http://localhost:3000/api/ask', {
        method: 'POST',
        body: JSON.stringify({ query: 'best forex broker' })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.results).toEqual(mockResults)
      expect(data.query).toBe('best forex broker')
      expect(mockSearchAllContent).toHaveBeenCalledWith('best forex broker', 10)
    })

    it('should handle missing query parameter', async () => {
      const request = new NextRequest('http://localhost:3000/api/ask', {
        method: 'POST',
        body: JSON.stringify({})
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Query parameter is required')
    })

    it('should handle empty query parameter', async () => {
      const request = new NextRequest('http://localhost:3000/api/ask', {
        method: 'POST',
        body: JSON.stringify({ query: '' })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Query parameter is required')
    })

    it('should handle whitespace-only query', async () => {
      const request = new NextRequest('http://localhost:3000/api/ask', {
        method: 'POST',
        body: JSON.stringify({ query: '   ' })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Query parameter is required')
    })

    it('should handle search service errors', async () => {
      mockSearchAllContent.mockRejectedValue(new Error('Database connection failed'))

      const request = new NextRequest('http://localhost:3000/api/ask', {
        method: 'POST',
        body: JSON.stringify({ query: 'test query' })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to process your request. Please try again.')
    })

    it('should include error details in development mode', async () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'development'

      mockSearchAllContent.mockRejectedValue(new Error('Specific database error'))

      const request = new NextRequest('http://localhost:3000/api/ask', {
        method: 'POST',
        body: JSON.stringify({ query: 'test query' })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to process your request. Please try again.')
      expect(data.details).toBe('Specific database error')

      process.env.NODE_ENV = originalEnv
    })

    it('should not include error details in production mode', async () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'production'

      mockSearchAllContent.mockRejectedValue(new Error('Specific database error'))

      const request = new NextRequest('http://localhost:3000/api/ask', {
        method: 'POST',
        body: JSON.stringify({ query: 'test query' })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to process your request. Please try again.')
      expect(data.details).toBeUndefined()

      process.env.NODE_ENV = originalEnv
    })

    it('should handle invalid JSON in request body', async () => {
      const request = new NextRequest('http://localhost:3000/api/ask', {
        method: 'POST',
        body: 'invalid json'
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to process your request. Please try again.')
    })

    it('should handle non-Error throwables', async () => {
      mockSearchAllContent.mockRejectedValue('String error')

      const request = new NextRequest('http://localhost:3000/api/ask', {
        method: 'POST',
        body: JSON.stringify({ query: 'test query' })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to process your request. Please try again.')
    })

    it('should return empty results when search returns empty array', async () => {
      mockSearchAllContent.mockResolvedValue([])

      const request = new NextRequest('http://localhost:3000/api/ask', {
        method: 'POST',
        body: JSON.stringify({ query: 'nonexistent query' })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.results).toEqual([])
      expect(data.query).toBe('nonexistent query')
    })

    it('should handle broker results with missing data gracefully', async () => {
      const mockResults = [
        {
          type: 'broker',
          title: 'Test Broker',
          content: 'Test Broker - Trust Score: N/A/100, Rating: N/A/5',
          url: '/brokers/test-broker',
          similarity: 0.85
        }
      ]

      mockSearchAllContent.mockResolvedValue(mockResults)

      const request = new NextRequest('http://localhost:3000/api/ask', {
        method: 'POST',
        body: JSON.stringify({ query: 'test broker' })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.results[0].content).toContain('N/A/100')
      expect(data.results[0].content).toContain('N/A/5')
    })
  })

  describe('GET /api/ask (health check)', () => {
    it('should return healthy status', async () => {
      mockSearchAllContent.mockResolvedValue([])

      const request = new NextRequest('http://localhost:3000/api/ask', {
        method: 'GET'
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.status).toBe('healthy')
      expect(data.timestamp).toBeDefined()
      expect(mockSearchAllContent).toHaveBeenCalledWith('health check', 1)
    })

    it('should return unhealthy status when search service fails', async () => {
      mockSearchAllContent.mockRejectedValue(new Error('Service unavailable'))

      const request = new NextRequest('http://localhost:3000/api/ask', {
        method: 'GET'
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.status).toBe('unhealthy')
      expect(data.error).toBe('Service unavailable')
      expect(data.timestamp).toBeDefined()
    })

    it('should handle non-Error throwables in health check', async () => {
      mockSearchAllContent.mockRejectedValue('String error')

      const request = new NextRequest('http://localhost:3000/api/ask', {
        method: 'GET'
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.status).toBe('unhealthy')
      expect(data.error).toBe('String error')
    })
  })
})

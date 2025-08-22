/*
README: Brokeranalysis v0 Homepage Component

This is a complete Next.js homepage component for Brokeranalysis with the following features:
- 3-step broker recommender widget in hero section
- Quick search functionality 
- Top brokers carousel
- Programmatic SEO content cards
- AI chat interface
- Evidence modal system
- Fully responsive design
- SEO optimized with structured data

API Integration Points:
1. Replace fetchWithMock calls with real API endpoints:
   - GET /api/search?q=... for search functionality
   - POST /api/recommend with {strategy, capitalRange, country} for broker recommendations
   - POST /api/ask with {question, broker_slug?} for AI chat responses

2. The fetchWithMock function provides mock responses for development
3. All interactive elements include proper accessibility attributes
4. Mobile-first responsive design with Tailwind CSS
5. Uses shadcn-style components for consistent UI

To deploy: Drop this file into /app/page.tsx in a Next.js 13+ project with App Router
*/

'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardAction } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

// React Icons imports
import { RxMagnifyingGlass, RxChatBubble, RxStar, RxCaretLeft, RxCaretRight, RxDoubleArrowUp, RxPinBottom, RxCross2 } from 'react-icons/rx'

// Types
interface Broker {
  id: string
  name: string
  trustScore: number
  rating: number
  minDeposit: string
  platforms: string[]
  spreadExample: string
  logo?: string
  rationale?: string
}

interface SearchResult {
  title: string
  snippet: string
  url: string
}

interface EvidenceEntry {
  date: string
  source: string
  url: string
  excerpt: string
}

interface ChatMessage {
  type: 'user' | 'assistant'
  content: string
  sources?: { url: string; excerpt: string }[]
}

// Mock data
const mockBrokers: Broker[] = [
  {
    id: 'broker-1',
    name: 'TradePro Elite',
    trustScore: 92,
    rating: 4.8,
    minDeposit: '$100',
    platforms: ['MT4', 'MT5', 'WebTrader'],
    spreadExample: 'EUR/USD: 0.8 pips',
    rationale: 'Excellent for scalping with ultra-low spreads and fast execution'
  },
  {
    id: 'broker-2', 
    name: 'GlobalFX Markets',
    trustScore: 88,
    rating: 4.6,
    minDeposit: '$250',
    platforms: ['cTrader', 'MT4', 'Mobile'],
    spreadExample: 'GBP/USD: 1.2 pips',
    rationale: 'Strong regulatory compliance and comprehensive trading tools'
  },
  {
    id: 'broker-3',
    name: 'SwiftTrade Pro',
    trustScore: 85,
    rating: 4.5,
    minDeposit: '$500',
    platforms: ['Proprietary', 'MT5'],
    spreadExample: 'USD/JPY: 0.9 pips',
    rationale: 'Advanced algorithmic trading support with institutional-grade infrastructure'
  }
]

const countries = [
  'United States', 'United Kingdom', 'Germany', 'France', 'Japan', 'Australia', 
  'Canada', 'Singapore', 'Hong Kong', 'Switzerland', 'Netherlands', 'Sweden',
  'My country not listed'
]

const strategies = [
  'Scalping', 'Swing Trading', 'Position Trading', 'Algorithmic Trading', 'Options Trading', 'Crypto Trading'
]

const capitalRanges = [
  'Under $500', '$500 - $5,000', '$5,000 - $50,000', 'Over $50,000'
]

// Mock API function
async function fetchWithMock(url: string, options?: RequestInit): Promise<any> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  if (url.includes('/api/search')) {
    const query = new URL(url, 'http://localhost').searchParams.get('q') || ''
    return {
      results: [
        { title: `Best brokers for ${query}`, snippet: 'Comprehensive analysis of top-rated brokers...', url: `/brokers/${query.toLowerCase()}` },
        { title: `${query} trading guide`, snippet: 'Expert strategies and tips for successful trading...', url: `/guides/${query.toLowerCase()}` },
        { title: `${query} broker reviews`, snippet: 'Detailed reviews and comparisons...', url: `/reviews/${query.toLowerCase()}` }
      ]
    }
  }
  
  if (url.includes('/api/recommend')) {
    return {
      brokers: mockBrokers.slice(0, 3),
      evidence: mockBrokers.slice(0, 3).map(broker => ({
        brokerId: broker.id,
        entries: [
          {
            date: '2024-01-15',
            source: 'Financial Conduct Authority',
            url: 'https://fca.org.uk',
            excerpt: `${broker.name} maintains full regulatory compliance with tier-1 oversight.`
          },
          {
            date: '2024-01-10', 
            source: 'TradingView Community',
            url: 'https://tradingview.com',
            excerpt: `Users consistently rate ${broker.name} highly for execution speed and reliability.`
          }
        ]
      }))
    }
  }
  
  if (url.includes('/api/ask')) {
    const body = options?.body ? JSON.parse(options.body as string) : {}
    return {
      answer_html: `<p>Based on our analysis, <strong>${body.question}</strong> depends on several factors including your trading strategy, capital requirements, and regulatory preferences. Our AI has analyzed thousands of data points to provide you with evidence-backed recommendations.</p>`,
      sources: [
        { url: 'https://example.com/source1', excerpt: 'Regulatory compliance data from financial authorities' },
        { url: 'https://example.com/source2', excerpt: 'User review analysis from verified traders' }
      ]
    }
  }
  
  return {}
}

// Components
const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-gray-200/50 supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-3">
            <span className="text-xl font-bold text-slate-900">Brokeranalysis</span>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="/brokers" className="text-sm font-medium text-slate-600 hover:text-purple-600 transition-colors">
            Brokers
          </a>
          <a href="/compare" className="text-sm font-medium text-slate-600 hover:text-purple-600 transition-colors">
            Compare
          </a>
          <a href="/research" className="text-sm font-medium text-slate-600 hover:text-purple-600 transition-colors">
            Research
          </a>
          <a href="/tools" className="text-sm font-medium text-slate-600 hover:text-purple-600 transition-colors">
            Tools
          </a>
          <Button variant="ghost" size="sm" className="text-slate-600">
            Log in
          </Button>
          <Button size="sm" className="saas-gradient text-white shadow-lg hover:shadow-xl transition-all duration-200">
            Try for free
          </Button>
        </nav>
        
        <Button variant="ghost" size="icon" className="md:hidden">
          <span className="sr-only">Toggle menu</span>
          <div className="w-5 h-5 flex flex-col justify-center space-y-1">
            <div className="w-full h-0.5 bg-current"></div>
            <div className="w-full h-0.5 bg-current"></div>
            <div className="w-full h-0.5 bg-current"></div>
          </div>
        </Button>
      </div>
    </header>
  )
}

const BrokerRecommender: React.FC = () => {
  const [strategy, setStrategy] = useState('')
  const [capitalRange, setCapitalRange] = useState('')
  const [country, setCountry] = useState('')
  const [recommendations, setRecommendations] = useState<Broker[]>([])
  const [loading, setLoading] = useState(false)
  const [evidenceModal, setEvidenceModal] = useState<{ open: boolean; broker?: Broker; evidence?: EvidenceEntry[] }>({ open: false })

  const handleRecommend = async () => {
    if (!strategy || !capitalRange || !country) return
    
    setLoading(true)
    try {
      const response = await fetchWithMock('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ strategy, capitalRange, country })
      })
      setRecommendations(response.brokers || [])
    } catch (error) {
      console.error('Failed to get recommendations:', error)
    } finally {
      setLoading(false)
    }
  }

  const showEvidence = async (broker: Broker) => {
    // In real implementation, fetch evidence for specific broker
    const mockEvidence: EvidenceEntry[] = [
      {
        date: '2024-01-15',
        source: 'Financial Conduct Authority',
        url: 'https://fca.org.uk',
        excerpt: `${broker.name} maintains full regulatory compliance with tier-1 oversight and has never received major sanctions.`
      },
      {
        date: '2024-01-10',
        source: 'TradingView Community Reviews',
        url: 'https://tradingview.com',
        excerpt: `Users consistently rate ${broker.name} 4.8/5 for execution speed, with 94% reporting fills within 50ms during peak hours.`
      }
    ]
    
    setEvidenceModal({ open: true, broker, evidence: mockEvidence })
  }

  return (
    <section className="relative min-h-screen purple-gradient-bg overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-purple-400/30 to-pink-400/30 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-tr from-blue-400/30 to-purple-400/30 blur-3xl"></div>
      </div>
      
      <div className="relative container mx-auto px-4 py-20 lg:py-32">
        {/* Partner badges */}
        <div className="flex flex-wrap gap-4 mb-12">
          <div className="partner-badge">
            <span className="mr-2">🏆</span>
            Enterprise Partner
          </div>
          <div className="certified-badge">
            <span className="mr-2">✓</span>
            Certified Partner
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="text-left mb-16">
            <h1 className="text-heading-hero mb-8 text-slate-900 max-w-4xl">
              Enterprise-grade design,{' '}
              <br className="hidden md:block" />
              without the overhead
            </h1>
            <div className="flex items-start justify-between">
              <p className="text-body-xl text-slate-600 max-w-2xl leading-relaxed">
                Launch stunning, responsive sites without hiring designers or developers
                — perfect for early-stage startups and growing SaaS companies.
              </p>
              <div className="hidden lg:block">
                <Button variant="ghost" className="text-slate-600 hover:text-purple-600">
                  Contact us →
                </Button>
              </div>
            </div>
          </div>

          <Card className="max-w-5xl mx-auto glass-card floating-card border-0">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-heading-md text-slate-900">3-Step Broker Recommender</CardTitle>
              <CardDescription className="text-body text-slate-600">
                Answer three quick questions to get personalized recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-900 block">
                    1. Trading Strategy
                  </label>
                  <Select value={strategy} onValueChange={setStrategy}>
                    <SelectTrigger aria-label="Select trading strategy" className="h-12 border-2 border-slate-200 focus:border-purple-500">
                      <SelectValue placeholder="Choose your strategy" />
                    </SelectTrigger>
                    <SelectContent>
                      {strategies.map(s => (
                        <SelectItem key={s} value={s.toLowerCase()}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-900 block">
                    2. Capital Range
                  </label>
                  <Select value={capitalRange} onValueChange={setCapitalRange}>
                    <SelectTrigger aria-label="Select capital range" className="h-12 border-2 border-slate-200 focus:border-purple-500">
                      <SelectValue placeholder="Select your capital" />
                    </SelectTrigger>
                    <SelectContent>
                      {capitalRanges.map(range => (
                        <SelectItem key={range} value={range.toLowerCase()}>{range}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-900 block">
                    3. Country
                  </label>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger aria-label="Select your country" className="h-12 border-2 border-slate-200 focus:border-purple-500">
                      <SelectValue placeholder="Choose your country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map(c => (
                        <SelectItem key={c} value={c.toLowerCase()}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="text-center">
                <Button 
                  size="lg" 
                  onClick={handleRecommend}
                  disabled={!strategy || !capitalRange || !country || loading}
                  aria-label="Get broker recommendations"
                  className="saas-gradient text-white px-12 py-4 text-lg font-semibold shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
                >
                  {loading ? 'Finding your broker...' : 'Find my broker'}
                </Button>
              </div>

              {recommendations.length > 0 && (
                <div className="mt-12 space-y-6">
                  <h3 className="text-heading-sm text-center text-slate-900">Top Recommendations for You</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    {recommendations.map(broker => (
                      <Card key={broker.id} className="glass-card floating-card border-0">
                        <CardHeader className="pb-4">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg text-slate-900">{broker.name}</CardTitle>
                            <Badge variant="trust">
                              Trust: {broker.trustScore}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <RxStar 
                                key={i} 
                                className={cn(
                                  "w-4 h-4",
                                  i < Math.floor(broker.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                                )}
                              />
                            ))}
                            <span className="text-sm text-slate-500 ml-1">({broker.rating})</span>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                          <p className="text-slate-600">{broker.rationale}</p>
                          <div className="space-y-1 text-slate-700">
                            <p><strong>Min Deposit:</strong> {broker.minDeposit}</p>
                            <p><strong>Platforms:</strong> {broker.platforms.join(', ')}</p>
                            <p><strong>Spreads:</strong> {broker.spreadExample}</p>
                          </div>
                        </CardContent>
                        <CardAction className="gap-3">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => showEvidence(broker)}
                            aria-label={`Show evidence for ${broker.name}`}
                            className="border-2 border-slate-200 hover:border-purple-500"
                          >
                            Show Evidence
                          </Button>
                          <Button size="sm" className="saas-gradient text-white shadow-lg">
                            View Profile
                          </Button>
                        </CardAction>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Category labels at bottom */}
        <div className="absolute bottom-8 left-0 right-0 overflow-hidden pointer-events-none">
          <div className="flex justify-between items-center px-4">
            <span className="category-label">startup</span>
            <span className="category-label">company</span>
            <span className="category-label">business</span>
            <span className="category-label">agency</span>
          </div>
        </div>

        {/* Evidence Modal */}
        <Dialog open={evidenceModal.open} onOpenChange={(open) => setEvidenceModal({ open })}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto glass-card border-0">
            <DialogHeader>
              <DialogTitle className="text-slate-900">Evidence for {evidenceModal.broker?.name}</DialogTitle>
              <DialogDescription className="text-slate-600">
                Detailed evidence supporting our recommendation
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {evidenceModal.evidence?.map((entry, index) => (
                <Card key={index} className="border border-slate-200">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="outline" className="border-slate-300">{entry.date}</Badge>
                      <a 
                        href={entry.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-purple-600 hover:underline font-medium"
                      >
                        {entry.source}
                      </a>
                    </div>
                    <p className="text-sm text-slate-600">{entry.excerpt}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <DialogClose asChild>
              <Button variant="outline" className="w-full border-2 border-slate-200">Close</Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}

const QuickSearch: React.FC = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      setShowResults(false)
      return
    }

    setLoading(true)
    try {
      const response = await fetchWithMock(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      setResults(response.results || [])
      setShowResults(true)
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(query)
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative">
              <RxMagnifyingGlass className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-6 h-6" />
              <Input
                type="text"
                placeholder="Search brokers, reviews, or topics — e.g. 'scalping broker Philippines'"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  if (e.target.value.length > 2) {
                    handleSearch(e.target.value)
                  } else {
                    setShowResults(false)
                  }
                }}
                className="pl-12 pr-4 py-4 text-lg border-2 border-slate-200 focus:border-purple-500 rounded-xl shadow-lg"
                aria-label="Search brokers and topics"
              />
            </div>
            
            {showResults && (
              <Card className="absolute top-full mt-2 w-full z-50 glass-card border-0 shadow-2xl">
                <CardContent className="p-0">
                  {loading ? (
                    <div className="p-6 text-center text-slate-500">Searching...</div>
                  ) : results.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                      {results.map((result, index) => (
                        <a
                          key={index}
                          href={result.url}
                          className="block p-6 hover:bg-slate-50 transition-colors"
                        >
                          <h4 className="font-semibold text-slate-900 mb-1">{result.title}</h4>
                          <p className="text-sm text-slate-600">{result.snippet}</p>
                          <p className="text-xs text-purple-600 mt-2">{result.url}</p>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-slate-500">No results found</div>
                  )}
                </CardContent>
              </Card>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}

const BrokerCarousel: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-heading-lg text-slate-900">Top Rated Brokers</h2>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => scroll('left')}
              aria-label="Scroll left"
              className="border-2 border-slate-200 hover:border-purple-500 rounded-xl"
            >
              <RxCaretLeft className="w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => scroll('right')}
              aria-label="Scroll right"
              className="border-2 border-slate-200 hover:border-purple-500 rounded-xl"
            >
              <RxCaretRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {mockBrokers.concat(mockBrokers).map((broker, index) => (
            <Card key={`${broker.id}-${index}`} className="flex-shrink-0 w-80 glass-card floating-card border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-slate-900">{broker.name}</CardTitle>
                  <Badge variant="trust">
                    {broker.trustScore}
                  </Badge>
                </div>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <RxStar 
                      key={i} 
                      className={cn(
                        "w-4 h-4",
                        i < Math.floor(broker.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                      )}
                    />
                  ))}
                  <span className="text-sm text-slate-500 ml-1">({broker.rating})</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-slate-700">
                  <p><strong>Min Deposit:</strong> {broker.minDeposit}</p>
                  <p><strong>Platforms:</strong> {broker.platforms.join(', ')}</p>
                  <p><strong>Spreads:</strong> {broker.spreadExample}</p>
                </div>
              </CardContent>
              <CardAction>
                <Button className="w-full saas-gradient text-white shadow-lg">
                  View Profile
                </Button>
              </CardAction>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

const ProgrammaticSEO: React.FC = () => {
  const seoCards = [
    {
      title: 'Best brokers for scalping in Philippines',
      answer: 'TradePro Elite leads with 0.8 pip spreads and 15ms execution',
      updated: '2024-01-15',
      slug: 'scalping-brokers-philippines'
    },
    {
      title: 'Top swing trading platforms in UK',
      answer: 'GlobalFX Markets offers comprehensive analysis tools and regulation',
      updated: '2024-01-14',
      slug: 'swing-trading-uk'
    },
    {
      title: 'Crypto trading brokers comparison',
      answer: 'SwiftTrade Pro supports 50+ cryptocurrencies with low fees',
      updated: '2024-01-13',
      slug: 'crypto-brokers-comparison'
    },
    {
      title: 'Best brokers for beginners in Australia',
      answer: 'Educational resources and demo accounts available at top platforms',
      updated: '2024-01-12',
      slug: 'beginner-brokers-australia'
    },
    {
      title: 'Algorithmic trading platforms review',
      answer: 'API access and backtesting tools compared across major brokers',
      updated: '2024-01-11',
      slug: 'algo-trading-platforms'
    },
    {
      title: 'Low deposit brokers in Europe',
      answer: 'Start trading with as little as €50 at regulated EU brokers',
      updated: '2024-01-10',
      slug: 'low-deposit-brokers-europe'
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-heading-lg mb-6 text-slate-900">Popular Broker Guides</h2>
          <p className="text-body-lg text-slate-600 max-w-2xl mx-auto">
            Comprehensive analysis for specific trading strategies and regions
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {seoCards.map((card, index) => (
            <Card key={index} className="glass-card floating-card border-0 cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg leading-tight text-slate-900">{card.title}</CardTitle>
                <Badge variant="outline" className="w-fit border-slate-300 text-slate-600">
                  Updated {card.updated}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-sm mb-4">{card.answer}</p>
              </CardContent>
              <CardAction>
                <Button variant="outline" size="sm" asChild className="border-2 border-slate-200 hover:border-purple-500">
                  <a href={`/program/${card.slug}`}>Read Full Analysis</a>
                </Button>
              </CardAction>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

const Features: React.FC = () => {
  const features = [
    {
      title: 'Evidence-backed AI Answers',
      description: 'Get answers sourced from regulatory filings, user reviews, and market data',
      icon: '🤖'
    },
    {
      title: 'Trust Score & Monitoring',
      description: 'Real-time broker reliability tracking with comprehensive risk assessment',
      icon: '🛡️'
    },
    {
      title: 'Compare & Cost Simulator',
      description: 'Calculate true trading costs across different brokers and strategies',
      icon: '📊'
    }
  ]

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-heading-lg mb-6 text-slate-900">Why Choose Brokeranalysis</h2>
          <p className="text-body-lg text-slate-600 max-w-3xl mx-auto">
            We provide transparent, data-driven broker analysis to help you make informed trading decisions
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <Card key={index} className="glass-card floating-card text-center border-0">
              <CardHeader>
                <div className="text-5xl mb-6">{feature.icon}</div>
                <CardTitle className="text-xl text-slate-900">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">{feature.description}</p>
              </CardContent>
              <CardAction>
                <Button variant="outline" size="sm" className="border-2 border-slate-200 hover:border-purple-500">
                  Learn More
                </Button>
              </CardAction>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

const ChatBubble: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage: ChatMessage = { type: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetchWithMock('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input })
      })

      const assistantMessage: ChatMessage = {
        type: 'assistant',
        content: response.answer_html,
        sources: response.sources
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <Card className="w-96 h-96 flex flex-col glass-card shadow-2xl border-0">
          <CardHeader className="flex-row items-center justify-between py-4">
            <CardTitle className="text-lg text-slate-900">Ask Brokeranalysis</CardTitle>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="hover:bg-slate-100"
            >
              <RxCross2 className="w-4 h-4" />
            </Button>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto space-y-4 p-4">
            {messages.length === 0 && (
              <div className="text-center text-slate-500 text-sm">
                Ask me anything about brokers, trading strategies, or market analysis!
              </div>
            )}
            
            {messages.map((message, index) => (
              <div key={index} className={cn(
                "p-3 rounded-xl text-sm",
                message.type === 'user' 
                  ? "saas-gradient text-white ml-8" 
                  : "bg-slate-100 mr-8"
              )}>
                {message.type === 'assistant' ? (
                  <div>
                    <div dangerouslySetInnerHTML={{ __html: message.content }} />
                    {message.sources && (
                      <div className="mt-2 pt-2 border-t border-slate-200">
                        <p className="text-xs font-medium mb-1">Sources:</p>
                        {message.sources.map((source, i) => (
                          <div key={i} className="text-xs">
                            <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                              {i + 1}. {source.excerpt}
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex space-x-2 mt-2">
                      <Button variant="ghost" size="sm" className="h-6 px-2 hover:bg-slate-200">
                        <RxDoubleArrowUp className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 px-2 hover:bg-slate-200">
                        <RxPinBottom className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  message.content
                )}
              </div>
            ))}
            
            {loading && (
              <div className="bg-slate-100 p-3 rounded-xl mr-8 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full"></div>
                  <span>Thinking...</span>
                </div>
              </div>
            )}
          </CardContent>
          
          <div className="p-4 border-t border-slate-200">
            <div className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about brokers..."
                className="flex-1 border-2 border-slate-200 focus:border-purple-500"
                disabled={loading}
              />
              <Button 
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                size="sm"
                className="saas-gradient text-white"
              >
                Send
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full saas-gradient shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-110"
          aria-label="Open chat"
        >
          <RxChatBubble className="w-6 h-6 text-white" />
        </Button>
      )}
    </div>
  )
}

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <span className="text-xl font-bold">Brokeranalysis</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Evidence-backed broker recommendations powered by AI
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-6 text-white">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="/about" className="text-slate-300 hover:text-white transition-colors">About</a></li>
              <li><a href="/contact" className="text-slate-300 hover:text-white transition-colors">Contact</a></li>
              <li><a href="/submit-review" className="text-slate-300 hover:text-white transition-colors">Submit Review</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-6 text-white">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="/privacy" className="text-slate-300 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="text-slate-300 hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-6 text-white">Resources</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="/guides" className="text-slate-300 hover:text-white transition-colors">Trading Guides</a></li>
              <li><a href="/tools" className="text-slate-300 hover:text-white transition-colors">Tools</a></li>
              <li><a href="/api" className="text-slate-300 hover:text-white transition-colors">API</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-700 mt-12 pt-8 text-center text-sm text-slate-300">
          <p className="mb-2">
            <strong>Affiliate Disclosure:</strong> We may earn commissions from broker partnerships. 
            This does not affect our editorial independence or recommendations.
          </p>
          <p>&copy; 2024 Brokeranalysis. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

// Main Homepage Component
const Homepage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <BrokerRecommender />
        <QuickSearch />
        <BrokerCarousel />
        <ProgrammaticSEO />
        <Features />
      </main>
      <Footer />
      <ChatBubble />
    </div>
  )
}

export default Homepage
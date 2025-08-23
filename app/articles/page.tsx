import { Metadata } from 'next'
import Link from 'next/link'
import { Search, Filter, Calendar, Clock, User, Tag, ArrowRight, BookOpen, TrendingUp } from 'lucide-react'
import { Suspense } from 'react'
import MegaMenuHeader from '@/components/MegaMenuHeader'
import Footer from '@/components/Footer'
import ChatBubble from '@/components/ChatBubble'

// Mock article data - replace with actual data fetching
interface Article {
  id: string
  slug: string
  title: string
  excerpt: string
  author: {
    name: string
    avatar: string
  }
  publishedAt: string
  readingTime: number
  category: string
  tags: string[]
  featuredImage: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  featured?: boolean
}

interface ArticlesPageProps {
  searchParams: {
    category?: string
    tag?: string
    search?: string
    difficulty?: string
    page?: string
  }
}

// Mock function to get articles
async function getArticles(filters?: {
  category?: string
  tag?: string
  search?: string
  difficulty?: string
  page?: number
}): Promise<{ articles: Article[], totalPages: number, totalArticles: number }> {
  // Mock data - replace with actual database query
  const mockArticles: Article[] = [
    {
      id: '1',
      slug: 'forex-trading-basics-complete-guide',
      title: 'Forex Trading Basics: A Complete Beginner\'s Guide',
      excerpt: 'Learn the fundamentals of forex trading, from currency pairs and market hours to basic trading strategies and risk management.',
      author: {
        name: 'Sarah Johnson',
        avatar: '/images/authors/sarah-johnson.jpg'
      },
      publishedAt: '2024-01-15T10:00:00Z',
      readingTime: 12,
      category: 'Forex Education',
      tags: ['forex', 'beginners', 'basics', 'education'],
      featuredImage: '/images/articles/forex-basics.jpg',
      difficulty: 'Beginner',
      featured: true
    },
    {
      id: '2',
      slug: 'technical-analysis-indicators-guide',
      title: 'Technical Analysis Indicators: Complete Guide',
      excerpt: 'Master the most important technical indicators for trading. Learn how to use moving averages, RSI, MACD, and more.',
      author: {
        name: 'Michael Chen',
        avatar: '/images/authors/michael-chen.jpg'
      },
      publishedAt: '2024-01-12T14:30:00Z',
      readingTime: 15,
      category: 'Technical Analysis',
      tags: ['technical-analysis', 'indicators', 'trading', 'charts'],
      featuredImage: '/images/articles/technical-indicators.jpg',
      difficulty: 'Intermediate'
    },
    {
      id: '3',
      slug: 'understanding-leverage-margin-trading',
      title: 'Understanding Leverage and Margin in Trading',
      excerpt: 'Learn how leverage and margin work in trading, their benefits and risks, and how to use them responsibly.',
      author: {
        name: 'Emma Rodriguez',
        avatar: '/images/authors/emma-rodriguez.jpg'
      },
      publishedAt: '2024-01-10T09:15:00Z',
      readingTime: 10,
      category: 'Risk Management',
      tags: ['leverage', 'margin', 'risk', 'trading'],
      featuredImage: '/images/articles/leverage-margin.jpg',
      difficulty: 'Intermediate'
    },
    {
      id: '4',
      slug: 'fundamental-analysis-forex-markets',
      title: 'Fundamental Analysis in Forex Markets',
      excerpt: 'Understand how economic indicators, central bank policies, and geopolitical events affect currency prices.',
      author: {
        name: 'David Kim',
        avatar: '/images/authors/david-kim.jpg'
      },
      publishedAt: '2024-01-08T16:45:00Z',
      readingTime: 14,
      category: 'Fundamental Analysis',
      tags: ['fundamental-analysis', 'forex', 'economics', 'markets'],
      featuredImage: '/images/articles/fundamental-analysis.jpg',
      difficulty: 'Advanced'
    },
    {
      id: '5',
      slug: 'psychology-of-trading-emotions',
      title: 'The Psychology of Trading: Managing Emotions',
      excerpt: 'Learn how to control emotions like fear and greed in trading. Develop the mental discipline needed for consistent success.',
      author: {
        name: 'Sarah Johnson',
        avatar: '/images/authors/sarah-johnson.jpg'
      },
      publishedAt: '2024-01-05T11:20:00Z',
      readingTime: 11,
      category: 'Trading Psychology',
      tags: ['psychology', 'emotions', 'discipline', 'trading'],
      featuredImage: '/images/articles/trading-psychology.jpg',
      difficulty: 'Intermediate'
    },
    {
      id: '6',
      slug: 'cryptocurrency-trading-guide',
      title: 'Cryptocurrency Trading: A Comprehensive Guide',
      excerpt: 'Everything you need to know about trading cryptocurrencies, from wallet setup to advanced trading strategies.',
      author: {
        name: 'Michael Chen',
        avatar: '/images/authors/michael-chen.jpg'
      },
      publishedAt: '2024-01-03T13:10:00Z',
      readingTime: 16,
      category: 'Cryptocurrency',
      tags: ['cryptocurrency', 'bitcoin', 'trading', 'blockchain'],
      featuredImage: '/images/articles/crypto-trading.jpg',
      difficulty: 'Beginner'
    },
    {
      id: '7',
      slug: 'options-trading-strategies',
      title: 'Options Trading Strategies for Different Market Conditions',
      excerpt: 'Learn advanced options trading strategies including covered calls, protective puts, straddles, and spreads.',
      author: {
        name: 'Emma Rodriguez',
        avatar: '/images/authors/emma-rodriguez.jpg'
      },
      publishedAt: '2024-01-01T10:30:00Z',
      readingTime: 18,
      category: 'Options Trading',
      tags: ['options', 'strategies', 'derivatives', 'advanced'],
      featuredImage: '/images/articles/options-strategies.jpg',
      difficulty: 'Advanced'
    },
    {
      id: '8',
      slug: 'building-trading-plan',
      title: 'How to Build a Comprehensive Trading Plan',
      excerpt: 'Create a structured trading plan that includes goals, strategies, risk management, and performance evaluation.',
      author: {
        name: 'David Kim',
        avatar: '/images/authors/david-kim.jpg'
      },
      publishedAt: '2023-12-28T15:45:00Z',
      readingTime: 13,
      category: 'Trading Strategy',
      tags: ['trading-plan', 'strategy', 'goals', 'planning'],
      featuredImage: '/images/articles/trading-plan.jpg',
      difficulty: 'Beginner'
    }
  ]
  
  // Apply filters
  let filteredArticles = mockArticles
  
  if (filters?.category) {
    filteredArticles = filteredArticles.filter(article => 
      article.category.toLowerCase() === filters.category?.toLowerCase()
    )
  }
  
  if (filters?.difficulty) {
    filteredArticles = filteredArticles.filter(article => 
      article.difficulty.toLowerCase() === filters.difficulty?.toLowerCase()
    )
  }
  
  if (filters?.tag) {
    filteredArticles = filteredArticles.filter(article => 
      article.tags.includes(filters.tag!)
    )
  }
  
  if (filters?.search) {
    const searchTerm = filters.search.toLowerCase()
    filteredArticles = filteredArticles.filter(article => 
      article.title.toLowerCase().includes(searchTerm) ||
      article.excerpt.toLowerCase().includes(searchTerm) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    )
  }
  
  // Pagination
  const articlesPerPage = 6
  const page = filters?.page || 1
  const startIndex = (page - 1) * articlesPerPage
  const endIndex = startIndex + articlesPerPage
  const paginatedArticles = filteredArticles.slice(startIndex, endIndex)
  
  return {
    articles: paginatedArticles,
    totalPages: Math.ceil(filteredArticles.length / articlesPerPage),
    totalArticles: filteredArticles.length
  }
}

// Get unique categories and tags
async function getArticleMetadata() {
  const categories = [
    'Forex Education',
    'Technical Analysis',
    'Fundamental Analysis',
    'Risk Management',
    'Trading Psychology',
    'Trading Strategy',
    'Cryptocurrency',
    'Options Trading'
  ]
  
  const popularTags = [
    'forex',
    'beginners',
    'technical-analysis',
    'risk',
    'psychology',
    'cryptocurrency',
    'strategies',
    'education'
  ]
  
  const difficulties = ['Beginner', 'Intermediate', 'Advanced']
  
  return { categories, popularTags, difficulties }
}

export const metadata: Metadata = {
  title: 'Trading Education Articles - Learn Trading & Investing | Brokeranalysis',
  description: 'Comprehensive trading education articles covering forex, stocks, crypto, technical analysis, risk management, and trading psychology.',
  keywords: 'trading education, forex learning, technical analysis, trading strategies, investment education, financial markets',
  openGraph: {
    title: 'Trading Education Articles - Learn Trading & Investing',
    description: 'Comprehensive trading education articles covering forex, stocks, crypto, technical analysis, risk management, and trading psychology.',
    type: 'website',
    url: '/articles',
    siteName: 'Brokeranalysis',
    images: [
      {
        url: '/images/articles/articles-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Brokeranalysis Trading Education'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trading Education Articles - Learn Trading & Investing',
    description: 'Comprehensive trading education articles covering forex, stocks, crypto, technical analysis, risk management, and trading psychology.',
    images: ['/images/articles/articles-og.jpg']
  },
  alternates: {
    canonical: '/articles'
  }
}

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case 'Beginner':
      return 'bg-green-100 text-green-800'
    case 'Intermediate':
      return 'bg-yellow-100 text-yellow-800'
    case 'Advanced':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function ArticleCard({ article }: { article: Article }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img
          src={article.featuredImage}
          alt={article.title}
          className="w-full h-48 object-cover"
        />
        {article.featured && (
          <div className="absolute top-4 left-4">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              Featured
            </span>
          </div>
        )}
        <div className="absolute top-4 right-4 flex space-x-2">
          <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
            {article.category}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(article.difficulty)}`}>
            {article.difficulty}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
          <Link href={`/articles/${article.slug}`}>
            {article.title}
          </Link>
        </h2>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {article.excerpt}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>{article.author.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(article.publishedAt)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>{article.readingTime} min</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {article.tags.slice(0, 3).map((tag) => (
              <Link
                key={tag}
                href={`/articles?tag=${tag}`}
                className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
          
          <Link
            href={`/articles/${article.slug}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            Read Article
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>
    </article>
  )
}

function FeaturedArticle({ article }: { article: Article }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="relative bg-gradient-to-r from-indigo-600 to-purple-700 rounded-lg overflow-hidden mb-12">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
        <div className="flex flex-col justify-center">
          <div className="mb-4 flex items-center space-x-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white backdrop-blur-sm">
              <BookOpen className="h-4 w-4 mr-1" />
              Featured Article
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white backdrop-blur-sm`}>
              {article.difficulty}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
            {article.title}
          </h1>
          
          <p className="text-indigo-100 text-lg mb-6 leading-relaxed">
            {article.excerpt}
          </p>
          
          <div className="flex items-center space-x-6 text-indigo-100 text-sm mb-6">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>{article.author.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(article.publishedAt)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>{article.readingTime} min read</span>
            </div>
          </div>
          
          <Link
            href={`/articles/${article.slug}`}
            className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition-colors w-fit"
          >
            Start Learning
            <ArrowRight className="h-5 w-5 ml-2" />
          </Link>
        </div>
        
        <div className="relative">
          <img
            src={article.featuredImage}
            alt={article.title}
            className="w-full h-64 lg:h-full object-cover rounded-lg shadow-lg"
          />
        </div>)}}
      </div>
    </div>
    <Footer />
    <ChatBubble />
    </>
  )
}

function Pagination({ currentPage, totalPages }: { currentPage: number, totalPages: number }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  
  return (
    <div className="flex items-center justify-center space-x-2 mt-12">
      {currentPage > 1 && (
        <Link
          href={`/articles?page=${currentPage - 1}`}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Previous
        </Link>
      )}
      
      {pages.map((page) => (
        <Link
          key={page}
          href={`/articles?page=${page}`}
          className={`px-4 py-2 text-sm font-medium rounded-lg ${
            page === currentPage
              ? 'bg-indigo-600 text-white'
              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {page}
        </Link>
      ))}
      
      {currentPage < totalPages && (
        <Link
          href={`/articles?page=${currentPage + 1}`}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Next
        </Link>
      )}
    </div>
  )
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const resolvedSearchParams = await searchParams
  const currentPage = parseInt(resolvedSearchParams.page || '1')
  const { articles, totalPages, totalArticles } = await getArticles({
    category: resolvedSearchParams.category,
    tag: resolvedSearchParams.tag,
    search: resolvedSearchParams.search,
    difficulty: resolvedSearchParams.difficulty,
    page: currentPage
  })
  
  const { categories, popularTags, difficulties } = await getArticleMetadata()
  const featuredArticle = articles.find(article => article.featured) || articles[0]
  const regularArticles = articles.filter(article => !article.featured || article.id !== featuredArticle.id)

  return (
    <>
      <MegaMenuHeader />
      <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <BookOpen className="h-8 w-8 text-indigo-600 mr-3" />
              <h1 className="text-4xl font-bold text-gray-900">
                Trading Education
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Master the art of trading with our comprehensive educational articles. From beginner basics to advanced strategies.
            </p>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Article */}
        {featuredArticle && !resolvedSearchParams.category && !resolvedSearchParams.tag && !resolvedSearchParams.search && !resolvedSearchParams.difficulty && (
          <FeaturedArticle article={featuredArticle} />
        )}
        
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                defaultValue={resolvedSearchParams.search || ''}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            
            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select 
                defaultValue={resolvedSearchParams.category || ''}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Difficulty Filter */}
            <div className="relative">
              <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select 
                defaultValue={resolvedSearchParams.difficulty || ''}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
              >
                <option value="">All Levels</option>
                {difficulties.map((difficulty) => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Popular Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Popular Topics</label>
              <div className="flex flex-wrap gap-2">
                {popularTags.slice(0, 3).map((tag) => (
                  <Link
                    key={tag}
                    href={`/articles?tag=${tag}`}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      resolvedSearchParams.tag === tag
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Results Info */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-gray-600">
            {totalArticles > 0 ? (
              <span>
                Showing {((currentPage - 1) * 6) + 1}-{Math.min(currentPage * 6, totalArticles)} of {totalArticles} articles
              </span>
            ) : (
              <span>No articles found</span>
            )}
          </div>
          
          {(resolvedSearchParams.category || resolvedSearchParams.tag || resolvedSearchParams.search || resolvedSearchParams.difficulty) && (
            <Link
              href="/articles"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Clear Filters
            </Link>
          )}
        </div>
        
        {/* Articles Grid */}
        {articles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination currentPage={currentPage} totalPages={totalPages} />
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">
              No articles found matching your criteria.
            </div>
            <Link
              href="/articles"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View all articles
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
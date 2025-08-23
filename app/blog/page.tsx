import { Metadata } from 'next'
import Link from 'next/link'
import { Search, Filter, Calendar, Clock, User, Tag, ArrowRight } from 'lucide-react'
import { Suspense } from 'react'
import MegaMenuHeader from '@/components/MegaMenuHeader'
import Footer from '@/components/Footer'
import ChatBubble from '@/components/ChatBubble'

// Mock blog data - replace with actual data fetching
interface BlogPost {
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
  featured?: boolean
}

interface BlogPageProps {
  searchParams: {
    category?: string
    tag?: string
    search?: string
    page?: string
  }
}

// Mock function to get blog posts
async function getBlogPosts(filters?: {
  category?: string
  tag?: string
  search?: string
  page?: number
}): Promise<{ posts: BlogPost[], totalPages: number, totalPosts: number }> {
  // Mock data - replace with actual database query
  const mockPosts: BlogPost[] = [
    {
      id: '1',
      slug: 'best-forex-brokers-2024',
      title: 'Best Forex Brokers for 2024: Complete Guide',
      excerpt: 'Discover the top-rated forex brokers for 2024 with our comprehensive analysis of trading conditions, regulation, and user experience.',
      author: {
        name: 'Sarah Johnson',
        avatar: '/images/authors/sarah-johnson.jpg'
      },
      publishedAt: '2024-01-15T10:00:00Z',
      readingTime: 8,
      category: 'Broker Reviews',
      tags: ['forex', 'brokers', 'trading', '2024', 'guide'],
      featuredImage: '/images/blog/forex-brokers-2024.jpg',
      featured: true
    },
    {
      id: '2',
      slug: 'forex-trading-strategies-beginners',
      title: 'Top 5 Forex Trading Strategies for Beginners',
      excerpt: 'Learn proven forex trading strategies that work for beginners. From trend following to breakout strategies, master the basics.',
      author: {
        name: 'Michael Chen',
        avatar: '/images/authors/michael-chen.jpg'
      },
      publishedAt: '2024-01-12T14:30:00Z',
      readingTime: 6,
      category: 'Trading Strategies',
      tags: ['forex', 'strategies', 'beginners', 'trading'],
      featuredImage: '/images/blog/forex-strategies.jpg'
    },
    {
      id: '3',
      slug: 'broker-regulation-explained',
      title: 'Understanding Broker Regulation: What Traders Need to Know',
      excerpt: 'A comprehensive guide to broker regulation, licensing, and what it means for trader protection and fund safety.',
      author: {
        name: 'Emma Rodriguez',
        avatar: '/images/authors/emma-rodriguez.jpg'
      },
      publishedAt: '2024-01-10T09:15:00Z',
      readingTime: 10,
      category: 'Education',
      tags: ['regulation', 'brokers', 'safety', 'licensing'],
      featuredImage: '/images/blog/broker-regulation.jpg'
    },
    {
      id: '4',
      slug: 'crypto-trading-vs-forex',
      title: 'Crypto Trading vs Forex: Which is Right for You?',
      excerpt: 'Compare cryptocurrency trading with forex trading. Understand the differences in volatility, regulation, and market hours.',
      author: {
        name: 'David Kim',
        avatar: '/images/authors/david-kim.jpg'
      },
      publishedAt: '2024-01-08T16:45:00Z',
      readingTime: 7,
      category: 'Market Analysis',
      tags: ['crypto', 'forex', 'comparison', 'trading'],
      featuredImage: '/images/blog/crypto-vs-forex.jpg'
    },
    {
      id: '5',
      slug: 'risk-management-trading',
      title: 'Essential Risk Management Techniques for Traders',
      excerpt: 'Master the art of risk management in trading. Learn position sizing, stop losses, and portfolio management strategies.',
      author: {
        name: 'Sarah Johnson',
        avatar: '/images/authors/sarah-johnson.jpg'
      },
      publishedAt: '2024-01-05T11:20:00Z',
      readingTime: 9,
      category: 'Risk Management',
      tags: ['risk-management', 'trading', 'strategy', 'portfolio'],
      featuredImage: '/images/blog/risk-management.jpg'
    },
    {
      id: '6',
      slug: 'mobile-trading-apps-review',
      title: 'Best Mobile Trading Apps: 2024 Review',
      excerpt: 'Review of the top mobile trading applications for forex, stocks, and crypto. Features, usability, and performance compared.',
      author: {
        name: 'Michael Chen',
        avatar: '/images/authors/michael-chen.jpg'
      },
      publishedAt: '2024-01-03T13:10:00Z',
      readingTime: 5,
      category: 'Technology',
      tags: ['mobile', 'apps', 'trading', 'review'],
      featuredImage: '/images/blog/mobile-trading.jpg'
    }
  ]
  
  // Apply filters
  let filteredPosts = mockPosts
  
  if (filters?.category) {
    filteredPosts = filteredPosts.filter(post => 
      post.category.toLowerCase() === filters.category?.toLowerCase()
    )
  }
  
  if (filters?.tag) {
    filteredPosts = filteredPosts.filter(post => 
      post.tags.includes(filters.tag!)
    )
  }
  
  if (filters?.search) {
    const searchTerm = filters.search.toLowerCase()
    filteredPosts = filteredPosts.filter(post => 
      post.title.toLowerCase().includes(searchTerm) ||
      post.excerpt.toLowerCase().includes(searchTerm) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    )
  }
  
  // Pagination
  const postsPerPage = 6
  const page = filters?.page || 1
  const startIndex = (page - 1) * postsPerPage
  const endIndex = startIndex + postsPerPage
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex)
  
  return {
    posts: paginatedPosts,
    totalPages: Math.ceil(filteredPosts.length / postsPerPage),
    totalPosts: filteredPosts.length
  }
}

// Get unique categories and tags
async function getBlogMetadata() {
  const categories = [
    'Broker Reviews',
    'Trading Strategies', 
    'Education',
    'Market Analysis',
    'Risk Management',
    'Technology'
  ]
  
  const popularTags = [
    'forex',
    'brokers',
    'trading',
    'strategies',
    'regulation',
    'crypto',
    'risk-management',
    'beginners'
  ]
  
  return { categories, popularTags }
}

export const metadata: Metadata = {
  title: 'Trading Blog - Expert Insights & Market Analysis | Brokeranalysis',
  description: 'Stay updated with the latest trading insights, broker reviews, market analysis, and educational content from our expert team.',
  keywords: 'trading blog, forex news, broker reviews, market analysis, trading strategies, financial education',
  openGraph: {
    title: 'Trading Blog - Expert Insights & Market Analysis',
    description: 'Stay updated with the latest trading insights, broker reviews, market analysis, and educational content.',
    type: 'website',
    url: '/blog',
    siteName: 'Brokeranalysis',
    images: [
      {
        url: '/images/blog/blog-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Brokeranalysis Trading Blog'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trading Blog - Expert Insights & Market Analysis',
    description: 'Stay updated with the latest trading insights, broker reviews, market analysis, and educational content.',
    images: ['/images/blog/blog-og.jpg']
  },
  alternates: {
    canonical: '/blog'
  }
}

function BlogPostCard({ post }: { post: BlogPost }) {
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
          src={post.featuredImage}
          alt={post.title}
          className="w-full h-48 object-cover"
        />
        {post.featured && (
          <div className="absolute top-4 left-4">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              Featured
            </span>
          </div>
        )}
        <div className="absolute top-4 right-4">
          <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
            {post.category}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
          <Link href={`/blog/${post.slug}`}>
            {post.title}
          </Link>
        </h2>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.excerpt}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>{post.author.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>{post.readingTime} min</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <Link
                key={tag}
                href={`/blog?tag=${tag}`}
                className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
          
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            Read More
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>
    </article>
  )
}

function FeaturedPost({ post }: { post: BlogPost }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg overflow-hidden mb-12">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
        <div className="flex flex-col justify-center">
          <div className="mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white backdrop-blur-sm">
              <Tag className="h-4 w-4 mr-1" />
              Featured Post
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
            {post.title}
          </h1>
          
          <p className="text-blue-100 text-lg mb-6 leading-relaxed">
            {post.excerpt}
          </p>
          
          <div className="flex items-center space-x-6 text-blue-100 text-sm mb-6">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>{post.author.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>{post.readingTime} min read</span>
            </div>
          </div>
          
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors w-fit"
          >
            Read Full Article
            <ArrowRight className="h-5 w-5 ml-2" />
          </Link>
        </div>
        
        <div className="relative">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-64 lg:h-full object-cover rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  )
}

function Pagination({ currentPage, totalPages }: { currentPage: number, totalPages: number }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  
  return (
    <div className="flex items-center justify-center space-x-2 mt-12">
      {currentPage > 1 && (
        <Link
          href={`/blog?page=${currentPage - 1}`}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Previous
        </Link>
      )}
      
      {pages.map((page) => (
        <Link
          key={page}
          href={`/blog?page=${page}`}
          className={`px-4 py-2 text-sm font-medium rounded-lg ${
            page === currentPage
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {page}
        </Link>
      ))}
      
      {currentPage < totalPages && (
        <Link
          href={`/blog?page=${currentPage + 1}`}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Next
        </Link>
      )}
    </div>
  )
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedSearchParams = await searchParams
  const currentPage = parseInt(resolvedSearchParams.page || '1')
  const { posts, totalPages, totalPosts } = await getBlogPosts({
    category: resolvedSearchParams.category,
    tag: resolvedSearchParams.tag,
    search: resolvedSearchParams.search,
    page: currentPage
  })
  
  const { categories, popularTags } = await getBlogMetadata()
  const featuredPost = posts.find(post => post.featured) || posts[0]
  const regularPosts = posts.filter(post => !post.featured || post.id !== featuredPost.id)

  return (
    <>
      <MegaMenuHeader />
      <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Trading Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay updated with the latest trading insights, broker reviews, market analysis, and educational content from our expert team.
            </p>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Post */}
        {featuredPost && !resolvedSearchParams.category && !resolvedSearchParams.tag && !resolvedSearchParams.search && (
          <FeaturedPost post={featuredPost} />
        )}
        
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                defaultValue={resolvedSearchParams.search || ''}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select 
                defaultValue={resolvedSearchParams.category || ''}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Popular Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Popular Tags</label>
              <div className="flex flex-wrap gap-2">
                {popularTags.slice(0, 4).map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${tag}`}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      resolvedSearchParams.tag === tag
                        ? 'bg-blue-100 text-blue-800'
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
            {totalPosts > 0 ? (
              <span>
                Showing {((currentPage - 1) * 6) + 1}-{Math.min(currentPage * 6, totalPosts)} of {totalPosts} articles
              </span>
            ) : (
              <span>No articles found</span>
            )}
          </div>
          
          {(resolvedSearchParams.category || resolvedSearchParams.tag || resolvedSearchParams.search) && (
            <Link
              href="/blog"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear Filters
            </Link>
          )}
        </div>
        
        {/* Blog Posts Grid */}
        {posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
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
              href="/blog"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View all articles
            </Link>
          </div>
        )}
      </div>
    </div>
    <Footer />
    <ChatBubble />
    </>
  )
}
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Clock, User, Calendar, Tag, Share2, BookOpen } from 'lucide-react'
import Link from 'next/link'

// Mock blog data - replace with actual data fetching
interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  author: {
    name: string
    avatar: string
    bio: string
  }
  publishedAt: string
  updatedAt: string
  readingTime: number
  category: string
  tags: string[]
  featuredImage: string
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string[]
}

interface BlogPageProps {
  params: {
    slug: string
  }
}

// Mock function to get blog post by slug
async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  // Mock data - replace with actual database query
  const mockPosts: BlogPost[] = [
    {
      id: '1',
      slug: 'best-forex-brokers-2024',
      title: 'Best Forex Brokers for 2024: Complete Guide',
      excerpt: 'Discover the top-rated forex brokers for 2024 with our comprehensive analysis of trading conditions, regulation, and user experience.',
      content: `
        <h2>Introduction</h2>
        <p>The forex market continues to evolve rapidly, and choosing the right broker is crucial for trading success. In this comprehensive guide, we'll analyze the best forex brokers for 2024 based on regulation, trading conditions, platform features, and customer satisfaction.</p>
        
        <h2>Top Forex Brokers for 2024</h2>
        <h3>1. IC Markets</h3>
        <p>IC Markets stands out as one of the leading forex brokers globally, offering exceptional trading conditions and regulatory compliance across multiple jurisdictions.</p>
        
        <h4>Key Features:</h4>
        <ul>
          <li>Ultra-tight spreads from 0.0 pips</li>
          <li>Multiple regulatory licenses (ASIC, CySEC, FSA)</li>
          <li>Advanced trading platforms (MT4, MT5, cTrader)</li>
          <li>Institutional-grade execution</li>
        </ul>
        
        <h3>2. Pepperstone</h3>
        <p>Pepperstone has built a strong reputation for fast execution and competitive pricing, making it a favorite among active traders.</p>
        
        <h4>Key Features:</h4>
        <ul>
          <li>Award-winning customer service</li>
          <li>Razor-sharp spreads</li>
          <li>Advanced trading tools and analysis</li>
          <li>Strong regulatory framework</li>
        </ul>
        
        <h2>How to Choose the Right Forex Broker</h2>
        <p>When selecting a forex broker, consider these essential factors:</p>
        
        <h3>1. Regulation and Safety</h3>
        <p>Ensure your broker is regulated by reputable authorities such as FCA, ASIC, or CySEC. This provides investor protection and ensures fair trading practices.</p>
        
        <h3>2. Trading Costs</h3>
        <p>Compare spreads, commissions, and overnight fees. Lower costs can significantly impact your profitability over time.</p>
        
        <h3>3. Trading Platform</h3>
        <p>Choose a platform that suits your trading style. Popular options include MetaTrader 4/5, cTrader, and proprietary platforms.</p>
        
        <h2>Conclusion</h2>
        <p>The forex market offers tremendous opportunities, but success depends largely on choosing the right broker. Consider your trading style, experience level, and specific needs when making your decision.</p>
      `,
      author: {
        name: 'Sarah Johnson',
        avatar: '/images/authors/sarah-johnson.jpg',
        bio: 'Senior Financial Analyst with 10+ years of experience in forex markets and broker analysis.'
      },
      publishedAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-20T14:30:00Z',
      readingTime: 8,
      category: 'Broker Reviews',
      tags: ['forex', 'brokers', 'trading', '2024', 'guide'],
      featuredImage: '/images/blog/forex-brokers-2024.jpg',
      seoTitle: 'Best Forex Brokers 2024 - Complete Trading Guide | Brokeranalysis',
      seoDescription: 'Discover the top-rated forex brokers for 2024. Compare spreads, regulation, platforms & more. Expert analysis to help you choose the best broker.',
      seoKeywords: ['best forex brokers 2024', 'forex broker comparison', 'regulated forex brokers', 'forex trading platforms']
    }
  ]
  
  return mockPosts.find(post => post.slug === slug) || null
}

// Generate metadata for blog posts
export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const post = await getBlogPostBySlug(resolvedParams.slug)
  
  if (!post) {
    return {
      title: 'Blog Post Not Found - Brokeranalysis',
      description: 'The requested blog post could not be found.'
    }
  }

  return {
    title: post.seoTitle || `${post.title} - Brokeranalysis Blog`,
    description: post.seoDescription || post.excerpt,
    keywords: post.seoKeywords?.join(', ') || post.tags.join(', '),
    authors: [{ name: post.author.name }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      tags: post.tags,
      url: `/blog/${post.slug}`,
      siteName: 'Brokeranalysis',
      images: [
        {
          url: post.featuredImage,
          width: 1200,
          height: 630,
          alt: post.title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.featuredImage]
    },
    alternates: {
      canonical: `/blog/${post.slug}`
    }
  }
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  const resolvedParams = await params
  const post = await getBlogPostBySlug(resolvedParams.slug)
  
  if (!post) {
    notFound()
  }

  // Generate structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage,
    author: {
      '@type': 'Person',
      name: post.author.name
    },
    publisher: {
      '@type': 'Organization',
      name: 'Brokeranalysis',
      logo: {
        '@type': 'ImageObject',
        url: '/images/logo.png'
      }
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `/blog/${post.slug}`
    },
    keywords: post.tags.join(', '),
    articleSection: post.category
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <article className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="mb-6">
              <ol className="flex items-center space-x-2 text-sm text-gray-600">
                <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
                <li>/</li>
                <li><Link href="/blog" className="hover:text-blue-600">Blog</Link></li>
                <li>/</li>
                <li className="text-gray-900">{post.title}</li>
              </ol>
            </nav>
            
            {/* Category */}
            <div className="mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                <Tag className="h-4 w-4 mr-1" />
                {post.category}
              </span>
            </div>
            
            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>
            
            {/* Excerpt */}
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {post.excerpt}
            </p>
            
            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>By {post.author.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(post.publishedAt)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{post.readingTime} min read</span>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span>{post.category}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Featured Image */}
              <div className="mb-8">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
                />
              </div>
              
              {/* Article Content */}
              <div 
                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
              
              {/* Tags */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog/tag/${tag}`}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
              
              {/* Share */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Share this article</h3>
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Share2 className="h-4 w-4" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Author Info */}
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">About the Author</h3>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-blue-600">
                      {post.author.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{post.author.name}</h4>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{post.author.bio}</p>
              </div>
              
              {/* Related Articles */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Articles</h3>
                <div className="space-y-4">
                  <Link href="/blog/forex-trading-strategies" className="block group">
                    <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      Top Forex Trading Strategies for Beginners
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">Learn proven strategies to start your forex trading journey.</p>
                  </Link>
                  <Link href="/blog/broker-regulation-guide" className="block group">
                    <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      Understanding Broker Regulation
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">Why regulation matters and what to look for in a broker.</p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  )
}

// Generate static params for popular blog posts
export async function generateStaticParams() {
  // Popular blog post slugs
  const popularPosts = [
    'best-forex-brokers-2024',
    'forex-trading-strategies',
    'broker-regulation-guide',
    'trading-psychology-tips',
    'risk-management-forex'
  ]
  
  return popularPosts.map(slug => ({
    slug
  }))
}
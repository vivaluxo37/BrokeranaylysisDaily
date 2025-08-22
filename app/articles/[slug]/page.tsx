import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Clock, User, Calendar, Tag, Share2, BookOpen, TrendingUp, AlertCircle } from 'lucide-react'
import Link from 'next/link'

// Mock article data - replace with actual data fetching
interface Article {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  author: {
    name: string
    avatar: string
    bio: string
    expertise: string[]
  }
  publishedAt: string
  updatedAt: string
  readingTime: number
  category: string
  tags: string[]
  featuredImage: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  articleType: 'Educational' | 'Market Analysis' | 'Strategy Guide' | 'News'
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string[]
  disclaimer?: string
}

interface ArticlePageProps {
  params: {
    slug: string
  }
}

// Mock function to get article by slug
async function getArticleBySlug(slug: string): Promise<Article | null> {
  // Mock data - replace with actual database query
  const mockArticles: Article[] = [
    {
      id: '1',
      slug: 'forex-risk-management-guide',
      title: 'Complete Guide to Forex Risk Management',
      excerpt: 'Master the essential risk management techniques that separate successful traders from the rest. Learn position sizing, stop losses, and portfolio management.',
      content: `
        <h2>Introduction to Forex Risk Management</h2>
        <p>Risk management is the cornerstone of successful forex trading. Without proper risk controls, even the most profitable trading strategy can lead to devastating losses. This comprehensive guide will teach you the essential risk management techniques used by professional traders.</p>
        
        <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-yellow-700">
                <strong>Risk Warning:</strong> Trading forex involves substantial risk and may not be suitable for all investors. Past performance is not indicative of future results.
              </p>
            </div>
          </div>
        </div>
        
        <h2>The 1% Rule: Your Foundation</h2>
        <p>The most fundamental rule in forex risk management is never risk more than 1-2% of your trading capital on a single trade. This rule ensures that even a series of losing trades won't devastate your account.</p>
        
        <h3>Calculating Position Size</h3>
        <p>To implement the 1% rule effectively, you need to calculate your position size based on:</p>
        <ul>
          <li><strong>Account Balance:</strong> Your total trading capital</li>
          <li><strong>Risk Per Trade:</strong> 1% of your account balance</li>
          <li><strong>Stop Loss Distance:</strong> The number of pips from entry to stop loss</li>
          <li><strong>Pip Value:</strong> The monetary value of each pip for your currency pair</li>
        </ul>
        
        <h4>Position Size Formula:</h4>
        <div class="bg-gray-100 p-4 rounded-lg my-4">
          <code>Position Size = (Account Balance × Risk %) ÷ (Stop Loss in Pips × Pip Value)</code>
        </div>
        
        <h2>Stop Loss Strategies</h2>
        <p>A stop loss is your safety net, automatically closing a trade when it moves against you. Here are the most effective stop loss strategies:</p>
        
        <h3>1. Technical Stop Losses</h3>
        <ul>
          <li><strong>Support/Resistance Levels:</strong> Place stops just beyond key levels</li>
          <li><strong>Moving Averages:</strong> Use dynamic stops based on moving averages</li>
          <li><strong>Chart Patterns:</strong> Set stops outside pattern boundaries</li>
        </ul>
        
        <h3>2. Volatility-Based Stops</h3>
        <ul>
          <li><strong>ATR (Average True Range):</strong> Set stops based on market volatility</li>
          <li><strong>Percentage Stops:</strong> Fixed percentage from entry price</li>
        </ul>
        
        <h2>Take Profit Strategies</h2>
        <p>While stop losses limit your downside, take profit orders secure your gains. Consider these approaches:</p>
        
        <h3>Risk-Reward Ratios</h3>
        <p>Aim for a minimum 1:2 risk-reward ratio. If you risk 50 pips, target at least 100 pips profit. This allows you to be profitable even with a 50% win rate.</p>
        
        <h3>Partial Profit Taking</h3>
        <p>Consider taking partial profits at key levels:</p>
        <ul>
          <li>Take 50% profit at 1:1 risk-reward</li>
          <li>Move stop to breakeven</li>
          <li>Let remaining position run to 1:3 or higher</li>
        </ul>
        
        <h2>Portfolio Diversification</h2>
        <p>Don't put all your eggs in one basket. Diversify across:</p>
        <ul>
          <li><strong>Currency Pairs:</strong> Trade different majors, minors, and exotics</li>
          <li><strong>Time Frames:</strong> Combine short-term and long-term strategies</li>
          <li><strong>Trading Styles:</strong> Mix trend following with mean reversion</li>
        </ul>
        
        <h2>Emotional Risk Management</h2>
        <p>Managing your emotions is just as important as managing your money:</p>
        
        <h3>Common Emotional Pitfalls</h3>
        <ul>
          <li><strong>Revenge Trading:</strong> Trying to recover losses quickly</li>
          <li><strong>Overconfidence:</strong> Increasing position sizes after wins</li>
          <li><strong>Fear of Missing Out (FOMO):</strong> Entering trades without proper analysis</li>
        </ul>
        
        <h3>Solutions</h3>
        <ul>
          <li>Stick to your trading plan religiously</li>
          <li>Keep a trading journal to track emotions</li>
          <li>Take breaks after significant wins or losses</li>
          <li>Use position sizing to control emotional impact</li>
        </ul>
        
        <h2>Advanced Risk Management Techniques</h2>
        
        <h3>Correlation Analysis</h3>
        <p>Understand how your trades correlate with each other. Avoid taking multiple positions in highly correlated pairs, as this increases your overall risk.</p>
        
        <h3>Value at Risk (VaR)</h3>
        <p>Calculate the maximum expected loss over a specific time period with a given confidence level. This helps you understand your portfolio's overall risk exposure.</p>
        
        <h3>Kelly Criterion</h3>
        <p>An advanced position sizing method that optimizes bet size based on win rate and average win/loss ratio:</p>
        <div class="bg-gray-100 p-4 rounded-lg my-4">
          <code>Kelly % = (Win Rate × Average Win) - (Loss Rate × Average Loss) / Average Win</code>
        </div>
        
        <h2>Risk Management Checklist</h2>
        <p>Before entering any trade, ask yourself:</p>
        <ul>
          <li>✓ Am I risking no more than 1-2% of my account?</li>
          <li>✓ Do I have a clear stop loss level?</li>
          <li>✓ Is my risk-reward ratio at least 1:2?</li>
          <li>✓ Have I considered correlation with existing positions?</li>
          <li>✓ Am I trading with a clear mind, free from emotions?</li>
          <li>✓ Does this trade fit my overall strategy?</li>
        </ul>
        
        <h2>Conclusion</h2>
        <p>Effective risk management is what separates professional traders from gamblers. By implementing these techniques consistently, you'll protect your capital and give yourself the best chance of long-term success in the forex markets.</p>
        
        <p>Remember: it's not about being right on every trade—it's about managing your risk so well that you can be wrong many times and still be profitable overall.</p>
      `,
      author: {
        name: 'Michael Chen',
        avatar: '/images/authors/michael-chen.jpg',
        bio: 'Professional forex trader and risk management specialist with 15+ years of experience in institutional trading.',
        expertise: ['Risk Management', 'Forex Trading', 'Portfolio Management', 'Technical Analysis']
      },
      publishedAt: '2024-01-10T09:00:00Z',
      updatedAt: '2024-01-15T16:45:00Z',
      readingTime: 12,
      category: 'Risk Management',
      tags: ['risk-management', 'forex', 'trading-strategy', 'position-sizing', 'stop-loss'],
      featuredImage: '/images/articles/forex-risk-management.jpg',
      difficulty: 'Intermediate',
      articleType: 'Educational',
      seoTitle: 'Complete Forex Risk Management Guide - Protect Your Trading Capital',
      seoDescription: 'Master forex risk management with our comprehensive guide. Learn position sizing, stop losses, and advanced techniques to protect your trading capital.',
      seoKeywords: ['forex risk management', 'position sizing', 'stop loss strategies', 'trading risk control', 'forex money management'],
      disclaimer: 'This article is for educational purposes only and does not constitute financial advice. Trading forex involves substantial risk of loss and may not be suitable for all investors.'
    }
  ]
  
  return mockArticles.find(article => article.slug === slug) || null
}

// Generate metadata for articles
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const resolvedParams = await params
  const article = await getArticleBySlug(resolvedParams.slug)
  
  if (!article) {
    return {
      title: 'Article Not Found - Brokeranalysis',
      description: 'The requested article could not be found.'
    }
  }

  return {
    title: article.seoTitle || `${article.title} - Brokeranalysis`,
    description: article.seoDescription || article.excerpt,
    keywords: article.seoKeywords?.join(', ') || article.tags.join(', '),
    authors: [{ name: article.author.name }],
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author.name],
      tags: article.tags,
      url: `/articles/${article.slug}`,
      siteName: 'Brokeranalysis',
      images: [
        {
          url: article.featuredImage,
          width: 1200,
          height: 630,
          alt: article.title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [article.featuredImage]
    },
    alternates: {
      canonical: `/articles/${article.slug}`
    }
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const resolvedParams = await params
  const article = await getArticleBySlug(resolvedParams.slug)
  
  if (!article) {
    notFound()
  }

  // Generate structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: article.featuredImage,
    author: {
      '@type': 'Person',
      name: article.author.name,
      jobTitle: 'Financial Analyst'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Brokeranalysis',
      logo: {
        '@type': 'ImageObject',
        url: '/images/logo.png'
      }
    },
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `/articles/${article.slug}`
    },
    keywords: article.tags.join(', '),
    articleSection: article.category,
    educationalLevel: article.difficulty,
    about: {
      '@type': 'Thing',
      name: 'Forex Trading'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'Advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <article className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="mb-6">
              <ol className="flex items-center space-x-2 text-sm text-gray-600">
                <li><Link href="/" className="hover:text-indigo-600">Home</Link></li>
                <li>/</li>
                <li><Link href="/articles" className="hover:text-indigo-600">Articles</Link></li>
                <li>/</li>
                <li className="text-gray-900">{article.title}</li>
              </ol>
            </nav>
            
            {/* Article Type & Difficulty */}
            <div className="flex items-center space-x-3 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                <TrendingUp className="h-4 w-4 mr-1" />
                {article.articleType}
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(article.difficulty)}`}>
                {article.difficulty}
              </span>
            </div>
            
            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {article.title}
            </h1>
            
            {/* Excerpt */}
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {article.excerpt}
            </p>
            
            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>By {article.author.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(article.publishedAt)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{article.readingTime} min read</span>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span>{article.category}</span>
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
                  src={article.featuredImage}
                  alt={article.title}
                  className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
                />
              </div>
              
              {/* Disclaimer */}
              {article.disclaimer && (
                <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-8">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div className="ml-3">
                      <p className="text-sm text-amber-700">
                        <strong>Disclaimer:</strong> {article.disclaimer}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Article Content */}
              <div 
                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-indigo-600 prose-strong:text-gray-900 prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
              
              {/* Tags */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/articles/tag/${tag}`}
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
                    <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
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
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-indigo-600">
                      {article.author.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{article.author.name}</h4>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">{article.author.bio}</p>
                <div className="flex flex-wrap gap-1">
                  {article.author.expertise.map((skill) => (
                    <span key={skill} className="inline-block px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Article Info */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Article Info</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Difficulty:</span>
                    <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(article.difficulty)}`}>
                      {article.difficulty}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reading Time:</span>
                    <span className="font-medium">{article.readingTime} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">{article.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Updated:</span>
                    <span className="font-medium">{formatDate(article.updatedAt)}</span>
                  </div>
                </div>
              </div>
              
              {/* Related Articles */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Articles</h3>
                <div className="space-y-4">
                  <Link href="/articles/forex-trading-psychology" className="block group">
                    <h4 className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                      Mastering Trading Psychology
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">Control emotions and develop a winning mindset.</p>
                  </Link>
                  <Link href="/articles/technical-analysis-basics" className="block group">
                    <h4 className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                      Technical Analysis Fundamentals
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">Learn to read charts and identify trading opportunities.</p>
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

// Generate static params for popular articles
export async function generateStaticParams() {
  // Popular article slugs
  const popularArticles = [
    'forex-risk-management-guide',
    'forex-trading-psychology',
    'technical-analysis-basics',
    'fundamental-analysis-guide',
    'trading-strategies-beginners'
  ]
  
  return popularArticles.map(slug => ({
    slug
  }))
}
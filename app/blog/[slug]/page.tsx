import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Clock, User, Calendar, Tag, Share2, BookOpen } from 'lucide-react'
import Link from 'next/link'
import MegaMenuHeader from '@/components/MegaMenuHeader'
import Footer from '@/components/Footer'
import ChatBubble from '@/components/ChatBubble'
import { ArticleService } from '@/lib/services/articleService'
import type { Article } from '@/lib/supabase'

// Enable static generation with revalidation for performance
export const revalidate = 7200 // Revalidate every 2 hours

// Blog post interface matching Supabase Article type
interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  author: {
    name: string
    avatar?: string
    bio?: string
  }
  publishedAt: string
  updatedAt?: string
  readingTime?: number
  category: string
  tags: string[]
  featuredImage?: string
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string[]
}

interface BlogPageProps {
  params: Promise<{ slug: string }>
}

// Optimized function to get blog post by slug with caching
async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    // Get article from Supabase
    const article = await ArticleService.getArticleBySlug(slug)
    
    if (!article) {
      return null
    }

    // Transform Supabase article to BlogPost format
    const blogPost: BlogPost = {
      id: article.id,
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt || article.meta_description || '',
      content: article.content || '<p>Content coming soon...</p>',
      author: {
        name: typeof article.authors === 'object' && article.authors 
          ? (article.authors as any).name 
          : 'Unknown Author',
        avatar: typeof article.authors === 'object' && article.authors 
          ? (article.authors as any).avatar_url 
          : undefined,
        bio: typeof article.authors === 'object' && article.authors 
          ? (article.authors as any).bio 
          : undefined
      },
      publishedAt: article.published_at || new Date().toISOString(),
      updatedAt: article.updated_at,
      readingTime: article.reading_time || 5,
      category: article.category || 'General',
      tags: article.tags || [],
      featuredImage: article.featured_image_url || '/images/article-placeholder.jpg',
      seoTitle: article.meta_title || article.title,
      seoDescription: article.meta_description || article.excerpt,
      seoKeywords: article.meta_keywords || []
    }

    return blogPost
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
}

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
    title: post.seoTitle || `${post.title} | Brokeranalysis`,
    description: post.seoDescription || post.excerpt,
    keywords: post.seoKeywords?.join(', ') || post.tags.join(', '),
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      tags: post.tags,
      images: post.featuredImage ? [
        {
          url: post.featuredImage,
          width: 1200,
          height: 630,
          alt: post.title
        }
      ] : undefined
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.featuredImage ? [post.featuredImage] : undefined
    }
  }
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  const resolvedParams = await params
  const post = await getBlogPostBySlug(resolvedParams.slug)

  if (!post) {
    notFound()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <>
      <MegaMenuHeader />
      <article className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-6">
          {/* Article Header */}
          <header className="mb-12">
            <div className="mb-6">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {post.category}
              </span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {post.excerpt}
            </p>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>{post.author.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(post.publishedAt)}</span>
              </div>
              {post.readingTime && (
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>{post.readingTime} min read</span>
                </div>
              )}
            </div>
            
            {post.featuredImage && (
              <div className="mb-8">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-64 lg:h-96 object-cover rounded-lg shadow-lg"
                />
              </div>
            )}
          </header>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Article Content */}
              <div 
                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-indigo-600 prose-strong:text-gray-900 prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded"
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
              
              {/* Share Buttons */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Share this article</h3>
                <div className="flex space-x-4">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Author Info */}
              <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
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
                {post.author.bio && (
                  <p className="text-sm text-gray-600">{post.author.bio}</p>
                )}
              </div>
              
              {/* Related Articles */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Articles</h3>
                <div className="space-y-4">
                  <Link href="/blog/forex-trading-strategies" className="block group">
                    <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      Top 5 Forex Trading Strategies for Beginners
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">Learn proven strategies that work for new traders.</p>
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
      <Footer />
      <ChatBubble />
    </>
  )
}

// Generate static params for blog posts
export async function generateStaticParams() {
  try {
    // Get recent articles from Supabase for static generation
    const articles = await ArticleService.getArticles(20, 0) // Get top 20 articles
    
    return articles.map(article => ({
      slug: article.slug
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    
    // Fallback to popular blog post slugs
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
}

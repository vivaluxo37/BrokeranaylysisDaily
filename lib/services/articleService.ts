import { supabase } from '../supabase';
import type { Article, Author, Category } from '../supabase';
import { cache, CACHE_KEYS, CACHE_TTL, generateCacheKey } from '../cache';

// Service for handling article-related data operations with caching
export class ArticleService {
  
  /**
   * Get published articles with author and category information
   * Optimized with selective field fetching and caching for better performance
   */
  static async getArticles(limit: number = 10, offset: number = 0): Promise<Article[]> {
    // Generate cache key with parameters
    const cacheKey = generateCacheKey(CACHE_KEYS.ARTICLES, { limit, offset });

    // Try to get from cache first
    const cached = cache.get<Article[]>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          id,
          title,
          slug,
          excerpt,
          meta_description,
          published_at,
          updated_at,
          reading_time,
          category,
          tags,
          featured_image_url,
          authors:author_id(name, slug, avatar_url, bio)
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Error fetching articles:', error);
        return [];
      }

      const articles = data || [];

      // Cache the result for 1 hour
      cache.set(cacheKey, articles, CACHE_TTL.MEDIUM);

      return articles;
    } catch (error) {
      console.error('Error in getArticles:', error);
      return [];
    }
  }

  /**
   * Get total count of published articles for pagination with caching
   */
  static async getArticleCount(): Promise<number> {
    // Try to get from cache first
    const cached = cache.get<number>(CACHE_KEYS.ARTICLE_COUNT);
    if (cached !== null) {
      return cached;
    }

    try {
      const { count, error } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published');

      if (error) {
        console.error('Error fetching article count:', error);
        return 0;
      }

      const articleCount = count || 0;

      // Cache the result for 2 hours
      cache.set(CACHE_KEYS.ARTICLE_COUNT, articleCount, CACHE_TTL.LONG);

      return articleCount;
    } catch (error) {
      console.error('Error in getArticleCount:', error);
      return 0;
    }
  }

  /**
   * Get featured articles for homepage
   */
  static async getFeaturedArticles(limit: number = 3): Promise<Article[]> {
    try {
      // Since there's no is_featured column, get the latest published articles
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          authors:author_id(*)
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching featured articles:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getFeaturedArticles:', error);
      return [];
    }
  }

  /**
   * Get article by slug with full content and caching
   * Optimized for individual article pages
   */
  static async getArticleBySlug(slug: string): Promise<Article | null> {
    // Try to get from cache first
    const cacheKey = CACHE_KEYS.ARTICLE_BY_SLUG(slug);
    const cached = cache.get<Article | null>(cacheKey);
    if (cached !== undefined) {
      return cached;
    }

    try {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          authors:author_id(name, slug, avatar_url, bio, expertise)
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned - cache null result to avoid repeated queries
          cache.set(cacheKey, null, CACHE_TTL.MEDIUM);
          return null;
        }
        console.error('Error fetching article by slug:', error);
        return null;
      }

      // Cache the result for 2 hours
      cache.set(cacheKey, data, CACHE_TTL.LONG);

      return data;
    } catch (error) {
      console.error('Error in getArticleBySlug:', error);
      return null;
    }
  }

  /**
   * Get articles by category
   */
  static async getArticlesByCategory(categorySlug: string, limit: number = 10): Promise<Article[]> {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          authors:author_id(*)
        `)
        .eq('category', categorySlug)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching articles by category:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getArticlesByCategory:', error);
      return [];
    }
  }

  /**
   * Search articles by title and content
   */
  static async searchArticles(searchTerm: string, limit: number = 10): Promise<Article[]> {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          authors:author_id(*)
        `)
        .eq('status', 'published')
        .or(`title.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`)
        .order('published_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error searching articles:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in searchArticles:', error);
      return [];
    }
  }

  /**
   * Get related articles based on category and tags
   */
  static async getRelatedArticles(articleId: string, limit: number = 3): Promise<Article[]> {
    try {
      // First get the current article's category
      const { data: currentArticle, error: currentError } = await supabase
        .from('articles')
        .select('category, tags')
        .eq('id', articleId)
        .single();

      if (currentError || !currentArticle) {
        console.error('Error fetching current article:', currentError);
        return [];
      }

      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          authors:author_id(*)
        `)
        .eq('category', currentArticle.category)
        .eq('status', 'published')
        .neq('id', articleId)
        .order('published_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching related articles:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getRelatedArticles:', error);
      return [];
    }
  }

  /**
   * Get latest blog insights for homepage
   */
  static async getBlogInsights(limit: number = 3): Promise<Article[]> {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          authors:author_id(*)
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching blog insights:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getBlogInsights:', error);
      return [];
    }
  }

  /**
   * Get all categories
   */
  static async getCategories(): Promise<Category[]> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching categories:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getCategories:', error);
      return [];
    }
  }

  /**
   * Get all authors
   */
  static async getAuthors(): Promise<Author[]> {
    try {
      const { data, error } = await supabase
        .from('authors')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching authors:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAuthors:', error);
      return [];
    }
  }

  /**
   * Get article statistics
   */
  static async getArticleStats(): Promise<{
    totalArticles: number;
    totalCategories: number;
    totalAuthors: number;
    latestArticle: string;
  }> {
    try {
      // Get total articles count
      const { count: articlesCount } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published');

      // Get total categories count
      const { count: categoriesCount } = await supabase
        .from('categories')
        .select('*', { count: 'exact', head: true });

      // Get total authors count
      const { count: authorsCount } = await supabase
        .from('authors')
        .select('*', { count: 'exact', head: true });

      // Get latest article
      const { data: latestArticle } = await supabase
        .from('articles')
        .select('title')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(1)
        .single();

      return {
        totalArticles: articlesCount || 0,
        totalCategories: categoriesCount || 0,
        totalAuthors: authorsCount || 0,
        latestArticle: latestArticle?.title || 'N/A'
      };
    } catch (error) {
      console.error('Error in getArticleStats:', error);
      return {
        totalArticles: 0,
        totalCategories: 0,
        totalAuthors: 0,
        latestArticle: 'N/A'
      };
    }
  }
}

// Helper function to format article data for frontend components
export function formatArticleForDisplay(article: Article) {
  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt || '',
    content: article.content || '',
    image: article.featured_image || '/images/article-placeholder.jpg',
    author: article.authors?.name || 'Unknown Author',
    authorSlug: article.authors?.slug || '',
    authorBio: article.authors?.bio || '',
    authorAvatar: article.authors?.avatar_url || '/images/author-placeholder.jpg',
    category: article.categories?.name || 'Uncategorized',
    categorySlug: article.categories?.slug || '',
    publishedAt: article.published_at ? new Date(article.published_at) : new Date(),
    readTime: article.read_time || '5 min read',
    tags: article.tags || [],
    metaTitle: article.meta_title || article.title,
    metaDescription: article.meta_description || article.excerpt,
    featured: article.is_featured || false,
    views: article.view_count || 0
  };
}

// Helper function to calculate reading time
export function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

// Helper function to format date for display
export function formatArticleDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
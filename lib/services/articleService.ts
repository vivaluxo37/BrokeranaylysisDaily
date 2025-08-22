import { supabase } from '../supabase';
import type { Article, Author, Category } from '../supabase';

// Service for handling article-related data operations
export class ArticleService {
  
  /**
   * Get published articles with author and category information
   */
  static async getArticles(limit: number = 10, offset: number = 0): Promise<Article[]> {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          authors:author_id(*),
          categories:category_id(*)
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Error fetching articles:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getArticles:', error);
      return [];
    }
  }

  /**
   * Get featured articles for homepage
   */
  static async getFeaturedArticles(limit: number = 3): Promise<Article[]> {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          authors:author_id(*),
          categories:category_id(*)
        `)
        .eq('status', 'published')
        .eq('is_featured', true)
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
   * Get article by slug
   */
  static async getArticleBySlug(slug: string): Promise<Article | null> {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          authors:author_id(*),
          categories:category_id(*)
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) {
        console.error('Error fetching article by slug:', error);
        return null;
      }

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
      // First get the category ID
      const { data: category, error: categoryError } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', categorySlug)
        .single();

      if (categoryError || !category) {
        console.error('Error fetching category:', categoryError);
        return [];
      }

      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          authors:author_id(*),
          categories:category_id(*)
        `)
        .eq('category_id', category.id)
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
          authors:author_id(*),
          categories:category_id(*)
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
        .select('category_id, tags')
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
          authors:author_id(*),
          categories:category_id(*)
        `)
        .eq('category_id', currentArticle.category_id)
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
          authors:author_id(*),
          categories:category_id(*)
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
import { supabase } from '../supabase';
import type { Category, Article } from '../supabase';

// Service for handling category-related data operations
export class CategoryService {
  
  /**
   * Get all categories with article counts
   */
  static async getCategories(): Promise<(Category & { articleCount: number })[]> {
    try {
      // First, try to get categories with the foreign key relationship
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (categoriesError) {
        console.error('Error fetching categories:', categoriesError);
        return [];
      }

      if (!categoriesData || categoriesData.length === 0) {
        // Return empty array if no categories exist
        return [];
      }

      // Get article counts for each category
      const categoriesWithCounts = await Promise.all(
        categoriesData.map(async (category) => {
          try {
            // Try to count articles by category_id first, then fallback to category field
            let articleCount = 0;

            // Try category_id field first
            const { count: countByCategoryId, error: countError1 } = await supabase
              .from('articles')
              .select('*', { count: 'exact', head: true })
              .eq('category_id', category.id)
              .eq('status', 'published');

            if (!countError1 && countByCategoryId !== null) {
              articleCount = countByCategoryId;
            } else {
              // Fallback to category field (string-based)
              const { count: countByCategory, error: countError2 } = await supabase
                .from('articles')
                .select('*', { count: 'exact', head: true })
                .eq('category', category.slug)
                .eq('status', 'published');

              if (!countError2 && countByCategory !== null) {
                articleCount = countByCategory;
              }
            }

            return {
              ...category,
              articleCount
            };
          } catch (error) {
            console.error(`Error counting articles for category ${category.name}:`, error);
            return {
              ...category,
              articleCount: 0
            };
          }
        })
      );

      return categoriesWithCounts;
    } catch (error) {
      console.error('Error in getCategories:', error);
      return [];
    }
  }

  /**
   * Get category by slug
   */
  static async getCategoryBySlug(slug: string): Promise<Category | null> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        console.error('Error fetching category by slug:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getCategoryBySlug:', error);
      return null;
    }
  }

  /**
   * Get popular categories (by article count)
   */
  static async getPopularCategories(limit: number = 5): Promise<(Category & { articleCount: number })[]> {
    try {
      // Get all categories with counts first
      const categoriesWithCount = await this.getCategories();

      // Sort by article count and return top categories
      return categoriesWithCount
        .sort((a, b) => b.articleCount - a.articleCount)
        .slice(0, limit);
    } catch (error) {
      console.error('Error in getPopularCategories:', error);
      return [];
    }
  }

  /**
   * Get category navigation menu items
   */
  static async getCategoryNavigation(): Promise<{
    id: string;
    name: string;
    slug: string;
    description?: string;
    articleCount: number;
  }[]> {
    try {
      // Get all categories with counts
      const categoriesWithCount = await this.getCategories();

      return categoriesWithCount.map(category => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        articleCount: category.articleCount
      }));
    } catch (error) {
      console.error('Error in getCategoryNavigation:', error);
      return [];
    }
  }

  /**
   * Get category statistics
   */
  static async getCategoryStats(): Promise<{
    totalCategories: number;
    mostPopularCategory: string;
    averageArticlesPerCategory: number;
    categoriesWithoutArticles: number;
  }> {
    try {
      // Get all categories with article counts
      const categoriesWithCount = await this.getCategories();

      const totalCategories = categoriesWithCount.length;
      const categoriesWithoutArticles = categoriesWithCount.filter(c => c.articleCount === 0).length;
      const totalArticles = categoriesWithCount.reduce((sum, c) => sum + c.articleCount, 0);
      const averageArticlesPerCategory = totalCategories > 0 ? totalArticles / totalCategories : 0;

      // Find most popular category
      const mostPopular = categoriesWithCount.reduce((prev, current) =>
        (prev.articleCount > current.articleCount) ? prev : current,
        { name: 'N/A', articleCount: 0 }
      );

      return {
        totalCategories,
        mostPopularCategory: mostPopular.name,
        averageArticlesPerCategory: Math.round(averageArticlesPerCategory * 10) / 10,
        categoriesWithoutArticles
      };
    } catch (error) {
      console.error('Error in getCategoryStats:', error);
      return {
        totalCategories: 0,
        mostPopularCategory: 'N/A',
        averageArticlesPerCategory: 0,
        categoriesWithoutArticles: 0
      };
    }
  }

  /**
   * Search categories by name and description
   */
  static async searchCategories(searchTerm: string): Promise<Category[]> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
        .order('name');

      if (error) {
        console.error('Error searching categories:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in searchCategories:', error);
      return [];
    }
  }

  /**
   * Get category breadcrumb data
   */
  static async getCategoryBreadcrumb(slug: string): Promise<{
    name: string;
    slug: string;
    description?: string;
  } | null> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('name, slug, description')
        .eq('slug', slug)
        .single();

      if (error) {
        console.error('Error fetching category breadcrumb:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getCategoryBreadcrumb:', error);
      return null;
    }
  }

  /**
   * Get related categories based on shared articles or similar topics
   */
  static async getRelatedCategories(categoryId: string, limit: number = 3): Promise<Category[]> {
    try {
      // For now, just get other categories excluding the current one
      // In the future, this could be enhanced with ML-based similarity
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .neq('id', categoryId)
        .order('name')
        .limit(limit);

      if (error) {
        console.error('Error fetching related categories:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getRelatedCategories:', error);
      return [];
    }
  }
}

// Helper function to format category data for frontend components
export function formatCategoryForDisplay(category: Category & { articleCount?: number }) {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description || '',
    articleCount: category.articleCount || 0,
    metaTitle: category.meta_title || category.name,
    metaDescription: category.meta_description || category.description,
    createdAt: category.created_at ? new Date(category.created_at) : new Date(),
    updatedAt: category.updated_at ? new Date(category.updated_at) : new Date()
  };
}

// Helper function to generate category URL
export function getCategoryUrl(slug: string): string {
  return `/category/${slug}`;
}

// Helper function to generate category meta tags
export function getCategoryMetaTags(category: Category) {
  return {
    title: category.meta_title || `${category.name} - Brokeranalysis`,
    description: category.meta_description || category.description || `Articles about ${category.name}`,
    canonical: `https://brokeranalysis.com/category/${category.slug}`,
    openGraph: {
      title: category.meta_title || category.name,
      description: category.meta_description || category.description,
      type: 'website',
      url: `https://brokeranalysis.com/category/${category.slug}`
    }
  };
}
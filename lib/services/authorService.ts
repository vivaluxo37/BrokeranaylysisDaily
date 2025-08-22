import { supabase } from '../supabase';
import type { Author, Article } from '../supabase';

// Service for handling author-related data operations
export class AuthorService {
  
  /**
   * Get all authors with article counts
   */
  static async getAuthors(): Promise<(Author & { articleCount: number })[]> {
    try {
      const { data, error } = await supabase
        .from('authors')
        .select(`
          *,
          articles!author_id(count)
        `)
        .order('name');

      if (error) {
        console.error('Error fetching authors:', error);
        return [];
      }

      return (data || []).map(author => ({
        ...author,
        articleCount: author.articles?.[0]?.count || 0
      }));
    } catch (error) {
      console.error('Error in getAuthors:', error);
      return [];
    }
  }

  /**
   * Get author by slug
   */
  static async getAuthorBySlug(slug: string): Promise<Author | null> {
    try {
      const { data, error } = await supabase
        .from('authors')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        console.error('Error fetching author by slug:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getAuthorBySlug:', error);
      return null;
    }
  }

  /**
   * Get featured authors (most prolific writers)
   */
  static async getFeaturedAuthors(limit: number = 5): Promise<(Author & { articleCount: number })[]> {
    try {
      const { data, error } = await supabase
        .from('authors')
        .select(`
          *,
          articles!author_id(count)
        `)
        .order('name');

      if (error) {
        console.error('Error fetching featured authors:', error);
        return [];
      }

      const authorsWithCount = (data || []).map(author => ({
        ...author,
        articleCount: author.articles?.[0]?.count || 0
      }));

      // Sort by article count and return top authors
      return authorsWithCount
        .sort((a, b) => b.articleCount - a.articleCount)
        .slice(0, limit);
    } catch (error) {
      console.error('Error in getFeaturedAuthors:', error);
      return [];
    }
  }

  /**
   * Get articles by author
   */
  static async getArticlesByAuthor(authorSlug: string, limit: number = 10, offset: number = 0): Promise<Article[]> {
    try {
      // First get the author ID
      const { data: author, error: authorError } = await supabase
        .from('authors')
        .select('id')
        .eq('slug', authorSlug)
        .single();

      if (authorError || !author) {
        console.error('Error fetching author:', authorError);
        return [];
      }

      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          authors:author_id(*),
          categories:category_id(*)
        `)
        .eq('author_id', author.id)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Error fetching articles by author:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getArticlesByAuthor:', error);
      return [];
    }
  }

  /**
   * Get author profile with statistics
   */
  static async getAuthorProfile(slug: string): Promise<(Author & {
    articleCount: number;
    latestArticle?: Article;
    totalViews: number;
    averageReadTime: number;
  }) | null> {
    try {
      // Get author basic info
      const { data: author, error: authorError } = await supabase
        .from('authors')
        .select('*')
        .eq('slug', slug)
        .single();

      if (authorError || !author) {
        console.error('Error fetching author profile:', authorError);
        return null;
      }

      // Get author's articles with statistics
      const { data: articles, error: articlesError } = await supabase
        .from('articles')
        .select('id, title, slug, published_at, view_count, read_time')
        .eq('author_id', author.id)
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (articlesError) {
        console.error('Error fetching author articles:', articlesError);
        return {
          ...author,
          articleCount: 0,
          totalViews: 0,
          averageReadTime: 0
        };
      }

      const articleCount = articles?.length || 0;
      const totalViews = articles?.reduce((sum, article) => sum + (article.view_count || 0), 0) || 0;
      const totalReadTime = articles?.reduce((sum, article) => {
        const readTime = parseInt(article.read_time?.replace(' min read', '') || '0');
        return sum + readTime;
      }, 0) || 0;
      const averageReadTime = articleCount > 0 ? Math.round(totalReadTime / articleCount) : 0;

      // Get latest article with full details
      let latestArticle = undefined;
      if (articles && articles.length > 0) {
        const { data: latest, error: latestError } = await supabase
          .from('articles')
          .select(`
            *,
            authors:author_id(*),
            categories:category_id(*)
          `)
          .eq('id', articles[0].id)
          .single();

        if (!latestError && latest) {
          latestArticle = latest;
        }
      }

      return {
        ...author,
        articleCount,
        latestArticle,
        totalViews,
        averageReadTime
      };
    } catch (error) {
      console.error('Error in getAuthorProfile:', error);
      return null;
    }
  }

  /**
   * Search authors by name and bio
   */
  static async searchAuthors(searchTerm: string): Promise<Author[]> {
    try {
      const { data, error } = await supabase
        .from('authors')
        .select('*')
        .or(`name.ilike.%${searchTerm}%,bio.ilike.%${searchTerm}%,expertise.ilike.%${searchTerm}%`)
        .order('name');

      if (error) {
        console.error('Error searching authors:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in searchAuthors:', error);
      return [];
    }
  }

  /**
   * Get author statistics
   */
  static async getAuthorStats(): Promise<{
    totalAuthors: number;
    mostProlificAuthor: string;
    averageArticlesPerAuthor: number;
    authorsWithoutArticles: number;
  }> {
    try {
      // Get all authors with article counts
      const { data, error } = await supabase
        .from('authors')
        .select(`
          name,
          articles!author_id(count)
        `);

      if (error) {
        console.error('Error fetching author stats:', error);
        return {
          totalAuthors: 0,
          mostProlificAuthor: 'N/A',
          averageArticlesPerAuthor: 0,
          authorsWithoutArticles: 0
        };
      }

      const authors = data || [];
      const authorsWithCount = authors.map(author => ({
        name: author.name,
        articleCount: author.articles?.[0]?.count || 0
      }));

      const totalAuthors = authors.length;
      const authorsWithoutArticles = authorsWithCount.filter(a => a.articleCount === 0).length;
      const totalArticles = authorsWithCount.reduce((sum, a) => sum + a.articleCount, 0);
      const averageArticlesPerAuthor = totalAuthors > 0 ? totalArticles / totalAuthors : 0;
      
      // Find most prolific author
      const mostProlific = authorsWithCount.reduce((prev, current) => 
        (prev.articleCount > current.articleCount) ? prev : current,
        { name: 'N/A', articleCount: 0 }
      );

      return {
        totalAuthors,
        mostProlificAuthor: mostProlific.name,
        averageArticlesPerAuthor: Math.round(averageArticlesPerAuthor * 10) / 10,
        authorsWithoutArticles
      };
    } catch (error) {
      console.error('Error in getAuthorStats:', error);
      return {
        totalAuthors: 0,
        mostProlificAuthor: 'N/A',
        averageArticlesPerAuthor: 0,
        authorsWithoutArticles: 0
      };
    }
  }

  /**
   * Get authors for team page
   */
  static async getTeamAuthors(): Promise<Author[]> {
    try {
      const { data, error } = await supabase
        .from('authors')
        .select('*')
        .eq('is_team_member', true)
        .order('name');

      if (error) {
        console.error('Error fetching team authors:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getTeamAuthors:', error);
      return [];
    }
  }
}

// Helper function to format author data for frontend components
export function formatAuthorForDisplay(author: Author & { articleCount?: number }) {
  return {
    id: author.id,
    name: author.name,
    slug: author.slug,
    bio: author.bio || '',
    avatar: author.avatar_url || '/images/author-placeholder.jpg',
    expertise: author.expertise || [],
    socialLinks: {
      twitter: author.twitter_url || '',
      linkedin: author.linkedin_url || '',
      website: author.website_url || ''
    },
    articleCount: author.articleCount || 0,
    isTeamMember: author.is_team_member || false,
    metaTitle: author.meta_title || author.name,
    metaDescription: author.meta_description || author.bio,
    createdAt: author.created_at ? new Date(author.created_at) : new Date(),
    updatedAt: author.updated_at ? new Date(author.updated_at) : new Date()
  };
}

// Helper function to generate author URL
export function getAuthorUrl(slug: string): string {
  return `/author/${slug}`;
}

// Helper function to generate author meta tags
export function getAuthorMetaTags(author: Author) {
  return {
    title: author.meta_title || `${author.name} - Brokeranalysis`,
    description: author.meta_description || author.bio || `Articles by ${author.name}`,
    canonical: `https://brokeranalysis.com/author/${author.slug}`,
    openGraph: {
      title: author.meta_title || author.name,
      description: author.meta_description || author.bio,
      type: 'profile',
      url: `https://brokeranalysis.com/author/${author.slug}`,
      images: author.avatar_url ? [{
        url: author.avatar_url,
        width: 400,
        height: 400,
        alt: author.name
      }] : []
    }
  };
}

// Helper function to get author expertise as formatted string
export function formatAuthorExpertise(expertise: string[]): string {
  if (!expertise || expertise.length === 0) return 'Trading Expert';
  if (expertise.length === 1) return expertise[0];
  if (expertise.length === 2) return expertise.join(' & ');
  return `${expertise.slice(0, -1).join(', ')} & ${expertise[expertise.length - 1]}`;
}
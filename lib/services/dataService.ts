import { BrokerService } from './brokerService';
import { ArticleService } from './articleService';
import { CategoryService } from './categoryService';
import { AuthorService } from './authorService';
import type { Broker, Article, Author, Category } from '../supabase';

// Unified data service that orchestrates all data operations
export class DataService {
  
  // Broker-related methods
  static broker = BrokerService;
  static article = ArticleService;
  static category = CategoryService;
  static author = AuthorService;

  /**
   * Get homepage data - all the data needed for the main page
   */
  static async getHomepageData(): Promise<{
    topBrokers: Broker[];
    featuredBrokers: Broker[];
    featuredArticles: Article[];
    blogInsights: Article[];
    categories: Category[];
    stats: {
      totalBrokers: number;
      totalArticles: number;
      totalAuthors: number;
      totalCategories: number;
    };
  }> {
    try {
      // Fetch all data in parallel for better performance
      const [topBrokers, featuredBrokers, featuredArticles, blogInsights, categories, brokerStats, articleStats] = await Promise.all([
        BrokerService.getTopBrokers(6),
        BrokerService.getFeaturedBrokers(3),
        ArticleService.getFeaturedArticles(3),
        ArticleService.getBlogInsights(4),
        CategoryService.getCategories(),
        BrokerService.getBrokerStats(),
        ArticleService.getArticleStats()
      ]);

      return {
        topBrokers,
        featuredBrokers,
        featuredArticles,
        blogInsights,
        categories: categories.slice(0, 8), // Limit categories for homepage
        stats: {
          totalBrokers: brokerStats.totalBrokers,
          totalArticles: articleStats.totalArticles,
          totalAuthors: articleStats.totalAuthors,
          totalCategories: articleStats.totalCategories
        }
      };
    } catch (error) {
      console.error('Error fetching homepage data:', error);
      return {
        topBrokers: [],
        featuredBrokers: [],
        featuredArticles: [],
        blogInsights: [],
        categories: [],
        stats: {
          totalBrokers: 0,
          totalArticles: 0,
          totalAuthors: 0,
          totalCategories: 0
        }
      };
    }
  }

  /**
   * Get broker comparison page data
   */
  static async getBrokerComparisonData(brokerSlugs: string[]): Promise<{
    brokers: Broker[];
    relatedBrokers: Broker[];
    comparisonArticles: Article[];
  }> {
    try {
      const [brokers, relatedBrokers, comparisonArticles] = await Promise.all([
        Promise.all(brokerSlugs.map(slug => BrokerService.getBrokerBySlug(slug))),
        BrokerService.getTopBrokers(4),
        ArticleService.searchArticles('comparison', 3)
      ]);

      return {
        brokers: brokers.filter(Boolean) as Broker[],
        relatedBrokers,
        comparisonArticles
      };
    } catch (error) {
      console.error('Error fetching broker comparison data:', error);
      return {
        brokers: [],
        relatedBrokers: [],
        comparisonArticles: []
      };
    }
  }

  /**
   * Get search results data
   */
  static async getSearchResults(query: string, filters?: {
    type?: 'all' | 'brokers' | 'articles';
    category?: string;
    minRating?: number;
    maxDeposit?: number;
  }): Promise<{
    brokers: Broker[];
    articles: Article[];
    categories: Category[];
    authors: Author[];
    totalResults: number;
  }> {
    try {
      const searchType = filters?.type || 'all';
      
      let brokers: Broker[] = [];
      let articles: Article[] = [];
      let categories: Category[] = [];
      let authors: Author[] = [];

      if (searchType === 'all' || searchType === 'brokers') {
        brokers = await BrokerService.searchBrokers(query, {
          minRating: filters?.minRating,
          maxMinDeposit: filters?.maxDeposit
        });
      }

      if (searchType === 'all' || searchType === 'articles') {
        articles = await ArticleService.searchArticles(query, 10);
      }

      if (searchType === 'all') {
        [categories, authors] = await Promise.all([
          CategoryService.searchCategories(query),
          AuthorService.searchAuthors(query)
        ]);
      }

      return {
        brokers,
        articles,
        categories,
        authors,
        totalResults: brokers.length + articles.length + categories.length + authors.length
      };
    } catch (error) {
      console.error('Error fetching search results:', error);
      return {
        brokers: [],
        articles: [],
        categories: [],
        authors: [],
        totalResults: 0
      };
    }
  }

  /**
   * Get blog page data
   */
  static async getBlogData(page: number = 1, limit: number = 12, categorySlug?: string): Promise<{
    articles: Article[];
    categories: Category[];
    featuredArticles: Article[];
    totalPages: number;
    currentPage: number;
  }> {
    try {
      const offset = (page - 1) * limit;
      
      const [articles, categories, featuredArticles] = await Promise.all([
        categorySlug 
          ? ArticleService.getArticlesByCategory(categorySlug, limit)
          : ArticleService.getArticles(limit, offset),
        CategoryService.getCategories(),
        ArticleService.getFeaturedArticles(3)
      ]);

      // Calculate total pages (simplified - in production, you'd want a proper count)
      const totalPages = Math.ceil(100 / limit); // Assuming max 100 articles for now

      return {
        articles,
        categories,
        featuredArticles,
        totalPages,
        currentPage: page
      };
    } catch (error) {
      console.error('Error fetching blog data:', error);
      return {
        articles: [],
        categories: [],
        featuredArticles: [],
        totalPages: 1,
        currentPage: 1
      };
    }
  }

  /**
   * Get broker detail page data
   */
  static async getBrokerDetailData(slug: string): Promise<{
    broker: Broker | null;
    relatedBrokers: Broker[];
    brokerArticles: Article[];
    comparisonBrokers: Broker[];
  }> {
    try {
      const broker = await BrokerService.getBrokerBySlug(slug);
      
      if (!broker) {
        return {
          broker: null,
          relatedBrokers: [],
          brokerArticles: [],
          comparisonBrokers: []
        };
      }

      const [relatedBrokers, brokerArticles, comparisonBrokers] = await Promise.all([
        BrokerService.getTopBrokers(4),
        ArticleService.searchArticles(broker.name, 3),
        BrokerService.getBrokersForComparison([broker.id], 3)
      ]);

      return {
        broker,
        relatedBrokers: relatedBrokers.filter(b => b.id !== broker.id),
        brokerArticles,
        comparisonBrokers
      };
    } catch (error) {
      console.error('Error fetching broker detail data:', error);
      return {
        broker: null,
        relatedBrokers: [],
        brokerArticles: [],
        comparisonBrokers: []
      };
    }
  }

  /**
   * Get article detail page data
   */
  static async getArticleDetailData(slug: string): Promise<{
    article: Article | null;
    relatedArticles: Article[];
    author: Author | null;
    category: Category | null;
    moreFromAuthor: Article[];
  }> {
    try {
      const article = await ArticleService.getArticleBySlug(slug);
      
      if (!article) {
        return {
          article: null,
          relatedArticles: [],
          author: null,
          category: null,
          moreFromAuthor: []
        };
      }

      const [relatedArticles, author, category, moreFromAuthor] = await Promise.all([
        ArticleService.getRelatedArticles(article.id, 3),
        article.authors ? Promise.resolve(article.authors) : null,
        article.categories ? Promise.resolve(article.categories) : null,
        article.authors?.slug ? AuthorService.getArticlesByAuthor(article.authors.slug, 3) : Promise.resolve([])
      ]);

      return {
        article,
        relatedArticles,
        author,
        category,
        moreFromAuthor: moreFromAuthor.filter(a => a.id !== article.id)
      };
    } catch (error) {
      console.error('Error fetching article detail data:', error);
      return {
        article: null,
        relatedArticles: [],
        author: null,
        category: null,
        moreFromAuthor: []
      };
    }
  }

  /**
   * Get dashboard data for admin/analytics
   */
  static async getDashboardData(): Promise<{
    stats: {
      brokers: any;
      articles: any;
      authors: any;
      categories: any;
    };
    recentActivity: {
      latestArticles: Article[];
      topBrokers: Broker[];
      activeAuthors: Author[];
    };
  }> {
    try {
      const [brokerStats, articleStats, authorStats, categoryStats, latestArticles, topBrokers, activeAuthors] = await Promise.all([
        BrokerService.getBrokerStats(),
        ArticleService.getArticleStats(),
        AuthorService.getAuthorStats(),
        CategoryService.getCategoryStats(),
        ArticleService.getArticles(5),
        BrokerService.getTopBrokers(5),
        AuthorService.getFeaturedAuthors(5)
      ]);

      return {
        stats: {
          brokers: brokerStats,
          articles: articleStats,
          authors: authorStats,
          categories: categoryStats
        },
        recentActivity: {
          latestArticles,
          topBrokers,
          activeAuthors
        }
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      return {
        stats: {
          brokers: { totalBrokers: 0, averageRating: 0, topRatedBroker: 'N/A', regulatedBrokers: 0 },
          articles: { totalArticles: 0, totalCategories: 0, totalAuthors: 0, latestArticle: 'N/A' },
          authors: { totalAuthors: 0, mostProlificAuthor: 'N/A', averageArticlesPerAuthor: 0, authorsWithoutArticles: 0 },
          categories: { totalCategories: 0, mostPopularCategory: 'N/A', averageArticlesPerCategory: 0, categoriesWithoutArticles: 0 }
        },
        recentActivity: {
          latestArticles: [],
          topBrokers: [],
          activeAuthors: []
        }
      };
    }
  }

  /**
   * Get navigation data for menus
   */
  static async getNavigationData(): Promise<{
    categories: Category[];
    topBrokers: Broker[];
    featuredArticles: Article[];
  }> {
    try {
      const [categories, topBrokers, featuredArticles] = await Promise.all([
        CategoryService.getCategoryNavigation(),
        BrokerService.getTopBrokers(5),
        ArticleService.getFeaturedArticles(3)
      ]);

      return {
        categories,
        topBrokers,
        featuredArticles
      };
    } catch (error) {
      console.error('Error fetching navigation data:', error);
      return {
        categories: [],
        topBrokers: [],
        featuredArticles: []
      };
    }
  }

  /**
   * Health check for all data services
   */
  static async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    services: {
      brokers: boolean;
      articles: boolean;
      authors: boolean;
      categories: boolean;
    };
    timestamp: Date;
  }> {
    try {
      const [brokersHealth, articlesHealth, authorsHealth, categoriesHealth] = await Promise.all([
        BrokerService.getTopBrokers(1).then(() => true).catch(() => false),
        ArticleService.getArticles(1).then(() => true).catch(() => false),
        AuthorService.getAuthors().then(() => true).catch(() => false),
        CategoryService.getCategories().then(() => true).catch(() => false)
      ]);

      const services = {
        brokers: brokersHealth,
        articles: articlesHealth,
        authors: authorsHealth,
        categories: categoriesHealth
      };

      const healthyServices = Object.values(services).filter(Boolean).length;
      const totalServices = Object.values(services).length;

      let status: 'healthy' | 'degraded' | 'unhealthy';
      if (healthyServices === totalServices) {
        status = 'healthy';
      } else if (healthyServices > totalServices / 2) {
        status = 'degraded';
      } else {
        status = 'unhealthy';
      }

      return {
        status,
        services,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error in health check:', error);
      return {
        status: 'unhealthy',
        services: {
          brokers: false,
          articles: false,
          authors: false,
          categories: false
        },
        timestamp: new Date()
      };
    }
  }
}

// Export individual services for direct access when needed
export { BrokerService, ArticleService, CategoryService, AuthorService };

// Export helper functions
export {
  formatBrokerForDisplay,
  calculateTrustScoreBreakdown
} from './brokerService';

export {
  formatArticleForDisplay,
  calculateReadingTime,
  formatArticleDate
} from './articleService';

export {
  formatCategoryForDisplay,
  getCategoryUrl,
  getCategoryMetaTags
} from './categoryService';

export {
  formatAuthorForDisplay,
  getAuthorUrl,
  getAuthorMetaTags,
  formatAuthorExpertise
} from './authorService';
import { supabase } from '../supabase';
import type { Broker } from '../supabase';

// Service for handling broker-related data operations
export class BrokerService {
  
  /**
   * Get top brokers with optional filtering
   */
  static async getTopBrokers(limit: number = 4): Promise<Broker[]> {
    try {
      const { data, error } = await supabase
        .from('brokers')
        .select('*')
        .order('overall_rating', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching top brokers:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getTopBrokers:', error);
      return [];
    }
  }

  /**
   * Get featured brokers for homepage
   */
  static async getFeaturedBrokers(): Promise<Broker[]> {
    try {
      const { data, error } = await supabase
        .from('brokers')
        .select('*')
        .eq('is_featured', true)
        .order('overall_rating', { ascending: false })
        .limit(6);

      if (error) {
        console.error('Error fetching featured brokers:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getFeaturedBrokers:', error);
      return [];
    }
  }

  /**
   * Get broker recommendations based on criteria
   */
  static async getRecommendations(criteria: {
    strategy?: string;
    minDeposit?: number;
    platforms?: string[];
    instruments?: string[];
    country?: string;
  }): Promise<Broker[]> {
    try {
      let query = supabase
        .from('brokers')
        .select('*');

      // Apply filters based on criteria
      if (criteria.minDeposit) {
        query = query.lte('minimum_deposit', criteria.minDeposit);
      }

      if (criteria.platforms && criteria.platforms.length > 0) {
        query = query.overlaps('trading_platforms', criteria.platforms);
      }

      if (criteria.instruments && criteria.instruments.length > 0) {
        query = query.overlaps('instruments', criteria.instruments);
      }

      // Order by overall rating and trust score
      query = query.order('overall_rating', { ascending: false })
                  .limit(10);

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching recommendations:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getRecommendations:', error);
      return [];
    }
  }

  /**
   * Search brokers by name or description
   */
  static async searchBrokers(searchTerm: string, limit: number = 10): Promise<Broker[]> {
    try {
      const { data, error } = await supabase
        .from('brokers')
        .select('*')
        .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
        .order('overall_rating', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error searching brokers:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in searchBrokers:', error);
      return [];
    }
  }

  /**
   * Get broker by slug
   */
  static async getBrokerBySlug(slug: string): Promise<Broker | null> {
    try {
      const { data, error } = await supabase
        .from('brokers')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        console.error('Error fetching broker by slug:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getBrokerBySlug:', error);
      return null;
    }
  }

  /**
   * Get brokers for comparison
   */
  static async getBrokersForComparison(brokerIds: string[]): Promise<Broker[]> {
    try {
      const { data, error } = await supabase
        .from('brokers')
        .select('*')
        .in('id', brokerIds);

      if (error) {
        console.error('Error fetching brokers for comparison:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getBrokersForComparison:', error);
      return [];
    }
  }

  /**
   * Get brokers by country/region
   */
  static async getBrokersByCountry(country: string, limit: number = 20): Promise<Broker[]> {
    try {
      const { data, error } = await supabase
        .from('brokers')
        .select('*')
        .contains('supported_countries', [country])
        .order('overall_rating', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching brokers by country:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getBrokersByCountry:', error);
      return [];
    }
  }

  /**
   * Get broker statistics
   */
  static async getBrokerStats(): Promise<{
    totalBrokers: number;
    averageTrustScore: number;
    topRatedBroker: string;
  }> {
    try {
      // Get total count
      const { count } = await supabase
        .from('brokers')
        .select('*', { count: 'exact', head: true });

      // Get average trust score
      const { data: avgData } = await supabase
        .from('brokers')
        .select('trust_score');

      const averageTrustScore = avgData && avgData.length > 0 
        ? avgData.reduce((sum, broker) => sum + (broker.trust_score || 0), 0) / avgData.length
        : 0;

      // Get top rated broker
      const { data: topBroker } = await supabase
        .from('brokers')
        .select('name')
        .order('overall_rating', { ascending: false })
        .limit(1)
        .single();

      return {
        totalBrokers: count || 0,
        averageTrustScore: Math.round(averageTrustScore),
        topRatedBroker: topBroker?.name || 'N/A'
      };
    } catch (error) {
      console.error('Error in getBrokerStats:', error);
      return {
        totalBrokers: 0,
        averageTrustScore: 0,
        topRatedBroker: 'N/A'
      };
    }
  }
}

// Helper function to format broker data for frontend components
export function formatBrokerForDisplay(broker: Broker) {
  return {
    id: broker.id,
    name: broker.name,
    slug: broker.slug,
    logo: broker.logo_url || '/images/broker-placeholder.png',
    rating: broker.overall_rating || 0,
    trustScore: broker.trust_score || 0,
    minDeposit: broker.minimum_deposit || 0,
    platforms: broker.trading_platforms || [],
    instruments: broker.instruments || [],
    pros: broker.pros || [],
    cons: broker.cons || [],
    specialties: broker.specialties || [],
    featured: broker.is_featured || false,
    description: broker.description || '',
    regulatedBy: broker.regulated_by || [],
    supportedCountries: broker.supported_countries || [],
    spreads: broker.typical_spreads || {},
    commissions: broker.commission_structure || {},
    leverage: broker.max_leverage || 1
  };
}

// Helper function to calculate trust score breakdown
export function calculateTrustScoreBreakdown(broker: Broker) {
  const regulation = broker.regulation_score || 0;
  const financial = broker.financial_stability_score || 0;
  const support = broker.customer_support_score || 0;
  const execution = broker.execution_score || 0;
  const transparency = broker.transparency_score || 0;

  return {
    regulation: { score: regulation, weight: 30 },
    financial_stability: { score: financial, weight: 25 },
    customer_support: { score: support, weight: 20 },
    execution: { score: execution, weight: 15 },
    transparency: { score: transparency, weight: 10 }
  };
}
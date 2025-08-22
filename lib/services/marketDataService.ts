import { supabase } from '../supabase';

// API Configuration
const API_KEYS = {
  ALPHA_VANTAGE: process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY || 'demo',
  FINNHUB: process.env.NEXT_PUBLIC_FINNHUB_API_KEY || '',
  FOREX_RATE_API: process.env.NEXT_PUBLIC_FOREX_RATE_API_KEY || '',
  CURRENCY_LAYER: process.env.NEXT_PUBLIC_CURRENCY_LAYER_API_KEY || ''
};

const API_ENDPOINTS = {
  ALPHA_VANTAGE: 'https://www.alphavantage.co/query',
  FINNHUB: 'https://finnhub.io/api/v1',
  FOREX_RATE_API: 'https://api.forexrateapi.com/v1',
  CURRENCY_LAYER: 'http://api.currencylayer.com/v1'
};

// Types
export interface CurrencyPair {
  id: string;
  symbol: string;
  base_currency: string;
  quote_currency: string;
  current_price: number;
  bid_price: number;
  ask_price: number;
  spread: number;
  change_24h: number;
  change_percent_24h: number;
  volume_24h: number;
  last_updated: string;
  source: string;
}

export interface EconomicEvent {
  id: string;
  title: string;
  country: string;
  currency: string;
  date: string;
  time: string;
  impact: 'low' | 'medium' | 'high';
  forecast: string;
  previous: string;
  actual?: string;
  category: string;
  source: string;
}

export interface MarketSignal {
  id: string;
  symbol: string;
  signal_type: 'buy' | 'sell' | 'hold';
  strength: number;
  confidence: number;
  timeframe: string;
  source: string;
  description: string;
  created_at: string;
}

export interface CommodityPrice {
  id: string;
  symbol: string;
  name: string;
  category: string;
  current_price: number;
  change_24h: number;
  change_percent_24h: number;
  currency: string;
  exchange: string;
  last_updated: string;
}

// Market Data Service Class
export class MarketDataService {
  private static instance: MarketDataService;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 60000; // 1 minute

  public static getInstance(): MarketDataService {
    if (!MarketDataService.instance) {
      MarketDataService.instance = new MarketDataService();
    }
    return MarketDataService.instance;
  }

  private async fetchWithCache<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    const cached = this.cache.get(key);
    const now = Date.now();

    if (cached && (now - cached.timestamp) < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      const data = await fetcher();
      this.cache.set(key, { data, timestamp: now });
      return data;
    } catch (error) {
      console.error(`Error fetching ${key}:`, error);
      // Return cached data if available, even if expired
      if (cached) {
        return cached.data;
      }
      throw error;
    }
  }

  // Currency Data Methods
  async getCurrencyPairs(filters?: {
    base_currency?: string;
    quote_currency?: string;
    limit?: number;
  }): Promise<CurrencyPair[]> {
    return this.fetchWithCache('currency_pairs', async () => {
      // Try multiple sources for currency data
      const sources = [
        () => this.fetchFromAlphaVantage(),
        () => this.fetchFromForexRateAPI(),
        () => this.fetchFromSupabase('currency_pairs', filters)
      ];

      for (const source of sources) {
        try {
          const data = await source();
          if (data && data.length > 0) {
            return data;
          }
        } catch (error) {
          console.warn('Currency source failed, trying next:', error);
        }
      }

      // Fallback to mock data if all sources fail
      return this.getMockCurrencyData();
    });
  }

  private async fetchFromAlphaVantage(): Promise<CurrencyPair[]> {
    const majorPairs = ['EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 'USDCAD', 'NZDUSD'];
    const pairs: CurrencyPair[] = [];

    for (const pair of majorPairs) {
      try {
        const response = await fetch(
          `${API_ENDPOINTS.ALPHA_VANTAGE}?function=FX_INTRADAY&from_symbol=${pair.slice(0, 3)}&to_symbol=${pair.slice(3)}&interval=1min&apikey=${API_KEYS.ALPHA_VANTAGE}`
        );
        const data = await response.json();

        if (data['Time Series FX (1min)']) {
          const latestTime = Object.keys(data['Time Series FX (1min)'])[0];
          const latestData = data['Time Series FX (1min)'][latestTime];

          pairs.push({
            id: pair.toLowerCase(),
            symbol: pair,
            base_currency: pair.slice(0, 3),
            quote_currency: pair.slice(3),
            current_price: parseFloat(latestData['4. close']),
            bid_price: parseFloat(latestData['4. close']) - 0.0001,
            ask_price: parseFloat(latestData['4. close']) + 0.0001,
            spread: 0.0002,
            change_24h: parseFloat(latestData['4. close']) - parseFloat(latestData['1. open']),
            change_percent_24h: ((parseFloat(latestData['4. close']) - parseFloat(latestData['1. open'])) / parseFloat(latestData['1. open'])) * 100,
            volume_24h: parseFloat(latestData['5. volume']),
            last_updated: new Date().toISOString(),
            source: 'Alpha Vantage'
          });
        }
      } catch (error) {
        console.warn(`Failed to fetch ${pair} from Alpha Vantage:`, error);
      }
    }

    return pairs;
  }

  private async fetchFromForexRateAPI(): Promise<CurrencyPair[]> {
    try {
      const response = await fetch(
        `${API_ENDPOINTS.FOREX_RATE_API}/latest?api_key=${API_KEYS.FOREX_RATE_API}&base=USD&currencies=EUR,GBP,JPY,CHF,AUD,CAD,NZD`
      );
      const data = await response.json();

      if (data.rates) {
        const pairs: CurrencyPair[] = [];
        Object.entries(data.rates).forEach(([currency, rate]: [string, any]) => {
          pairs.push({
            id: `usd${currency.toLowerCase()}`,
            symbol: `USD${currency}`,
            base_currency: 'USD',
            quote_currency: currency,
            current_price: rate,
            bid_price: rate - 0.0001,
            ask_price: rate + 0.0001,
            spread: 0.0002,
            change_24h: 0,
            change_percent_24h: 0,
            volume_24h: 0,
            last_updated: new Date().toISOString(),
            source: 'ForexRateAPI'
          });
        });
        return pairs;
      }
    } catch (error) {
      console.warn('Failed to fetch from ForexRateAPI:', error);
    }
    return [];
  }

  // Economic Calendar Methods
  async getEconomicEvents(filters?: {
    country?: string;
    currency?: string;
    impact?: string;
    date_from?: string;
    date_to?: string;
    limit?: number;
  }): Promise<EconomicEvent[]> {
    return this.fetchWithCache('economic_events', async () => {
      // Try multiple sources for economic data
      const sources = [
        () => this.fetchEconomicFromFinnhub(),
        () => this.fetchFromSupabase('economic_events', filters)
      ];

      for (const source of sources) {
        try {
          const data = await source();
          if (data && data.length > 0) {
            return data;
          }
        } catch (error) {
          console.warn('Economic events source failed, trying next:', error);
        }
      }

      // Fallback to mock data
      return this.getMockEconomicData();
    });
  }

  private async fetchEconomicFromFinnhub(): Promise<EconomicEvent[]> {
    if (!API_KEYS.FINNHUB) {
      return [];
    }

    try {
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      const response = await fetch(
        `${API_ENDPOINTS.FINNHUB}/calendar/economic?from=${today.toISOString().split('T')[0]}&to=${nextWeek.toISOString().split('T')[0]}&token=${API_KEYS.FINNHUB}`
      );
      const data = await response.json();

      if (data.economicCalendar) {
        return data.economicCalendar.map((event: any, index: number) => ({
          id: `finnhub_${index}`,
          title: event.event,
          country: event.country,
          currency: this.getCountryCurrency(event.country),
          date: event.time.split(' ')[0],
          time: event.time.split(' ')[1] || '00:00',
          impact: this.mapImpactLevel(event.impact),
          forecast: event.estimate || '',
          previous: event.prev || '',
          actual: event.actual || '',
          category: 'Economic Indicator',
          source: 'Finnhub'
        }));
      }
    } catch (error) {
      console.warn('Failed to fetch economic events from Finnhub:', error);
    }
    return [];
  }

  // Market Signals Methods
  async getMarketSignals(filters?: {
    symbol?: string;
    signal_type?: string;
    timeframe?: string;
    limit?: number;
  }): Promise<MarketSignal[]> {
    return this.fetchWithCache('market_signals', async () => {
      try {
        return await this.fetchFromSupabase('market_signals', filters);
      } catch (error) {
        console.warn('Failed to fetch market signals:', error);
        return this.getMockSignalData();
      }
    });
  }

  // Commodity Prices Methods
  async getCommodityPrices(filters?: {
    category?: string;
    symbol?: string;
    limit?: number;
  }): Promise<CommodityPrice[]> {
    return this.fetchWithCache('commodity_prices', async () => {
      try {
        return await this.fetchFromSupabase('commodities', filters);
      } catch (error) {
        console.warn('Failed to fetch commodity prices:', error);
        return this.getMockCommodityData();
      }
    });
  }

  // Supabase Integration
  private async fetchFromSupabase(table: string, filters?: any): Promise<any[]> {
    let query = supabase.from(table).select('*');

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value && key !== 'limit') {
          query = query.eq(key, value);
        }
      });

      if (filters.limit) {
        query = query.limit(filters.limit);
      }
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  // Utility Methods
  private getCountryCurrency(country: string): string {
    const currencyMap: { [key: string]: string } = {
      'US': 'USD', 'United States': 'USD',
      'EU': 'EUR', 'Germany': 'EUR', 'France': 'EUR',
      'UK': 'GBP', 'United Kingdom': 'GBP',
      'Japan': 'JPY', 'JP': 'JPY',
      'Australia': 'AUD', 'AU': 'AUD',
      'Canada': 'CAD', 'CA': 'CAD',
      'Switzerland': 'CHF', 'CH': 'CHF'
    };
    return currencyMap[country] || 'USD';
  }

  private mapImpactLevel(impact: string): 'low' | 'medium' | 'high' {
    if (!impact) return 'medium';
    const level = impact.toLowerCase();
    if (level.includes('high') || level.includes('3')) return 'high';
    if (level.includes('low') || level.includes('1')) return 'low';
    return 'medium';
  }

  // Mock Data Fallbacks
  private getMockCurrencyData(): CurrencyPair[] {
    return [
      {
        id: 'eurusd',
        symbol: 'EURUSD',
        base_currency: 'EUR',
        quote_currency: 'USD',
        current_price: 1.0850,
        bid_price: 1.0849,
        ask_price: 1.0851,
        spread: 0.0002,
        change_24h: 0.0025,
        change_percent_24h: 0.23,
        volume_24h: 1500000,
        last_updated: new Date().toISOString(),
        source: 'Mock Data'
      },
      {
        id: 'gbpusd',
        symbol: 'GBPUSD',
        base_currency: 'GBP',
        quote_currency: 'USD',
        current_price: 1.2650,
        bid_price: 1.2649,
        ask_price: 1.2651,
        spread: 0.0002,
        change_24h: -0.0015,
        change_percent_24h: -0.12,
        volume_24h: 1200000,
        last_updated: new Date().toISOString(),
        source: 'Mock Data'
      }
    ];
  }

  private getMockEconomicData(): EconomicEvent[] {
    const today = new Date();
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    
    return [
      {
        id: 'mock_1',
        title: 'Non-Farm Payrolls',
        country: 'US',
        currency: 'USD',
        date: tomorrow.toISOString().split('T')[0],
        time: '13:30',
        impact: 'high',
        forecast: '200K',
        previous: '195K',
        category: 'Employment',
        source: 'Mock Data'
      },
      {
        id: 'mock_2',
        title: 'ECB Interest Rate Decision',
        country: 'EU',
        currency: 'EUR',
        date: tomorrow.toISOString().split('T')[0],
        time: '12:45',
        impact: 'high',
        forecast: '4.50%',
        previous: '4.50%',
        category: 'Central Bank',
        source: 'Mock Data'
      }
    ];
  }

  private getMockSignalData(): MarketSignal[] {
    return [
      {
        id: 'signal_1',
        symbol: 'EURUSD',
        signal_type: 'buy',
        strength: 75,
        confidence: 80,
        timeframe: '4H',
        source: 'Technical Analysis',
        description: 'Bullish breakout above resistance level',
        created_at: new Date().toISOString()
      }
    ];
  }

  private getMockCommodityData(): CommodityPrice[] {
    return [
      {
        id: 'gold',
        symbol: 'XAUUSD',
        name: 'Gold',
        category: 'Precious Metals',
        current_price: 2050.50,
        change_24h: 15.25,
        change_percent_24h: 0.75,
        currency: 'USD',
        exchange: 'COMEX',
        last_updated: new Date().toISOString()
      }
    ];
  }

  // WebSocket Connection for Real-time Updates
  async initializeWebSocket(): Promise<void> {
    // Implementation for WebSocket connections to real-time data providers
    // This would connect to TradingView, Alpha Vantage WebSocket, or other real-time sources
    console.log('WebSocket initialization for real-time market data');
  }
}

// Export singleton instance
export const marketDataService = MarketDataService.getInstance();
import { BrokerPlatform, TradingStrategy, TrustScoreRange, EvidenceType, AlertType } from '../lib/enums';

// Mock data for API responses
export const mockQuery = {
  topBrokers: [
    {
      broker_slug: "tradepro-elite" as const,
      name: "TradePro Elite" as const,
      trust_score: 91,
      rating: 4.8,
      min_deposit: 100,
      platforms: [BrokerPlatform.MT4, BrokerPlatform.MT5],
      sample_spread: "EUR/USD 0.15 pips" as const,
      logo_url: "https://i.pravatar.cc/64?img=1" as const
    },
    {
      broker_slug: "globalfx" as const,
      name: "GlobalFX Markets" as const,
      trust_score: 88,
      rating: 4.6,
      min_deposit: 250,
      platforms: [BrokerPlatform.CTRADER, BrokerPlatform.MT4],
      sample_spread: "GBP/USD 1.2 pips" as const,
      logo_url: "https://i.pravatar.cc/64?img=2" as const
    },
    {
      broker_slug: "alphatrade" as const,
      name: "AlphaTrade Pro" as const,
      trust_score: 85,
      rating: 4.4,
      min_deposit: 500,
      platforms: [BrokerPlatform.MT5, BrokerPlatform.PROPRIETARY],
      sample_spread: "USD/JPY 0.8 pips" as const,
      logo_url: "https://i.pravatar.cc/64?img=3" as const
    },
    {
      broker_slug: "oceanfx" as const,
      name: "OceanFX Global" as const,
      trust_score: 82,
      rating: 4.2,
      min_deposit: 200,
      platforms: [BrokerPlatform.MT4, BrokerPlatform.WEBTRADER],
      sample_spread: "AUD/USD 1.5 pips" as const,
      logo_url: "https://i.pravatar.cc/64?img=4" as const
    }
  ],
  recommenderResults: [
    {
      broker_slug: "tradepro-elite" as const,
      name: "TradePro Elite" as const,
      trust_score: 91,
      one_liner: "Ultra-low spreads and lightning-fast execution perfect for high-frequency scalping strategies." as const,
      metrics: {
        min_deposit: 100,
        platforms: [BrokerPlatform.MT4, BrokerPlatform.MT5],
        sample_spread: "EUR/USD 0.15 pips" as const
      },
      evidence: [
        {
          chunk_id: "te-001" as const,
          url: "https://example.com/review1" as const,
          excerpt: "Consistently delivers sub-millisecond execution times with spreads as low as 0.1 pips during peak trading hours." as const,
          date: "2024-12-10" as const
        }
      ]
    },
    {
      broker_slug: "globalfx" as const,
      name: "GlobalFX Markets" as const,
      trust_score: 88,
      one_liner: "Competitive spreads with institutional-grade execution and comprehensive regulatory coverage." as const,
      metrics: {
        min_deposit: 250,
        platforms: [BrokerPlatform.CTRADER, BrokerPlatform.MT4],
        sample_spread: "GBP/USD 1.2 pips" as const
      },
      evidence: [
        {
          chunk_id: "gfx-001" as const,
          url: "https://example.com/review2" as const,
          excerpt: "Offers competitive spreads starting from 0.2 pips with no requotes and instant execution." as const,
          date: "2024-12-08" as const
        }
      ]
    },
    {
      broker_slug: "alphatrade" as const,
      name: "AlphaTrade Pro" as const,
      trust_score: 85,
      one_liner: "Advanced trading tools and algorithmic capabilities for professional traders." as const,
      metrics: {
        min_deposit: 500,
        platforms: [BrokerPlatform.MT5, BrokerPlatform.PROPRIETARY],
        sample_spread: "USD/JPY 0.8 pips" as const
      },
      evidence: [
        {
          chunk_id: "at-001" as const,
          url: "https://example.com/review3" as const,
          excerpt: "Provides advanced charting tools and API access for algorithmic trading strategies." as const,
          date: "2024-12-05" as const
        }
      ]
    }
  ],
  programmaticPages: [
    {
      slug: "best-brokers-scalping-philippines" as const,
      title: "Best Brokers for Scalping in Philippines" as const,
      short_answer: "TradePro Elite and GlobalFX offer the lowest spreads and fastest execution for Filipino scalpers." as const,
      bullet_reasons: [
        "Sub-0.2 pip spreads on major pairs" as const,
        "Regulated by BSP with local support" as const,
        "No minimum holding time restrictions" as const
      ]
    },
    {
      slug: "forex-brokers-mt5-singapore" as const,
      title: "Best MT5 Forex Brokers in Singapore" as const,
      short_answer: "AlphaTrade Pro leads with advanced MT5 features and MAS regulation for Singapore traders." as const,
      bullet_reasons: [
        "Full MT5 suite with algorithmic trading" as const,
        "MAS regulated with SGD accounts" as const,
        "24/7 local customer support" as const
      ]
    },
    {
      slug: "low-deposit-brokers-beginners" as const,
      title: "Low Deposit Brokers for Beginners" as const,
      short_answer: "Start trading with as little as $10 at beginner-friendly regulated brokers." as const,
      bullet_reasons: [
        "Minimum deposits from $10-$100" as const,
        "Free educational resources included" as const,
        "Demo accounts with real market data" as const
      ]
    }
  ],
  blogInsights: [
    {
      id: "market-outlook-2025" as const,
      title: "Forex Market Outlook 2025: Key Trends to Watch" as const,
      excerpt: "Central bank policies and geopolitical shifts will drive major currency movements in the coming year." as const,
      author: "Sarah Chen" as const,
      date: new Date('2024-12-14'),
      image_url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop" as const,
      category: "Market Analysis" as const
    },
    {
      id: "broker-regulation-update" as const,
      title: "New ESMA Regulations Impact European Brokers" as const,
      excerpt: "Latest regulatory changes affect leverage limits and client protection measures across EU brokers." as const,
      author: "Michael Rodriguez" as const,
      date: new Date('2024-12-12'),
      image_url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop" as const,
      category: "Regulation" as const
    },
    {
      id: "ai-trading-guide" as const,
      title: "AI-Powered Trading: A Beginner's Guide" as const,
      excerpt: "How artificial intelligence is revolutionizing retail trading and what it means for individual traders." as const,
      author: "Dr. Emma Watson" as const,
      date: new Date('2024-12-10'),
      image_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop" as const,
      category: "Technology" as const
    }
  ],
  dashboardAlerts: [
    {
      id: "reg-change-001" as const,
      type: AlertType.REGULATORY_CHANGE,
      title: "Regulatory change: Broker X — Malta license suspended" as const,
      timestamp: new Date('2024-12-14T10:30:00Z'),
      severity: "high" as const
    },
    {
      id: "spread-spike-001" as const,
      type: AlertType.SPREAD_SPIKE,
      title: "Spread spike: Broker Y — EURUSD 2.7pips" as const,
      timestamp: new Date('2024-12-14T14:15:00Z'),
      severity: "medium" as const
    },
    {
      id: "platform-issue-001" as const,
      type: AlertType.PLATFORM_ISSUE,
      title: "Platform maintenance: MT4 servers offline 2-4 AM UTC" as const,
      timestamp: new Date('2024-12-13T20:00:00Z'),
      severity: "low" as const
    }
  ],
  trustScoreBreakdown: {
    regulation: { score: 95, weight: 30 },
    financial_stability: { score: 88, weight: 25 },
    user_feedback: { score: 92, weight: 20 },
    transparency: { score: 85, weight: 15 },
    platform_reliability: { score: 90, weight: 10 }
  }
};

// Mock data for root component props
export const mockRootProps = {
  queryParams: {
    strategy: TradingStrategy.SCALPING,
    country: "PH" as const,
    min_deposit: 100,
    preferred_platform: BrokerPlatform.MT4
  },
  userPreferences: {
    theme: "dark" as const,
    language: "en" as const,
    notifications_enabled: true
  }
};
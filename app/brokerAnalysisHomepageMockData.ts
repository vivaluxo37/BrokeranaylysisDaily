// Mock data for task-oriented broker analysis homepage

// Trading strategy options
export enum TradingStrategy {
  SCALPING = "scalping",
  DAY = "day", 
  SWING = "swing",
  POSITION = "position",
  ALGORITHMIC = "algorithmic",
  OPTIONS = "options",
  CRYPTO = "crypto"
}

// Capital range options
export enum CapitalRange {
  UNDER_500 = "under_500",
  RANGE_500_5K = "500_5k",
  RANGE_5K_50K = "5k_50k", 
  OVER_50K = "over_50k"
}

// Trading instruments
export enum Instrument {
  FOREX = "forex",
  CRYPTO = "crypto",
  STOCKS = "stocks", 
  CFDS = "cfds",
  OPTIONS = "options",
  FUTURES = "futures"
}

// Latency requirements
export enum LatencyNeed {
  LOW = "low",
  NORMAL = "normal",
  NOT_CRITICAL = "not_critical"
}

// Trust Score components
export enum TrustScoreComponent {
  REGULATION = "regulation",
  WITHDRAWAL = "withdrawal",
  SUPPORT = "support",
  SENTIMENT = "sentiment", 
  EXECUTION = "execution"
}

// Format trading strategy display text
export const formatTradingStrategy = (strategy: TradingStrategy): string => {
  const strategyMap = {
    [TradingStrategy.SCALPING]: "Scalping",
    [TradingStrategy.DAY]: "Day Trading", 
    [TradingStrategy.SWING]: "Swing Trading",
    [TradingStrategy.POSITION]: "Position Trading",
    [TradingStrategy.ALGORITHMIC]: "Algorithmic",
    [TradingStrategy.OPTIONS]: "Options",
    [TradingStrategy.CRYPTO]: "Crypto"
  };
  return strategyMap[strategy];
};

// Format capital range display text
export const formatCapitalRange = (range: CapitalRange): string => {
  const rangeMap = {
    [CapitalRange.UNDER_500]: "<$500",
    [CapitalRange.RANGE_500_5K]: "$500–5k",
    [CapitalRange.RANGE_5K_50K]: "$5k–50k",
    [CapitalRange.OVER_50K]: ">$50k"
  };
  return rangeMap[range];
};

// Format instrument display text
export const formatInstrument = (instrument: Instrument): string => {
  const instrumentMap = {
    [Instrument.FOREX]: "Forex",
    [Instrument.CRYPTO]: "Crypto", 
    [Instrument.STOCKS]: "Stocks",
    [Instrument.CFDS]: "CFDs",
    [Instrument.OPTIONS]: "Options",
    [Instrument.FUTURES]: "Futures"
  };
  return instrumentMap[instrument];
};

// Format latency need display text
export const formatLatencyNeed = (latency: LatencyNeed): string => {
  const latencyMap = {
    [LatencyNeed.LOW]: "Low latency",
    [LatencyNeed.NORMAL]: "Normal",
    [LatencyNeed.NOT_CRITICAL]: "Not critical"
  };
  return latencyMap[latency];
};

// Format trust score component display text
export const formatTrustScoreComponent = (component: TrustScoreComponent): string => {
  const componentMap = {
    [TrustScoreComponent.REGULATION]: "Regulation",
    [TrustScoreComponent.WITHDRAWAL]: "Withdrawal history",
    [TrustScoreComponent.SUPPORT]: "Support",
    [TrustScoreComponent.SENTIMENT]: "Sentiment",
    [TrustScoreComponent.EXECUTION]: "Execution"
  };
  return componentMap[component];
};

// Format date for evidence snippets
export const formatEvidenceDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

// Data for global state store
export const mockStore = {
  user: {
    isAuthenticated: false,
    preferences: {
      defaultStrategy: TradingStrategy.DAY as const,
      defaultCapitalRange: CapitalRange.RANGE_5K_50K as const,
      watchlist: ["tradepro-elite", "cryptoedge"] as const
    }
  },
  chat: {
    isOpen: false,
    contextBroker: null as string | null
  }
};

// Data returned by API queries
export const mockQuery = {
  recommendResults: [
    {
      broker_slug: "tradepro-elite" as const,
      name: "TradePro Elite" as const,
      trust_score: 91,
      one_liner: "ECN spreads from 0.1 pips on EUR/USD, supports scalping and low-latency execution." as const,
      metrics: { 
        min_deposit: 100, 
        platforms: ["MT4","MT5"] as const, 
        sample_spread: "EUR/USD 0.15 pips" as const 
      },
      evidence: [
        { 
          chunk_id: "doc_123" as const, 
          url: "https://brokeranalysis.com/reviews/tradepro" as const, 
          excerpt: "TradePro offers ECN accounts with an average EURUSD spread of 0.15..." as const, 
          date: "2024-11-01" as const 
        },
        { 
          chunk_id: "doc_512" as const, 
          url: "https://brokeranalysis.com/forum/txn" as const, 
          excerpt: "Multiple users report fast withdrawals in 2024 Q3..." as const, 
          date: "2024-10-14" as const 
        }
      ]
    },
    {
      broker_slug: "cryptoedge-pro" as const,
      name: "CryptoEdge Pro" as const,
      trust_score: 88,
      one_liner: "Specialized crypto broker with 0.1% trading fees and DeFi integration." as const,
      metrics: { 
        min_deposit: 50, 
        platforms: ["Web","Mobile"] as const, 
        sample_spread: "BTC/USD 0.1%" as const 
      },
      evidence: [
        { 
          chunk_id: "doc_234" as const, 
          url: "https://brokeranalysis.com/reviews/cryptoedge" as const, 
          excerpt: "CryptoEdge maintains competitive 0.1% fees across all major pairs..." as const, 
          date: "2024-10-28" as const 
        }
      ]
    },
    {
      broker_slug: "globaltrade-fx" as const,
      name: "GlobalTrade FX" as const,
      trust_score: 85,
      one_liner: "Regulated broker with comprehensive market access and research tools." as const,
      metrics: { 
        min_deposit: 250, 
        platforms: ["MT4","TradingView"] as const, 
        sample_spread: "EUR/USD 0.8 pips" as const 
      },
      evidence: [
        { 
          chunk_id: "doc_345" as const, 
          url: "https://brokeranalysis.com/reviews/globaltrade" as const, 
          excerpt: "GlobalTrade provides access to 50+ markets with strong regulatory oversight..." as const, 
          date: "2024-10-20" as const 
        }
      ]
    }
  ],
  trustScoreBreakdown: {
    [TrustScoreComponent.REGULATION]: { score: 95, weight: 30 },
    [TrustScoreComponent.WITHDRAWAL]: { score: 88, weight: 25 },
    [TrustScoreComponent.SUPPORT]: { score: 92, weight: 20 },
    [TrustScoreComponent.SENTIMENT]: { score: 85, weight: 15 },
    [TrustScoreComponent.EXECUTION]: { score: 90, weight: 10 }
  },
  sampleAlerts: [
    {
      id: "alert_1" as const,
      type: "regulation" as const,
      broker: "TradePro Elite" as const,
      message: "Regulation status updated - ESMA compliance confirmed" as const,
      date: "2024-12-15" as const,
      severity: "info" as const
    },
    {
      id: "alert_2" as const,
      type: "spread" as const,
      broker: "CryptoEdge Pro" as const,
      message: "Spread spike detected on BTC/USD - 0.15% vs avg 0.1%" as const,
      date: "2024-12-14" as const,
      severity: "warning" as const
    }
  ]
};

// Data passed as props to the root component
export const mockRootProps = {
  initialRecommenderState: {
    strategy: null as TradingStrategy | null,
    capitalRange: null as CapitalRange | null,
    instruments: [] as Instrument[],
    latencyNeed: null as LatencyNeed | null,
    country: "US" as const
  },
  chatContext: {
    prefilledBroker: null as string | null,
    isFloating: true
  }
};

// Community reviews mock data
export const mockCommunityReviews = [
  {
    id: "review_1",
    broker: "TradePro Elite",
    reviewer: "TraderMike2024",
    isVerified: true,
    rating: 5,
    excerpt: "Excellent execution speed and customer support. Withdrawals processed within 24 hours.",
    date: "2024-12-10",
    category: "withdrawals"
  },
  {
    id: "review_2", 
    broker: "CryptoEdge Pro",
    reviewer: "CryptoQueen",
    isVerified: true,
    rating: 4,
    excerpt: "Great for crypto trading but limited traditional assets. Support team is responsive.",
    date: "2024-12-08",
    category: "support"
  }
];

// Evidence search results mock data
export const mockEvidenceResults = [
  {
    id: "evidence_1",
    title: "TradePro Elite Review - Comprehensive Analysis",
    excerpt: "Our in-depth review reveals TradePro Elite's competitive spreads starting from 0.1 pips...",
    source: "BrokerAnalysis Review",
    url: "https://brokeranalysis.com/reviews/tradepro-elite",
    date: "2024-11-15",
    type: "review"
  },
  {
    id: "evidence_2",
    title: "Crypto Trading Fees Comparison 2024",
    excerpt: "CryptoEdge Pro maintains some of the lowest fees in the industry at 0.1%...",
    source: "Market Analysis Report",
    url: "https://brokeranalysis.com/reports/crypto-fees-2024",
    date: "2024-11-01",
    type: "report"
  }
];
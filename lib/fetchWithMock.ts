import { BrokerPlatform, TradingStrategy, AlertType } from './enums';

// Mock fetch utility for development
export const fetchWithMock = async (url: string, options?: RequestInit): Promise<Response> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));

  // Mock API responses
  const mockResponses: Record<string, any> = {
    '/api/top-brokers': {
      brokers: [
        {
          broker_slug: "tradepro-elite",
          name: "TradePro Elite",
          trust_score: 91,
          rating: 4.8,
          min_deposit: 100,
          platforms: [BrokerPlatform.MT4, BrokerPlatform.MT5],
          sample_spread: "EUR/USD 0.15 pips",
          logo_url: "/images/placeholders/broker-placeholder.svg"
        },
        {
          broker_slug: "globalfx",
          name: "GlobalFX Markets",
          trust_score: 88,
          rating: 4.6,
          min_deposit: 250,
          platforms: [BrokerPlatform.CTRADER, BrokerPlatform.MT4],
          sample_spread: "GBP/USD 1.2 pips",
          logo_url: "/images/placeholders/broker-placeholder.svg"
        },
        {
          broker_slug: "alphatrade",
          name: "AlphaTrade Pro",
          trust_score: 85,
          rating: 4.4,
          min_deposit: 500,
          platforms: [BrokerPlatform.MT5, BrokerPlatform.PROPRIETARY],
          sample_spread: "USD/JPY 0.8 pips",
          logo_url: "/images/placeholders/broker-placeholder.svg"
        },
        {
          broker_slug: "oceanfx",
          name: "OceanFX Global",
          trust_score: 82,
          rating: 4.2,
          min_deposit: 200,
          platforms: [BrokerPlatform.MT4, BrokerPlatform.WEBTRADER],
          sample_spread: "AUD/USD 1.5 pips",
          logo_url: "/images/placeholders/broker-placeholder.svg"
        }
      ]
    },

    '/api/program-pages': [
      {
        slug: "best-brokers-scalping-philippines",
        title: "Best Brokers for Scalping in Philippines",
        short_answer: "TradePro Elite and GlobalFX offer the lowest spreads and fastest execution for Filipino scalpers.",
        bullet_reasons: [
          "Sub-0.2 pip spreads on major pairs",
          "Regulated by BSP with local support",
          "No minimum holding time restrictions"
        ]
      },
      {
        slug: "forex-brokers-mt5-singapore",
        title: "Best MT5 Forex Brokers in Singapore",
        short_answer: "AlphaTrade Pro leads with advanced MT5 features and MAS regulation for Singapore traders.",
        bullet_reasons: [
          "Full MT5 suite with algorithmic trading",
          "MAS regulated with SGD accounts",
          "24/7 local customer support"
        ]
      },
      {
        slug: "low-deposit-brokers-beginners",
        title: "Low Deposit Brokers for Beginners",
        short_answer: "Start trading with as little as $10 at beginner-friendly regulated brokers.",
        bullet_reasons: [
          "Minimum deposits from $10-$100",
          "Free educational resources included",
          "Demo accounts with real market data"
        ]
      }
    ],

    '/api/latest-articles': [
      {
        id: "market-outlook-2025",
        title: "Forex Market Outlook 2025: Key Trends to Watch",
        excerpt: "Central bank policies and geopolitical shifts will drive major currency movements in the coming year.",
        author: "Sarah Chen",
        date: "2024-12-14",
        image_url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop",
        category: "Market Analysis"
      },
      {
        id: "broker-regulation-update",
        title: "New ESMA Regulations Impact European Brokers",
        excerpt: "Latest regulatory changes affect leverage limits and client protection measures across EU brokers.",
        author: "Michael Rodriguez",
        date: "2024-12-12",
        image_url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop",
        category: "Regulation"
      },
      {
        id: "ai-trading-guide",
        title: "AI-Powered Trading: A Beginner's Guide",
        excerpt: "How artificial intelligence is revolutionizing retail trading and what it means for individual traders.",
        author: "Dr. Emma Watson",
        date: "2024-12-10",
        image_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop",
        category: "Technology"
      }
    ],

    '/api/dashboard-alerts': [
      {
        id: "reg-change-001",
        type: AlertType.REGULATORY_CHANGE,
        title: "Regulatory change: Broker X — Malta license suspended",
        timestamp: "2024-12-14T10:30:00Z",
        severity: "high"
      },
      {
        id: "spread-spike-001",
        type: AlertType.SPREAD_SPIKE,
        title: "Spread spike: Broker Y — EURUSD 2.7pips",
        timestamp: "2024-12-14T14:15:00Z",
        severity: "medium"
      },
      {
        id: "platform-issue-001",
        type: AlertType.PLATFORM_ISSUE,
        title: "Platform maintenance: MT4 servers offline 2-4 AM UTC",
        timestamp: "2024-12-13T20:00:00Z",
        severity: "low"
      }
    ],

    '/api/ask': {
      answer_html: "Based on your scalping strategy, I recommend <strong>TradePro Elite</strong> and <strong>GlobalFX Markets</strong> for their ultra-low spreads and lightning-fast execution.",
      sources: [
        {
          title: "TradePro Elite Review",
          excerpt: "Consistently delivers sub-millisecond execution times with spreads as low as 0.1 pips during peak trading hours.",
          url: "https://example.com/review1",
          date: "2024-12-10"
        },
        {
          title: "GlobalFX Analysis",
          excerpt: "Offers competitive spreads starting from 0.2 pips with no requotes and instant execution.",
          url: "https://example.com/review2",
          date: "2024-12-08"
        }
      ]
    },

    '/api/subscribe': {
      success: true,
      message: "Successfully subscribed to newsletter"
    }
  };

  const mockResponse = mockResponses[url];
  
  if (mockResponse) {
    return new Response(JSON.stringify(mockResponse), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Default 404 response
  return new Response(JSON.stringify({ error: 'Not found' }), {
    status: 404,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// Utility hook for mock queries
export const useMockQuery = <T>(url: string) => {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetchWithMock(url)
      .then(response => response.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [url]);

  return { data, loading, error };
};

import React from 'react';
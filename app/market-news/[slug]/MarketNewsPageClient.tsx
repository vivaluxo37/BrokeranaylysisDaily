'use client';

import React from 'react';
import Link from 'next/link';

interface MarketNewsPageClientProps {
  slug: string;
}

const MarketNewsPageClient: React.FC<MarketNewsPageClientProps> = ({ slug }) => {
  const newsTitle = slug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  // Mock content based on the news type
  const newsContent = {
    'forex': {
      title: 'Forex News',
      description: 'Latest foreign exchange market news, currency updates, and central bank announcements affecting forex traders worldwide.',
      sections: [
        {
          title: 'Major Currency Pairs',
          content: 'Stay updated on EUR/USD, GBP/USD, USD/JPY, and other major pairs with real-time analysis and trend predictions.'
        },
        {
          title: 'Central Bank Policies',
          content: 'Follow Federal Reserve, ECB, Bank of Japan, and other central bank decisions that impact currency valuations.'
        },
        {
          title: 'Economic Indicators',
          content: 'Monitor key economic data releases like GDP, inflation rates, employment figures, and retail sales that drive forex markets.'
        }
      ]
    },
    'crypto': {
      title: 'Cryptocurrency News',
      description: 'Breaking cryptocurrency news, Bitcoin and altcoin updates, blockchain developments, and regulatory changes in the crypto space.',
      sections: [
        {
          title: 'Bitcoin and Ethereum',
          content: 'Latest price movements, network upgrades, and institutional adoption news for major cryptocurrencies.'
        },
        {
          title: 'Altcoin Updates',
          content: 'News and analysis for alternative cryptocurrencies, DeFi projects, and emerging blockchain technologies.'
        },
        {
          title: 'Regulatory Developments',
          content: 'Government regulations, SEC decisions, and global policy changes affecting cryptocurrency markets and adoption.'
        }
      ]
    },
    'stocks': {
      title: 'Stock Market News',
      description: 'Daily stock market updates, earnings reports, company news, and analysis for equity traders and investors.',
      sections: [
        {
          title: 'Major Indices',
          content: 'S&P 500, NASDAQ, Dow Jones, and other global stock index movements and analysis.'
        },
        {
          title: 'Earnings Season',
          content: 'Quarterly earnings reports, guidance updates, and analyst expectations for publicly traded companies.'
        },
        {
          title: 'Mergers and Acquisitions',
          content: 'Corporate M&A activity, takeover bids, and strategic partnerships affecting stock valuations.'
        }
      ]
    },
    'commodities': {
      title: 'Commodities News',
      description: 'Latest commodities market news including oil, gold, silver, and agricultural products price movements and analysis.',
      sections: [
        {
          title: 'Energy Markets',
          content: 'Crude oil, natural gas, and renewable energy market updates, OPEC decisions, and inventory reports.'
        },
        {
          title: 'Precious Metals',
          content: 'Gold, silver, platinum, and palladium price movements, safe-haven demand, and industrial usage trends.'
        },
        {
          title: 'Agricultural Products',
          content: 'Grain, livestock, and soft commodity updates, weather impacts, and supply chain developments.'
        }
      ]
    }
  };

  const content = newsContent[slug as keyof typeof newsContent] || {
    title: newsTitle,
    description: `Latest ${newsTitle.toLowerCase()} updates and market analysis for traders and investors.`,
    sections: [
      {
        title: 'Market Overview',
        content: `Stay informed about the latest developments and trends in the ${newsTitle.toLowerCase()} market.`
      },
      {
        title: 'Key Developments',
        content: 'Important news events, regulatory changes, and market-moving announcements affecting this sector.'
      },
      {
        title: 'Trading Implications',
        content: 'How current news and events impact trading strategies, risk management, and investment decisions.'
      }
    ]
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/market-news" className="hover:text-blue-600">Market News</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">{content.title}</span>
      </nav>

      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {content.title}
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {content.description}
        </p>
      </div>

      {/* Content Sections */}
      <div className="max-w-4xl mx-auto">
        {content.sections.map((section, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {section.title}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {section.content}
            </p>
          </div>
        ))}
      </div>

      {/* Recent News Examples */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Recent Market Updates
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Breaking News</h3>
            <p className="text-sm text-blue-600">
              Federal Reserve maintains interest rates, signaling cautious approach to inflation control.
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">Market Analysis</h3>
            <p className="text-sm text-green-600">
              Technical indicators suggest potential breakout in major currency pairs following recent consolidation.
            </p>
          </div>
        </div>
      </div>

      {/* News Sources */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Trusted News Sources
        </h2>
        <p className="text-gray-600 mb-4">
          Stay informed with these reliable financial news providers:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">Financial Times</h3>
            <p className="text-sm text-gray-600">Global financial news and market analysis</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">Bloomberg</h3>
            <p className="text-sm text-gray-600">Real-time market data and breaking news</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">Reuters</h3>
            <p className="text-sm text-gray-600">Comprehensive financial news coverage</p>
          </div>
        </div>
      </div>

      {/* Related Content */}
      <div className="bg-blue-50 rounded-lg p-6 mt-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Continue Your Market Education
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/education/analysis"
            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-blue-600 mb-2">Market Analysis</h3>
            <p className="text-sm text-gray-600">Learn technical and fundamental analysis techniques</p>
          </Link>
          <Link
            href="/education/strategies"
            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-blue-600 mb-2">Trading Strategies</h3>
            <p className="text-sm text-gray-600">Discover effective trading approaches</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MarketNewsPageClient;
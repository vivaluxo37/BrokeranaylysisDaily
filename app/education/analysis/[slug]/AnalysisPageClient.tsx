'use client';

import React from 'react';
import Link from 'next/link';

interface AnalysisPageClientProps {
  slug: string;
}

const AnalysisPageClient: React.FC<AnalysisPageClientProps> = ({ slug }) => {
  const analysisTitle = slug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  // Mock content based on the analysis type
  const analysisContent = {
    'technical-analysis': {
      title: 'Technical Analysis',
      description: 'Learn how to analyze price charts and use technical indicators to predict future market movements.',
      sections: [
        {
          title: 'What is Technical Analysis?',
          content: 'Technical analysis involves studying historical price data and trading volumes to identify patterns and trends that can help predict future price movements.'
        },
        {
          title: 'Key Technical Indicators',
          content: 'Popular indicators include moving averages, RSI, MACD, Bollinger Bands, and Fibonacci retracements. Each provides different insights into market conditions.'
        },
        {
          title: 'Chart Patterns',
          content: 'Recognize common patterns like head and shoulders, triangles, flags, and double tops/bottoms that signal potential price reversals or continuations.'
        }
      ]
    },
    'fundamental-analysis': {
      title: 'Fundamental Analysis',
      description: 'Understand how economic factors, company financials, and market conditions influence asset prices.',
      sections: [
        {
          title: 'Fundamental Analysis Basics',
          content: 'Fundamental analysis evaluates securities by analyzing economic, financial, and other qualitative and quantitative factors to determine their intrinsic value.'
        },
        {
          title: 'Economic Indicators',
          content: 'Key indicators include GDP, inflation rates, interest rates, employment data, and central bank policies that affect currency and market valuations.'
        },
        {
          title: 'Company Financials',
          content: 'Analyze balance sheets, income statements, cash flow statements, and key ratios like P/E, P/B, and ROE for stock valuation.'
        }
      ]
    },
    'sentiment-analysis': {
      title: 'Sentiment Analysis',
      description: 'Measure market mood and investor sentiment to gauge potential price directions and market extremes.',
      sections: [
        {
          title: 'Understanding Market Sentiment',
          content: 'Sentiment analysis assesses the overall attitude of investors toward a particular security or financial market, often indicating potential reversals.'
        },
        {
          title: 'Sentiment Indicators',
          content: 'Tools like the Fear & Greed Index, put/call ratios, volatility indexes (VIX), and social media sentiment tracking help measure market mood.'
        },
        {
          title: 'Contrarian Trading',
          content: 'Learn how to use extreme sentiment readings to identify potential market turning points and profit from crowd psychology.'
        }
      ]
    },
    'risk-analysis': {
      title: 'Risk Analysis',
      description: 'Identify, assess, and manage various types of trading risks to protect your capital and improve returns.',
      sections: [
        {
          title: 'Types of Trading Risks',
          content: 'Market risk, liquidity risk, leverage risk, operational risk, and counterparty risk are key considerations for every trader.'
        },
        {
          title: 'Risk Management Techniques',
          content: 'Use position sizing, stop-loss orders, diversification, and risk-reward ratios to manage exposure and protect your trading account.'
        },
        {
          title: 'Risk Assessment Tools',
          content: 'Value at Risk (VaR), stress testing, and scenario analysis help quantify and prepare for potential losses in different market conditions.'
        }
      ]
    }
  };

  const content = analysisContent[slug as keyof typeof analysisContent] || {
    title: analysisTitle,
    description: `Comprehensive guide to ${analysisTitle.toLowerCase()} for traders and investors.`,
    sections: [
      {
        title: 'Analysis Overview',
        content: `Understand the fundamentals of ${analysisTitle.toLowerCase()} and how to apply it in your trading strategy.`
      },
      {
        title: 'Key Concepts',
        content: 'Learn the essential principles and methodologies used in this type of market analysis.'
      },
      {
        title: 'Practical Application',
        content: 'Discover how to implement this analysis technique in real-world trading scenarios.'
      }
    ]
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/education" className="hover:text-blue-600">Education</Link>
        <span className="mx-2">/</span>
        <Link href="/education/analysis" className="hover:text-blue-600">Analysis</Link>
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

      {/* Analysis Tools */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Essential Tools for {content.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Software Platforms</h3>
            <p className="text-sm text-blue-600">
              MetaTrader, TradingView, Thinkorswim, and Bloomberg Terminal offer advanced analysis tools.
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">Data Sources</h3>
            <p className="text-sm text-green-600">
              Economic calendars, earnings reports, central bank announcements, and real-time news feeds.
            </p>
          </div>
        </div>
      </div>

      {/* Recommended Resources */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Recommended Learning Resources
        </h2>
        <p className="text-gray-600 mb-4">
          Enhance your {content.title.toLowerCase()} skills with these valuable resources:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">Books</h3>
            <p className="text-sm text-gray-600">Technical Analysis of Financial Markets by John Murphy</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">Courses</h3>
            <p className="text-sm text-gray-600">Online courses on Coursera, Udemy, and specialized trading platforms</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">Websites</h3>
            <p className="text-sm text-gray-600">Investopedia, BabyPips, and professional trading blogs</p>
          </div>
        </div>
      </div>

      {/* Related Content */}
      <div className="bg-blue-50 rounded-lg p-6 mt-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Continue Your Education
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/education/strategies"
            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-blue-600 mb-2">Trading Strategies</h3>
            <p className="text-sm text-gray-600">Learn various trading approaches and methodologies</p>
          </Link>
          <Link
            href="/education/beginner-guides"
            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-blue-600 mb-2">Beginner Guides</h3>
            <p className="text-sm text-gray-600">Start with the basics of trading and investment</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPageClient;
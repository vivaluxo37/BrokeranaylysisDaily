'use client';

import React from 'react';
import Link from 'next/link';

interface StrategyPageClientProps {
  slug: string;
}

const StrategyPageClient: React.FC<StrategyPageClientProps> = ({ slug }) => {
  const strategyTitle = slug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  // Mock content based on the strategy type
  const strategyContent = {
    'day-trading': {
      title: 'Day Trading',
      description: 'Learn day trading strategies for quick profits within the same trading day. Perfect for active traders.',
      sections: [
        {
          title: 'What is Day Trading?',
          content: 'Day trading involves buying and selling financial instruments within the same trading day. Positions are closed before market close to avoid overnight risk.'
        },
        {
          title: 'Key Day Trading Strategies',
          content: 'Popular strategies include scalping, momentum trading, and range trading. Each requires different skills and risk management.'
        },
        {
          title: 'Risk Management for Day Traders',
          content: 'Use tight stop-losses, position sizing, and risk-reward ratios of at least 1:2 to protect your capital.'
        }
      ]
    },
    'swing-trading': {
      title: 'Swing Trading',
      description: 'Swing trading strategies for capturing multi-day price movements. Ideal for traders who can\'t monitor markets constantly.',
      sections: [
        {
          title: 'Understanding Swing Trading',
          content: 'Swing trading aims to capture gains in a stock or currency pair over a period of several days to several weeks.'
        },
        {
          title: 'Swing Trading Techniques',
          content: 'Common techniques include trend following, counter-trend trading, and breakout trading using technical analysis.'
        },
        {
          title: 'Swing Trading Timeframes',
          content: 'Typically uses 4-hour and daily charts for analysis, with trades lasting from 2 days to several weeks.'
        }
      ]
    },
    'scalping': {
      title: 'Scalping',
      description: 'High-frequency scalping strategies for capturing small price movements throughout the day.',
      sections: [
        {
          title: 'Scalping Basics',
          content: 'Scalping involves making numerous trades throughout the day to capture small price movements, often just a few pips.'
        },
        {
          title: 'Scalping Tools and Indicators',
          content: 'Use tick charts, Level 2 data, and fast-moving indicators like stochastic oscillators and moving averages.'
        },
        {
          title: 'Scalping Risk Management',
          content: 'Requires strict discipline with tiny stop-losses and high win rates to be profitable.'
        }
      ]
    },
    'position-trading': {
      title: 'Position Trading',
      description: 'Long-term position trading strategies based on fundamental analysis and major trends.',
      sections: [
        {
          title: 'Position Trading Overview',
          content: 'Position trading involves holding trades for weeks, months, or even years based on long-term fundamental trends.'
        },
        {
          title: 'Fundamental Analysis for Position Trading',
          content: 'Focus on economic indicators, interest rates, geopolitical events, and long-term market trends.'
        },
        {
          title: 'Position Trading Risk Management',
          content: 'Use wider stop-losses and smaller position sizes to account for larger price swings over longer periods.'
        }
      ]
    }
  };

  const content = strategyContent[slug as keyof typeof strategyContent] || {
    title: strategyTitle,
    description: `Comprehensive guide to ${strategyTitle.toLowerCase()} trading strategies.`,
    sections: [
      {
        title: 'Strategy Overview',
        content: `Learn the fundamentals of ${strategyTitle.toLowerCase()} and how to implement it successfully.`
      },
      {
        title: 'Key Techniques',
        content: 'Discover the most effective techniques and indicators for this trading style.'
      },
      {
        title: 'Risk Management',
        content: 'Essential risk management principles to protect your capital while using this strategy.'
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
        <Link href="/education/strategies" className="hover:text-blue-600">Strategies</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">{content.title}</span>
      </nav>

      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {content.title} Strategies
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

      {/* Strategy Examples */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Practical Examples
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Example Setup</h3>
            <p className="text-sm text-blue-600">
              Look for confluence of support/resistance with RSI divergence and moving average crossovers.
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">Entry Signals</h3>
            <p className="text-sm text-green-600">
              Enter on breakout confirmation with volume increase and candlestick patterns.
            </p>
          </div>
        </div>
      </div>

      {/* Recommended Brokers */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Recommended Brokers for {content.title}
        </h2>
        <p className="text-gray-600 mb-4">
          These brokers offer excellent conditions for {content.title.toLowerCase()} strategies:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/brokers/ic-markets"
            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-gray-900 mb-2">IC Markets</h3>
            <p className="text-sm text-gray-600">Low spreads, fast execution</p>
          </Link>
          <Link
            href="/brokers/fxpro"
            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-gray-900 mb-2">FxPro</h3>
            <p className="text-sm text-gray-600">Multiple platforms, good liquidity</p>
          </Link>
          <Link
            href="/brokers/pepperstone"
            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-gray-900 mb-2">Pepperstone</h3>
            <p className="text-sm text-gray-600">Tight spreads, Razor account</p>
          </Link>
        </div>
      </div>

      {/* Additional Resources */}
      <div className="bg-blue-50 rounded-lg p-6 mt-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Continue Learning
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/education/analysis"
            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-blue-600 mb-2">Market Analysis</h3>
            <p className="text-sm text-gray-600">Learn technical and fundamental analysis methods</p>
          </Link>
          <Link
            href="/education/beginner-guides"
            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-blue-600 mb-2">Beginner Guides</h3>
            <p className="text-sm text-gray-600">Start with the basics of trading</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StrategyPageClient;
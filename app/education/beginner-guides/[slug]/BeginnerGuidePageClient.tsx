'use client';

import React from 'react';
import Link from 'next/link';

interface BeginnerGuidePageClientProps {
  slug: string;
}

const BeginnerGuidePageClient: React.FC<BeginnerGuidePageClientProps> = ({ slug }) => {
  const guideTitle = slug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  // Mock content based on the guide type
  const guideContent = {
    'forex-basics': {
      title: 'Forex Basics',
      description: 'Learn the fundamentals of foreign exchange trading, including currency pairs, pips, and market hours.',
      sections: [
        {
          title: 'What is Forex Trading?',
          content: 'Forex trading involves buying and selling currencies on the foreign exchange market. It\'s the largest financial market in the world with daily trading volumes exceeding $6 trillion.'
        },
        {
          title: 'Major Currency Pairs',
          content: 'The most traded pairs include EUR/USD, USD/JPY, GBP/USD, and USD/CHF. These pairs offer high liquidity and tight spreads.'
        },
        {
          title: 'Understanding Pips',
          content: 'A pip is the smallest price move that a currency pair can make. For most pairs, it\'s 0.0001, except for JPY pairs where it\'s 0.01.'
        }
      ]
    },
    'crypto-basics': {
      title: 'Crypto Basics',
      description: 'Understand cryptocurrency trading, blockchain technology, and how to get started with digital assets.',
      sections: [
        {
          title: 'Introduction to Cryptocurrencies',
          content: 'Cryptocurrencies are digital or virtual currencies that use cryptography for security and operate on decentralized networks.'
        },
        {
          title: 'Popular Cryptocurrencies',
          content: 'Bitcoin (BTC), Ethereum (ETH), and other altcoins offer various investment opportunities with different risk profiles.'
        },
        {
          title: 'Crypto Trading Strategies',
          content: 'Learn about HODLing, day trading, and swing trading strategies for cryptocurrency markets.'
        }
      ]
    },
    'stock-basics': {
      title: 'Stock Basics',
      description: 'Get started with stock market investing, understanding shares, dividends, and market indices.',
      sections: [
        {
          title: 'What are Stocks?',
          content: 'Stocks represent ownership in a company. When you buy shares, you become a partial owner of that business.'
        },
        {
          title: 'Types of Stocks',
          content: 'Common stocks, preferred stocks, and different market caps (large, mid, small) offer various risk-return profiles.'
        },
        {
          title: 'Stock Market Indices',
          content: 'Indices like S&P 500, NASDAQ, and Dow Jones track the performance of groups of stocks.'
        }
      ]
    },
    'risk-management': {
      title: 'Risk Management',
      description: 'Essential risk management techniques to protect your capital and improve trading performance.',
      sections: [
        {
          title: 'Position Sizing',
          content: 'Determine how much to risk per trade based on your account size and risk tolerance.'
        },
        {
          title: 'Stop-Loss Orders',
          content: 'Use stop-loss orders to limit potential losses and protect your trading capital.'
        },
        {
          title: 'Risk-Reward Ratios',
          content: 'Maintain favorable risk-reward ratios to ensure profitable trading over the long term.'
        }
      ]
    }
  };

  const content = guideContent[slug as keyof typeof guideContent] || {
    title: guideTitle,
    description: `Comprehensive guide to ${guideTitle.toLowerCase()} for beginner traders.`,
    sections: [
      {
        title: 'Introduction',
        content: `Welcome to our beginner's guide on ${guideTitle.toLowerCase()}. This guide will help you understand the basics and get started.`
      },
      {
        title: 'Key Concepts',
        content: 'Learn the fundamental concepts and terminology that every beginner should know.'
      },
      {
        title: 'Getting Started',
        content: 'Practical steps to begin your trading journey with confidence.'
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
        <Link href="/education/beginner-guides" className="hover:text-blue-600">Beginner Guides</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">{content.title}</span>
      </nav>

      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {content.title} Guide for Beginners
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

      {/* Additional Resources */}
      <div className="bg-blue-50 rounded-lg p-6 mt-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Additional Learning Resources
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/education/strategies"
            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-blue-600 mb-2">Trading Strategies</h3>
            <p className="text-sm text-gray-600">Explore advanced trading strategies and techniques</p>
          </Link>
          <Link
            href="/education/analysis"
            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-blue-600 mb-2">Market Analysis</h3>
            <p className="text-sm text-gray-600">Learn technical and fundamental analysis methods</p>
          </Link>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Ready to Start Trading?
        </h2>
        <p className="text-gray-600 mb-6">
          Compare brokers and find the perfect platform for your trading needs.
        </p>
        <Link
          href="/brokers"
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Compare Brokers
        </Link>
      </div>
    </div>
  );
};

export default BeginnerGuidePageClient;
'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// Mock broker data for comparison - in a real app, this would come from the database
const mockBrokers = [
  {
    id: 1,
    name: 'IC Markets',
    rating: 4.8,
    minDeposit: '$200',
    spreads: '0.0 pips',
    platforms: ['MT4', 'MT5', 'cTrader'],
    regulation: 'ASIC, CySEC, FSA',
    leverage: '1:500',
    accountTypes: ['Standard', 'Raw Spread', 'cTrader'],
    commission: '$3.50 per lot',
    instruments: ['Forex', 'Indices', 'Commodities', 'Cryptos'],
  },
  {
    id: 2,
    name: 'Pepperstone',
    rating: 4.7,
    minDeposit: '$200',
    spreads: '0.0 pips',
    platforms: ['MT4', 'MT5', 'cTrader'],
    regulation: 'ASIC, FCA, CySEC',
    leverage: '1:500',
    accountTypes: ['Razor', 'Standard'],
    commission: '$3.50 per lot',
    instruments: ['Forex', 'Indices', 'Commodities', 'Cryptos'],
  },
  {
    id: 3,
    name: 'XM',
    rating: 4.6,
    minDeposit: '$5',
    spreads: '0.6 pips',
    platforms: ['MT4', 'MT5'],
    regulation: 'ASIC, CySEC, FCA',
    leverage: '1:888',
    accountTypes: ['Micro', 'Standard', 'Zero'],
    commission: 'No commission',
    instruments: ['Forex', 'Stocks', 'Indices', 'Commodities'],
  },
  {
    id: 4,
    name: 'FXPro',
    rating: 4.5,
    minDeposit: '$100',
    spreads: '0.6 pips',
    platforms: ['MT4', 'MT5', 'cTrader', 'FXPro Platform'],
    regulation: 'FCA, CySEC, FSCA',
    leverage: '1:500',
    accountTypes: ['MT4', 'MT5', 'cTrader'],
    commission: 'No commission',
    instruments: ['Forex', 'Stocks', 'Indices', 'Commodities', 'Futures'],
  },
];

const BrokerComparisonClient: React.FC = () => {
  const [selectedBrokers, setSelectedBrokers] = useState<number[]>([]);
  const [compareMode, setCompareMode] = useState<'features' | 'detailed'>('features');

  const toggleBrokerSelection = (brokerId: number) => {
    setSelectedBrokers(prev => {
      if (prev.includes(brokerId)) {
        return prev.filter(id => id !== brokerId);
      } else if (prev.length < 4) { // Limit to 4 brokers for comparison
        return [...prev, brokerId];
      }
      return prev;
    });
  };

  const selectedBrokersData = mockBrokers.filter(broker => selectedBrokers.includes(broker.id));

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/tools" className="hover:text-blue-600">Tools</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">Broker Comparison</span>
      </nav>

      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Broker Comparison Tool
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Compare spreads, commissions, platforms, and features of top forex and CFD brokers side by side
        </p>
      </div>

      {/* Broker Selection */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Select Brokers to Compare (Max 4)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockBrokers.map(broker => (
            <div
              key={broker.id}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedBrokers.includes(broker.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => toggleBrokerSelection(broker.id)}
            >
              <h3 className="font-semibold text-gray-900 mb-2">{broker.name}</h3>
              <p className="text-sm text-gray-600">Rating: {broker.rating}/5</p>
              <p className="text-sm text-gray-600">Min Deposit: {broker.minDeposit}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison Mode Toggle */}
      {selectedBrokers.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setCompareMode('features')}
              className={`px-6 py-2 rounded-lg font-medium ${
                compareMode === 'features'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Key Features
            </button>
            <button
              onClick={() => setCompareMode('detailed')}
              className={`px-6 py-2 rounded-lg font-medium ${
                compareMode === 'detailed'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Detailed Comparison
            </button>
          </div>
        </div>
      )}

      {/* Comparison Table */}
      {selectedBrokers.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 overflow-x-auto">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Broker Comparison
          </h2>
          
          {compareMode === 'features' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {selectedBrokersData.map(broker => (
                <div key={broker.id} className="border rounded-lg p-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-4">{broker.name}</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-semibold text-gray-700">Rating:</span>
                      <span className="ml-2 text-gray-600">{broker.rating}/5</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Min Deposit:</span>
                      <span className="ml-2 text-gray-600">{broker.minDeposit}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Spreads:</span>
                      <span className="ml-2 text-gray-600">{broker.spreads}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Commission:</span>
                      <span className="ml-2 text-gray-600">{broker.commission}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Leverage:</span>
                      <span className="ml-2 text-gray-600">{broker.leverage}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border p-3 text-left font-semibold text-gray-700">Feature</th>
                  {selectedBrokersData.map(broker => (
                    <th key={broker.id} className="border p-3 text-left font-semibold text-gray-700">
                      {broker.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-3 font-semibold text-gray-700">Rating</td>
                  {selectedBrokersData.map(broker => (
                    <td key={broker.id} className="border p-3 text-gray-600">
                      {broker.rating}/5
                    </td>
                  ))}
                </tr>
                <tr className="bg-gray-50">
                  <td className="border p-3 font-semibold text-gray-700">Min Deposit</td>
                  {selectedBrokersData.map(broker => (
                    <td key={broker.id} className="border p-3 text-gray-600">
                      {broker.minDeposit}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-3 font-semibold text-gray-700">Spreads</td>
                  {selectedBrokersData.map(broker => (
                    <td key={broker.id} className="border p-3 text-gray-600">
                      {broker.spreads}
                    </td>
                  ))}
                </tr>
                <tr className="bg-gray-50">
                  <td className="border p-3 font-semibold text-gray-700">Commission</td>
                  {selectedBrokersData.map(broker => (
                    <td key={broker.id} className="border p-3 text-gray-600">
                      {broker.commission}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-3 font-semibold text-gray-700">Leverage</td>
                  {selectedBrokersData.map(broker => (
                    <td key={broker.id} className="border p-3 text-gray-600">
                      {broker.leverage}
                    </td>
                  ))}
                </tr>
                <tr className="bg-gray-50">
                  <td className="border p-3 font-semibold text-gray-700">Platforms</td>
                  {selectedBrokersData.map(broker => (
                    <td key={broker.id} className="border p-3 text-gray-600">
                      {broker.platforms.join(', ')}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-3 font-semibold text-gray-700">Regulation</td>
                  {selectedBrokersData.map(broker => (
                    <td key={broker.id} className="border p-3 text-gray-600">
                      {broker.regulation}
                    </td>
                  ))}
                </tr>
                <tr className="bg-gray-50">
                  <td className="border p-3 font-semibold text-gray-700">Account Types</td>
                  {selectedBrokersData.map(broker => (
                    <td key={broker.id} className="border p-3 text-gray-600">
                      {broker.accountTypes.join(', ')}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-3 font-semibold text-gray-700">Instruments</td>
                  {selectedBrokersData.map(broker => (
                    <td key={broker.id} className="border p-3 text-gray-600">
                      {broker.instruments.join(', ')}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Call to Action */}
      <div className="bg-blue-50 rounded-lg p-6 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Need More Detailed Information?
        </h2>
        <p className="text-gray-600 mb-6">
          Visit our individual broker reviews for in-depth analysis and user experiences.
        </p>
        <Link
          href="/brokers"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Browse All Brokers
        </Link>
      </div>

      {/* Related Tools */}
      <div className="bg-gray-50 rounded-lg p-6 mt-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Explore More Trading Tools
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/tools/risk-calculator"
            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-blue-600 mb-2">Risk Calculator</h3>
            <p className="text-sm text-gray-600">Calculate position sizes and risk management</p>
          </Link>
          <Link
            href="/tools/pip-calculator"
            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-blue-600 mb-2">Pip Calculator</h3>
            <p className="text-sm text-gray-600">Calculate pip values and profit/loss</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BrokerComparisonClient;
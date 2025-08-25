'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const PipCalculatorClient: React.FC = () => {
  const [accountCurrency, setAccountCurrency] = useState<string>('USD');
  const [instrument, setInstrument] = useState<string>('EUR/USD');
  const [tradeSize, setTradeSize] = useState<string>('1');
  const [entryPrice, setEntryPrice] = useState<string>('1.1000');
  const [exitPrice, setExitPrice] = useState<string>('1.1020');
  const [pipValue, setPipValue] = useState<string>('10');

  const calculatePipResults = () => {
    const size = parseFloat(tradeSize) || 0;
    const entry = parseFloat(entryPrice) || 0;
    const exit = parseFloat(exitPrice) || 0;
    const pips = Math.abs(exit - entry) * 10000; // For 4 decimal places
    const profitLoss = (exit - entry) * size * 100000; // Standard lot size
    const pipValuePerLot = parseFloat(pipValue) || 0;
    const totalPipValue = pips * pipValuePerLot * size;

    return {
      pips: pips.toFixed(1),
      profitLoss: profitLoss.toFixed(2),
      totalPipValue: totalPipValue.toFixed(2),
    };
  };

  const results = calculatePipResults();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/tools" className="hover:text-blue-600">Tools</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">Pip Calculator</span>
      </nav>

      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Pip Calculator
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Calculate pip values, profit/loss, and margin requirements for forex and CFD trades
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Calculator Inputs
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Currency
              </label>
              <select
                value={accountCurrency}
                onChange={(e) => setAccountCurrency(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="JPY">JPY</option>
                <option value="AUD">AUD</option>
                <option value="CAD">CAD</option>
                <option value="CHF">CHF</option>
                <option value="NZD">NZD</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instrument
              </label>
              <select
                value={instrument}
                onChange={(e) => setInstrument(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="EUR/USD">EUR/USD</option>
                <option value="GBP/USD">GBP/USD</option>
                <option value="USD/JPY">USD/JPY</option>
                <option value="AUD/USD">AUD/USD</option>
                <option value="USD/CAD">USD/CAD</option>
                <option value="USD/CHF">USD/CHF</option>
                <option value="NZD/USD">NZD/USD</option>
                <option value="XAU/USD">Gold (XAU/USD)</option>
                <option value="XAG/USD">Silver (XAG/USD)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trade Size (Lots)
              </label>
              <input
                type="number"
                value={tradeSize}
                onChange={(e) => setTradeSize(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1"
                step="0.01"
                min="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pip Value ($ per lot)
              </label>
              <input
                type="number"
                value={pipValue}
                onChange={(e) => setPipValue(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="10"
                step="0.01"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Entry Price
                </label>
                <input
                  type="number"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1.1000"
                  step="0.0001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exit Price
                </label>
                <input
                  type="number"
                  value={exitPrice}
                  onChange={(e) => setExitPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1.1020"
                  step="0.0001"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Calculation Results
          </h2>

          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Pip Movement</h3>
              <p className="text-2xl font-bold text-blue-600">{results.pips} pips</p>
              <p className="text-sm text-blue-700">
                Total pips moved between entry and exit
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Profit/Loss</h3>
              <p className="text-2xl font-bold text-green-600">${results.profitLoss}</p>
              <p className="text-sm text-green-700">
                Total profit or loss in account currency
              </p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">Pip Value Total</h3>
              <p className="text-2xl font-bold text-purple-600">${results.totalPipValue}</p>
              <p className="text-sm text-purple-700">
                Total value based on pip value and trade size
              </p>
            </div>
          </div>

          {/* Pip Value Reference */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">Pip Value Reference</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• EUR/USD: ~$10 per standard lot</li>
              <li>• GBP/USD: ~$10 per standard lot</li>
              <li>• USD/JPY: ~$9.09 per standard lot (for USD account)</li>
              <li>• Gold (XAU/USD): ~$1 per pip per ounce</li>
              <li>• Silver (XAG/USD): ~$5 per pip per 100 ounces</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Tools */}
      <div className="bg-gray-50 rounded-lg p-6 mt-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Explore More Trading Tools
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/tools/broker-comparison"
            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-blue-600 mb-2">Broker Comparison</h3>
            <p className="text-sm text-gray-600">Compare spreads, commissions, and features</p>
          </Link>
          <Link
            href="/tools/risk-calculator"
            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-blue-600 mb-2">Risk Calculator</h3>
            <p className="text-sm text-gray-600">Calculate position sizes and risk management</p>
          </Link>
        </div>
      </div>

      {/* Educational Resources */}
      <div className="bg-blue-50 rounded-lg p-6 mt-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Learn More About Pips
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/education/beginner-guides/understanding-pips"
            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-blue-600 mb-2">Understanding Pips</h3>
            <p className="text-sm text-gray-600">Learn what pips are and how they work</p>
          </Link>
          <Link
            href="/education/analysis/forex-basics"
            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-blue-600 mb-2">Forex Basics</h3>
            <p className="text-sm text-gray-600">Fundamental concepts of currency trading</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PipCalculatorClient;
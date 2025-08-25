'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const RiskCalculatorClient: React.FC = () => {
  const [accountBalance, setAccountBalance] = useState<string>('10000');
  const [riskPercentage, setRiskPercentage] = useState<string>('2');
  const [stopLossPips, setStopLossPips] = useState<string>('20');
  const [instrument, setInstrument] = useState<string>('EUR/USD');
  const [lotSize, setLotSize] = useState<string>('100000');
  const [pipValue, setPipValue] = useState<string>('10');
  const [entryPrice, setEntryPrice] = useState<string>('1.1000');
  const [stopLossPrice, setStopLossPrice] = useState<string>('1.0980');

  const calculateRisk = () => {
    const balance = parseFloat(accountBalance) || 0;
    const riskPercent = parseFloat(riskPercentage) || 0;
    const slPips = parseFloat(stopLossPips) || 0;
    const pipVal = parseFloat(pipValue) || 0;
    const entry = parseFloat(entryPrice) || 0;
    const slPrice = parseFloat(stopLossPrice) || 0;

    // Calculate risk amount in currency
    const riskAmount = (balance * riskPercent) / 100;

    // Calculate position size based on stop loss pips and pip value
    const positionSize = riskAmount / (slPips * pipVal);

    // Calculate actual stop loss from prices if provided
    const calculatedSLPips = entry && slPrice ? Math.abs(entry - slPrice) * 10000 : slPips;
    const calculatedPositionSize = riskAmount / (calculatedSLPips * pipVal);

    return {
      riskAmount: riskAmount.toFixed(2),
      positionSize: positionSize.toFixed(2),
      calculatedSLPips: calculatedSLPips.toFixed(1),
      calculatedPositionSize: calculatedPositionSize.toFixed(2),
    };
  };

  const results = calculateRisk();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/tools" className="hover:text-blue-600">Tools</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">Risk Calculator</span>
      </nav>

      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Risk Management Calculator
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Calculate optimal position sizes, stop-loss levels, and risk-reward ratios to protect your capital
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
                Account Balance ($)
              </label>
              <input
                type="number"
                value={accountBalance}
                onChange={(e) => setAccountBalance(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="10000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Risk Percentage (%)
              </label>
              <input
                type="number"
                value={riskPercentage}
                onChange={(e) => setRiskPercentage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="2"
                step="0.1"
                min="0.1"
                max="100"
              />
              <p className="text-xs text-gray-500 mt-1">
                Recommended: 1-2% of account balance per trade
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stop Loss (Pips)
              </label>
              <input
                type="number"
                value={stopLossPips}
                onChange={(e) => setStopLossPips(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="20"
                step="1"
                min="1"
              />
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
                  Stop Loss Price
                </label>
                <input
                  type="number"
                  value={stopLossPrice}
                  onChange={(e) => setStopLossPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1.0980"
                  step="0.0001"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Risk Calculation Results
          </h2>

          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Risk Amount</h3>
              <p className="text-2xl font-bold text-blue-600">${results.riskAmount}</p>
              <p className="text-sm text-blue-700">
                Maximum amount you're risking on this trade
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Position Size (Lots)</h3>
              <p className="text-2xl font-bold text-green-600">{results.positionSize}</p>
              <p className="text-sm text-green-700">
                Optimal lot size based on your risk parameters
              </p>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">Stop Loss Details</h3>
              <p className="text-lg font-bold text-yellow-600">{results.calculatedSLPips} pips</p>
              <p className="text-sm text-yellow-700">
                Actual stop loss distance based on prices
              </p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">Adjusted Position Size</h3>
              <p className="text-2xl font-bold text-purple-600">{results.calculatedPositionSize} lots</p>
              <p className="text-sm text-purple-700">
                Final position size considering price-based stop loss
              </p>
            </div>
          </div>

          {/* Risk Management Tips */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">Risk Management Tips</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Never risk more than 2% of your account on a single trade</li>
              <li>• Always use stop-loss orders to limit potential losses</li>
              <li>• Consider your risk-reward ratio before entering a trade</li>
              <li>• Adjust position sizes based on market volatility</li>
              <li>• Regularly review and update your risk management strategy</li>
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
            href="/tools/pip-calculator"
            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-blue-600 mb-2">Pip Calculator</h3>
            <p className="text-sm text-gray-600">Calculate pip values and profit/loss</p>
          </Link>
        </div>
      </div>

      {/* Educational Resources */}
      <div className="bg-blue-50 rounded-lg p-6 mt-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Learn More About Risk Management
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/education/strategies/risk-management"
            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-blue-600 mb-2">Risk Management Strategies</h3>
            <p className="text-sm text-gray-600">Advanced techniques for protecting your capital</p>
          </Link>
          <Link
            href="/education/beginner-guides/risk-management-basics"
            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-blue-600 mb-2">Risk Management Basics</h3>
            <p className="text-sm text-gray-600">Fundamental principles for new traders</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RiskCalculatorClient;
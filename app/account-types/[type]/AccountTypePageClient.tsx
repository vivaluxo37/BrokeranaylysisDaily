'use client';

import React from 'react';
import Link from 'next/link';

interface AccountTypePageClientProps {
  type: string;
}

interface Broker {
  id: number;
  name: string;
  slug: string;
  rating: number;
  min_deposit: number;
  regulation: string;
  spreads: string;
}

const AccountTypePageClient: React.FC<AccountTypePageClientProps> = ({ type }) => {
  const typeTitle = type.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  // Mock data for brokers offering this account type
  const brokers: Broker[] = [
    {
      id: 1,
      name: 'Broker A',
      slug: 'broker-a',
      rating: 4.5,
      min_deposit: 100,
      regulation: 'FCA, ASIC',
      spreads: 'From 0.0 pips'
    },
    {
      id: 2,
      name: 'Broker B',
      slug: 'broker-b',
      rating: 4.3,
      min_deposit: 200,
      regulation: 'CySEC',
      spreads: 'From 0.1 pips'
    },
    {
      id: 3,
      name: 'Broker C',
      slug: 'broker-c',
      rating: 4.7,
      min_deposit: 50,
      regulation: 'FSCA',
      spreads: 'From 0.2 pips'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/account-types" className="hover:text-blue-600">Account Types</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">{typeTitle}</span>
      </nav>

      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Best {typeTitle} Brokers 2024
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Compare the top brokers offering {typeTitle.toLowerCase()} accounts with competitive spreads, 
          flexible leverage, and excellent trading conditions.
        </p>
      </div>

      {/* Account Type Overview */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          What is a {typeTitle} Account?
        </h2>
        <div className="prose prose-lg text-gray-600">
          <p>
            {typeTitle} accounts are designed for traders who {type.includes('demo') ? 
            'want to practice trading without risking real money' : 
            type.includes('islamic') ? 'require Sharia-compliant trading conditions' :
            'seek specific trading conditions and features'}. These accounts typically offer:
          </p>
          <ul className="list-disc list-inside mt-4">
            <li>Competitive spreads and commissions</li>
            <li>Flexible leverage options</li>
            <li>Access to multiple trading instruments</li>
            <li>Advanced trading platforms</li>
            <li>Professional customer support</li>
          </ul>
        </div>
      </div>

      {/* Brokers Comparison Table */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Compare {typeTitle} Brokers
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">
                  Broker
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">
                  Rating
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">
                  Min Deposit
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">
                  Regulation
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">
                  Spreads
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {brokers.map((broker, index) => (
                <tr key={broker.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-4 text-sm font-medium text-gray-900 border-b">
                    <Link 
                      href={`/brokers/${broker.slug}`}
                      className="hover:text-blue-600"
                    >
                      {broker.name}
                    </Link>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600 border-b">
                    <div className="flex items-center">
                      <span className="text-yellow-400">★</span>
                      <span className="ml-1">{broker.rating}/5</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600 border-b">
                    ${broker.min_deposit}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600 border-b">
                    {broker.regulation}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600 border-b">
                    {broker.spreads}
                  </td>
                  <td className="px-4 py-4 text-sm border-b">
                    <Link
                      href={`/brokers/${broker.slug}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      View Broker
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Key Features of {typeTitle} Accounts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 text-xl">⚡</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Fast Execution</h3>
            <p className="text-gray-600 text-sm">
              Get instant order execution with minimal slippage
            </p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-xl">🔒</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Secure Trading</h3>
            <p className="text-gray-600 text-sm">
              Your funds are protected with segregated accounts
            </p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-purple-600 text-xl">📊</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Advanced Tools</h3>
            <p className="text-gray-600 text-sm">
              Access professional trading tools and indicators
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              What is the minimum deposit for a {typeTitle} account?
            </h3>
            <p className="text-gray-600">
              Minimum deposits vary by broker, typically ranging from $50 to $500 for {typeTitle.toLowerCase()} accounts.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Can I trade cryptocurrencies with a {typeTitle} account?
            </h3>
            <p className="text-gray-600">
              Yes, most brokers offering {typeTitle.toLowerCase()} accounts provide access to cryptocurrency trading alongside forex and other instruments.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Is Islamic account swapping allowed?
            </h3>
            <p className="text-gray-600">
              {type.includes('islamic') ? 
                'Islamic accounts are swap-free and comply with Sharia principles, with no overnight interest charges.' :
                'Account swapping policies vary by broker. Please check with individual brokers for their specific terms.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountTypePageClient;
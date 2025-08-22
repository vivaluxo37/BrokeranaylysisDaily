'use client';

import React from 'react';
import RealTimeMarketDashboard from '@/components/market/RealTimeMarketDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Activity, 
  Zap, 
  Globe, 
  Shield, 
  Clock,
  BarChart3,
  Signal,
  Calendar
} from 'lucide-react';

const features = [
  {
    icon: <Activity className="w-6 h-6" />,
    title: 'Real-Time Data',
    description: 'Live market data updates every few seconds for accurate trading decisions'
  },
  {
    icon: <Signal className="w-6 h-6" />,
    title: 'Market Signals',
    description: 'AI-powered trading signals with confidence levels and timeframes'
  },
  {
    icon: <Calendar className="w-6 h-6" />,
    title: 'Economic Calendar',
    description: 'Track important economic events and their market impact'
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: 'Commodity Prices',
    description: 'Live prices for gold, oil, and other major commodities'
  }
];

const apiEndpoints = [
  {
    method: 'GET',
    endpoint: '/api/market/currencies',
    description: 'Real-time currency pair data with bid/ask spreads',
    params: ['symbol', 'limit', 'page']
  },
  {
    method: 'GET',
    endpoint: '/api/market/events',
    description: 'Economic calendar events with impact levels',
    params: ['date', 'country', 'currency', 'impact', 'limit']
  },
  {
    method: 'GET',
    endpoint: '/api/market/signals',
    description: 'Market signals with confidence and timeframe data',
    params: ['symbol', 'type', 'source', 'timeframe', 'limit']
  },
  {
    method: 'GET',
    endpoint: '/api/market/commodities',
    description: 'Commodity prices and market indices',
    params: ['category', 'symbol', 'exchange', 'limit']
  }
];

const dataSources = [
  {
    name: 'Alpha Vantage',
    description: 'Real-time and historical market data',
    features: ['Stock prices', 'Forex rates', 'Economic indicators']
  },
  {
    name: 'Finnhub',
    description: 'Comprehensive financial market data',
    features: ['Market news', 'Company fundamentals', 'Economic calendar']
  },
  {
    name: 'ForexRateAPI',
    description: 'Currency exchange rates',
    features: ['Real-time rates', 'Historical data', 'Currency conversion']
  },
  {
    name: 'CurrencyLayer',
    description: 'Foreign exchange rates API',
    features: ['Live rates', 'Historical data', 'Currency fluctuation']
  }
];

export default function MarketDataPageClient() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
              <Activity className="w-4 h-4 text-blue-400 mr-2" />
              <span className="text-blue-400 text-sm font-medium">Live Market Data</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Real-Time Market Data
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto mb-8">
              Access live currency pairs, economic calendar, market signals, and commodity prices. 
              Powered by multiple trusted data sources for accurate trading decisions.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-3 text-blue-400">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-white text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/70 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* API Endpoints Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">API Endpoints</h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Access our market data through these RESTful API endpoints
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {apiEndpoints.map((endpoint, index) => (
              <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      {endpoint.method}
                    </Badge>
                    <code className="text-blue-400 text-sm font-mono">
                      {endpoint.endpoint}
                    </code>
                  </div>
                  <p className="text-white/70 text-sm">{endpoint.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-white text-sm font-medium">Parameters:</p>
                    <div className="flex flex-wrap gap-2">
                      {endpoint.params.map((param, paramIndex) => (
                        <Badge key={paramIndex} variant="outline" className="text-xs border-white/20 text-white/60">
                          {param}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Live Dashboard */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Live Market Dashboard</h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Real-time market data dashboard with WebSocket connections for instant updates
            </p>
          </div>

          <RealTimeMarketDashboard />
        </div>
      </section>

      {/* Data Sources */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Trusted Data Sources</h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Our market data is aggregated from multiple reliable financial data providers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dataSources.map((source, index) => (
              <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-green-400" />
                    <CardTitle className="text-white text-lg">{source.name}</CardTitle>
                  </div>
                  <p className="text-white/70 text-sm">{source.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {source.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="text-white/60 text-sm flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* WebSocket Info */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-400" />
              </div>
              <CardTitle className="text-white text-2xl mb-2">WebSocket Connection</CardTitle>
              <p className="text-white/70">
                Connect to our WebSocket server for real-time market data streaming
              </p>
            </CardHeader>
            <CardContent className="text-center">
              <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
                <code className="text-blue-400 font-mono text-sm">
                  ws://localhost:8080
                </code>
              </div>
              <div className="grid md:grid-cols-2 gap-4 text-left">
                <div>
                  <h4 className="text-white font-medium mb-2">Available Channels:</h4>
                  <ul className="space-y-1 text-white/70 text-sm">
                    <li>• currencies</li>
                    <li>• economic_events</li>
                    <li>• market_signals</li>
                    <li>• commodities</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-2">Update Frequency:</h4>
                  <ul className="space-y-1 text-white/70 text-sm">
                    <li>• Currencies: 5 seconds</li>
                    <li>• Events: 30 seconds</li>
                    <li>• Signals: 15 seconds</li>
                    <li>• Commodities: 10 seconds</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
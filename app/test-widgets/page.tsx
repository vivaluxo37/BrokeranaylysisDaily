'use client';

import React from 'react';
import { 
  TickerTapeWidget, 
  MarketOverviewWidget, 
  EconomicCalendarWidget,
  ForexHeatmapWidget,
  AdvancedChartWidget,
  TechnicalAnalysisWidget,
  ScreenerWidget
} from '@/components/widgets';

export default function TestWidgetsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-7xl px-4">
        <h1 className="text-3xl font-bold text-center mb-8">TradingView Widgets Test Page</h1>
        
        {/* Ticker Tape */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Ticker Tape Widget</h2>
          <TickerTapeWidget 
            height={46}
            theme="light"
            displayMode="adaptive"
            className="w-full border rounded-lg"
          />
        </section>

        {/* Market Overview */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Market Overview Widget</h2>
          <MarketOverviewWidget 
            height={400}
            theme="light"
            tabs={['indices', 'forex', 'crypto']}
            showHeader={true}
            className="shadow-lg"
          />
        </section>

        {/* Economic Calendar */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Economic Calendar Widget</h2>
          <EconomicCalendarWidget 
            height={500}
            theme="light"
            className="shadow-lg"
          />
        </section>

        {/* Forex Heatmap */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Forex Heatmap Widget</h2>
          <ForexHeatmapWidget 
            height={400}
            theme="light"
            className="shadow-lg"
          />
        </section>

        {/* Advanced Chart */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Advanced Chart Widget</h2>
          <AdvancedChartWidget 
            symbol="FX_IDC:EURUSD"
            height={500}
            theme="light"
            title="EUR/USD Professional Chart"
            className="shadow-lg"
          />
        </section>

        {/* Technical Analysis */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Technical Analysis Widget</h2>
          <TechnicalAnalysisWidget 
            symbol="FX_IDC:EURUSD"
            height={400}
            theme="light"
            className="shadow-lg"
          />
        </section>

        {/* Market Screener */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Market Screener Widget</h2>
          <ScreenerWidget 
            market="forex"
            screener_type="forex_mkt"
            height={500}
            theme="light"
            className="shadow-lg"
          />
        </section>

        {/* Grid Layout Test */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Grid Layout Test</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            <ForexHeatmapWidget 
              height={350}
              theme="light"
              title="Currency Strength"
              className="shadow-lg"
            />
            <TechnicalAnalysisWidget 
              symbol="FX_IDC:GBPUSD"
              height={350}
              theme="light"
              title="GBP/USD Signals"
              className="shadow-lg"
            />
          </div>
        </section>

        {/* Dark Theme Test */}
        <section className="mb-12 bg-slate-900 p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-white">Dark Theme Test</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            <AdvancedChartWidget 
              symbol="BITSTAMP:BTCUSD"
              height={400}
              theme="dark"
              title="Bitcoin Chart"
              className="bg-white/5 border-white/10"
              showHeader={true}
            />
            <EconomicCalendarWidget 
              height={400}
              theme="dark"
              className="bg-white/5 border-white/10"
            />
          </div>
        </section>

        {/* Responsive Test */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Responsive Test</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <TechnicalAnalysisWidget 
              symbol="FX_IDC:EURUSD"
              height={300}
              theme="light"
              showHeader={false}
              className="shadow-lg"
            />
            <TechnicalAnalysisWidget 
              symbol="FX_IDC:GBPUSD"
              height={300}
              theme="light"
              showHeader={false}
              className="shadow-lg"
            />
            <TechnicalAnalysisWidget 
              symbol="FX_IDC:USDJPY"
              height={300}
              theme="light"
              showHeader={false}
              className="shadow-lg"
            />
          </div>
        </section>
      </div>
    </div>
  );
}

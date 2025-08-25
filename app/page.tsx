import React from 'react';
import MegaMenuHeader from '@/components/MegaMenuHeader';
import { HeroSection } from '@/components/HeroSection';
import { AIAssistantPreview } from '@/components/AIAssistantPreview';
import { TopBrokersGridSSR } from '@/components/TopBrokersGridSSR';
import { ProgrammaticCardsSSR } from '@/components/ProgrammaticCardsSSR';
import { WhyBrokeranalysis } from '@/components/WhyBrokeranalysis';
import { CompareTeaser } from '@/components/CompareTeaser';
import { BlogInsightsSSR } from '@/components/BlogInsightsSSR';
import { DashboardTeaser } from '@/components/DashboardTeaser';
import { ChatBubble } from '@/components/ChatBubble';
import Footer from '@/components/Footer';
import { LocationPermission } from '@/components/LocationPermission';
import { DataService } from '@/lib/services/dataService';
import { TickerTapeWidget, MarketOverviewWidget } from '@/components/widgets';

export default async function Homepage() {
  // Fetch all homepage data from Supabase
  const homepageData = await DataService.getHomepageData();

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Mega Menu */}
      <MegaMenuHeader />

      {/* Live Market Ticker */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <TickerTapeWidget
          height={46}
          theme="dark"
          displayMode="adaptive"
          className="w-full"
        />
      </div>

      {/* Location Detection */}
      <LocationPermission />

      {/* Hero Section with Recommender */}
      <HeroSection />

      {/* AI Assistant Preview */}
      <AIAssistantPreview />

      {/* Top Brokers Grid - SSR with real data */}
      <TopBrokersGridSSR brokers={homepageData.topBrokers} />

      {/* Programmatic SEO Cards - SSR with real data */}
      <ProgrammaticCardsSSR />

      {/* Why Brokeranalysis Features */}
      <WhyBrokeranalysis />

      {/* Compare Teaser & Cost Calculator */}
      <CompareTeaser />

      {/* Market Overview Widget */}
      <section className="py-16 px-4 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Live Market Overview
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay updated with real-time market data across global indices, forex, commodities, and bonds.
              Essential information for making informed trading decisions.
            </p>
          </div>
          <MarketOverviewWidget
            height={450}
            theme="light"
            tabs={['indices', 'forex', 'crypto', 'futures']}
            showHeader={false}
            className="shadow-lg rounded-xl overflow-hidden"
          />
        </div>
      </section>

      {/* Blog & Market Insights - SSR with real data */}
      <BlogInsightsSSR articles={homepageData.blogInsights} />

      {/* Dashboard Preview */}
      <DashboardTeaser />

      {/* Footer */}
      <Footer />

      {/* Floating Chat Bubble */}
      <ChatBubble />
    </div>
  );
}
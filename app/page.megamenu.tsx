'use client';

import React from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';
import MegaMenuHeader from '@/components/MegaMenuHeader';
import BrokerHeroSection from '@/components/BrokerHeroSection';
import SearchEvidence from '@/components/SearchEvidence';
import DashboardPreview from '@/components/DashboardPreview';
import CommunitySection from '@/components/CommunitySection';
import EnterpriseCTA from '@/components/EnterpriseCTA';
import ChatBubble from '@/components/ChatBubble';
import BrokerFooter from '@/components/BrokerFooter';

const MegaMenuPreview: React.FC = () => {
  return (
    <ErrorBoundary>
      <div className="min-h-screen dark-theme">
        <MegaMenuHeader />
        <main>
          <BrokerHeroSection />
          <SearchEvidence />
          <DashboardPreview />
          <CommunitySection />
          <EnterpriseCTA />
        </main>
        <BrokerFooter />
        
        {/* Floating Chat Assistant */}
        <ChatBubble />
      </div>
    </ErrorBoundary>
  );
};

export default MegaMenuPreview;
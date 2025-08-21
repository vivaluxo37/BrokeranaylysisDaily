'use client';

import React from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';
import ModernHeader from '@/components/ModernHeader';
import HeroSection from '@/components/HeroSection';
import DashboardPreview from '@/components/DashboardPreview';
import PartnersSection from '@/components/PartnersSection';
import FeaturesGrid from '@/components/FeaturesGrid';
import AdminShowcase from '@/components/AdminShowcase';
import GrowthSection from '@/components/GrowthSection';
import TeamManagement from '@/components/TeamManagement';
import CTASection from '@/components/CTASection';
import PricingSection from '@/components/PricingSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import ModernFooter from '@/components/ModernFooter';

const ModernLandingPage: React.FC = () => {
  return (
    <ErrorBoundary>
      <div className="min-h-screen dark-theme">
        <ModernHeader />
        <main>
          <HeroSection />
          <DashboardPreview />
          <PartnersSection />
          <FeaturesGrid />
          <AdminShowcase />
          <GrowthSection />
          <TeamManagement />
          <CTASection />
          <PricingSection />
          <TestimonialsSection />
        </main>
        <ModernFooter />
      </div>
    </ErrorBoundary>
  );
};

export default ModernLandingPage;
'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, AlignLeft, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NavigationSection } from '@/lib/enums';
import { DataService } from '@/lib/services/DataService';
import MegaMenuDropdown from './navigation/MegaMenuDropdown';
import MobileNavigation from './navigation/MobileNavigation';
import HeaderSearch from './navigation/HeaderSearch';

interface NavigationData {
  countries: Array<{ name: string; code: string; brokerCount: number }>;
  platforms: Array<{ name: string; brokerCount: number }>;
  accountTypes: Array<{ name: string; brokerCount: number }>;
  topBrokers: Array<{ name: string; rating: number; trustScore: number }>;
  recentAnalysis: Array<{ title: string; timestamp: string; category: string }>;
  educationResources: Array<{ title: string; type: string; readTime?: string; pages?: number }>;
  propFirms: Array<{ name: string; rating: number; fundingAmount: string }>;
  popularComparisons: Array<{ broker1: string; broker2: string; views: number }>;
}

export const MegaMenuHeader: React.FC = () => {
  const [activeSection, setActiveSection] = useState<NavigationSection | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [navigationData, setNavigationData] = useState<NavigationData>({
    countries: [],
    platforms: [],
    accountTypes: [],
    topBrokers: [],
    recentAnalysis: [],
    educationResources: [],
    propFirms: [],
    popularComparisons: []
  });
  const [loading, setLoading] = useState(true);

  const navigationItems = [
    { name: 'Brokers', section: NavigationSection.BROKERS },
    { name: 'Market News', section: NavigationSection.MARKET_NEWS },
    { name: 'Prop Trading', section: NavigationSection.PROP_TRADING },
    { name: 'Education', section: NavigationSection.EDUCATION },
    { name: 'About', section: NavigationSection.ABOUT }
  ];

  // Fetch navigation data
  useEffect(() => {
    const fetchNavigationData = async () => {
      try {
        // Sample navigation data for Brokeranalysis platform
        const data: NavigationData = {
          countries: [
            { name: 'United States', code: 'US', brokerCount: 45 },
            { name: 'United Kingdom', code: 'GB', brokerCount: 38 },
            { name: 'Australia', code: 'AU', brokerCount: 22 },
            { name: 'Philippines', code: 'PH', brokerCount: 18 },
            { name: 'Canada', code: 'CA', brokerCount: 15 },
            { name: 'Germany', code: 'DE', brokerCount: 28 }
          ],
          platforms: [
            { name: 'MT4', brokerCount: 156 },
            { name: 'MT5', brokerCount: 142 },
            { name: 'Crypto Trading', brokerCount: 89 },
            { name: 'Demo Accounts', brokerCount: 203 },
            { name: 'Copy Trading', brokerCount: 67 },
            { name: 'Gold Trading', brokerCount: 178 }
          ],
          accountTypes: [
            { name: 'ECN', brokerCount: 78 },
            { name: 'Islamic/Halal', brokerCount: 45 },
            { name: 'Scalping', brokerCount: 92 },
            { name: 'High Leverage', brokerCount: 134 },
            { name: 'Low Commission', brokerCount: 87 }
          ],
          topBrokers: [
            { name: 'XM', rating: 4.8, trustScore: 92 },
            { name: 'Exness', rating: 4.7, trustScore: 89 },
            { name: 'FP Markets', rating: 4.6, trustScore: 88 },
            { name: 'eToro', rating: 4.5, trustScore: 85 }
          ],
          recentAnalysis: [
            { title: 'EUR/USD Weekly Outlook', timestamp: '2024-01-15T10:00:00Z', category: 'Technical Analysis' },
            { title: 'Gold Price Forecast', timestamp: '2024-01-15T08:30:00Z', category: 'Commodity Analysis' },
            { title: 'Bitcoin Technical Update', timestamp: '2024-01-14T16:45:00Z', category: 'Crypto Analysis' }
          ],
          educationResources: [
            { title: 'Beginner Trading Guide', type: 'Article', readTime: '15 min' },
            { title: 'Risk Management Strategies', type: 'Guide', readTime: '25 min' },
            { title: 'Market Psychology', type: 'eBook', pages: 45 }
          ],
          propFirms: [
            { name: 'FTMO', rating: 4.6, fundingAmount: '$200K' },
            { name: 'MyForexFunds', rating: 4.4, fundingAmount: '$300K' },
            { name: 'The5%ers', rating: 4.3, fundingAmount: '$100K' }
          ],
          popularComparisons: [
            { broker1: 'XM', broker2: 'Exness', views: 15420 },
            { broker1: 'eToro', broker2: 'Interactive Brokers', views: 12350 },
            { broker1: 'FP Markets', broker2: 'IC Markets', views: 9870 }
          ]
        };
        setNavigationData(data);
      } catch (error) {
        console.error('Error fetching navigation data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNavigationData();
  }, []);

  // Close mega menu when clicking outside or pressing escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveSection(null);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  const handleSectionHover = (section: NavigationSection) => {
    if (!isMobileMenuOpen) {
      // Clear any existing timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
        setTimeoutId(null);
      }
      setActiveSection(section);
    }
  };

  const handleSectionLeave = () => {
    if (!isMobileMenuOpen) {
      // Add a longer delay to keep submenu visible when hovering
      const id = setTimeout(() => setActiveSection(null), 300);
      setTimeoutId(id);
    }
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setIsSearching(query.length > 0);
  };

  const handleSearchSubmit = (query: string) => {
    console.log('Search submitted:', query);
    // Implement search functionality
  };

  const handleSignIn = () => {
    console.log('Sign in clicked');
    // Implement sign in functionality
  };

  const handleGetAIMatch = () => {
    console.log('Get AI Match clicked');
    // Implement AI match functionality
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/10">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div>
                <span className="text-xl font-bold text-white">Brokeranalysis</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-2">
              {navigationItems.map((item) => (
                <div
                  key={item.section}
                  className="relative"
                  onMouseEnter={() => handleSectionHover(item.section)}
                  onMouseLeave={handleSectionLeave}
                >
                  <button
                    className={`nav-item flex items-center space-x-1 ${
                      activeSection === item.section ? 'active' : ''
                    }`}
                  >
                    <span>{item.name}</span>
                    <ChevronDown 
                      className={`w-4 h-4 nav-dropdown-indicator ${
                        activeSection === item.section ? 'open' : ''
                      }`} 
                    />
                  </button>
                </div>
              ))}
            </nav>

            {/* Search and Auth */}
            <div className="hidden lg:flex items-center space-x-4">
              <HeaderSearch
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                onSearchSubmit={handleSearchSubmit}
                suggestions={[]}
                isSearching={isSearching}
              />
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/10"
                onClick={handleSignIn}
              >
                Sign In
              </Button>
              <Button 
                className="btn-gradient"
                onClick={handleGetAIMatch}
              >
                Get AI Match
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <AlignLeft size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mega Menu Dropdown */}
      <div
        onMouseEnter={() => {
          if (activeSection) {
            // Clear any existing timeout when hovering over dropdown
            if (timeoutId) {
              clearTimeout(timeoutId);
              setTimeoutId(null);
            }
            setActiveSection(activeSection);
          }
        }}
        onMouseLeave={handleSectionLeave}
      >
        {activeSection && (
          <MegaMenuDropdown
            section={activeSection}
            isOpen={!!activeSection}
            onClose={() => setActiveSection(null)}
            countries={navigationData.countries}
            platforms={navigationData.platforms}
            accountTypes={navigationData.accountTypes}
            topBrokers={navigationData.topBrokers}
            recentAnalysis={navigationData.recentAnalysis}
            educationResources={navigationData.educationResources}
            propFirms={navigationData.propFirms}
            popularComparisons={navigationData.popularComparisons}
          />
        )}
      </div>

      {/* Mobile Navigation */}
      <MobileNavigation
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        countries={navigationData.countries}
        platforms={navigationData.platforms}
        accountTypes={navigationData.accountTypes}
        topBrokers={navigationData.topBrokers}
        recentAnalysis={navigationData.recentAnalysis}
        educationResources={navigationData.educationResources}
        propFirms={navigationData.propFirms}
        popularComparisons={navigationData.popularComparisons}
        onSignIn={handleSignIn}
        onGetAIMatch={handleGetAIMatch}
      />
    </>
  );
};

export default MegaMenuHeader;
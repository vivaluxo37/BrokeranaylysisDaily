import React, { useState, useEffect } from 'react';
import { ChevronDown, AlignLeft, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NavigationSection } from '@/lib/enums';
import { mockQuery } from '@/lib/megaMenuMockData';
import MegaMenuDropdown from './navigation/MegaMenuDropdown';
import MobileNavigation from './navigation/MobileNavigation';
import HeaderSearch from './navigation/HeaderSearch';

export const MegaMenuHeader: React.FC = () => {
  const [activeSection, setActiveSection] = useState<NavigationSection | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const navigationItems = [
    { name: 'Brokers', section: NavigationSection.BROKERS },
    { name: 'Market News', section: NavigationSection.MARKET_NEWS },
    { name: 'Prop Trading', section: NavigationSection.PROP_TRADING },
    { name: 'Education', section: NavigationSection.EDUCATION },
    { name: 'About', section: NavigationSection.ABOUT }
  ];

  // Close mega menu when clicking outside or pressing escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveSection(null);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleSectionHover = (section: NavigationSection) => {
    if (!isMobileMenuOpen) {
      setActiveSection(section);
    }
  };

  const handleSectionLeave = () => {
    if (!isMobileMenuOpen) {
      // Add a small delay to prevent flickering when moving between nav and dropdown
      setTimeout(() => setActiveSection(null), 100);
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
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <div>
                <span className="text-xl font-bold text-white">Brokeranalysis</span>
                <div className="text-xs text-white/60">Formerly DailyForex</div>
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
        onMouseEnter={() => activeSection && setActiveSection(activeSection)}
        onMouseLeave={handleSectionLeave}
      >
        {activeSection && (
          <MegaMenuDropdown
            section={activeSection}
            isOpen={!!activeSection}
            onClose={() => setActiveSection(null)}
            countries={mockQuery.countries}
            platforms={mockQuery.platforms}
            accountTypes={mockQuery.accountTypes}
            topBrokers={mockQuery.topBrokers}
            recentAnalysis={mockQuery.recentAnalysis}
            educationResources={mockQuery.educationResources}
            propFirms={mockQuery.propFirms}
            popularComparisons={mockQuery.popularComparisons}
          />
        )}
      </div>

      {/* Mobile Navigation */}
      <MobileNavigation
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        countries={mockQuery.countries}
        platforms={mockQuery.platforms}
        accountTypes={mockQuery.accountTypes}
        topBrokers={mockQuery.topBrokers}
        recentAnalysis={mockQuery.recentAnalysis}
        educationResources={mockQuery.educationResources}
        propFirms={mockQuery.propFirms}
        popularComparisons={mockQuery.popularComparisons}
        onSignIn={handleSignIn}
        onGetAIMatch={handleGetAIMatch}
      />
    </>
  );
};

export default MegaMenuHeader;
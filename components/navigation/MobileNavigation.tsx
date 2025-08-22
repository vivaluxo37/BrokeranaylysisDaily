import React, { useState } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import * as Collapsible from '@radix-ui/react-collapsible';
import { NavigationSection } from '@/lib/enums';
import { CountryData, PlatformData, AccountTypeData, BrokerData, AnalysisData, EducationResourceData, PropFirmData, ComparisonData } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import MegaMenuLink from '@/components/ui/MegaMenuLink';
import BrokerCountBadge from '@/components/ui/BrokerCountBadge';

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  countries: CountryData[];
  platforms: PlatformData[];
  accountTypes: AccountTypeData[];
  topBrokers: BrokerData[];
  recentAnalysis: AnalysisData[];
  educationResources: EducationResourceData[];
  propFirms: PropFirmData[];
  popularComparisons: ComparisonData[];
  onSignIn: () => void;
  onGetAIMatch: () => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  isOpen,
  onClose,
  searchQuery,
  onSearchChange,
  countries,
  platforms,
  accountTypes,
  topBrokers,
  recentAnalysis,
  educationResources,
  propFirms,
  popularComparisons,
  onSignIn,
  onGetAIMatch
}) => {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());

  const toggleSection = (section: string) => {
    const newOpenSections = new Set(openSections);
    if (newOpenSections.has(section)) {
      newOpenSections.delete(section);
    } else {
      newOpenSections.add(section);
    }
    setOpenSections(newOpenSections);
  };

  if (!isOpen) return null;

  return (
    <div className="lg:hidden mobile-menu">
      <div className="container mx-auto px-6 py-4">
        {/* Mobile Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
          <Input 
            placeholder="Search brokers, topics..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
          />
        </div>

        {/* Navigation Sections */}
        <div className="space-y-2">
          {/* Brokers Section */}
          <Collapsible.Root 
            open={openSections.has('brokers')}
            onOpenChange={() => toggleSection('brokers')}
          >
            <Collapsible.Trigger className="mobile-menu-trigger">
              <span>Brokers</span>
              <ChevronDown 
                className={`w-5 h-5 transition-transform ${
                  openSections.has('brokers') ? 'rotate-180' : ''
                }`} 
              />
            </Collapsible.Trigger>
            <Collapsible.Content className="mobile-menu-content">
              <div className="space-y-4">
                {/* Countries */}
                <div>
                  <h4 className="font-medium text-white/90 mb-2">By Country</h4>
                  <div className="space-y-1">
                    {countries.slice(0, 4).map((country) => (
                      <div key={country.code} className="flex items-center justify-between">
                        <MegaMenuLink href={`/brokers/country/${country.code.toLowerCase()}`}>
                          {country.name}
                        </MegaMenuLink>
                        <BrokerCountBadge count={country.brokerCount} />
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Platforms */}
                <div>
                  <h4 className="font-medium text-white/90 mb-2">By Platform</h4>
                  <div className="space-y-1">
                    {platforms.slice(0, 3).map((platform) => (
                      <div key={platform.name} className="flex items-center justify-between">
                        <MegaMenuLink href={`/brokers/platform/${platform.name.toLowerCase()}`}>
                          {platform.name}
                        </MegaMenuLink>
                        <BrokerCountBadge count={platform.brokerCount} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Brokers */}
                <div>
                  <h4 className="font-medium text-white/90 mb-2">Top Brokers</h4>
                  <div className="space-y-1">
                    {topBrokers.slice(0, 3).map((broker) => (
                      <MegaMenuLink key={broker.name} href={`/brokers/${broker.name.toLowerCase()}`}>
                        {broker.name}
                      </MegaMenuLink>
                    ))}
                  </div>
                </div>
              </div>
            </Collapsible.Content>
          </Collapsible.Root>

          {/* Market News Section */}
          <Collapsible.Root 
            open={openSections.has('market-news')}
            onOpenChange={() => toggleSection('market-news')}
          >
            <Collapsible.Trigger className="mobile-menu-trigger">
              <span>Market News</span>
              <ChevronDown 
                className={`w-5 h-5 transition-transform ${
                  openSections.has('market-news') ? 'rotate-180' : ''
                }`} 
              />
            </Collapsible.Trigger>
            <Collapsible.Content className="mobile-menu-content">
              <div className="space-y-2">
                <MegaMenuLink href="/market-news/technical-analysis">Technical Analysis</MegaMenuLink>
                <MegaMenuLink href="/market-news/signals">Trading Signals</MegaMenuLink>
                <MegaMenuLink href="/market-news/forecasts">Weekly Forecasts</MegaMenuLink>
                <MegaMenuLink href="/market-news/economic-calendar">Economic Calendar</MegaMenuLink>
              </div>
            </Collapsible.Content>
          </Collapsible.Root>

          {/* Prop Trading Section */}
          <Collapsible.Root 
            open={openSections.has('prop-trading')}
            onOpenChange={() => toggleSection('prop-trading')}
          >
            <Collapsible.Trigger className="mobile-menu-trigger">
              <span>Prop Trading</span>
              <ChevronDown 
                className={`w-5 h-5 transition-transform ${
                  openSections.has('prop-trading') ? 'rotate-180' : ''
                }`} 
              />
            </Collapsible.Trigger>
            <Collapsible.Content className="mobile-menu-content">
              <div className="space-y-2">
                <MegaMenuLink href="/prop-trading/firms">Prop Firm Reviews</MegaMenuLink>
                <MegaMenuLink href="/prop-trading/challenges">Challenges</MegaMenuLink>
                <MegaMenuLink href="/prop-trading/compare">Compare Firms</MegaMenuLink>
                <MegaMenuLink href="/prop-trading/calculator">Profit Calculator</MegaMenuLink>
              </div>
            </Collapsible.Content>
          </Collapsible.Root>

          {/* Education Section */}
          <Collapsible.Root 
            open={openSections.has('education')}
            onOpenChange={() => toggleSection('education')}
          >
            <Collapsible.Trigger className="mobile-menu-trigger">
              <span>Education</span>
              <ChevronDown 
                className={`w-5 h-5 transition-transform ${
                  openSections.has('education') ? 'rotate-180' : ''
                }`} 
              />
            </Collapsible.Trigger>
            <Collapsible.Content className="mobile-menu-content">
              <div className="space-y-2">
                <MegaMenuLink href="/education/beginner">Beginner's Guide</MegaMenuLink>
                <MegaMenuLink href="/education/articles">Trading Articles</MegaMenuLink>
                <MegaMenuLink href="/education/ebooks">Free eBooks</MegaMenuLink>
                <MegaMenuLink href="/education/tools">Trading Tools</MegaMenuLink>
                <MegaMenuLink href="/education/glossary">Glossary</MegaMenuLink>
              </div>
            </Collapsible.Content>
          </Collapsible.Root>

          {/* About Section */}
          <Collapsible.Root 
            open={openSections.has('about')}
            onOpenChange={() => toggleSection('about')}
          >
            <Collapsible.Trigger className="mobile-menu-trigger">
              <span>About</span>
              <ChevronDown 
                className={`w-5 h-5 transition-transform ${
                  openSections.has('about') ? 'rotate-180' : ''
                }`} 
              />
            </Collapsible.Trigger>
            <Collapsible.Content className="mobile-menu-content">
              <div className="space-y-2">
                <MegaMenuLink href="/about/methodology">Our Methodology</MegaMenuLink>
                <MegaMenuLink href="/about/trust-score">Trust Score</MegaMenuLink>
                <MegaMenuLink href="/about/team">Our Team</MegaMenuLink>
                <MegaMenuLink href="/about/contact">Contact</MegaMenuLink>
              </div>
            </Collapsible.Content>
          </Collapsible.Root>
        </div>

        {/* Auth Buttons */}
        <div className="flex flex-col space-y-3 pt-6 border-t border-white/10 mt-6">
          <Button 
            variant="ghost" 
            className="text-white hover:bg-white/10 w-full justify-start"
            onClick={onSignIn}
          >
            Sign In
          </Button>
          <Button 
            className="btn-gradient w-full"
            onClick={onGetAIMatch}
          >
            Get AI Match
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileNavigation;
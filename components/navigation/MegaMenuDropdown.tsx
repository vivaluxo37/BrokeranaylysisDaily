import React from 'react';
import { NavigationSection } from '@/lib/enums';
import { CountryData, PlatformData, AccountTypeData, BrokerData, AnalysisData, EducationResourceData, PropFirmData, ComparisonData } from '@/lib/types';
import BrokersMegaMenu from './BrokersMegaMenu';
import MarketNewsMegaMenu from './MarketNewsMegaMenu';
import PropTradingMegaMenu from './PropTradingMegaMenu';
import EducationMegaMenu from './EducationMegaMenu';
import AboutMegaMenu from './AboutMegaMenu';

interface MegaMenuDropdownProps {
  section: NavigationSection;
  isOpen: boolean;
  onClose: () => void;
  countries: CountryData[];
  platforms: PlatformData[];
  accountTypes: AccountTypeData[];
  topBrokers: BrokerData[];
  recentAnalysis: AnalysisData[];
  educationResources: EducationResourceData[];
  propFirms: PropFirmData[];
  popularComparisons: ComparisonData[];
}

export const MegaMenuDropdown: React.FC<MegaMenuDropdownProps> = ({
  section,
  isOpen,
  onClose,
  countries,
  platforms,
  accountTypes,
  topBrokers,
  recentAnalysis,
  educationResources,
  propFirms,
  popularComparisons
}) => {
  if (!isOpen) return null;

  const renderMegaMenuContent = () => {
    switch (section) {
      case NavigationSection.BROKERS:
        return (
          <BrokersMegaMenu
            countries={countries}
            platforms={platforms}
            accountTypes={accountTypes}
            topBrokers={topBrokers}
            popularComparisons={popularComparisons}
          />
        );
      case NavigationSection.MARKET_NEWS:
        return <MarketNewsMegaMenu recentAnalysis={recentAnalysis} />;
      case NavigationSection.PROP_TRADING:
        return <PropTradingMegaMenu propFirms={propFirms} />;
      case NavigationSection.EDUCATION:
        return <EducationMegaMenu educationResources={educationResources} />;
      case NavigationSection.ABOUT:
        return <AboutMegaMenu />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
        onClick={onClose}
      />
      
      {/* Mega Menu */}
      <div className="fixed top-16 left-0 right-0 z-40 mega-menu">
        <div className="mega-menu-content">
          {renderMegaMenuContent()}
        </div>
      </div>
    </>
  );
};

export default MegaMenuDropdown;
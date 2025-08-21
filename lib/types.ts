// Type definitions for mega menu navigation data
import { NavigationSection } from './enums';

export interface CountryData {
  name: string;
  code: string;
  brokerCount: number;
}

export interface PlatformData {
  name: string;
  brokerCount: number;
}

export interface AccountTypeData {
  name: string;
  brokerCount: number;
}

export interface BrokerData {
  name: string;
  rating: number;
  trustScore: number;
}

export interface AnalysisData {
  title: string;
  timestamp: string;
  category: string;
}

export interface EducationResourceData {
  title: string;
  type: string;
  readTime?: string;
  pages?: number;
}

export interface PropFirmData {
  name: string;
  rating: number;
  fundingAmount: string;
}

export interface ComparisonData {
  broker1: string;
  broker2: string;
  views: number;
}

// Props types
export interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  section: NavigationSection;
  countries: CountryData[];
  platforms: PlatformData[];
  accountTypes: AccountTypeData[];
  topBrokers: BrokerData[];
  recentAnalysis: AnalysisData[];
  educationResources: EducationResourceData[];
  propFirms: PropFirmData[];
  popularComparisons: ComparisonData[];
}

export interface HeaderProps {
  currentPath: string;
  isAuthenticated: boolean;
  searchQuery: string;
  activeSection: NavigationSection | null;
  isMobileMenuOpen: boolean;
  searchSuggestions: string[];
  isSearching: boolean;
  onSectionChange: (section: NavigationSection | null) => void;
  onMobileMenuToggle: (open: boolean) => void;
  onSearchChange: (query: string) => void;
  onSearchSubmit: (query: string) => void;
  onSignIn: () => void;
  onSignOut: () => void;
  onGetAIMatch: () => void;
}

// Query types
export interface NavigationQueryData {
  countries: CountryData[];
  platforms: PlatformData[];
  accountTypes: AccountTypeData[];
  topBrokers: BrokerData[];
  recentAnalysis: AnalysisData[];
  educationResources: EducationResourceData[];
  propFirms: PropFirmData[];
  popularComparisons: ComparisonData[];
}
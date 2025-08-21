// Mock data for mega menu navigation structure
import { NavigationSection, BrokerCategory, MarketNewsCategory, EducationCategory, AboutCategory } from './enums';

// Mock data for mega menu navigation structure
export const mockRootProps = {
  currentPath: '/',
  isAuthenticated: false,
  searchQuery: '',
  activeSection: null as NavigationSection | null,
  isMobileMenuOpen: false,
  searchSuggestions: [] as string[],
  isSearching: false,
  onSectionChange: (section: NavigationSection | null) => {},
  onMobileMenuToggle: (open: boolean) => {},
  onSearchChange: (query: string) => {},
  onSearchSubmit: (query: string) => {},
  onSignIn: () => {},
  onSignOut: () => {},
  onGetAIMatch: () => {}
};

export const mockQuery = {
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
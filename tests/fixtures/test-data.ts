/**
 * Test data and fixtures for Playwright tests
 */

export const mockBrokers = [
  {
    id: 'ic-markets',
    name: 'IC Markets',
    slug: 'ic-markets',
    trust_score: 95,
    overall_rating: 4.8,
    minimum_deposit: 200,
    maximum_leverage: 500,
    user_reviews_count: 1250,
    regulation_info: ['ASIC', 'CySEC'],
    spreads: {
      'EUR/USD': 0.1,
      'GBP/USD': 0.2
    },
    execution_speed_ms: 15,
    commission: 3.5
  },
  {
    id: 'pepperstone',
    name: 'Pepperstone',
    slug: 'pepperstone',
    trust_score: 92,
    overall_rating: 4.6,
    minimum_deposit: 200,
    maximum_leverage: 400,
    user_reviews_count: 980,
    regulation_info: ['ASIC', 'FCA'],
    spreads: {
      'EUR/USD': 0.2,
      'GBP/USD': 0.3
    },
    execution_speed_ms: 18,
    commission: 4.0
  },
  {
    id: 'xm-group',
    name: 'XM Group',
    slug: 'xm-group',
    trust_score: 88,
    overall_rating: 4.4,
    minimum_deposit: 5,
    maximum_leverage: 888,
    user_reviews_count: 2100,
    regulation_info: ['CySEC', 'ASIC'],
    spreads: {
      'EUR/USD': 0.8,
      'GBP/USD': 1.2
    },
    execution_speed_ms: 25,
    commission: 0
  }
]

export const mockArticles = [
  {
    id: 'best-forex-brokers-2024',
    title: 'Best Forex Brokers 2024',
    slug: 'best-forex-brokers-2024',
    excerpt: 'Complete guide to choosing the best forex broker for your trading needs',
    category: 'Education',
    published_at: '2024-01-15T10:00:00Z',
    author: 'Trading Expert'
  },
  {
    id: 'scalping-strategies',
    title: 'Advanced Scalping Strategies',
    slug: 'scalping-strategies',
    excerpt: 'Learn professional scalping techniques and strategies',
    category: 'Strategy',
    published_at: '2024-01-10T14:30:00Z',
    author: 'Market Analyst'
  },
  {
    id: 'market-analysis-weekly',
    title: 'Weekly Market Analysis',
    slug: 'market-analysis-weekly',
    excerpt: 'This week\'s market trends and trading opportunities',
    category: 'Analysis',
    published_at: '2024-01-08T09:00:00Z',
    author: 'Senior Analyst'
  }
]

export const searchQueries = {
  valid: [
    'forex broker',
    'scalping',
    'trading strategies',
    'IC Markets',
    'regulation',
    'spreads'
  ],
  empty: [
    '',
    '   ',
    '\t\n'
  ],
  special: [
    'forex & trading',
    'broker (regulated)',
    'spread: 0.1 pips',
    'EUR/USD',
    'commission $3.5/lot'
  ],
  noResults: [
    'nonexistentquerythatshouldhavenoResults123',
    'xyzabc999',
    'impossiblebrokernamethatshouldnotexist'
  ]
}

export const testUrls = {
  homepage: '/',
  brokers: '/brokers',
  blog: '/blog',
  search: '/search',
  scalpingComparison: '/program/scalping-brokers-comparison',
  about: '/about',
  contact: '/contact',
  privacyPolicy: '/privacy-policy',
  termsOfService: '/terms-of-service'
}

export const selectors = {
  navigation: {
    main: ['nav', '[data-testid="navigation"]', '.navigation', '.nav-menu'],
    mobile: ['[data-testid="mobile-menu-toggle"]', '.mobile-menu-toggle', 'button[aria-label*="menu" i]', '.hamburger'],
    links: ['nav a', '.nav-link', '.navigation a']
  },
  search: {
    input: ['[data-testid="search-input"]', 'input[type="search"]', 'input[placeholder*="search" i]', '.search-input'],
    results: ['[data-testid="search-results"]', '.search-results', '.search-result', '.result-item'],
    filters: ['[data-testid="search-filters"]', '.search-filters', '.filter-option']
  },
  brokers: {
    cards: ['[data-testid="broker-card"]', '.broker-card', '.broker-item'],
    filters: ['[data-testid="broker-filters"]', '.filters', '.filter-select'],
    trustScore: ['.trust-score', '[data-testid="trust-score"]', '.score'],
    rating: ['.rating', '[data-testid="rating"]', '.stars'],
    regulation: ['.regulation', '.regulatory', '[data-testid="regulation"]']
  },
  blog: {
    articles: ['[data-testid="blog-article"]', '.blog-article', 'article'],
    pagination: ['[data-testid="pagination"]', '.pagination', 'nav[aria-label*="pagination" i]'],
    categories: ['[data-testid="category-filter"]', '.category-filter', '.filter-button']
  },
  comparison: {
    table: ['table', '.comparison-table', '[data-testid="comparison-table"]'],
    cards: ['[data-testid="broker-card"]', '.broker-card', '.comparison-card'],
    selectors: ['[data-testid="broker-selector"]', '.broker-selector', 'select[name*="broker" i]'],
    metrics: {
      execution: ['[data-testid="execution-speed"]', '.execution-speed', '.execution'],
      commission: ['[data-testid="commission"]', '.commission'],
      spread: ['[data-testid="spread"]', '.spread'],
      regulation: ['[data-testid="regulation"]', '.regulation']
    }
  },
  common: {
    loading: ['[data-testid="loading"]', '.loading', '.spinner'],
    error: ['[data-testid="error"]', '.error', '.error-message'],
    noResults: ['[data-testid="no-results"]', '.no-results', 'text=/no results/i'],
    cta: ['[data-testid="cta-button"]', '.cta-button', '.btn-primary'],
    hero: ['[data-testid="hero"]', '.hero', '.hero-section', '.banner']
  }
}

export const expectedContent = {
  homepage: {
    title: /BrokeranalysisDaily/i,
    heading: /broker|trading|forex/i
  },
  brokers: {
    title: /Brokers.*BrokeranalysisDaily/i,
    heading: /brokers/i
  },
  blog: {
    title: /Blog.*BrokeranalysisDaily/i,
    heading: /blog/i
  },
  search: {
    title: /Search.*BrokeranalysisDaily/i,
    heading: /search/i
  },
  scalpingComparison: {
    title: /Scalping.*Comparison.*BrokeranalysisDaily/i,
    heading: /scalping/i
  }
}

export const viewports = {
  desktop: { width: 1920, height: 1080 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 667 },
  mobileLarge: { width: 414, height: 896 }
}

export const performanceThresholds = {
  pageLoadTime: 5000,
  domContentLoaded: 3000,
  firstContentfulPaint: 2000
}

export const accessibilityChecks = {
  requiredElements: ['h1', 'nav', 'main', 'footer'],
  imageAltText: true,
  formLabels: true,
  headingHierarchy: true,
  colorContrast: true
}

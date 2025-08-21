// Enums for mega menu navigation structure
export enum NavigationSection {
  BROKERS = 'brokers',
  MARKET_NEWS = 'market-news',
  PROP_TRADING = 'prop-trading', 
  EDUCATION = 'education',
  ABOUT = 'about'
}

export enum BrokerCategory {
  BY_COUNTRY = 'by-country',
  BY_PLATFORM = 'by-platform',
  BY_ACCOUNT_TYPE = 'by-account-type',
  REVIEWS = 'reviews',
  COMPARE = 'compare'
}

export enum MarketNewsCategory {
  TECHNICAL_ANALYSIS = 'technical-analysis',
  TRADING_SIGNALS = 'trading-signals',
  WEEKLY_FORECASTS = 'weekly-forecasts',
  CURRENCY_ANALYSIS = 'currency-analysis',
  COMMODITY_FORECASTS = 'commodity-forecasts'
}

export enum EducationCategory {
  FOREX_ARTICLES = 'forex-articles',
  TRADING_GUIDES = 'trading-guides',
  GLOSSARY = 'glossary',
  REGULATIONS = 'regulations',
  EBOOKS = 'ebooks'
}

export enum AboutCategory {
  METHODOLOGY = 'methodology',
  TRUST_SCORE = 'trust-score',
  HOW_WE_MAKE_MONEY = 'how-we-make-money',
  TEAM = 'team',
  CONTACT = 'contact'
}

export enum BrokerPlatform {
  MT4 = 'mt4',
  MT5 = 'mt5',
  CTRADER = 'ctrader',
  PROPRIETARY = 'proprietary',
  WEBTRADER = 'webtrader'
}

export enum TradingStrategy {
  SCALPING = 'scalping',
  DAY_TRADING = 'day-trading',
  SWING_TRADING = 'swing-trading',
  POSITION_TRADING = 'position-trading'
}

export enum TrustScoreRange {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor'
}

export enum EvidenceType {
  REVIEW = 'review',
  REGULATORY = 'regulatory',
  FINANCIAL = 'financial',
  TECHNICAL = 'technical'
}

export enum AlertType {
  REGULATORY_CHANGE = 'regulatory-change',
  SPREAD_SPIKE = 'spread-spike',
  PLATFORM_ISSUE = 'platform-issue',
  NEWS_UPDATE = 'news-update'
}
// TradingView Widgets Export
export { default as TradingViewWidget } from './TradingViewWidget';
export type { TradingViewWidgetProps } from './TradingViewWidget';

// Specific Widget Components
export { default as MarketOverviewWidget } from './MarketOverviewWidget';
export { default as EconomicCalendarWidget } from './EconomicCalendarWidget';
export { default as ForexHeatmapWidget } from './ForexHeatmapWidget';
export { default as TickerTapeWidget } from './TickerTapeWidget';
export { default as AdvancedChartWidget } from './AdvancedChartWidget';
export { default as TechnicalAnalysisWidget } from './TechnicalAnalysisWidget';
export { default as ScreenerWidget } from './ScreenerWidget';

// Widget Types for easy reference
export const WIDGET_TYPES = {
  MARKET_OVERVIEW: 'market-overview',
  ECONOMIC_CALENDAR: 'economic-calendar',
  FOREX_CROSS_RATES: 'forex-cross-rates',
  FOREX_HEATMAP: 'forex-heatmap',
  ADVANCED_CHART: 'advanced-chart',
  TICKER_TAPE: 'ticker-tape',
  SYMBOL_OVERVIEW: 'symbol-overview',
  TECHNICAL_ANALYSIS: 'technical-analysis',
  STOCK_MARKET: 'stock-market',
  SCREENER: 'screener',
  TOP_STORIES: 'top-stories',
  CRYPTO_HEATMAP: 'crypto-heatmap',
  SINGLE_TICKER: 'single-ticker',
  MINI_CHART: 'mini-chart'
} as const;

// Common symbol configurations for broker analysis
export const BROKER_SYMBOLS = {
  MAJOR_FOREX: [
    'FX_IDC:EURUSD',
    'FX_IDC:GBPUSD',
    'FX_IDC:USDJPY',
    'FX_IDC:AUDUSD',
    'FX_IDC:USDCAD',
    'FX_IDC:USDCHF',
    'FX_IDC:NZDUSD'
  ],
  CRYPTO: [
    'BITSTAMP:BTCUSD',
    'BITSTAMP:ETHUSD',
    'BINANCE:ADAUSD',
    'BINANCE:DOTUSD',
    'BINANCE:LINKUSD'
  ],
  INDICES: [
    'FOREXCOM:SPXUSD',
    'FOREXCOM:NSXUSD',
    'TVC:DJI',
    'TVC:UKX',
    'TVC:NI225'
  ],
  COMMODITIES: [
    'TVC:GOLD',
    'TVC:SILVER',
    'NYMEX:CL1!',
    'NYMEX:NG1!',
    'CBOT:ZW1!'
  ]
};

// Theme configurations
export const WIDGET_THEMES = {
  LIGHT: {
    theme: 'light' as const,
    colorTheme: 'light' as const
  },
  DARK: {
    theme: 'dark' as const,
    colorTheme: 'dark' as const
  }
};

// Common widget configurations for different page types
export const WIDGET_CONFIGS = {
  HOMEPAGE: {
    marketOverview: {
      height: 400,
      tabs: ['indices', 'forex', 'crypto'],
      showHeader: true
    },
    tickerTape: {
      height: 46,
      symbols: BROKER_SYMBOLS.MAJOR_FOREX.slice(0, 6),
      displayMode: 'adaptive' as const
    }
  },
  BROKER_PAGE: {
    forexChart: {
      height: 400,
      symbol: 'FX_IDC:EURUSD',
      interval: 'D',
      showHeader: true
    },
    forexHeatmap: {
      height: 350,
      showHeader: true
    }
  },
  MARKET_DATA_PAGE: {
    economicCalendar: {
      height: 600,
      showHeader: true
    },
    marketOverview: {
      height: 500,
      tabs: ['indices', 'futures', 'bonds', 'forex'],
      showHeader: true
    }
  }
};

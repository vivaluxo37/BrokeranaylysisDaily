'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export interface TradingViewWidgetProps {
  widgetType: 'market-overview' | 'economic-calendar' | 'forex-cross-rates' | 'forex-heatmap' | 
             'advanced-chart' | 'ticker-tape' | 'symbol-overview' | 'technical-analysis' | 
             'stock-market' | 'screener' | 'top-stories' | 'crypto-heatmap' | 'single-ticker' | 'mini-chart';
  symbol?: string;
  width?: string | number;
  height?: string | number;
  theme?: 'light' | 'dark';
  colorTheme?: 'light' | 'dark';
  locale?: string;
  className?: string;
  autosize?: boolean;
  // Widget-specific props
  symbols?: string[];
  showSymbolLogo?: boolean;
  isTransparent?: boolean;
  displayMode?: 'adaptive' | 'compact' | 'regular';
  interval?: string;
  range?: string;
  style?: string;
  timezone?: string;
  studies?: string[];
  showPopupButton?: boolean;
  popup_width?: string;
  popup_height?: string;
  noTimeScale?: boolean;
  valuesTracking?: string;
  changeMode?: string;
  chartOnly?: boolean;
  hideSideToolbar?: boolean;
  hideTopToolbar?: boolean;
  hideBottomToolbar?: boolean;
  // Economic Calendar specific
  importanceFilter?: string;
  countryFilter?: string;
  // Forex specific
  currencies?: string[];
  // Market Overview specific
  tabs?: string[];
  // Screener specific
  market?: string;
  screener_type?: string;
  // Ticker specific
  displayMode_ticker?: 'adaptive' | 'compact';
  // News specific
  feedMode?: string;
  market_news?: string;
  isTransparent_news?: boolean;
}

const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({
  widgetType,
  symbol = 'NASDAQ:AAPL',
  width = '100%',
  height = 400,
  theme = 'dark',
  colorTheme = 'dark',
  locale = 'en',
  className,
  autosize = false,
  symbols = [],
  showSymbolLogo = true,
  isTransparent = false,
  displayMode = 'adaptive',
  interval = 'D',
  range = '12M',
  style = '1',
  timezone = 'Etc/UTC',
  studies = [],
  showPopupButton = true,
  popup_width = '1000',
  popup_height = '650',
  noTimeScale = false,
  valuesTracking = '1',
  changeMode = 'price-and-percent',
  chartOnly = false,
  hideSideToolbar = false,
  hideTopToolbar = false,
  hideBottomToolbar = false,
  importanceFilter = '-1,0,1',
  countryFilter = 'ar,au,br,ca,cn,fr,de,in,id,it,jp,kr,mx,ru,sa,za,tr,gb,us,eu',
  currencies = ['EUR', 'USD', 'JPY', 'GBP', 'CHF', 'AUD', 'CAD', 'NZD', 'CNY'],
  tabs = ['indices', 'futures', 'bonds', 'forex'],
  market = 'forex',
  screener_type = 'crypto_mkt',
  displayMode_ticker = 'adaptive',
  feedMode = 'all_symbols',
  market_news = 'stock',
  isTransparent_news = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  const getWidgetConfig = () => {
    const baseConfig = {
      width: autosize ? '100%' : width,
      height: autosize ? '100%' : height,
      colorTheme,
      locale,
      isTransparent
    };

    switch (widgetType) {
      case 'market-overview':
        return {
          ...baseConfig,
          tabs,
          showChart: true,
          showFloatingTooltip: false,
          width: autosize ? '100%' : width,
          height: autosize ? '100%' : height,
          plotLineColorGrowing: 'rgba(41, 98, 255, 1)',
          plotLineColorFalling: 'rgba(41, 98, 255, 1)',
          gridLineColor: 'rgba(240, 243, 250, 0)',
          scaleFontColor: 'rgba(106, 109, 120, 1)',
          belowLineFillColorGrowing: 'rgba(41, 98, 255, 0.12)',
          belowLineFillColorFalling: 'rgba(41, 98, 255, 0.12)',
          belowLineFillColorGrowingBottom: 'rgba(41, 98, 255, 0)',
          belowLineFillColorFallingBottom: 'rgba(41, 98, 255, 0)',
          symbolActiveColor: 'rgba(41, 98, 255, 0.12)'
        };

      case 'economic-calendar':
        return {
          ...baseConfig,
          importanceFilter,
          countryFilter,
          width: autosize ? '100%' : width,
          height: autosize ? '100%' : height
        };

      case 'forex-cross-rates':
        return {
          ...baseConfig,
          currencies,
          width: autosize ? '100%' : width,
          height: autosize ? '100%' : height
        };

      case 'forex-heatmap':
        return {
          ...baseConfig,
          currencies,
          width: autosize ? '100%' : width,
          height: autosize ? '100%' : height,
          isTransparent: false
        };

      case 'advanced-chart':
        return {
          ...baseConfig,
          symbol,
          interval,
          range,
          style,
          timezone,
          theme: colorTheme,
          studies,
          show_popup_button: showPopupButton,
          popup_width,
          popup_height,
          no_referral_id: true,
          withdateranges: true,
          hide_side_toolbar: hideSideToolbar,
          hide_top_toolbar: hideTopToolbar,
          hide_legend: false,
          save_image: false,
          container_id: 'tradingview_chart'
        };

      case 'ticker-tape':
        return {
          ...baseConfig,
          symbols: symbols.length > 0 ? symbols.map(s => ({ proName: s, title: s })) : [
            { proName: 'FOREXCOM:SPXUSD', title: 'S&P 500' },
            { proName: 'FOREXCOM:NSXUSD', title: 'US 100' },
            { proName: 'FX_IDC:EURUSD', title: 'EUR to USD' },
            { proName: 'BITSTAMP:BTCUSD', title: 'Bitcoin' },
            { proName: 'BITSTAMP:ETHUSD', title: 'Ethereum' }
          ],
          showSymbolLogo,
          displayMode: displayMode_ticker
        };

      case 'symbol-overview':
        return {
          ...baseConfig,
          symbols: [[symbol]],
          chartOnly,
          width: autosize ? '100%' : width,
          height: autosize ? '100%' : height,
          hideDateRanges: false,
          hideMarketStatus: false,
          hideSymbolLogo: !showSymbolLogo,
          scalePosition: 'right',
          scaleMode: 'Normal',
          fontFamily: '-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif',
          fontSize: '10',
          noTimeScale,
          valuesTracking,
          changeMode,
          chartType: 'area',
          maLineColor: '#2962FF',
          maLineWidth: 1,
          maLength: 9,
          backgroundColor: 'rgba(255, 255, 255, 0)',
          lineWidth: 2,
          lineType: 0,
          dateRanges: ['1d', '1m', '3m', '12m', '60m', 'all']
        };

      case 'technical-analysis':
        return {
          ...baseConfig,
          interval,
          symbol,
          width: autosize ? '100%' : width,
          height: autosize ? '100%' : height,
          showIntervalTabs: true,
          displayMode
        };

      case 'stock-market':
        return {
          ...baseConfig,
          exchange: 'US',
          showChart: true,
          width: autosize ? '100%' : width,
          height: autosize ? '100%' : height,
          largeChartUrl: ''
        };

      case 'screener':
        return {
          ...baseConfig,
          width: autosize ? '100%' : width,
          height: autosize ? '100%' : height,
          defaultColumn: 'overview',
          screener_type,
          displayCurrency: 'USD',
          market
        };

      case 'top-stories':
        return {
          ...baseConfig,
          feedMode,
          market: market_news,
          isTransparent: isTransparent_news,
          displayMode,
          width: autosize ? '100%' : width,
          height: autosize ? '100%' : height
        };

      case 'crypto-heatmap':
        return {
          ...baseConfig,
          dataSource: 'Crypto',
          blockSize: 'market_cap_calc',
          blockColor: 'change',
          width: autosize ? '100%' : width,
          height: autosize ? '100%' : height,
          hasTopBar: false,
          isDataSetEnabled: true,
          isZoomEnabled: true,
          hasSymbolTooltip: true
        };

      case 'single-ticker':
        return {
          ...baseConfig,
          symbol,
          width: autosize ? '100%' : width,
          height: autosize ? '100%' : height
        };

      case 'mini-chart':
        return {
          ...baseConfig,
          symbol,
          width: autosize ? '100%' : width,
          height: autosize ? '100%' : height,
          dateRange: '12M',
          trendLineColor: 'rgba(41, 98, 255, 1)',
          underLineColor: 'rgba(41, 98, 255, 0.3)',
          underLineBottomColor: 'rgba(41, 98, 255, 0)',
          isTransparent: true,
          autosize: true,
          largeChartUrl: ''
        };

      default:
        return baseConfig;
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // Clean up previous script
    if (scriptRef.current) {
      scriptRef.current.remove();
      scriptRef.current = null;
    }

    // Clear container
    containerRef.current.innerHTML = '';

    // Add a delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (!containerRef.current) return;

      try {
        // Create new script
        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-' + widgetType + '.js';
        script.type = 'text/javascript';
        script.async = true;
        script.innerHTML = JSON.stringify(getWidgetConfig());

        script.onload = () => {
          console.log(`TradingView ${widgetType} widget loaded successfully`);
        };

        script.onerror = (error) => {
          console.error(`Failed to load TradingView ${widgetType} widget:`, error);
        };

        scriptRef.current = script;
        containerRef.current.appendChild(script);
      } catch (error) {
        console.error('Error creating TradingView widget:', error);
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      if (scriptRef.current) {
        scriptRef.current.remove();
        scriptRef.current = null;
      }
    };
  }, [widgetType, symbol, width, height, theme, colorTheme, locale]);

  return (
    <div 
      ref={containerRef}
      className={cn(
        'tradingview-widget-container',
        autosize && 'w-full h-full',
        className
      )}
      style={{
        width: autosize ? '100%' : width,
        height: autosize ? '100%' : height
      }}
    />
  );
};

export default TradingViewWidget;

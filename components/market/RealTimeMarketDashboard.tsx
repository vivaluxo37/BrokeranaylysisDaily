'use client';

import React, { useState, useEffect } from 'react';
import { useMarketDataWebSocket } from '../../hooks/useMarketDataWebSocket';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Calendar, 
  Signal, 
  BarChart3,
  Wifi,
  WifiOff,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface RealTimeMarketDashboardProps {
  className?: string;
}

const RealTimeMarketDashboard: React.FC<RealTimeMarketDashboardProps> = ({ className }) => {
  const {
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    subscriptions,
    currencies,
    economicEvents,
    marketSignals,
    commodities,
    lastUpdated,
    reconnectCount,
    maxReconnectAttempts
  } = useMarketDataWebSocket();

  const [activeTab, setActiveTab] = useState('currencies');

  // Auto-subscribe to all channels when connected
  useEffect(() => {
    if (isConnected && subscriptions.length === 0) {
      subscribe(['currencies', 'economic_events', 'market_signals', 'commodities']);
    }
  }, [isConnected, subscriptions.length, subscribe]);

  const formatPrice = (price: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(price);
  };

  const formatPercentage = (percentage: number) => {
    const formatted = percentage.toFixed(2);
    return `${percentage >= 0 ? '+' : ''}${formatted}%`;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getImpactColor = (impact: string) => {
    switch (impact?.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSignalColor = (signalType: string) => {
    switch (signalType?.toLowerCase()) {
      case 'buy': return 'bg-green-100 text-green-800';
      case 'sell': return 'bg-red-100 text-red-800';
      case 'hold': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const ConnectionStatus = () => (
    <div className="flex items-center gap-2 mb-4">
      <div className="flex items-center gap-2">
        {isConnected ? (
          <>
            <Wifi className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-600 font-medium">Connected</span>
          </>
        ) : isConnecting ? (
          <>
            <RefreshCw className="h-4 w-4 text-yellow-600 animate-spin" />
            <span className="text-sm text-yellow-600 font-medium">Connecting...</span>
          </>
        ) : (
          <>
            <WifiOff className="h-4 w-4 text-red-600" />
            <span className="text-sm text-red-600 font-medium">Disconnected</span>
          </>
        )}
      </div>
      
      {error && (
        <div className="flex items-center gap-1 text-red-600">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}
      
      {reconnectCount > 0 && (
        <span className="text-xs text-gray-500">
          Reconnect attempts: {reconnectCount}/{maxReconnectAttempts}
        </span>
      )}
      
      <div className="ml-auto">
        {isConnected ? (
          <Button variant="outline" size="sm" onClick={disconnect}>
            Disconnect
          </Button>
        ) : (
          <Button variant="outline" size="sm" onClick={connect}>
            Connect
          </Button>
        )}
      </div>
    </div>
  );

  const CurrenciesTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {currencies.slice(0, 12).map((currency, index) => (
        <Card key={currency.id || index} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-lg">{currency.symbol}</h3>
                <p className="text-sm text-gray-600">
                  {currency.base_currency}/{currency.quote_currency}
                </p>
              </div>
              <Badge variant={currency.is_active ? 'default' : 'secondary'}>
                {currency.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Bid:</span>
                <span className="font-medium">{formatPrice(currency.bid_price)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Ask:</span>
                <span className="font-medium">{formatPrice(currency.ask_price)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Spread:</span>
                <span className="font-medium">{currency.spread?.toFixed(4)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">24h Change:</span>
                <div className="flex items-center gap-1">
                  {currency.change_percentage_24h >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  )}
                  <span className={getChangeColor(currency.change_percentage_24h)}>
                    {formatPercentage(currency.change_percentage_24h)}
                  </span>
                </div>
              </div>
            </div>
            
            {currency.source && (
              <div className="mt-2 pt-2 border-t">
                <span className="text-xs text-gray-500">Source: {currency.source}</span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const EconomicEventsTab = () => (
    <div className="space-y-4">
      {economicEvents.slice(0, 10).map((event, index) => (
        <Card key={event.id || index} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h3 className="font-semibold">{event.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{event.description}</p>
              </div>
              <Badge className={getImpactColor(event.impact_level)}>
                {event.impact_level?.toUpperCase()}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
              <div>
                <span className="text-xs text-gray-500">Country</span>
                <p className="font-medium">{event.country}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">Currency</span>
                <p className="font-medium">{event.currency}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">Date</span>
                <p className="font-medium">{event.event_date}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">Time</span>
                <p className="font-medium">{event.event_time}</p>
              </div>
            </div>
            
            {(event.previous_value || event.forecast_value || event.actual_value) && (
              <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t">
                <div>
                  <span className="text-xs text-gray-500">Previous</span>
                  <p className="font-medium">{event.previous_value || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Forecast</span>
                  <p className="font-medium">{event.forecast_value || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Actual</span>
                  <p className="font-medium">{event.actual_value || 'N/A'}</p>
                </div>
              </div>
            )}
            
            {event.source && (
              <div className="mt-2 pt-2 border-t">
                <span className="text-xs text-gray-500">Source: {event.source}</span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const MarketSignalsTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {marketSignals.slice(0, 8).map((signal, index) => (
        <Card key={signal.id || index} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-lg">{signal.symbol}</h3>
                <p className="text-sm text-gray-600">{signal.timeframe}</p>
              </div>
              <Badge className={getSignalColor(signal.signal_type)}>
                {signal.signal_type?.toUpperCase()}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Strength:</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(signal.strength / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{signal.strength}/10</span>
                </div>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Confidence:</span>
                <span className="font-medium">{signal.confidence}%</span>
              </div>
              
              {signal.entry_price && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Entry Price:</span>
                  <span className="font-medium">{formatPrice(signal.entry_price)}</span>
                </div>
              )}
              
              {signal.stop_loss && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Stop Loss:</span>
                  <span className="font-medium text-red-600">{formatPrice(signal.stop_loss)}</span>
                </div>
              )}
              
              {signal.take_profit && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Take Profit:</span>
                  <span className="font-medium text-green-600">{formatPrice(signal.take_profit)}</span>
                </div>
              )}
            </div>
            
            {signal.description && (
              <div className="mt-3 pt-3 border-t">
                <p className="text-sm text-gray-600">{signal.description}</p>
              </div>
            )}
            
            <div className="mt-2 pt-2 border-t flex justify-between text-xs text-gray-500">
              <span>Source: {signal.source}</span>
              {signal.created_at && (
                <span>{formatDistanceToNow(new Date(signal.created_at), { addSuffix: true })}</span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const CommoditiesTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {commodities.slice(0, 9).map((commodity, index) => (
        <Card key={commodity.id || index} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-lg">{commodity.symbol}</h3>
                <p className="text-sm text-gray-600">{commodity.name}</p>
                <p className="text-xs text-gray-500">{commodity.category}</p>
              </div>
              <Badge variant={commodity.is_active ? 'default' : 'secondary'}>
                {commodity.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Price:</span>
                <span className="font-medium text-lg">
                  {formatPrice(commodity.current_price, commodity.currency)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">24h Change:</span>
                <div className="flex items-center gap-1">
                  {commodity.change_percentage_24h >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  )}
                  <span className={getChangeColor(commodity.change_percentage_24h)}>
                    {formatPercentage(commodity.change_percentage_24h)}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Volume 24h:</span>
                <span className="font-medium">
                  {new Intl.NumberFormat('en-US', { notation: 'compact' }).format(commodity.volume_24h)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">High/Low 24h:</span>
                <span className="font-medium text-sm">
                  {formatPrice(commodity.high_24h, commodity.currency)} / {formatPrice(commodity.low_24h, commodity.currency)}
                </span>
              </div>
            </div>
            
            <div className="mt-2 pt-2 border-t flex justify-between text-xs text-gray-500">
              <span>Exchange: {commodity.exchange}</span>
              <span>Source: {commodity.source}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Real-Time Market Data Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ConnectionStatus />
          
          {lastUpdated && Object.keys(lastUpdated).length > 0 && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Last Updated:</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                {Object.entries(lastUpdated).map(([key, timestamp]) => (
                  <div key={key}>
                    <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                    <br />
                    <span className="font-medium">
                      {formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="currencies" className="flex items-center gap-1">
                <BarChart3 className="h-4 w-4" />
                Currencies
              </TabsTrigger>
              <TabsTrigger value="events" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Events
              </TabsTrigger>
              <TabsTrigger value="signals" className="flex items-center gap-1">
                <Signal className="h-4 w-4" />
                Signals
              </TabsTrigger>
              <TabsTrigger value="commodities" className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                Commodities
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="currencies" className="mt-6">
              <CurrenciesTab />
            </TabsContent>
            
            <TabsContent value="events" className="mt-6">
              <EconomicEventsTab />
            </TabsContent>
            
            <TabsContent value="signals" className="mt-6">
              <MarketSignalsTab />
            </TabsContent>
            
            <TabsContent value="commodities" className="mt-6">
              <CommoditiesTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeMarketDashboard;
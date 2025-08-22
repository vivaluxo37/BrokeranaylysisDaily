import { useState, useEffect, useRef, useCallback } from 'react';

interface MarketDataMessage {
  type: string;
  data?: any;
  timestamp?: string;
}

interface UseMarketDataWebSocketOptions {
  url?: string;
  autoConnect?: boolean;
  reconnectAttempts?: number;
  reconnectInterval?: number;
}

interface MarketDataState {
  currencies: any[];
  economicEvents: any[];
  marketSignals: any[];
  commodities: any[];
  lastUpdated: Record<string, string>;
}

export const useMarketDataWebSocket = (options: UseMarketDataWebSocketOptions = {}) => {
  const {
    url = process.env.NODE_ENV === 'production' 
      ? 'wss://brokeranalysis.com/ws' 
      : 'ws://localhost:8080',
    autoConnect = true,
    reconnectAttempts = 5,
    reconnectInterval = 3000
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscriptions, setSubscriptions] = useState<string[]>([]);
  const [marketData, setMarketData] = useState<MarketDataState>({
    currencies: [],
    economicEvents: [],
    marketSignals: [],
    commodities: [],
    lastUpdated: {}
  });

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectCountRef = useRef(0);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (isConnecting || isConnected) {
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected to market data server');
        setIsConnected(true);
        setIsConnecting(false);
        setError(null);
        reconnectCountRef.current = 0;

        // Start ping interval
        pingIntervalRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'ping' }));
          }
        }, 30000); // Ping every 30 seconds
      };

      ws.onmessage = (event) => {
        try {
          const message: MarketDataMessage = JSON.parse(event.data);
          handleMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = (event) => {
        console.log('WebSocket connection closed:', event.code, event.reason);
        setIsConnected(false);
        setIsConnecting(false);
        
        // Clear ping interval
        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current);
          pingIntervalRef.current = null;
        }

        // Attempt to reconnect if not manually closed
        if (event.code !== 1000 && reconnectCountRef.current < reconnectAttempts) {
          scheduleReconnect();
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('WebSocket connection error');
        setIsConnecting(false);
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setError('Failed to create WebSocket connection');
      setIsConnecting(false);
    }
  }, [url, isConnecting, isConnected, reconnectAttempts]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close(1000, 'Manual disconnect');
      wsRef.current = null;
    }

    setIsConnected(false);
    setIsConnecting(false);
    reconnectCountRef.current = 0;
  }, []);

  const scheduleReconnect = useCallback(() => {
    if (reconnectCountRef.current >= reconnectAttempts) {
      setError(`Failed to reconnect after ${reconnectAttempts} attempts`);
      return;
    }

    reconnectCountRef.current++;
    console.log(`Scheduling reconnect attempt ${reconnectCountRef.current}/${reconnectAttempts}`);

    reconnectTimeoutRef.current = setTimeout(() => {
      connect();
    }, reconnectInterval);
  }, [connect, reconnectAttempts, reconnectInterval]);

  const subscribe = useCallback((channels: string[]) => {
    if (!isConnected || !wsRef.current) {
      console.warn('Cannot subscribe: WebSocket not connected');
      return;
    }

    const message = {
      type: 'subscribe',
      channels
    };

    wsRef.current.send(JSON.stringify(message));
  }, [isConnected]);

  const unsubscribe = useCallback((channels: string[]) => {
    if (!isConnected || !wsRef.current) {
      console.warn('Cannot unsubscribe: WebSocket not connected');
      return;
    }

    const message = {
      type: 'unsubscribe',
      channels
    };

    wsRef.current.send(JSON.stringify(message));
  }, [isConnected]);

  const handleMessage = useCallback((message: MarketDataMessage) => {
    switch (message.type) {
      case 'connection':
        console.log('WebSocket connection established:', message.data);
        break;

      case 'subscription_confirmed':
        setSubscriptions(message.data?.total_subscriptions || []);
        console.log('Subscriptions confirmed:', message.data?.subscribed);
        break;

      case 'unsubscription_confirmed':
        setSubscriptions(message.data?.remaining_subscriptions || []);
        console.log('Unsubscriptions confirmed:', message.data?.unsubscribed);
        break;

      case 'currency_update':
        setMarketData(prev => ({
          ...prev,
          currencies: message.data || [],
          lastUpdated: {
            ...prev.lastUpdated,
            currencies: message.timestamp || new Date().toISOString()
          }
        }));
        break;

      case 'economic_events_update':
        setMarketData(prev => ({
          ...prev,
          economicEvents: message.data || [],
          lastUpdated: {
            ...prev.lastUpdated,
            economicEvents: message.timestamp || new Date().toISOString()
          }
        }));
        break;

      case 'market_signals_update':
        setMarketData(prev => ({
          ...prev,
          marketSignals: message.data || [],
          lastUpdated: {
            ...prev.lastUpdated,
            marketSignals: message.timestamp || new Date().toISOString()
          }
        }));
        break;

      case 'commodities_update':
        setMarketData(prev => ({
          ...prev,
          commodities: message.data || [],
          lastUpdated: {
            ...prev.lastUpdated,
            commodities: message.timestamp || new Date().toISOString()
          }
        }));
        break;

      case 'error':
        console.error('WebSocket error message:', message.data?.message);
        setError(message.data?.message || 'Unknown error');
        break;

      case 'ping':
        // Respond to ping with pong
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ type: 'pong' }));
        }
        break;

      case 'pong':
        // Server responded to our ping
        break;

      default:
        console.log('Unknown message type:', message.type);
    }
  }, []);

  // Auto-connect on mount if enabled
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    // Connection state
    isConnected,
    isConnecting,
    error,
    
    // Connection methods
    connect,
    disconnect,
    
    // Subscription methods
    subscribe,
    unsubscribe,
    subscriptions,
    
    // Market data
    marketData,
    
    // Convenience getters
    currencies: marketData.currencies,
    economicEvents: marketData.economicEvents,
    marketSignals: marketData.marketSignals,
    commodities: marketData.commodities,
    lastUpdated: marketData.lastUpdated,
    
    // Connection info
    reconnectCount: reconnectCountRef.current,
    maxReconnectAttempts: reconnectAttempts
  };
};

export default useMarketDataWebSocket;
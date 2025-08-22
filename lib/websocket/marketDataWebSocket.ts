import { WebSocketServer } from 'ws';
import { marketDataService } from '../services/marketDataService';
import { createServer } from 'http';

interface WebSocketClient {
  id: string;
  ws: any;
  subscriptions: Set<string>;
  lastPing: number;
}

interface MarketDataMessage {
  type: 'subscribe' | 'unsubscribe' | 'ping' | 'pong';
  channels?: string[];
  data?: any;
}

class MarketDataWebSocketServer {
  private wss: WebSocketServer | null = null;
  private clients: Map<string, WebSocketClient> = new Map();
  private updateIntervals: Map<string, NodeJS.Timeout> = new Map();
  private isRunning = false;

  constructor() {
    this.setupCleanupInterval();
  }

  public start(port: number = 8080): void {
    if (this.isRunning) {
      console.log('WebSocket server is already running');
      return;
    }

    const server = createServer();
    this.wss = new WebSocketServer({ server });

    this.wss.on('connection', (ws, request) => {
      const clientId = this.generateClientId();
      const client: WebSocketClient = {
        id: clientId,
        ws,
        subscriptions: new Set(),
        lastPing: Date.now()
      };

      this.clients.set(clientId, client);
      console.log(`Client ${clientId} connected. Total clients: ${this.clients.size}`);

      // Send welcome message
      this.sendMessage(client, {
        type: 'connection',
        data: {
          clientId,
          message: 'Connected to Brokeranalysis Market Data WebSocket',
          availableChannels: [
            'currencies',
            'economic_events',
            'market_signals',
            'commodities'
          ]
        }
      });

      ws.on('message', (data) => {
        try {
          const message: MarketDataMessage = JSON.parse(data.toString());
          this.handleMessage(client, message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
          this.sendError(client, 'Invalid message format');
        }
      });

      ws.on('close', () => {
        this.handleClientDisconnect(clientId);
      });

      ws.on('error', (error) => {
        console.error(`WebSocket error for client ${clientId}:`, error);
        this.handleClientDisconnect(clientId);
      });

      // Send initial ping
      this.sendPing(client);
    });

    server.listen(port, () => {
      console.log(`Market Data WebSocket server running on port ${port}`);
      this.isRunning = true;
    });

    // Setup periodic data updates
    this.setupDataUpdates();
  }

  public stop(): void {
    if (!this.isRunning) {
      return;
    }

    // Clear all intervals
    this.updateIntervals.forEach(interval => clearInterval(interval));
    this.updateIntervals.clear();

    // Close all client connections
    this.clients.forEach(client => {
      if (client.ws.readyState === 1) { // OPEN
        client.ws.close();
      }
    });
    this.clients.clear();

    // Close WebSocket server
    if (this.wss) {
      this.wss.close();
      this.wss = null;
    }

    this.isRunning = false;
    console.log('Market Data WebSocket server stopped');
  }

  private handleMessage(client: WebSocketClient, message: MarketDataMessage): void {
    switch (message.type) {
      case 'subscribe':
        this.handleSubscribe(client, message.channels || []);
        break;
      case 'unsubscribe':
        this.handleUnsubscribe(client, message.channels || []);
        break;
      case 'ping':
        this.handlePing(client);
        break;
      case 'pong':
        this.handlePong(client);
        break;
      default:
        this.sendError(client, `Unknown message type: ${message.type}`);
    }
  }

  private handleSubscribe(client: WebSocketClient, channels: string[]): void {
    const validChannels = ['currencies', 'economic_events', 'market_signals', 'commodities'];
    const subscribedChannels: string[] = [];

    channels.forEach(channel => {
      if (validChannels.includes(channel)) {
        client.subscriptions.add(channel);
        subscribedChannels.push(channel);
      }
    });

    this.sendMessage(client, {
      type: 'subscription_confirmed',
      data: {
        subscribed: subscribedChannels,
        total_subscriptions: Array.from(client.subscriptions)
      }
    });

    console.log(`Client ${client.id} subscribed to: ${subscribedChannels.join(', ')}`);
  }

  private handleUnsubscribe(client: WebSocketClient, channels: string[]): void {
    const unsubscribedChannels: string[] = [];

    channels.forEach(channel => {
      if (client.subscriptions.has(channel)) {
        client.subscriptions.delete(channel);
        unsubscribedChannels.push(channel);
      }
    });

    this.sendMessage(client, {
      type: 'unsubscription_confirmed',
      data: {
        unsubscribed: unsubscribedChannels,
        remaining_subscriptions: Array.from(client.subscriptions)
      }
    });

    console.log(`Client ${client.id} unsubscribed from: ${unsubscribedChannels.join(', ')}`);
  }

  private handlePing(client: WebSocketClient): void {
    client.lastPing = Date.now();
    this.sendMessage(client, { type: 'pong' });
  }

  private handlePong(client: WebSocketClient): void {
    client.lastPing = Date.now();
  }

  private sendPing(client: WebSocketClient): void {
    this.sendMessage(client, { type: 'ping' });
  }

  private sendMessage(client: WebSocketClient, message: any): void {
    if (client.ws.readyState === 1) { // OPEN
      try {
        client.ws.send(JSON.stringify(message));
      } catch (error) {
        console.error(`Error sending message to client ${client.id}:`, error);
      }
    }
  }

  private sendError(client: WebSocketClient, error: string): void {
    this.sendMessage(client, {
      type: 'error',
      data: { message: error }
    });
  }

  private handleClientDisconnect(clientId: string): void {
    const client = this.clients.get(clientId);
    if (client) {
      this.clients.delete(clientId);
      console.log(`Client ${clientId} disconnected. Total clients: ${this.clients.size}`);
    }
  }

  private generateClientId(): string {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupDataUpdates(): void {
    // Update currency pairs every 5 seconds
    const currencyInterval = setInterval(async () => {
      await this.broadcastCurrencyUpdates();
    }, 5000);
    this.updateIntervals.set('currencies', currencyInterval);

    // Update economic events every 30 seconds
    const eventsInterval = setInterval(async () => {
      await this.broadcastEconomicEvents();
    }, 30000);
    this.updateIntervals.set('economic_events', eventsInterval);

    // Update market signals every 10 seconds
    const signalsInterval = setInterval(async () => {
      await this.broadcastMarketSignals();
    }, 10000);
    this.updateIntervals.set('market_signals', signalsInterval);

    // Update commodities every 15 seconds
    const commoditiesInterval = setInterval(async () => {
      await this.broadcastCommodities();
    }, 15000);
    this.updateIntervals.set('commodities', commoditiesInterval);
  }

  private async broadcastCurrencyUpdates(): Promise<void> {
    try {
      const currencies = await marketDataService.getCurrencyPairs({ limit: 20 });
      this.broadcastToSubscribers('currencies', {
        type: 'currency_update',
        data: currencies,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error broadcasting currency updates:', error);
    }
  }

  private async broadcastEconomicEvents(): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const events = await marketDataService.getEconomicEvents({
        date_from: today,
        date_to: tomorrow,
        limit: 10
      });
      
      this.broadcastToSubscribers('economic_events', {
        type: 'economic_events_update',
        data: events,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error broadcasting economic events:', error);
    }
  }

  private async broadcastMarketSignals(): Promise<void> {
    try {
      const signals = await marketDataService.getMarketSignals({ 
        is_active: true,
        limit: 15 
      });
      
      this.broadcastToSubscribers('market_signals', {
        type: 'market_signals_update',
        data: signals,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error broadcasting market signals:', error);
    }
  }

  private async broadcastCommodities(): Promise<void> {
    try {
      const commodities = await marketDataService.getCommodities({ 
        is_active: true,
        limit: 10 
      });
      
      this.broadcastToSubscribers('commodities', {
        type: 'commodities_update',
        data: commodities,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error broadcasting commodities:', error);
    }
  }

  private broadcastToSubscribers(channel: string, message: any): void {
    let subscriberCount = 0;
    
    this.clients.forEach(client => {
      if (client.subscriptions.has(channel)) {
        this.sendMessage(client, message);
        subscriberCount++;
      }
    });

    if (subscriberCount > 0) {
      console.log(`Broadcasted ${channel} update to ${subscriberCount} subscribers`);
    }
  }

  private setupCleanupInterval(): void {
    // Clean up inactive clients every 60 seconds
    setInterval(() => {
      const now = Date.now();
      const timeout = 60000; // 60 seconds

      this.clients.forEach((client, clientId) => {
        if (now - client.lastPing > timeout) {
          console.log(`Cleaning up inactive client: ${clientId}`);
          if (client.ws.readyState === 1) {
            client.ws.close();
          }
          this.clients.delete(clientId);
        }
      });
    }, 60000);
  }

  public getStats(): any {
    const subscriptionStats: Record<string, number> = {};
    
    this.clients.forEach(client => {
      client.subscriptions.forEach(channel => {
        subscriptionStats[channel] = (subscriptionStats[channel] || 0) + 1;
      });
    });

    return {
      totalClients: this.clients.size,
      isRunning: this.isRunning,
      subscriptionStats,
      activeChannels: Object.keys(subscriptionStats)
    };
  }
}

// Export singleton instance
export const marketDataWebSocket = new MarketDataWebSocketServer();

// Export types for use in other files
export type { MarketDataMessage, WebSocketClient };
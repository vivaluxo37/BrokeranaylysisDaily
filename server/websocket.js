const WebSocket = require('ws');
const http = require('http');
const path = require('path');

// Mock market data service for the WebSocket server
const mockMarketDataService = {
  async getCurrencyPairs(options = {}) {
    const { limit = 20 } = options;
    const currencies = [];
    const pairs = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF', 'AUD/USD', 'USD/CAD', 'NZD/USD', 'EUR/GBP', 'EUR/JPY', 'GBP/JPY'];
    
    for (let i = 0; i < Math.min(limit, pairs.length); i++) {
      const [base, quote] = pairs[i].split('/');
      const basePrice = Math.random() * 2 + 0.5;
      const spread = Math.random() * 0.001 + 0.0001;
      currencies.push({
        id: `currency_${i}`,
        symbol: pairs[i],
        base_currency: base,
        quote_currency: quote,
        bid_price: basePrice,
        ask_price: basePrice + spread,
        spread: spread,
        change_percentage_24h: (Math.random() - 0.5) * 4,
        is_active: true,
        source: 'Mock API',
        updated_at: new Date().toISOString()
      });
    }
    return currencies;
  },
  
  async getEconomicEvents(options = {}) {
    const { limit = 10 } = options;
    const events = [];
    const eventTitles = ['GDP Release', 'Employment Data', 'Interest Rate Decision', 'Inflation Report', 'Trade Balance'];
    const countries = ['US', 'EU', 'UK', 'JP', 'AU'];
    const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD'];
    const impacts = ['high', 'medium', 'low'];
    
    for (let i = 0; i < limit; i++) {
      const date = new Date();
      date.setDate(date.getDate() + Math.floor(Math.random() * 7));
      events.push({
        id: `event_${i}`,
        title: eventTitles[i % eventTitles.length],
        description: `Important economic event for ${countries[i % countries.length]}`,
        country: countries[i % countries.length],
        currency: currencies[i % currencies.length],
        impact_level: impacts[i % impacts.length],
        event_date: date.toISOString().split('T')[0],
        event_time: `${Math.floor(Math.random() * 24).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
        previous_value: Math.random() * 100,
        forecast_value: Math.random() * 100,
        actual_value: Math.random() > 0.5 ? Math.random() * 100 : null,
        source: 'Mock Calendar'
      });
    }
    return events;
  },
  
  async getMarketSignals(options = {}) {
    const { limit = 10 } = options;
    const signals = [];
    const symbols = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'GOLD', 'OIL', 'BTC/USD'];
    const signalTypes = ['buy', 'sell', 'hold'];
    const timeframes = ['1H', '4H', '1D', '1W'];
    
    for (let i = 0; i < limit; i++) {
      signals.push({
        id: `signal_${i}`,
        symbol: symbols[i % symbols.length],
        signal_type: signalTypes[i % signalTypes.length],
        timeframe: timeframes[i % timeframes.length],
        strength: Math.floor(Math.random() * 10) + 1,
        confidence: Math.floor(Math.random() * 40) + 60,
        entry_price: Math.random() * 100 + 50,
        stop_loss: Math.random() * 100 + 40,
        take_profit: Math.random() * 100 + 60,
        description: `${signalTypes[i % signalTypes.length].toUpperCase()} signal for ${symbols[i % symbols.length]}`,
        source: 'Mock Signals',
        created_at: new Date().toISOString(),
        is_active: true
      });
    }
    return signals;
  },
  
  async getCommodities(options = {}) {
    const { limit = 15 } = options;
    const commodities = [];
    const commodityData = [
      { symbol: 'GOLD', name: 'Gold', category: 'Precious Metals', currency: 'USD', exchange: 'COMEX' },
      { symbol: 'SILVER', name: 'Silver', category: 'Precious Metals', currency: 'USD', exchange: 'COMEX' },
      { symbol: 'OIL', name: 'Crude Oil', category: 'Energy', currency: 'USD', exchange: 'NYMEX' },
      { symbol: 'NATGAS', name: 'Natural Gas', category: 'Energy', currency: 'USD', exchange: 'NYMEX' },
      { symbol: 'WHEAT', name: 'Wheat', category: 'Agriculture', currency: 'USD', exchange: 'CBOT' }
    ];
    
    for (let i = 0; i < Math.min(limit, commodityData.length * 3); i++) {
      const commodity = commodityData[i % commodityData.length];
      const basePrice = Math.random() * 1000 + 100;
      commodities.push({
        id: `commodity_${i}`,
        ...commodity,
        current_price: basePrice,
        change_percentage_24h: (Math.random() - 0.5) * 6,
        volume_24h: Math.floor(Math.random() * 1000000) + 100000,
        high_24h: basePrice * (1 + Math.random() * 0.05),
        low_24h: basePrice * (1 - Math.random() * 0.05),
        is_active: true,
        source: 'Mock Commodities'
      });
    }
    return commodities;
  }
};

class MarketDataWebSocketServer {
  constructor(port = 8080) {
    this.port = port;
    this.clients = new Map();
    this.subscriptions = new Map();
    this.updateIntervals = new Map();
    this.isRunning = false;
    
    // Initialize server
    this.server = http.createServer();
    this.wss = new WebSocket.Server({ server: this.server });
    
    this.setupWebSocketHandlers();
    this.setupUpdateIntervals();
  }

  setupWebSocketHandlers() {
    this.wss.on('connection', (ws, req) => {
      const clientId = this.generateClientId();
      console.log(`Client ${clientId} connected from ${req.socket.remoteAddress}`);
      
      // Store client info
      this.clients.set(clientId, {
        ws,
        subscriptions: new Set(),
        lastPing: Date.now(),
        isAlive: true
      });
      
      // Send welcome message
      this.sendToClient(clientId, {
        type: 'connection',
        status: 'connected',
        clientId,
        timestamp: new Date().toISOString()
      });
      
      // Handle messages
      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleClientMessage(clientId, message);
        } catch (error) {
          console.error(`Error parsing message from client ${clientId}:`, error);
          this.sendToClient(clientId, {
            type: 'error',
            message: 'Invalid JSON format'
          });
        }
      });
      
      // Handle ping/pong
      ws.on('pong', () => {
        const client = this.clients.get(clientId);
        if (client) {
          client.isAlive = true;
          client.lastPing = Date.now();
        }
      });
      
      // Handle disconnection
      ws.on('close', () => {
        console.log(`Client ${clientId} disconnected`);
        this.handleClientDisconnect(clientId);
      });
      
      // Handle errors
      ws.on('error', (error) => {
        console.error(`WebSocket error for client ${clientId}:`, error);
        this.handleClientDisconnect(clientId);
      });
    });
  }

  handleClientMessage(clientId, message) {
    const client = this.clients.get(clientId);
    if (!client) return;
    
    switch (message.type) {
      case 'subscribe':
        this.handleSubscribe(clientId, message.channels || []);
        break;
        
      case 'unsubscribe':
        this.handleUnsubscribe(clientId, message.channels || []);
        break;
        
      case 'ping':
        this.sendToClient(clientId, {
          type: 'pong',
          timestamp: new Date().toISOString()
        });
        break;
        
      case 'get_status':
        this.sendToClient(clientId, {
          type: 'status',
          subscriptions: Array.from(client.subscriptions),
          connectedClients: this.clients.size,
          uptime: process.uptime(),
          timestamp: new Date().toISOString()
        });
        break;
        
      default:
        this.sendToClient(clientId, {
          type: 'error',
          message: `Unknown message type: ${message.type}`
        });
    }
  }

  handleSubscribe(clientId, channels) {
    const client = this.clients.get(clientId);
    if (!client) return;
    
    const validChannels = ['currencies', 'economic_events', 'market_signals', 'commodities'];
    const subscribedChannels = [];
    
    channels.forEach(channel => {
      if (validChannels.includes(channel)) {
        client.subscriptions.add(channel);
        subscribedChannels.push(channel);
        
        // Add to global subscriptions
        if (!this.subscriptions.has(channel)) {
          this.subscriptions.set(channel, new Set());
        }
        this.subscriptions.get(channel).add(clientId);
      }
    });
    
    this.sendToClient(clientId, {
      type: 'subscribed',
      channels: subscribedChannels,
      timestamp: new Date().toISOString()
    });
    
    console.log(`Client ${clientId} subscribed to:`, subscribedChannels);
  }

  handleUnsubscribe(clientId, channels) {
    const client = this.clients.get(clientId);
    if (!client) return;
    
    const unsubscribedChannels = [];
    
    channels.forEach(channel => {
      if (client.subscriptions.has(channel)) {
        client.subscriptions.delete(channel);
        unsubscribedChannels.push(channel);
        
        // Remove from global subscriptions
        if (this.subscriptions.has(channel)) {
          this.subscriptions.get(channel).delete(clientId);
          if (this.subscriptions.get(channel).size === 0) {
            this.subscriptions.delete(channel);
          }
        }
      }
    });
    
    this.sendToClient(clientId, {
      type: 'unsubscribed',
      channels: unsubscribedChannels,
      timestamp: new Date().toISOString()
    });
    
    console.log(`Client ${clientId} unsubscribed from:`, unsubscribedChannels);
  }

  handleClientDisconnect(clientId) {
    const client = this.clients.get(clientId);
    if (!client) return;
    
    // Remove from all subscriptions
    client.subscriptions.forEach(channel => {
      if (this.subscriptions.has(channel)) {
        this.subscriptions.get(channel).delete(clientId);
        if (this.subscriptions.get(channel).size === 0) {
          this.subscriptions.delete(channel);
        }
      }
    });
    
    // Remove client
    this.clients.delete(clientId);
  }

  sendToClient(clientId, data) {
    const client = this.clients.get(clientId);
    if (!client || client.ws.readyState !== WebSocket.OPEN) return;
    
    try {
      client.ws.send(JSON.stringify(data));
    } catch (error) {
      console.error(`Error sending data to client ${clientId}:`, error);
      this.handleClientDisconnect(clientId);
    }
  }

  broadcastToChannel(channel, data) {
    const subscribers = this.subscriptions.get(channel);
    if (!subscribers) return;
    
    const message = {
      type: 'data',
      channel,
      data,
      timestamp: new Date().toISOString()
    };
    
    subscribers.forEach(clientId => {
      this.sendToClient(clientId, message);
    });
  }

  setupUpdateIntervals() {
    // Currency pairs - update every 5 seconds
    this.updateIntervals.set('currencies', setInterval(async () => {
      if (this.subscriptions.has('currencies')) {
        try {
          const currencies = await mockMarketDataService.getCurrencyPairs({ limit: 20 });
          this.broadcastToChannel('currencies', currencies);
        } catch (error) {
          console.error('Error fetching currencies:', error);
        }
      }
    }, 5000));
    
    // Economic events - update every 30 seconds
    this.updateIntervals.set('economic_events', setInterval(async () => {
      if (this.subscriptions.has('economic_events')) {
        try {
          const events = await mockMarketDataService.getEconomicEvents({ limit: 10 });
          this.broadcastToChannel('economic_events', events);
        } catch (error) {
          console.error('Error fetching economic events:', error);
        }
      }
    }, 30000));
    
    // Market signals - update every 15 seconds
    this.updateIntervals.set('market_signals', setInterval(async () => {
      if (this.subscriptions.has('market_signals')) {
        try {
          const signals = await mockMarketDataService.getMarketSignals({ limit: 10 });
          this.broadcastToChannel('market_signals', signals);
        } catch (error) {
          console.error('Error fetching market signals:', error);
        }
      }
    }, 15000));
    
    // Commodities - update every 10 seconds
    this.updateIntervals.set('commodities', setInterval(async () => {
      if (this.subscriptions.has('commodities')) {
        try {
          const commodities = await mockMarketDataService.getCommodities({ limit: 15 });
          this.broadcastToChannel('commodities', commodities);
        } catch (error) {
          console.error('Error fetching commodities:', error);
        }
      }
    }, 10000));
    
    // Ping clients every 30 seconds
    this.updateIntervals.set('ping', setInterval(() => {
      this.clients.forEach((client, clientId) => {
        if (client.ws.readyState === WebSocket.OPEN) {
          client.isAlive = false;
          client.ws.ping();
          
          // Check if client responded to previous ping
          if (Date.now() - client.lastPing > 60000) {
            console.log(`Client ${clientId} timeout, disconnecting`);
            client.ws.terminate();
            this.handleClientDisconnect(clientId);
          }
        } else {
          this.handleClientDisconnect(clientId);
        }
      });
    }, 30000));
  }

  generateClientId() {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  start() {
    return new Promise((resolve, reject) => {
      this.server.listen(this.port, (error) => {
        if (error) {
          reject(error);
          return;
        }
        
        this.isRunning = true;
        console.log(`Market Data WebSocket Server running on port ${this.port}`);
        console.log(`WebSocket URL: ws://localhost:${this.port}`);
        resolve();
      });
    });
  }

  stop() {
    return new Promise((resolve) => {
      // Clear all intervals
      this.updateIntervals.forEach((interval) => {
        clearInterval(interval);
      });
      this.updateIntervals.clear();
      
      // Close all client connections
      this.clients.forEach((client, clientId) => {
        client.ws.close(1000, 'Server shutting down');
      });
      this.clients.clear();
      this.subscriptions.clear();
      
      // Close server
      this.wss.close(() => {
        this.server.close(() => {
          this.isRunning = false;
          console.log('Market Data WebSocket Server stopped');
          resolve();
        });
      });
    });
  }

  getStats() {
    return {
      isRunning: this.isRunning,
      connectedClients: this.clients.size,
      activeSubscriptions: Object.fromEntries(
        Array.from(this.subscriptions.entries()).map(([channel, clients]) => [
          channel,
          clients.size
        ])
      ),
      uptime: process.uptime()
    };
  }
}

// Create and export server instance
const marketDataWS = new MarketDataWebSocketServer(8080);

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nReceived SIGINT, shutting down gracefully...');
  await marketDataWS.stop();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nReceived SIGTERM, shutting down gracefully...');
  await marketDataWS.stop();
  process.exit(0);
});

// Start server if this file is run directly
if (require.main === module) {
  marketDataWS.start().catch((error) => {
    console.error('Failed to start WebSocket server:', error);
    process.exit(1);
  });
}

module.exports = { MarketDataWebSocketServer, marketDataWS };
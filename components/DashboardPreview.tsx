import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, TrendingUp, AlertTriangle, Info, ExternalLink } from 'lucide-react';
import { DataService } from '@/lib/services/dataService';

interface Alert {
  id: string;
  broker: string;
  message: string;
  severity: 'info' | 'warning' | 'error';
  date: string;
}

interface WatchlistItem {
  id: string;
  broker_name: string;
  trust_score: number;
  status: string;
}

export const DashboardPreview: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await DataService.getDashboardData();
        
        // Sample alerts data until we have a real alerts system
        const sampleAlerts: Alert[] = [
          {
            id: '1',
            broker: 'TradePro Elite',
            message: 'Spread reduced on EUR/USD to 0.8 pips',
            severity: 'info',
            date: '2 hours ago'
          },
          {
            id: '2',
            broker: 'CryptoEdge Pro',
            message: 'New regulation compliance update',
            severity: 'warning',
            date: '1 day ago'
          },
          {
            id: '3',
            broker: 'ForexMaster',
            message: 'Platform maintenance scheduled',
            severity: 'info',
            date: '3 days ago'
          }
        ];
        
        // Sample watchlist data
        const sampleWatchlist: WatchlistItem[] = [
          {
            id: '1',
            broker_name: 'TradePro Elite',
            trust_score: 91,
            status: 'No changes'
          },
          {
            id: '2',
            broker_name: 'CryptoEdge Pro',
            trust_score: 88,
            status: 'Spread alert'
          }
        ];
        
        setAlerts(sampleAlerts);
        setWatchlist(sampleWatchlist);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Set fallback data
        setAlerts([]);
        setWatchlist([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default: return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'warning': return 'alert-warning';
      case 'error': return 'bg-red-500/10 border border-red-500/20 text-red-400';
      default: return 'alert-info';
    }
  };

  return (
    <section className="section-spacing relative overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full glass-card mb-6">
            <Bell className="w-4 h-4 mr-2 text-white/80" />
            <span className="text-sm text-white/80">Dashboard Preview</span>
          </div>
          <h2 className="text-heading-lg text-white mb-4">
            Stay Informed with Real-Time Alerts
          </h2>
          <p className="text-body text-white/70 max-w-2xl mx-auto">
            Monitor your watched brokers and get notified of important changes
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Alerts Preview */}
            <Card className="modern-card border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Recent Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading ? (
                    // Loading skeleton
                    Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="p-3 rounded-lg bg-white/5 border border-white/10 animate-pulse">
                        <div className="flex items-start space-x-3">
                          <div className="w-4 h-4 bg-white/20 rounded"></div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <div className="w-20 h-4 bg-white/20 rounded"></div>
                              <div className="w-16 h-3 bg-white/20 rounded"></div>
                            </div>
                            <div className="w-full h-3 bg-white/20 rounded"></div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    alerts.map((alert) => (
                      <div key={alert.id} className={`p-3 rounded-lg ${getAlertColor(alert.severity)}`}>
                        <div className="flex items-start space-x-3">
                          {getAlertIcon(alert.severity)}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-sm">{alert.broker}</span>
                              <span className="text-xs opacity-80">{alert.date}</span>
                            </div>
                            <p className="text-sm opacity-90">{alert.message}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                <Button className="w-full mt-4 cta-secondary">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Dashboard
                </Button>
              </CardContent>
            </Card>

            {/* Watchlist Preview */}
            <Card className="modern-card border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Your Watchlist
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading ? (
                    // Loading skeleton
                    Array.from({ length: 2 }).map((_, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 animate-pulse">
                        <div>
                          <div className="w-24 h-4 bg-white/20 rounded mb-2"></div>
                          <div className="w-32 h-3 bg-white/20 rounded"></div>
                        </div>
                        <div className="w-8 h-6 bg-white/20 rounded"></div>
                      </div>
                    ))
                  ) : (
                    watchlist.map((item) => {
                      const getTrustScoreClass = (score: number) => {
                        if (score >= 90) return 'trust-score-excellent';
                        if (score >= 80) return 'trust-score-good';
                        if (score >= 70) return 'trust-score-fair';
                        return 'trust-score-poor';
                      };
                      
                      return (
                        <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                          <div>
                            <div className="text-white font-medium">{item.broker_name}</div>
                            <div className="text-white/60 text-sm">Trust Score: {item.trust_score} • {item.status}</div>
                          </div>
                          <Badge className={getTrustScoreClass(item.trust_score)}>{item.trust_score}</Badge>
                        </div>
                      );
                    })
                  )}
                  
                  <div className="text-center py-4">
                    <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
                      + Add Broker to Watch
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Features Overview */}
          <Card className="modern-card border-white/10 mt-8">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h3 className="text-white text-xl font-semibold mb-2">
                  Full Dashboard Features
                </h3>
                <p className="text-white/70">
                  Get comprehensive monitoring and analytics for your broker selection
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center mx-auto mb-3">
                    <Bell className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-white font-medium mb-2">Custom Alerts</h4>
                  <p className="text-white/60 text-sm">Set up alerts for spread changes, regulatory updates, and more</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full gradient-secondary flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-white font-medium mb-2">Performance Tracking</h4>
                  <p className="text-white/60 text-sm">Monitor broker performance metrics over time</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full gradient-accent flex items-center justify-center mx-auto mb-3">
                    <ExternalLink className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-white font-medium mb-2">Export & API</h4>
                  <p className="text-white/60 text-sm">Export data and integrate with your trading tools</p>
                </div>
              </div>
              
              <div className="text-center">
                <Button className="cta-primary">
                  Get Full Dashboard Access
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;
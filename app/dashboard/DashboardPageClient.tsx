'use client';

import React, { useState, useEffect } from 'react';
import { 
  Star, 
  TrendingUp, 
  Clock, 
  BarChart3, 
  Settings, 
  Bell, 
  Heart, 
  GitCompare, 
  Eye,
  Filter,
  Download,
  Plus,
  X
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SavedBroker {
  id: string;
  name: string;
  logo: string;
  trustScore: number;
  rating: number;
  savedDate: Date;
  category: string;
  minDeposit: number;
  spread: string;
  leverage: string;
}

interface ComparisonHistory {
  id: string;
  brokers: string[];
  date: Date;
  title: string;
}

interface Recommendation {
  id: string;
  brokerName: string;
  reason: string;
  matchScore: number;
  category: string;
  logo: string;
}

interface DashboardStats {
  totalSaved: number;
  totalComparisons: number;
  avgTrustScore: number;
  lastActivity: Date;
}

export default function DashboardPageClient() {
  const [activeTab, setActiveTab] = useState<'overview' | 'saved' | 'history' | 'recommendations'>('overview');
  const [savedBrokers, setSavedBrokers] = useState<SavedBroker[]>([]);
  const [comparisonHistory, setComparisonHistory] = useState<ComparisonHistory[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading dashboard data
    const loadDashboardData = async () => {
      setIsLoading(true);
      
      // Mock data - replace with actual API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockSavedBrokers: SavedBroker[] = [
        {
          id: '1',
          name: 'IC Markets',
          logo: '/logos/ic-markets.png',
          trustScore: 95,
          rating: 4.8,
          savedDate: new Date('2024-01-15'),
          category: 'Forex',
          minDeposit: 200,
          spread: '0.0 pips',
          leverage: '1:500'
        },
        {
          id: '2',
          name: 'Pepperstone',
          logo: '/logos/pepperstone.png',
          trustScore: 92,
          rating: 4.7,
          savedDate: new Date('2024-01-10'),
          category: 'CFD',
          minDeposit: 200,
          spread: '0.1 pips',
          leverage: '1:400'
        },
        {
          id: '3',
          name: 'XM Group',
          logo: '/logos/xm.png',
          trustScore: 88,
          rating: 4.5,
          savedDate: new Date('2024-01-08'),
          category: 'Forex',
          minDeposit: 5,
          spread: '1.0 pips',
          leverage: '1:888'
        }
      ];

      const mockComparisonHistory: ComparisonHistory[] = [
        {
          id: '1',
          brokers: ['IC Markets', 'Pepperstone'],
          date: new Date('2024-01-20'),
          title: 'IC Markets vs Pepperstone'
        },
        {
          id: '2',
          brokers: ['XM Group', 'FXCM', 'IG'],
          date: new Date('2024-01-18'),
          title: 'Multi-Broker Comparison'
        },
        {
          id: '3',
          brokers: ['Pepperstone', 'FP Markets'],
          date: new Date('2024-01-15'),
          title: 'Pepperstone vs FP Markets'
        }
      ];

      const mockRecommendations: Recommendation[] = [
        {
          id: '1',
          brokerName: 'FP Markets',
          reason: 'Based on your preference for low spreads and forex trading',
          matchScore: 94,
          category: 'Forex',
          logo: '/logos/fp-markets.png'
        },
        {
          id: '2',
          brokerName: 'Exness',
          reason: 'High leverage options matching your trading style',
          matchScore: 89,
          category: 'CFD',
          logo: '/logos/exness.png'
        },
        {
          id: '3',
          brokerName: 'OANDA',
          reason: 'Excellent for algorithmic trading and API access',
          matchScore: 87,
          category: 'Forex',
          logo: '/logos/oanda.png'
        }
      ];

      const mockStats: DashboardStats = {
        totalSaved: mockSavedBrokers.length,
        totalComparisons: mockComparisonHistory.length,
        avgTrustScore: Math.round(mockSavedBrokers.reduce((sum, broker) => sum + broker.trustScore, 0) / mockSavedBrokers.length),
        lastActivity: new Date('2024-01-20')
      };

      setSavedBrokers(mockSavedBrokers);
      setComparisonHistory(mockComparisonHistory);
      setRecommendations(mockRecommendations);
      setStats(mockStats);
      setIsLoading(false);
    };

    loadDashboardData();
  }, []);

  const removeSavedBroker = (brokerId: string) => {
    setSavedBrokers(prev => prev.filter(broker => broker.id !== brokerId));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your broker preferences and trading insights</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Saved Brokers</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalSaved}</p>
                </div>
                <Heart className="w-8 h-8 text-red-500" />
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Comparisons</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalComparisons}</p>
                </div>
                <GitCompare className="w-8 h-8 text-blue-500" />
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Trust Score</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.avgTrustScore}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-green-500" />
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Last Activity</p>
                  <p className="text-lg font-semibold text-gray-900">{formatDate(stats.lastActivity)}</p>
                </div>
                <Clock className="w-8 h-8 text-purple-500" />
              </div>
            </Card>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8 w-fit">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'saved', label: 'Saved Brokers', icon: Heart },
            { id: 'history', label: 'Comparison History', icon: GitCompare },
            { id: 'recommendations', label: 'Recommendations', icon: TrendingUp }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {comparisonHistory.slice(0, 3).map((comparison) => (
                  <div key={comparison.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div>
                      <p className="font-medium text-gray-900">{comparison.title}</p>
                      <p className="text-sm text-gray-600">{formatDate(comparison.date)}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Top Recommendations */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Top Recommendations</h3>
              <div className="space-y-4">
                {recommendations.slice(0, 3).map((rec) => (
                  <div key={rec.id} className="flex items-start space-x-3 py-2">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{rec.brokerName}</p>
                      <p className="text-sm text-gray-600">{rec.reason}</p>
                      <div className="flex items-center mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {rec.matchScore}% match
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'saved' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Saved Brokers ({savedBrokers.length})</h3>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedBrokers.map((broker) => (
                <Card key={broker.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-lg font-bold text-gray-600">
                          {broker.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{broker.name}</h4>
                        <Badge variant="secondary" className="text-xs">{broker.category}</Badge>
                      </div>
                    </div>
                    <button
                      onClick={() => removeSavedBroker(broker.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Trust Score</span>
                      <span className="font-semibold text-green-600">{broker.trustScore}/100</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Rating</span>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm font-medium">{broker.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Min Deposit</span>
                      <span className="text-sm font-medium">${broker.minDeposit}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Details
                    </Button>
                    <Button size="sm" className="flex-1">
                      Compare
                    </Button>
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-3">
                    Saved on {formatDate(broker.savedDate)}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Comparison History ({comparisonHistory.length})</h3>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export History
              </Button>
            </div>
            
            <div className="space-y-4">
              {comparisonHistory.map((comparison) => (
                <Card key={comparison.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{comparison.title}</h4>
                      <div className="flex items-center space-x-2 mb-2">
                        {comparison.brokers.map((broker, index) => (
                          <React.Fragment key={broker}>
                            <Badge variant="outline">{broker}</Badge>
                            {index < comparison.brokers.length - 1 && (
                              <span className="text-gray-400">vs</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600">{formatDate(comparison.date)}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <GitCompare className="w-4 h-4 mr-2" />
                        Re-compare
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Personalized Recommendations</h3>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Get New Recommendations
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendations.map((rec) => (
                <Card key={rec.id} className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-xl font-bold text-gray-600">
                        {rec.brokerName.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{rec.brokerName}</h4>
                        <Badge className="bg-green-100 text-green-800">
                          {rec.matchScore}% match
                        </Badge>
                      </div>
                      <Badge variant="secondary" className="text-xs mb-3">{rec.category}</Badge>
                      <p className="text-sm text-gray-600 mb-4">{rec.reason}</p>
                      <div className="flex space-x-2">
                        <Button size="sm" className="flex-1">
                          View Broker
                        </Button>
                        <Button variant="outline" size="sm">
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
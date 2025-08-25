'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  TrendingUp, 
  Zap, 
  Shield, 
  Clock, 
  DollarSign, 
  Star,
  Filter,
  ArrowUpDown,
  ExternalLink,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'
import { BrokerService, formatBrokerForDisplay } from '@/lib/services/brokerService'
import { Broker } from '@/lib/supabase'

// Fallback mock data for scalping brokers - used when database is unavailable
const fallbackScalpingBrokers = [
  {
    id: 1,
    name: 'IC Markets',
    logo: '/brokers/ic-markets.png',
    trustScore: 95,
    regulation: ['ASIC', 'CySEC', 'FSA'],
    spreads: {
      eurusd: 0.0,
      gbpusd: 0.1,
      usdjpy: 0.1,
      usdchf: 0.2
    },
    commission: 3.5,
    executionSpeed: 12,
    minDeposit: 200,
    leverage: 500,
    scalpingAllowed: true,
    eaAllowed: true,
    accountTypes: ['Raw Spread', 'Standard'],
    platforms: ['MetaTrader 4', 'MetaTrader 5', 'cTrader'],
    pros: [
      'Ultra-low spreads from 0.0 pips',
      'Lightning-fast execution (12ms avg)',
      'No restrictions on scalping',
      'Multiple regulatory licenses'
    ],
    cons: [
      'Commission-based pricing',
      'Higher minimum deposit for Raw Spread'
    ],
    rating: 4.8,
    reviews: 2847
  },
  {
    id: 2,
    name: 'Pepperstone',
    logo: '/brokers/pepperstone.png',
    trustScore: 92,
    regulation: ['ASIC', 'CySEC', 'FCA', 'DFSA'],
    spreads: {
      eurusd: 0.0,
      gbpusd: 0.1,
      usdjpy: 0.1,
      usdchf: 0.2
    },
    commission: 3.5,
    executionSpeed: 15,
    minDeposit: 200,
    leverage: 400,
    scalpingAllowed: true,
    eaAllowed: true,
    accountTypes: ['Razor', 'Standard'],
    platforms: ['MetaTrader 4', 'MetaTrader 5', 'cTrader', 'TradingView'],
    pros: [
      'Excellent execution speeds',
      'Strong regulatory framework',
      'Advanced trading platforms',
      'Competitive spreads'
    ],
    cons: [
      'Limited educational resources',
      'No proprietary platform'
    ],
    rating: 4.7,
    reviews: 1923
  },
  {
    id: 3,
    name: 'FP Markets',
    logo: '/brokers/fp-markets.png',
    trustScore: 89,
    regulation: ['ASIC', 'CySEC'],
    spreads: {
      eurusd: 0.0,
      gbpusd: 0.1,
      usdjpy: 0.2,
      usdchf: 0.3
    },
    commission: 3.0,
    executionSpeed: 18,
    minDeposit: 100,
    leverage: 500,
    scalpingAllowed: true,
    eaAllowed: true,
    accountTypes: ['Raw', 'Standard'],
    platforms: ['MetaTrader 4', 'MetaTrader 5', 'IRESS'],
    pros: [
      'Low commission rates',
      'Good customer support',
      'Multiple account options',
      'Competitive spreads'
    ],
    cons: [
      'Limited platform options',
      'Fewer regulatory licenses'
    ],
    rating: 4.5,
    reviews: 1456
  },
  {
    id: 4,
    name: 'Blueberry Markets',
    logo: '/brokers/blueberry-markets.png',
    trustScore: 87,
    regulation: ['ASIC'],
    spreads: {
      eurusd: 0.0,
      gbpusd: 0.2,
      usdjpy: 0.2,
      usdchf: 0.3
    },
    commission: 2.25,
    executionSpeed: 20,
    minDeposit: 100,
    leverage: 500,
    scalpingAllowed: true,
    eaAllowed: true,
    accountTypes: ['ECN', 'Standard'],
    platforms: ['MetaTrader 4', 'MetaTrader 5'],
    pros: [
      'Very low commission rates',
      'No minimum deposit restrictions',
      'Good scalping conditions',
      'Transparent pricing'
    ],
    cons: [
      'Single regulatory license',
      'Limited platform variety'
    ],
    rating: 4.4,
    reviews: 892
  }
]

interface ScalpingBrokersClientProps {}

export default function ScalpingBrokersClient({}: ScalpingBrokersClientProps) {
  const [brokers, setBrokers] = useState<Broker[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'trustScore' | 'spreads' | 'execution' | 'commission'>('trustScore')
  const [filterMinDeposit, setFilterMinDeposit] = useState<number>(0)
  const [selectedBrokers, setSelectedBrokers] = useState<string[]>([])
  const [showComparison, setShowComparison] = useState(false)

  useEffect(() => {
    const fetchScalpingBrokers = async () => {
      try {
        setLoading(true)
        const scalpingBrokers = await BrokerService.getScalpingBrokers(10)
        
        if (scalpingBrokers && scalpingBrokers.length > 0) {
          setBrokers(scalpingBrokers)
        } else {
          // Use fallback data if no brokers found
          console.log('No scalping brokers found in database, using fallback data')
          setBrokers(fallbackScalpingBrokers as any[])
        }
      } catch (error) {
        console.error('Error fetching scalping brokers:', error)
        // Fallback to mock data if database fails
        setBrokers(fallbackScalpingBrokers as any[])
      } finally {
        setLoading(false)
      }
    }

    fetchScalpingBrokers()
  }, [])

  // Helper functions to handle both cleaned and original data structures
  const getBrokerTrustScore = (broker: any) => {
    return broker.trustScore || broker.trust_score || 0
  }

  const getBrokerSpread = (broker: any) => {
    return broker.spreads?.['EUR/USD'] || broker.spreads_info?.EURUSD || broker.spreads?.eurusd || broker.spreads?.EURUSD || 999
  }

  const getBrokerRating = (broker: any) => {
    return broker.rating || broker.overall_rating || 0
  }

  const getBrokerMinDeposit = (broker: any) => {
    return broker.minDeposit || broker.minimum_deposit || 0
  }

  const getBrokerExecutionSpeed = (broker: any) => {
    return broker.executionSpeed ?? broker.execution_speed_ms ?? broker.execution ?? null
  }

  const getBrokerCommission = (broker: any) => {
    return broker.commission ?? broker.commissions?.per_lot ?? broker.commissions?.perLot ?? broker.commissions?.standard ?? null
  }

  const getBrokerReviewsCount = (broker: any) => {
    return broker.user_reviews_count ?? broker.reviews ?? null
  }

  const getBrokerRegulationList = (broker: any): string[] => {
    return broker.regulation ?? broker.regulatory_bodies ?? broker.regulation_info ?? []
  }

  const sortedBrokers = [...brokers].sort((a, b) => {
    switch (sortBy) {
      case 'trustScore':
        return getBrokerTrustScore(b) - getBrokerTrustScore(a)
      case 'spreads':
        return getBrokerSpread(a) - getBrokerSpread(b)
      case 'execution':
        return getBrokerRating(b) - getBrokerRating(a)
      case 'commission':
        return getBrokerTrustScore(b) - getBrokerTrustScore(a)
      default:
        return 0
    }
  }).filter(broker => getBrokerMinDeposit(broker) >= filterMinDeposit)

  const toggleBrokerSelection = (brokerId: string) => {
    setSelectedBrokers(prev => 
      prev.includes(brokerId) 
        ? prev.filter(id => id !== brokerId)
        : [...prev, brokerId].slice(0, 3) // Max 3 brokers for comparison
    )
  }

  const getSelectedBrokers = () => {
    return brokers.filter(broker => selectedBrokers.includes(broker.id))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">Loading scalping brokers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">
          Best Scalping Brokers Comparison 2025
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Compare the top scalping brokers with ultra-low spreads, lightning-fast execution, 
          and optimal conditions for high-frequency trading strategies.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <Zap className="w-3 h-3 mr-1" />
            Fast Execution
          </Badge>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <DollarSign className="w-3 h-3 mr-1" />
            Low Spreads
          </Badge>
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            <Shield className="w-3 h-3 mr-1" />
            Regulated
          </Badge>
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            <TrendingUp className="w-3 h-3 mr-1" />
            Scalping Friendly
          </Badge>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white">
          <CardContent className="p-6 text-center">
            <Zap className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
            <h3 className="font-semibold text-gray-900">Avg Execution</h3>
            <p className="text-2xl font-bold text-blue-600">16ms</p>
            <p className="text-sm text-gray-600">Lightning fast</p>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="p-6 text-center">
            <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <h3 className="font-semibold text-gray-900">Min Spreads</h3>
            <p className="text-2xl font-bold text-green-600">0.0</p>
            <p className="text-sm text-gray-600">pips on EUR/USD</p>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="p-6 text-center">
            <Shield className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <h3 className="font-semibold text-gray-900">Regulated</h3>
            <p className="text-2xl font-bold text-blue-600">100%</p>
            <p className="text-sm text-gray-600">All brokers</p>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <h3 className="font-semibold text-gray-900">Scalping</h3>
            <p className="text-2xl font-bold text-purple-600">Allowed</p>
            <p className="text-sm text-gray-600">No restrictions</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Sorting */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Filter className="w-5 h-5" />
            Filter & Sort Brokers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="sortBy" className="text-gray-700">Sort by:</Label>
              <select 
                id="sortBy"
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as any)}
                className="border rounded px-3 py-1 text-gray-900 bg-white"
              >
                <option value="trustScore">Trust Score</option>
                <option value="spreads">Lowest Spreads</option>
                <option value="execution">Fastest Execution</option>
                <option value="commission">Lowest Commission</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="minDeposit" className="text-gray-700">Min Deposit:</Label>
              <Input
                id="minDeposit"
                type="number"
                value={filterMinDeposit}
                onChange={(e) => setFilterMinDeposit(Number(e.target.value))}
                className="w-24 text-gray-900"
                placeholder="0"
              />
            </div>
            {selectedBrokers.length > 0 && (
              <Button 
                onClick={() => setShowComparison(!showComparison)}
                variant="outline"
                className="ml-auto"
              >
                Compare Selected ({selectedBrokers.length})
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Comparison Table */}
      {showComparison && selectedBrokers.length > 0 && (
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-gray-900">Broker Comparison</CardTitle>
            <CardDescription className="text-gray-600">
              Side-by-side comparison of selected scalping brokers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left p-3 font-semibold text-gray-900">Feature</th>
                    {getSelectedBrokers().map(broker => (
                      <th key={broker.id} className="text-center p-3 font-semibold text-gray-900">
                        {broker.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="p-3 font-medium text-gray-900">Trust Score</td>
                    {getSelectedBrokers().map(broker => (
                      <td key={broker.id} className="text-center p-3">
                        <Badge variant={getBrokerTrustScore(broker) >= 90 ? 'default' : 'secondary'}>
                          {getBrokerTrustScore(broker)}/100
                        </Badge>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-3 font-medium text-gray-900">EUR/USD Spread</td>
                    {getSelectedBrokers().map(broker => (
                      <td key={broker.id} className="text-center p-3 text-gray-900">
                        {getBrokerSpread(broker)} pips
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-3 font-medium text-gray-900">Execution Speed</td>
                    {getSelectedBrokers().map(broker => (
                      <td key={broker.id} className="text-center p-3 text-gray-900">
                        {getBrokerExecutionSpeed(broker) ?? 'N/A'}ms
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-3 font-medium text-gray-900">Commission</td>
                    {getSelectedBrokers().map(broker => (
                      <td key={broker.id} className="text-center p-3 text-gray-900">
                        ${getBrokerCommission(broker) ?? 'N/A'}/lot
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-3 font-medium text-gray-900">Min Deposit</td>
                    {getSelectedBrokers().map(broker => (
                      <td key={broker.id} className="text-center p-3 text-gray-900">
                        ${getBrokerMinDeposit(broker)}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Broker Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sortedBrokers.map((broker) => (
          <Card key={broker.id} className="bg-white hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="font-bold text-lg">{broker.name.charAt(0)}</span>
                  </div>
                  <div>
                    <CardTitle className="text-xl">{broker.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={getBrokerTrustScore(broker) >= 90 ? 'default' : 'secondary'}>
                        Trust Score: {getBrokerTrustScore(broker)}/100
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{getBrokerRating(broker)}</span>
                        <span className="text-sm text-gray-500">({getBrokerReviewsCount(broker) || 'N/A'})</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  variant={selectedBrokers.includes(broker.id) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleBrokerSelection(broker.id)}
                  disabled={!selectedBrokers.includes(broker.id) && selectedBrokers.length >= 3}
                >
                  {selectedBrokers.includes(broker.id) ? 'Selected' : 'Compare'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-sm text-gray-500">EUR/USD Spread</div>
                  <div className="font-bold text-green-600">{getBrokerSpread(broker)} pips</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">Execution</div>
                  <div className="font-bold text-blue-600">{getBrokerExecutionSpeed(broker) ?? 'N/A'}ms</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">Commission</div>
                  <div className="font-bold text-purple-600">${getBrokerCommission(broker) ?? 'N/A'}/lot</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">Min Deposit</div>
                  <div className="font-bold text-orange-600">${getBrokerMinDeposit(broker)}</div>
                </div>
              </div>

              {/* Regulation */}
              <div>
                <div className="text-sm font-medium text-gray-900 mb-2">Regulation:</div>
                <div className="flex flex-wrap gap-1">
                  {getBrokerRegulationList(broker).map((reg, index) => (
                    <Badge key={index} variant="outline" className="text-xs text-gray-700">
                      {reg}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Pros and Cons */}
              <Tabs defaultValue="pros" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="pros">Pros</TabsTrigger>
                  <TabsTrigger value="cons">Cons</TabsTrigger>
                </TabsList>
                <TabsContent value="pros" className="space-y-2">
                  {(broker.pros || []).map((pro, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-900">{pro}</span>
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="cons" className="space-y-2">
                  {(broker.cons || []).map((con, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-900">{con}</span>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Button className="flex-1">
                  Open Account
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="outline" className="flex-1">
                  Read Review
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Educational Content */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-gray-900">Scalping Trading Guide</CardTitle>
          <CardDescription className="text-gray-600">
            Essential information for successful scalping strategies
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-3 text-gray-900">What is Scalping?</h3>
              <p className="text-gray-700 mb-4">
                Scalping is a high-frequency trading strategy that involves making numerous trades 
                to profit from small price movements. Scalpers typically hold positions for seconds 
                to minutes, aiming to capture small profits repeatedly.
              </p>
              <h4 className="font-medium mb-2 text-gray-900">Key Requirements:</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Ultra-low spreads (0-1 pip)</li>
                <li>• Fast execution speeds (under 50ms)</li>
                <li>• Minimal slippage</li>
                <li>• No scalping restrictions</li>
                <li>• Reliable platform stability</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3 text-gray-900">Choosing a Scalping Broker</h3>
              <p className="text-gray-700 mb-4">
                The right broker can make or break your scalping strategy. Focus on execution 
                quality, cost structure, and platform reliability rather than just marketing claims.
              </p>
              <h4 className="font-medium mb-2 text-gray-900">Essential Features:</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• ECN/STP execution model</li>
                <li>• Commission-based pricing</li>
                <li>• Level II pricing data</li>
                <li>• Advanced order types</li>
                <li>• Strong regulatory oversight</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}
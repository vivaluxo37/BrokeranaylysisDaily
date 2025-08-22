import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ExternalLink, Database } from 'lucide-react';
import { DataService } from '@/lib/services/dataService';

interface EvidenceResult {
  id: string;
  title: string;
  excerpt: string;
  source: string;
  url: string;
  date: string;
  type: 'review' | 'report' | 'article';
}

export const SearchEvidence: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<EvidenceResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    
    try {
      // Sample evidence results for Brokeranalysis
      const sampleResults: EvidenceResult[] = [
        {
          id: '1',
          title: 'CFTC Regulatory Filing - XM Global Limited',
          excerpt: 'Comprehensive regulatory analysis of XM Global Limited showing compliance with CFTC regulations and customer fund segregation practices.',
          source: 'CFTC Official Records',
          url: 'https://cftc.gov/filings/xm-global-2024',
          date: '2024-01-15',
          type: 'report'
        },
        {
          id: '2',
          title: 'Independent Review: IG Markets Trading Conditions',
          excerpt: 'Detailed analysis of IG Markets spread competitiveness, execution quality, and customer service based on 6-month trading data.',
          source: 'Brokeranalysis Research Team',
          url: '/reviews/ig-markets-detailed-analysis',
          date: '2024-01-10',
          type: 'review'
        },
        {
          id: '3',
          title: 'FCA Warning Notice - Unauthorized Broker Operations',
          excerpt: 'Financial Conduct Authority issues warning about unauthorized forex broker operations targeting UK residents.',
          source: 'FCA Official Notices',
          url: 'https://fca.org.uk/warnings/unauthorized-brokers-2024',
          date: '2024-01-08',
          type: 'report'
        },
        {
          id: '4',
          title: 'Market Analysis: EUR/USD Spread Comparison Across 15 Brokers',
          excerpt: 'Comprehensive spread analysis showing real-time EUR/USD spreads across major forex brokers during London and New York sessions.',
          source: 'Brokeranalysis Market Data',
          url: '/research/eurusd-spread-analysis-2024',
          date: '2024-01-05',
          type: 'article'
        },
        {
          id: '5',
          title: 'Customer Complaint Analysis - OANDA Corporation',
          excerpt: 'Analysis of customer complaints filed with NFA regarding OANDA Corporation, including resolution rates and common issues.',
          source: 'NFA Customer Complaints Database',
          url: 'https://nfa.futures.org/complaints/oanda-2024',
          date: '2024-01-03',
          type: 'report'
        },
        {
          id: '6',
          title: 'Trading Platform Performance Review: MetaTrader 5 vs cTrader',
          excerpt: 'Performance comparison of MT5 and cTrader platforms including execution speed, slippage analysis, and feature comparison.',
          source: 'Brokeranalysis Technical Team',
          url: '/reviews/mt5-vs-ctrader-performance',
          date: '2023-12-28',
          type: 'review'
        }
      ];
      
      // Filter results based on query (simple text matching)
      const filteredResults = sampleResults.filter(result => 
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.excerpt.toLowerCase().includes(query.toLowerCase()) ||
        result.source.toLowerCase().includes(query.toLowerCase())
      );
      
      setResults(filteredResults);
    } catch (error) {
      console.error('Error searching evidence:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };}]}}}

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'review': return 'bg-blue-500/20 text-blue-400';
      case 'report': return 'bg-green-500/20 text-green-400';
      case 'article': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <section className="section-spacing relative overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full glass-card mb-6">
            <Database className="w-4 h-4 mr-2 text-white/80" />
            <span className="text-sm text-white/80">Evidence Database</span>
          </div>
          <h2 className="text-heading-lg text-white mb-4">
            Search Our Evidence Database
          </h2>
          <p className="text-body text-white/70 max-w-2xl mx-auto">
            Access thousands of verified reviews, regulatory filings, and market reports
          </p>
        </div>

        {/* Search Interface */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for broker reviews, reports, or regulatory information..."
                className="form-input pl-10"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button 
              onClick={handleSearch}
              disabled={!query.trim() || isLoading}
              className="cta-primary"
            >
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white text-xl font-semibold">
                Search Results ({results.length})
              </h3>
              <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
                <ExternalLink className="w-4 h-4 mr-2" />
                API Access
              </Button>
            </div>

            {results.map((result) => (
              <Card key={result.id} className="modern-card border-white/10">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-white font-semibold text-lg mb-2">
                          {result.title}
                        </h4>
                        <p className="text-white/80 text-sm leading-relaxed mb-3">
                          {result.excerpt}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(result.type)}`}>
                        {result.type}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <div className="text-white/60 text-sm">
                        {result.source} • {result.date}
                      </div>
                      <a 
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 inline-flex items-center text-sm"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        View Source
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {query && results.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Database className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-white text-lg font-semibold mb-2">No results found</h3>
            <p className="text-white/60">Try different keywords or browse our API documentation</p>
          </div>
        )}

        {/* CTA for Developers */}
        <div className="text-center mt-12">
          <div className="glass-card p-8 rounded-2xl max-w-2xl mx-auto">
            <h3 className="text-white text-xl font-semibold mb-3">
              Need programmatic access?
            </h3>
            <p className="text-white/70 mb-6">
              Get real-time access to our complete evidence database via API
            </p>
            <Button className="cta-primary">
              <ExternalLink className="w-4 h-4 mr-2" />
              Explore API Documentation
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchEvidence;
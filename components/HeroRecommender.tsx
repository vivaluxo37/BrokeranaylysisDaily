import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, ExternalLink, ShieldCheck } from 'lucide-react';
import { 
  TradingStrategy, 
  CapitalRange, 
  Instrument, 
  LatencyNeed,
  formatTradingStrategy,
  formatCapitalRange,
  formatInstrument,
  formatLatencyNeed,
  mockQuery
} from '@/app/brokerAnalysisHomepageMockData';

interface HeroRecommenderProps {
  onResultsGenerated?: (results: any[]) => void;
}

export const HeroRecommender: React.FC<HeroRecommenderProps> = ({ onResultsGenerated }) => {
  const [formData, setFormData] = useState({
    strategy: null as TradingStrategy | null,
    capitalRange: null as CapitalRange | null,
    instruments: [] as Instrument[],
    latencyNeed: null as LatencyNeed | null,
    country: 'US'
  });

  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInstrumentChange = (instrument: Instrument, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      instruments: checked 
        ? [...prev.instruments, instrument]
        : prev.instruments.filter(i => i !== instrument)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.strategy || !formData.capitalRange || formData.instruments.length === 0 || !formData.latencyNeed) {
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockResults = mockQuery.recommendResults;
      setResults(mockResults);
      setIsLoading(false);
      onResultsGenerated?.(mockResults);
    }, 1500);
  };

  const isFormValid = formData.strategy && formData.capitalRange && formData.instruments.length > 0 && formData.latencyNeed;

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Recommender Form */}
      <Card className="glass-card border-white/20 mb-8">
        <CardHeader className="text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full glass-card mb-4 mx-auto">
            <Bot className="w-4 h-4 mr-2 text-white/80" />
            <span className="text-sm text-white/80">3-Step AI Recommender</span>
          </div>
          <CardTitle className="text-white text-2xl">Get Your Personalized Match</CardTitle>
          <p className="text-white/70">Answer 3 questions to get evidence-backed broker recommendations</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Trading Strategy */}
              <div className="form-field-group">
                <Label className="form-label">Trading Strategy *</Label>
                <Select value={formData.strategy || ''} onValueChange={(value) => setFormData(prev => ({ ...prev, strategy: value as TradingStrategy }))}>
                  <SelectTrigger className="form-input">
                    <SelectValue placeholder="Select your strategy" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-white/20">
                    {Object.values(TradingStrategy).map((strategy) => (
                      <SelectItem key={strategy} value={strategy} className="text-white hover:bg-white/10">
                        {formatTradingStrategy(strategy)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Capital Range */}
              <div className="form-field-group">
                <Label className="form-label">Capital Range *</Label>
                <Select value={formData.capitalRange || ''} onValueChange={(value) => setFormData(prev => ({ ...prev, capitalRange: value as CapitalRange }))}>
                  <SelectTrigger className="form-input">
                    <SelectValue placeholder="Select your capital range" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-white/20">
                    {Object.values(CapitalRange).map((range) => (
                      <SelectItem key={range} value={range} className="text-white hover:bg-white/10">
                        {formatCapitalRange(range)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Latency Need */}
              <div className="form-field-group">
                <Label className="form-label">Latency Requirement *</Label>
                <Select value={formData.latencyNeed || ''} onValueChange={(value) => setFormData(prev => ({ ...prev, latencyNeed: value as LatencyNeed }))}>
                  <SelectTrigger className="form-input">
                    <SelectValue placeholder="Select latency need" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-white/20">
                    {Object.values(LatencyNeed).map((latency) => (
                      <SelectItem key={latency} value={latency} className="text-white hover:bg-white/10">
                        {formatLatencyNeed(latency)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Country */}
              <div className="form-field-group">
                <Label className="form-label">Country</Label>
                <Input 
                  value={formData.country}
                  onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                  className="form-input"
                  placeholder="Auto-detected: US"
                />
              </div>
            </div>

            {/* Instruments Multi-select */}
            <div className="form-field-group">
              <Label className="form-label">Trading Instruments * (Select all that apply)</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                {Object.values(Instrument).map((instrument) => (
                  <div key={instrument} className="multi-select-option">
                    <Checkbox
                      id={instrument}
                      checked={formData.instruments.includes(instrument)}
                      onCheckedChange={(checked) => handleInstrumentChange(instrument, !!checked)}
                      className="multi-select-checkbox"
                    />
                    <Label htmlFor={instrument} className="text-white text-sm cursor-pointer">
                      {formatInstrument(instrument)}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={!isFormValid || isLoading}
              className="cta-primary w-full"
            >
              {isLoading ? 'Finding Your Match...' : 'Get Your AI Match'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-white text-xl font-semibold mb-4">Your Top Matches</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {results.map((result, index) => (
              <Card key={result.broker_slug} className="broker-card-interactive">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-white text-lg">{result.name}</CardTitle>
                    <Badge className="trust-score-excellent">
                      <ShieldCheck className="w-3 h-3 mr-1" />
                      {result.trust_score}
                    </Badge>
                  </div>
                  <p className="text-white/80 text-sm">{result.one_liner}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-xs text-white/60">
                      Min Deposit: ${result.metrics.min_deposit} • {result.metrics.platforms.join(', ')}
                    </div>
                    
                    {/* Evidence Snippet */}
                    <div className="evidence-snippet">
                      <p className="text-xs text-white/80 mb-1">
                        {result.evidence[0]?.excerpt.substring(0, 120)}...
                      </p>
                      <a 
                        href={result.evidence[0]?.url} 
                        className="evidence-source-link inline-flex items-center"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Evidence ({result.evidence.length}) • {result.evidence[0]?.date}
                      </a>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" className="cta-secondary flex-1">View Profile</Button>
                      <Button size="sm" className="cta-secondary flex-1">Compare</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroRecommender;
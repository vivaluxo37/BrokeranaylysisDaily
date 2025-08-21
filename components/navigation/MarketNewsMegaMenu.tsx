import React from 'react';
import { TrendingUp, Calendar, BarChart3 } from 'lucide-react';
import { AnalysisData } from '@/lib/types';
import MegaMenuLink from '@/components/ui/MegaMenuLink';

interface MarketNewsMegaMenuProps {
  recentAnalysis: AnalysisData[];
}

export const MarketNewsMegaMenu: React.FC<MarketNewsMegaMenuProps> = ({
  recentAnalysis
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {/* Technical Analysis */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Technical Analysis</h3>
        </div>
        <div className="space-y-2">
          <MegaMenuLink href="/market-news/technical-analysis/forex">Forex Analysis</MegaMenuLink>
          <MegaMenuLink href="/market-news/technical-analysis/crypto">Crypto Analysis</MegaMenuLink>
          <MegaMenuLink href="/market-news/technical-analysis/commodities">Commodities</MegaMenuLink>
          <MegaMenuLink href="/market-news/technical-analysis/indices">Indices</MegaMenuLink>
        </div>
      </div>

      {/* Trading Signals */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <BarChart3 className="w-5 h-5 text-green-400" />
          <h3 className="text-lg font-semibold text-white">Trading Signals</h3>
        </div>
        <div className="space-y-2">
          <MegaMenuLink href="/market-news/signals/forex">Forex Signals</MegaMenuLink>
          <MegaMenuLink href="/market-news/signals/crypto">Crypto Signals</MegaMenuLink>
          <MegaMenuLink href="/market-news/signals/free">Free Signals</MegaMenuLink>
          <MegaMenuLink href="/market-news/signals/premium">Premium Signals</MegaMenuLink>
        </div>
      </div>

      {/* Market Calendar */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <Calendar className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Market Calendar</h3>
        </div>
        <div className="space-y-2">
          <MegaMenuLink href="/market-news/calendar/economic">Economic Calendar</MegaMenuLink>
          <MegaMenuLink href="/market-news/calendar/earnings">Earnings Calendar</MegaMenuLink>
          <MegaMenuLink href="/market-news/calendar/events">Market Events</MegaMenuLink>
          <MegaMenuLink href="/market-news/calendar/holidays">Market Holidays</MegaMenuLink>
        </div>
      </div>

      {/* Recent Analysis */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Analysis</h3>
        <div className="space-y-2">
          {recentAnalysis.slice(0, 4).map((analysis) => (
            <MegaMenuLink 
              key={analysis.title} 
              href={`/market-news/analysis/${analysis.title.toLowerCase().replace(/\s+/g, '-')}`}
              featured
            >
              <div className="text-sm">
                {analysis.title}
                <div className="text-xs text-white/60 mt-1">
                  {analysis.category} • {new Date(analysis.timestamp).toLocaleDateString()}
                </div>
              </div>
            </MegaMenuLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketNewsMegaMenu;
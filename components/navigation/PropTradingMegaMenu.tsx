import React from 'react';
import { Building2, Calculator, Trophy } from 'lucide-react';
import { PropFirmData } from '@/lib/types';
import MegaMenuLink from '@/components/ui/MegaMenuLink';

interface PropTradingMegaMenuProps {
  propFirms: PropFirmData[];
}

export const PropTradingMegaMenu: React.FC<PropTradingMegaMenuProps> = ({
  propFirms
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {/* Prop Firms */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <Building2 className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Prop Firms</h3>
        </div>
        <div className="space-y-2">
          <MegaMenuLink href="/prop-trading/firms/ftmo">FTMO</MegaMenuLink>
          <MegaMenuLink href="/prop-trading/firms/myforexfunds">MyForexFunds</MegaMenuLink>
          <MegaMenuLink href="/prop-trading/firms/the5ers">The5%ers</MegaMenuLink>
          <MegaMenuLink href="/prop-trading/firms/topstep">TopStep</MegaMenuLink>
          <MegaMenuLink href="/prop-trading/firms" className="text-blue-400 font-medium">
            View All Firms →
          </MegaMenuLink>
        </div>
      </div>

      {/* Challenges */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <Trophy className="w-5 h-5 text-green-400" />
          <h3 className="text-lg font-semibold text-white">Challenges</h3>
        </div>
        <div className="space-y-2">
          <MegaMenuLink href="/prop-trading/challenges/evaluation">Evaluation Process</MegaMenuLink>
          <MegaMenuLink href="/prop-trading/challenges/rules">Trading Rules</MegaMenuLink>
          <MegaMenuLink href="/prop-trading/challenges/tips">Success Tips</MegaMenuLink>
          <MegaMenuLink href="/prop-trading/challenges/comparison">Challenge Comparison</MegaMenuLink>
        </div>
      </div>

      {/* Tools */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <Calculator className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Tools</h3>
        </div>
        <div className="space-y-2">
          <MegaMenuLink href="/prop-trading/calculator/profit">Profit Calculator</MegaMenuLink>
          <MegaMenuLink href="/prop-trading/calculator/risk">Risk Calculator</MegaMenuLink>
          <MegaMenuLink href="/prop-trading/compare">Compare Firms</MegaMenuLink>
          <MegaMenuLink href="/prop-trading/tracker">Challenge Tracker</MegaMenuLink>
        </div>
      </div>

      {/* Top Prop Firms */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white mb-4">Top Rated Firms</h3>
        <div className="space-y-2">
          {propFirms.slice(0, 4).map((firm) => (
            <MegaMenuLink 
              key={firm.name} 
              href={`/prop-trading/firms/${firm.name.toLowerCase()}`}
              featured
            >
              <div className="flex items-center justify-between">
                <span>{firm.name}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-yellow-400">★ {firm.rating}</span>
                  <span className="text-xs text-green-400">{firm.fundingAmount}</span>
                </div>
              </div>
            </MegaMenuLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropTradingMegaMenu;
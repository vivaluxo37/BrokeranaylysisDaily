import React from 'react';
import { Globe, CandlestickChart } from 'lucide-react';
import { CountryData, PlatformData, AccountTypeData, BrokerData, ComparisonData } from '@/lib/types';
import MegaMenuLink from '@/components/ui/MegaMenuLink';
import BrokerCountBadge from '@/components/ui/BrokerCountBadge';

interface BrokersMegaMenuProps {
  countries: CountryData[];
  platforms: PlatformData[];
  accountTypes: AccountTypeData[];
  topBrokers: BrokerData[];
  popularComparisons: ComparisonData[];
}

export const BrokersMegaMenu: React.FC<BrokersMegaMenuProps> = ({
  countries,
  platforms,
  accountTypes,
  topBrokers,
  popularComparisons
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {/* Best Brokers by Country */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <Globe className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Best Brokers by Country</h3>
        </div>
        <div className="space-y-2">
          {countries.slice(0, 6).map((country) => (
            <div key={country.code} className="flex items-center justify-between">
              <MegaMenuLink href={`/brokers/country/${country.code.toLowerCase()}`}>
                {country.name}
              </MegaMenuLink>
              <BrokerCountBadge count={country.brokerCount} />
            </div>
          ))}
          <MegaMenuLink href="/brokers/countries" className="text-blue-400 font-medium">
            View All Countries →
          </MegaMenuLink>
        </div>
      </div>

      {/* Brokers by Platforms & Assets */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <CandlestickChart className="w-5 h-5 text-green-400" />
          <h3 className="text-lg font-semibold text-white">Platforms & Assets</h3>
        </div>
        <div className="space-y-2">
          {platforms.slice(0, 6).map((platform) => (
            <div key={platform.name} className="flex items-center justify-between">
              <MegaMenuLink href={`/brokers/platform/${platform.name.toLowerCase().replace(/\s+/g, '-')}`}>
                {platform.name}
              </MegaMenuLink>
              <BrokerCountBadge count={platform.brokerCount} />
            </div>
          ))}
          <MegaMenuLink href="/brokers/platforms" className="text-green-400 font-medium">
            View All Platforms →
          </MegaMenuLink>
        </div>
      </div>

      {/* Brokers by Account Types */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white mb-4">Account Types</h3>
        <div className="space-y-2">
          {accountTypes.slice(0, 5).map((accountType) => (
            <div key={accountType.name} className="flex items-center justify-between">
              <MegaMenuLink href={`/brokers/account-type/${accountType.name.toLowerCase().replace(/\s+/g, '-')}`}>
                {accountType.name}
              </MegaMenuLink>
              <BrokerCountBadge count={accountType.brokerCount} />
            </div>
          ))}
          <MegaMenuLink href="/brokers/account-types" className="text-purple-400 font-medium">
            View All Types →
          </MegaMenuLink>
        </div>
      </div>

      {/* Top Brokers & Compare */}
      <div className="space-y-6">
        {/* Top Brokers */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Top Brokers</h3>
          <div className="space-y-2">
            {topBrokers.slice(0, 4).map((broker) => (
              <MegaMenuLink 
                key={broker.name} 
                href={`/brokers/${broker.name.toLowerCase()}`}
                featured
              >
                <div className="flex items-center justify-between">
                  <span>{broker.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-yellow-400">★ {broker.rating}</span>
                    <span className="text-xs text-green-400">Trust: {broker.trustScore}</span>
                  </div>
                </div>
              </MegaMenuLink>
            ))}
            <MegaMenuLink href="/brokers/reviews" className="text-yellow-400 font-medium">
              All Broker Reviews →
            </MegaMenuLink>
          </div>
        </div>

        {/* Popular Comparisons */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Popular Comparisons</h3>
          <div className="space-y-2">
            {popularComparisons.slice(0, 3).map((comparison) => (
              <MegaMenuLink 
                key={`${comparison.broker1}-${comparison.broker2}`}
                href={`/compare/${comparison.broker1.toLowerCase()}-vs-${comparison.broker2.toLowerCase()}`}
              >
                <div className="text-sm">
                  {comparison.broker1} vs {comparison.broker2}
                  <div className="text-xs text-white/60">{comparison.views.toLocaleString()} views</div>
                </div>
              </MegaMenuLink>
            ))}
            <MegaMenuLink href="/compare" className="text-orange-400 font-medium">
              Compare Brokers →
            </MegaMenuLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrokersMegaMenu;
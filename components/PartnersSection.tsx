import React, { useState, useEffect } from 'react';
import { DataService } from '@/lib/services/DataService';

interface Partner {
  name: string;
  logo: string;
  website?: string;
}

export const PartnersSection: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPartners = async () => {
      try {
        // Sample partner data for Brokeranalysis platform
        const data: Partner[] = [
          { name: "MetaTrader", logo: "metatrader", website: "https://metatrader.com" },
          { name: "TradingView", logo: "tradingview", website: "https://tradingview.com" },
          { name: "cTrader", logo: "ctrader", website: "https://ctrader.com" },
          { name: "NinjaTrader", logo: "ninjatrader", website: "https://ninjatrader.com" },
          { name: "Interactive Brokers", logo: "interactive-brokers", website: "https://interactivebrokers.com" },
          { name: "Oanda", logo: "oanda", website: "https://oanda.com" }
        ];
        
        setPartners(data);
      } catch (error) {
        console.error('Error loading partners:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPartners();
  }, []);

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center space-x-12 md:space-x-16">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="flex items-center justify-center">
                <div className="h-8 w-24 bg-white/10 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Trusted by Leading Trading Platforms</h2>
          <p className="text-white/60">We work with the industry's most respected brokers and platforms</p>
        </div>
        <div className="flex items-center justify-center space-x-12 md:space-x-16 flex-wrap gap-8">
          {partners.map((partner, index) => (
            <div
              key={partner.name}
              className="flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-300"
            >
              <span className="text-white/60 font-semibold text-lg hover:text-white transition-colors">
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
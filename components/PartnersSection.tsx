import React from 'react';
import { mockPartnerLogos } from '@/app/modernLandingMockData';

export const PartnersSection: React.FC = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-center space-x-12 md:space-x-16">
          {mockPartnerLogos.map((partner, index) => (
            <div
              key={partner.name}
              className="flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-300"
            >
              <span className="text-white/60 font-semibold text-lg">
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
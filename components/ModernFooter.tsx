import React from 'react';
import { mockFooterLinks } from '@/app/modernLandingMockData';
import OrbitalElement from './OrbitalElement';

export const ModernFooter: React.FC = () => {
  return (
    <footer className="relative border-t border-white/10 py-16">
      <div className="container mx-auto px-6">
        {/* Background orbital element */}
        <OrbitalElement 
          size="lg" 
          variant="primary" 
          className="absolute bottom-10 right-10 opacity-20" 
        />

        <div className="grid md:grid-cols-4 gap-8 relative z-10">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">H</span>
              </div>
              <span className="text-xl font-bold text-white">HarlyCo</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Say goodbye to admin headaches and say hello to efficiency.
            </p>
          </div>

          {/* Useful Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Useful Links</h4>
            <ul className="space-y-3">
              {mockFooterLinks.usefulLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-white/60 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {mockFooterLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-white/60 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h4 className="text-white font-semibold mb-4">Follow Us</h4>
            <ul className="space-y-3">
              {mockFooterLinks.social.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-white/60 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 mt-12 pt-8 text-center">
          <p className="text-white/60 text-sm">
            ©2024. All right reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default ModernFooter;
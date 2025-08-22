'use client';

import React, { useState, useEffect } from 'react';
import { DataService } from '@/lib/services/DataService';
import OrbitalElement from './OrbitalElement';

interface FooterLink {
  name: string;
  href: string;
}

interface FooterData {
  usefulLinks: FooterLink[];
  company: FooterLink[];
  social: FooterLink[];
}

export const ModernFooter: React.FC = () => {
  const [footerData, setFooterData] = useState<FooterData>({
    usefulLinks: [],
    company: [],
    social: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFooterData = async () => {
      try {
        // Sample footer data for Brokeranalysis platform
        const sampleFooterData: FooterData = {
          usefulLinks: [
            { name: "Broker Reviews", href: "/brokers" },
            { name: "Trading Guides", href: "/education" },
            { name: "Market Analysis", href: "/analysis" },
            { name: "Comparison Tool", href: "/compare" },
            { name: "Trust Scores", href: "/trust-scores" }
          ],
          company: [
            { name: "About Us", href: "/about" },
            { name: "Contact", href: "/contact" },
            { name: "Privacy Policy", href: "/privacy" },
            { name: "Terms of Service", href: "/terms" },
            { name: "Careers", href: "/careers" }
          ],
          social: [
            { name: "Twitter", href: "https://twitter.com/brokeranalysis" },
            { name: "LinkedIn", href: "https://linkedin.com/company/brokeranalysis" },
            { name: "YouTube", href: "https://youtube.com/brokeranalysis" },
            { name: "Telegram", href: "https://t.me/brokeranalysis" }
          ]
        };
        
        setFooterData(sampleFooterData);
      } catch (error) {
        console.error('Error loading footer data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFooterData();
  }, []);

  if (loading) {
    return (
      <footer className="relative border-t border-white/10 py-16">
        <div className="container mx-auto px-6">
          <OrbitalElement 
            size="lg" 
            variant="primary" 
            className="absolute bottom-10 right-10 opacity-20" 
          />
          <div className="grid md:grid-cols-4 gap-8 relative z-10">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/10 rounded-lg"></div>
                <div className="h-6 bg-white/10 rounded w-32"></div>
              </div>
              <div className="h-16 bg-white/10 rounded"></div>
            </div>
            {[1, 2, 3].map((index) => (
              <div key={index}>
                <div className="h-6 bg-white/10 rounded w-24 mb-4"></div>
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="h-4 bg-white/10 rounded w-20"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 mt-12 pt-8 text-center">
            <div className="h-4 bg-white/10 rounded w-32 mx-auto"></div>
          </div>
        </div>
      </footer>
    );
  }
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
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="text-xl font-bold text-white">Brokeranalysis</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Your trusted partner in finding the perfect trading broker with AI-powered recommendations and comprehensive analysis.
            </p>
          </div>

          {/* Useful Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Useful Links</h4>
            <ul className="space-y-3">
              {footerData.usefulLinks.map((link) => (
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
              {footerData.company.map((link) => (
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
              {footerData.social.map((link) => (
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
            ©2024 Brokeranalysis. All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default ModernFooter;
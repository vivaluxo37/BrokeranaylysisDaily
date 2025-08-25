import React, { useState, useEffect } from 'react';
import { Linkedin, Twitter, Youtube, Send } from 'lucide-react';
import OrbitalElement from './OrbitalElement';
import { DataService } from '@/lib/services/dataService';

const socialIconMap = {
  linkedin: Linkedin,
  twitter: Twitter,
  youtube: Youtube,
  telegram: Send
};

interface FooterLink {
  name: string;
  href: string;
}

interface SocialLink {
  name: string;
  href: string;
  icon: string;
}

interface FooterData {
  usefulLinks: FooterLink[];
  company: FooterLink[];
  social: SocialLink[];
}

export const BrokerFooter: React.FC = () => {
  const [footerData, setFooterData] = useState<FooterData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFooterData = async () => {
      try {
        // Sample footer data for Brokeranalysis platform
        const data: FooterData = {
          usefulLinks: [
            { name: "Brokers", href: "/brokers" },
            { name: "Reviews", href: "/reviews" },
            { name: "Tools", href: "/tools" },
            { name: "AI Assistant", href: "/ai-assistant" },
            { name: "Blog", href: "/blog" },
            { name: "Market Analysis", href: "/market-analysis" }
          ],
          company: [
            { name: "About", href: "/about" },
            { name: "Contact", href: "/contact" },
            { name: "Careers", href: "/careers" },
            { name: "Press", href: "/press" },
            { name: "Sitemap", href: "/sitemap" }
          ],
          social: [
            { name: "LinkedIn", href: "https://linkedin.com/company/brokeranalysis", icon: "linkedin" },
            { name: "X/Twitter", href: "https://twitter.com/brokeranalysis", icon: "twitter" },
            { name: "YouTube", href: "https://youtube.com/@brokeranalysis", icon: "youtube" },
            { name: "Telegram", href: "https://t.me/brokeranalysis", icon: "telegram" }
          ]
        };
        
        setFooterData(data);
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
          <div className="grid md:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="h-6 bg-white/10 rounded animate-pulse"></div>
                <div className="space-y-2">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="h-4 bg-white/5 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </footer>
    );
  }

  if (!footerData) return null;
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
              <span className="text-xl font-bold text-white">Brokeranalysis</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Find the right broker, backed by AI. Personalized recommendations with explainable insights.
            </p>
            <div className="flex space-x-4">
              {footerData.social.map((social) => {
                const IconComponent = socialIconMap[social.icon as keyof typeof socialIconMap];
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all duration-200"
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Navigation</h4>
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

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-semibold mb-4">Stay Updated</h4>
            <p className="text-white/60 text-sm mb-4">
              Get the latest broker insights and market analysis delivered to your inbox.
            </p>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button className="w-full px-4 py-2 rounded-lg btn-gradient text-white font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/60 text-sm">
            ©2025 Brokeranalysis. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="/privacy" className="text-white/60 hover:text-white text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="text-white/60 hover:text-white text-sm transition-colors">
              Terms of Service
            </a>
            <a href="/cookies" className="text-white/60 hover:text-white text-sm transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default BrokerFooter;
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ExternalLink } from 'lucide-react';
import { DataService } from '@/lib/services/DataService';

const footerSections = [
  {
    title: "Brokers",
    links: [
      { label: "Top Rated", href: "/brokers" },
      { label: "By Country", href: "/brokers/country" },
      { label: "By Platform", href: "/brokers/platform" },
      { label: "Reviews", href: "/reviews" }
    ]
  },
  {
    title: "Tools",
    links: [
      { label: "Broker Comparison", href: "/compare" },
      { label: "Cost Calculator", href: "/calculator" },
      { label: "AI Assistant", href: "/ai" },
      { label: "Dashboard", href: "/dashboard" }
    ]
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Market Analysis", href: "/analysis" },
      { label: "Trading Guides", href: "/guides" },
      { label: "Glossary", href: "/glossary" }
    ]
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Methodology", href: "/methodology" },
      { label: "Contact", href: "/contact" },
      { label: "Careers", href: "/careers" }
    ]
  }
];

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setEmailError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setEmailError('');
    setIsSubscribing(true);

    try {
      // Simulate newsletter subscription for Brokeranalysis platform
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, this would call DataService.subscribeToNewsletter(email)
      console.log('Newsletter subscription for:', email);
      
      setSubscribed(true);
      setEmail('');
    } catch (error) {
      console.error('Subscription error:', error);
      setEmailError('Failed to subscribe. Please try again.');
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="bg-black/50 backdrop-blur-xl border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Newsletter Section */}
        <div className="mb-16">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-heading-md text-gradient mb-4">Stay Informed</h3>
            <p className="text-body text-white/70 mb-6">
              Get weekly broker analysis, market insights, and trading tips delivered to your inbox.
            </p>
            
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="flex-1">
                <Label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </Label>
                <Input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/60"
                  disabled={isSubscribing || subscribed}
                />
                {emailError && (
                  <p className="text-red-400 text-xs mt-1">{emailError}</p>
                )}
              </div>
              <Button 
                type="submit" 
                className="cta-primary"
                disabled={isSubscribing || subscribed}
              >
                <Mail className="w-4 h-4 mr-2" />
                {subscribed ? 'Subscribed!' : isSubscribing ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </form>
          </div>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-white font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-white/70 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Legal Links */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10">
          <div className="flex flex-wrap gap-6 mb-4 md:mb-0">
            <a href="/privacy" className="text-white/60 hover:text-white text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="text-white/60 hover:text-white text-sm transition-colors">
              Terms of Service
            </a>
            <a href="/sitemap" className="text-white/60 hover:text-white text-sm transition-colors">
              Sitemap
            </a>
          </div>
          <div className="text-white/60 text-sm">
            © 2024 Brokeranalysis. All rights reserved.
          </div>
        </div>

        {/* Affiliate Disclosure */}
        <div className="mt-8 p-4 bg-white/5 rounded-lg border border-white/10">
          <p className="text-white/60 text-xs leading-relaxed">
            <strong>Affiliate Disclosure:</strong> We may earn a commission when you sign up with a broker through our links. 
            This helps us provide free content and maintain our platform. Our recommendations are based on thorough analysis 
            and are not influenced by affiliate partnerships.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
import React from 'react';
import { Info, Users, Mail, Shield } from 'lucide-react';
import MegaMenuLink from '@/components/ui/MegaMenuLink';

export const AboutMegaMenu: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {/* About Us */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <Info className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">About Us</h3>
        </div>
        <div className="space-y-2">
          <MegaMenuLink href="/about/story">Our Story</MegaMenuLink>
          <MegaMenuLink href="/about/mission">Mission & Vision</MegaMenuLink>
          <MegaMenuLink href="/about/methodology">Our Methodology</MegaMenuLink>
          <MegaMenuLink href="/about/awards">Awards & Recognition</MegaMenuLink>
        </div>
      </div>

      {/* Trust & Transparency */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <Shield className="w-5 h-5 text-green-400" />
          <h3 className="text-lg font-semibold text-white">Trust & Transparency</h3>
        </div>
        <div className="space-y-2">
          <MegaMenuLink href="/about/trust-score">Trust Score Explained</MegaMenuLink>
          <MegaMenuLink href="/about/how-we-make-money">How We Make Money</MegaMenuLink>
          <MegaMenuLink href="/about/editorial-policy">Editorial Policy</MegaMenuLink>
          <MegaMenuLink href="/about/data-sources">Data Sources</MegaMenuLink>
        </div>
      </div>

      {/* Team */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <Users className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Team</h3>
        </div>
        <div className="space-y-2">
          <MegaMenuLink href="/about/team">Meet the Team</MegaMenuLink>
          <MegaMenuLink href="/about/advisors">Advisory Board</MegaMenuLink>
          <MegaMenuLink href="/about/careers">Careers</MegaMenuLink>
          <MegaMenuLink href="/about/press">Press Kit</MegaMenuLink>
        </div>
      </div>

      {/* Contact */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <Mail className="w-5 h-5 text-orange-400" />
          <h3 className="text-lg font-semibold text-white">Contact</h3>
        </div>
        <div className="space-y-2">
          <MegaMenuLink href="/contact">Contact Us</MegaMenuLink>
          <MegaMenuLink href="/contact/support">Support Center</MegaMenuLink>
          <MegaMenuLink href="/contact/media">Media Inquiries</MegaMenuLink>
          <MegaMenuLink href="/contact/partnerships">Partnerships</MegaMenuLink>
        </div>
      </div>
    </div>
  );
};

export default AboutMegaMenu;
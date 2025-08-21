import React from 'react';
import { BookOpen, GraduationCap, FileText } from 'lucide-react';
import { EducationResourceData } from '@/lib/types';
import MegaMenuLink from '@/components/ui/MegaMenuLink';

interface EducationMegaMenuProps {
  educationResources: EducationResourceData[];
}

export const EducationMegaMenu: React.FC<EducationMegaMenuProps> = ({
  educationResources
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {/* Beginner */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <GraduationCap className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Beginner</h3>
        </div>
        <div className="space-y-2">
          <MegaMenuLink href="/education/beginner/basics">Trading Basics</MegaMenuLink>
          <MegaMenuLink href="/education/beginner/terminology">Terminology</MegaMenuLink>
          <MegaMenuLink href="/education/beginner/first-trade">Your First Trade</MegaMenuLink>
          <MegaMenuLink href="/education/beginner/demo-account">Demo Account Guide</MegaMenuLink>
        </div>
      </div>

      {/* Advanced */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <BookOpen className="w-5 h-5 text-green-400" />
          <h3 className="text-lg font-semibold text-white">Advanced</h3>
        </div>
        <div className="space-y-2">
          <MegaMenuLink href="/education/advanced/strategies">Trading Strategies</MegaMenuLink>
          <MegaMenuLink href="/education/advanced/risk-management">Risk Management</MegaMenuLink>
          <MegaMenuLink href="/education/advanced/psychology">Trading Psychology</MegaMenuLink>
          <MegaMenuLink href="/education/advanced/algorithms">Algorithmic Trading</MegaMenuLink>
        </div>
      </div>

      {/* Resources */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <FileText className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Resources</h3>
        </div>
        <div className="space-y-2">
          <MegaMenuLink href="/education/ebooks">Free eBooks</MegaMenuLink>
          <MegaMenuLink href="/education/webinars">Webinars</MegaMenuLink>
          <MegaMenuLink href="/education/glossary">Trading Glossary</MegaMenuLink>
          <MegaMenuLink href="/education/tools">Trading Tools</MegaMenuLink>
        </div>
      </div>

      {/* Latest Resources */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white mb-4">Latest Resources</h3>
        <div className="space-y-2">
          {educationResources.slice(0, 4).map((resource) => (
            <MegaMenuLink 
              key={resource.title} 
              href={`/education/resource/${resource.title.toLowerCase().replace(/\s+/g, '-')}`}
              featured
            >
              <div className="text-sm">
                {resource.title}
                <div className="text-xs text-white/60 mt-1">
                  {resource.type} • {resource.readTime || `${resource.pages} pages`}
                </div>
              </div>
            </MegaMenuLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EducationMegaMenu;
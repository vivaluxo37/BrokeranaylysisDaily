import React from 'react';
import { cn } from '@/lib/utils';

interface MegaMenuLinkProps {
  href: string;
  children: React.ReactNode;
  featured?: boolean;
  className?: string;
  onClick?: () => void;
}

export const MegaMenuLink: React.FC<MegaMenuLinkProps> = ({ 
  href, 
  children, 
  featured = false, 
  className,
  onClick 
}) => {
  return (
    <a
      href={href}
      onClick={onClick}
      className={cn(
        "block py-2 px-3 rounded-lg transition-all duration-300 text-white/80 hover:text-white hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 hover:translate-x-2 hover:shadow-lg hover:border-white/30",
        featured && "border border-white/10 bg-white/5 hover:bg-gradient-to-r hover:from-blue-500/30 hover:to-purple-500/30 hover:border-white/40 hover:shadow-xl",
        className
      )}
    >
      {children}
    </a>
  );
};

export default MegaMenuLink;
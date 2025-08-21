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
        "block py-2 px-3 rounded-lg transition-all duration-200 text-white/80 hover:text-white hover:bg-white/10 hover:translate-x-1",
        featured && "border border-white/10 bg-white/5 hover:bg-white/15 hover:border-white/20",
        className
      )}
    >
      {children}
    </a>
  );
};

export default MegaMenuLink;
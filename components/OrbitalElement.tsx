import React from 'react';
import { cn } from '@/lib/utils';

interface OrbitalElementProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'accent';
  className?: string;
}

export const OrbitalElement: React.FC<OrbitalElementProps> = ({
  size = 'md',
  variant = 'primary',
  className
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48'
  };

  const variantClasses = {
    primary: 'orbital-element',
    secondary: 'orbital-element orbital-element-secondary',
    accent: 'orbital-element orbital-element-accent'
  };

  return (
    <div 
      className={cn(
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    />
  );
};

export default OrbitalElement;
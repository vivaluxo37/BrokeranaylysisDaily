'use client';

import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useLocation, LocationData, LocationError, UseLocationReturn } from '@/lib/hooks/useLocation';

interface LocationContextType extends UseLocationReturn {
  autoDetectLocation: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

interface LocationProviderProps {
  children: ReactNode;
  autoDetect?: boolean;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({ 
  children, 
  autoDetect = false 
}) => {
  const locationHook = useLocation();
  
  const autoDetectLocation = () => {
    // Only auto-detect if we don't have a recent location and user hasn't explicitly denied
    if (!locationHook.location && !locationHook.error && !locationHook.loading) {
      locationHook.requestLocation();
    }
  };

  // Auto-detect location on mount if enabled
  useEffect(() => {
    if (autoDetect) {
      autoDetectLocation();
    }
  }, [autoDetect]);

  const contextValue: LocationContextType = {
    ...locationHook,
    autoDetectLocation
  };

  return (
    <LocationContext.Provider value={contextValue}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
};

export default LocationContext;
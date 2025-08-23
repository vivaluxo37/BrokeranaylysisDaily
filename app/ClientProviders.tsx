'use client';

import { ReactNode } from 'react';
import { LocationProvider } from '@/lib/contexts/LocationContext';
import { AuthProvider } from '@/lib/contexts/AuthContext';
import { PerformanceProvider } from '@/components/providers/performance-provider';
import PerformanceDebugger from '@/components/PerformanceDebugger';

interface ClientProvidersProps {
  children: ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <PerformanceProvider>
      <AuthProvider>
        <LocationProvider autoDetect={true}>
          {children}
          <PerformanceDebugger />
        </LocationProvider>
      </AuthProvider>
    </PerformanceProvider>
  );
}
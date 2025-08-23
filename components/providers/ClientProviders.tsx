'use client'

import React from 'react'
import { LocationProvider } from '@/lib/contexts/LocationContext'
import { AuthProvider } from '@/lib/contexts/AuthContext'
import { PerformanceProvider, PerformanceDebugger } from './performance-provider'

interface ClientProvidersProps {
  children: React.ReactNode
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <LocationProvider autoDetect={true}>
      <AuthProvider>
        <PerformanceProvider>
          {children}
          <PerformanceDebugger />
        </PerformanceProvider>
      </AuthProvider>
    </LocationProvider>
  )
}
'use client'

import { lazy, Suspense, ComponentType, ReactNode } from 'react'
import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'

// Loading component for code splitting
interface LoadingProps {
  className?: string
  lines?: number
  height?: string
}

function LoadingFallback({ className, lines = 3, height = '20px' }: LoadingProps) {
  return (
    <div className={className}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={`w-full mb-2`} style={{ height }} />
      ))}
    </div>
  )
}

// Enhanced loading components for different use cases
export const LoadingComponents = {
  // Simple skeleton loader
  Skeleton: ({ lines = 3, className }: { lines?: number; className?: string }) => (
    <LoadingFallback className={className} lines={lines} />
  ),

  // Card skeleton
  Card: ({ className }: { className?: string }) => (
    <div className={`border rounded-lg p-4 ${className || ''}`}>
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-3 w-1/2 mb-4" />
      <Skeleton className="h-20 w-full" />
    </div>
  ),

  // Table skeleton
  Table: ({ rows = 5, cols = 4, className }: { rows?: number; cols?: number; className?: string }) => (
    <div className={`space-y-2 ${className || ''}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex space-x-2">
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} className="h-8 flex-1" />
          ))}
        </div>
      ))}
    </div>
  ),

  // Form skeleton
  Form: ({ fields = 3, className }: { fields?: number; className?: string }) => (
    <div className={`space-y-4 ${className || ''}`}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i}>
          <Skeleton className="h-4 w-1/4 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  ),

  // Chart skeleton
  Chart: ({ className }: { className?: string }) => (
    <div className={`${className || ''}`}>
      <Skeleton className="h-6 w-1/3 mb-4" />
      <Skeleton className="h-64 w-full" />
    </div>
  ),

  // Page skeleton
  Page: ({ className }: { className?: string }) => (
    <div className={`space-y-6 ${className || ''}`}>
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-4 w-3/4" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <LoadingComponents.Card key={i} />
        ))}
      </div>
    </div>
  )
}

// Dynamic import with custom loading
interface DynamicImportOptions {
  loading?: ComponentType
  ssr?: boolean
  suspense?: boolean
}

export function createDynamicComponent<T = {}>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  options: DynamicImportOptions = {}
) {
  const {
    loading = LoadingComponents.Skeleton,
    ssr = false,
    suspense = false
  } = options

  if (suspense) {
    const LazyComponent = lazy(importFn)
    return function DynamicComponent(props: T) {
      return (
        <Suspense fallback={<loading />}>
          <LazyComponent {...props} />
        </Suspense>
      )
    }
  }

  return dynamic(importFn, {
    loading,
    ssr
  })
}

// Route-based code splitting helpers
export const RouteComponents = {
  // Lazy load page components
  HomePage: createDynamicComponent(
    () => import('@/app/page'),
    { loading: LoadingComponents.Page, ssr: true }
  ),

  SearchPage: createDynamicComponent(
    () => import('@/app/search/page'),
    { loading: LoadingComponents.Page }
  ),

  BrokerPage: createDynamicComponent(
    () => import('@/app/brokers/[slug]/page'),
    { loading: LoadingComponents.Page }
  ),

  ComparisonPage: createDynamicComponent(
    () => import('@/app/comparison/page'),
    { loading: LoadingComponents.Table }
  ),

  NewsPage: createDynamicComponent(
    () => import('@/app/news/page'),
    { loading: LoadingComponents.Page }
  ),

  EducationPage: createDynamicComponent(
    () => import('@/app/education/page'),
    { loading: LoadingComponents.Page }
  ),

  MarketDataPage: createDynamicComponent(
    () => import('@/app/market-data/page'),
    { loading: LoadingComponents.Chart }
  ),

  AuthPage: createDynamicComponent(
    () => import('@/app/auth/login/page'),
    { loading: LoadingComponents.Form }
  )
}

// Component-based code splitting
export const LazyComponents = {
  // Heavy components that should be lazy loaded
  TradingViewChart: createDynamicComponent(
    () => import('@/components/charts/TradingViewChart'),
    { loading: LoadingComponents.Chart }
  ),

  DataTable: createDynamicComponent(
    () => import('@/components/ui/data-table'),
    { loading: LoadingComponents.Table }
  ),

  RichTextEditor: createDynamicComponent(
    () => import('@/components/ui/rich-text-editor'),
    { loading: LoadingComponents.Form }
  ),

  FileUploader: createDynamicComponent(
    () => import('@/components/ui/file-uploader'),
    { loading: LoadingComponents.Form }
  ),

  Calendar: createDynamicComponent(
    () => import('@/components/ui/calendar'),
    { loading: LoadingComponents.Card }
  ),

  Map: createDynamicComponent(
    () => import('@/components/ui/map'),
    { loading: LoadingComponents.Chart }
  ),

  VideoPlayer: createDynamicComponent(
    () => import('@/components/ui/video-player'),
    { loading: () => <Skeleton className="w-full aspect-video" /> }
  ),

  CodeEditor: createDynamicComponent(
    () => import('@/components/ui/code-editor'),
    { loading: LoadingComponents.Form }
  )
}

// Feature-based code splitting
export const FeatureComponents = {
  // Authentication features
  LoginForm: createDynamicComponent(
    () => import('@/components/auth/LoginForm'),
    { loading: LoadingComponents.Form }
  ),

  RegisterForm: createDynamicComponent(
    () => import('@/components/auth/RegisterForm'),
    { loading: LoadingComponents.Form }
  ),

  ProfileSettings: createDynamicComponent(
    () => import('@/components/profile/ProfileSettings'),
    { loading: LoadingComponents.Form }
  ),

  // Search features
  AdvancedSearch: createDynamicComponent(
    () => import('@/components/search/AdvancedSearch'),
    { loading: LoadingComponents.Form }
  ),

  SearchFilters: createDynamicComponent(
    () => import('@/components/search/SearchFilters'),
    { loading: LoadingComponents.Form }
  ),

  // Broker features
  BrokerComparison: createDynamicComponent(
    () => import('@/components/brokers/BrokerComparison'),
    { loading: LoadingComponents.Table }
  ),

  BrokerReviews: createDynamicComponent(
    () => import('@/components/brokers/BrokerReviews'),
    { loading: LoadingComponents.Page }
  ),

  // Trading features
  TradingCalculator: createDynamicComponent(
    () => import('@/components/trading/TradingCalculator'),
    { loading: LoadingComponents.Form }
  ),

  EconomicCalendar: createDynamicComponent(
    () => import('@/components/trading/EconomicCalendar'),
    { loading: LoadingComponents.Table }
  ),

  // Admin features
  AdminDashboard: createDynamicComponent(
    () => import('@/components/admin/AdminDashboard'),
    { loading: LoadingComponents.Page }
  ),

  UserManagement: createDynamicComponent(
    () => import('@/components/admin/UserManagement'),
    { loading: LoadingComponents.Table }
  )
}

// Utility for conditional loading
export function conditionalLoad<T>(
  condition: boolean,
  component: ComponentType<T>,
  fallback?: ComponentType<T>
) {
  return condition ? component : (fallback || (() => null))
}

// Bundle analyzer helper
export function analyzeBundleSize() {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log('Bundle analysis available in production build with ANALYZE=true')
  }
}

// Preload components for better UX
export const preloadComponent = {
  async search() {
    await Promise.all([
      import('@/components/search/AdvancedSearch'),
      import('@/components/search/SearchFilters')
    ])
  },

  async broker() {
    await Promise.all([
      import('@/components/brokers/BrokerComparison'),
      import('@/components/brokers/BrokerReviews')
    ])
  },

  async trading() {
    await Promise.all([
      import('@/components/trading/TradingCalculator'),
      import('@/components/trading/EconomicCalendar'),
      import('@/components/charts/TradingViewChart')
    ])
  },

  async auth() {
    await Promise.all([
      import('@/components/auth/LoginForm'),
      import('@/components/auth/RegisterForm')
    ])
  },

  async admin() {
    await Promise.all([
      import('@/components/admin/AdminDashboard'),
      import('@/components/admin/UserManagement')
    ])
  }
}

// Hook for preloading on hover
export function usePreloadOnHover(preloadFn: () => Promise<any>) {
  const handleMouseEnter = () => {
    preloadFn().catch(console.error)
  }

  return { onMouseEnter: handleMouseEnter }
}

export type { LoadingProps, DynamicImportOptions }
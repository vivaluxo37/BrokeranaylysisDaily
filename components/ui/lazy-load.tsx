'use client'

import React, { useState, useEffect, useRef, ReactNode } from 'react'
import { createIntersectionObserver } from '@/lib/performance'

interface LazyLoadProps {
  children: ReactNode
  fallback?: ReactNode
  rootMargin?: string
  threshold?: number
  once?: boolean
  className?: string
  style?: React.CSSProperties
}

export const LazyLoad: React.FC<LazyLoadProps> = ({
  children,
  fallback = null,
  rootMargin = '50px',
  threshold = 0.1,
  once = true,
  className,
  style
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [hasBeenVisible, setHasBeenVisible] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = createIntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            if (once) {
              setHasBeenVisible(true)
              observer?.unobserve(element)
            }
          } else if (!once) {
            setIsVisible(false)
          }
        })
      },
      {
        rootMargin,
        threshold
      }
    )

    if (observer) {
      observer.observe(element)
    }

    return () => {
      if (observer && element) {
        observer.unobserve(element)
      }
    }
  }, [rootMargin, threshold, once])

  const shouldRender = isVisible || hasBeenVisible

  return (
    <div ref={elementRef} className={className} style={style}>
      {shouldRender ? children : fallback}
    </div>
  )
}

// Higher-order component for lazy loading
export function withLazyLoad<P extends object>(
  Component: React.ComponentType<P>,
  lazyLoadProps?: Omit<LazyLoadProps, 'children'>
) {
  return function LazyLoadedComponent(props: P) {
    return (
      <LazyLoad {...lazyLoadProps}>
        <Component {...props} />
      </LazyLoad>
    )
  }
}

// Skeleton loader component
interface SkeletonProps {
  width?: string | number
  height?: string | number
  className?: string
  variant?: 'text' | 'rectangular' | 'circular'
  animation?: 'pulse' | 'wave' | 'none'
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  className = '',
  variant = 'text',
  animation = 'pulse'
}) => {
  const baseClasses = 'bg-gray-200 dark:bg-gray-700'
  
  const variantClasses = {
    text: 'rounded',
    rectangular: 'rounded-md',
    circular: 'rounded-full'
  }
  
  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-pulse', // Could be enhanced with custom wave animation
    none: ''
  }

  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
      aria-hidden="true"
    />
  )
}

// Image lazy loading component
interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  fallbackSrc?: string
  skeletonHeight?: string | number
  skeletonWidth?: string | number
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  fallbackSrc,
  skeletonHeight = 200,
  skeletonWidth = '100%',
  className,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const img = imgRef.current
    if (!img) return

    const observer = createIntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer?.unobserve(img)
          }
        })
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    )

    if (observer) {
      observer.observe(img)
    }

    return () => {
      if (observer && img) {
        observer.unobserve(img)
      }
    }
  }, [])

  const handleLoad = () => {
    setIsLoaded(true)
    setHasError(false)
  }

  const handleError = () => {
    setHasError(true)
    setIsLoaded(false)
  }

  const imageSrc = hasError && fallbackSrc ? fallbackSrc : src

  return (
    <div className={`relative ${className}`} ref={imgRef}>
      {!isLoaded && (
        <Skeleton
          width={skeletonWidth}
          height={skeletonHeight}
          variant="rectangular"
          className="absolute inset-0"
        />
      )}
      {isVisible && (
        <img
          {...props}
          src={imageSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          loading="lazy"
        />
      )}
    </div>
  )
}

// Component lazy loading with dynamic imports
export function createLazyComponent<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: ReactNode
) {
  const LazyComponent = React.lazy(importFunc)
  
  return function LazyWrapper(props: React.ComponentProps<T>) {
    return (
      <React.Suspense fallback={fallback || <Skeleton height={200} />}>
        <LazyComponent {...props} />
      </React.Suspense>
    )
  }
}
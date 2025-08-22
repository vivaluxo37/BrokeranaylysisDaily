'use client'

import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  sizes?: string
  fill?: boolean
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  objectPosition?: string
  loading?: 'lazy' | 'eager'
  onLoad?: () => void
  onError?: () => void
  fallbackSrc?: string
  webpSrc?: string
  avifSrc?: string
  responsive?: boolean
  aspectRatio?: string
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  quality = 85,
  placeholder = 'empty',
  blurDataURL,
  sizes,
  fill = false,
  objectFit = 'cover',
  objectPosition = 'center',
  loading = 'lazy',
  onLoad,
  onError,
  fallbackSrc,
  webpSrc,
  avifSrc,
  responsive = true,
  aspectRatio,
  ...props
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState(src)
  const [imageError, setImageError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  // Generate responsive sizes if not provided
  const responsiveSizes = sizes || (
    responsive
      ? '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
      : undefined
  )

  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  // Handle image error with fallback
  const handleError = () => {
    if (!imageError && fallbackSrc) {
      setImageSrc(fallbackSrc)
      setImageError(true)
    } else {
      setImageError(true)
    }
    onError?.()
  }

  // Generate blur placeholder
  const generateBlurDataURL = (w: number, h: number) => {
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.fillStyle = '#f3f4f6'
      ctx.fillRect(0, 0, w, h)
    }
    return canvas.toDataURL()
  }

  // Auto-generate blur placeholder if not provided
  const autoBlurDataURL = blurDataURL || (
    placeholder === 'blur' && width && height
      ? generateBlurDataURL(10, Math.round((height / width) * 10))
      : undefined
  )

  // Container styles for aspect ratio
  const containerStyles = aspectRatio
    ? { aspectRatio }
    : {}

  if (imageError && !fallbackSrc) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-gray-100 text-gray-400',
          className
        )}
        style={{
          width: fill ? '100%' : width,
          height: fill ? '100%' : height,
          ...containerStyles
        }}
      >
        <svg
          className="w-8 h-8"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        !isLoaded && 'animate-pulse bg-gray-200',
        aspectRatio && 'w-full'
      )}
      style={containerStyles}
    >
      {/* Modern image formats with fallback */}
      <picture>
        {avifSrc && (
          <source srcSet={avifSrc} type="image/avif" />
        )}
        {webpSrc && (
          <source srcSet={webpSrc} type="image/webp" />
        )}
        <Image
          ref={imgRef}
          src={imageSrc}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          fill={fill}
          className={cn(
            'transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0',
            className
          )}
          style={{
            objectFit: fill ? objectFit : undefined,
            objectPosition: fill ? objectPosition : undefined
          }}
          priority={priority}
          quality={quality}
          placeholder={placeholder}
          blurDataURL={autoBlurDataURL}
          sizes={responsiveSizes}
          loading={loading}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      </picture>

      {/* Loading skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer" />
      )}
    </div>
  )
}

// Responsive image component with predefined breakpoints
interface ResponsiveImageProps extends Omit<OptimizedImageProps, 'sizes'> {
  breakpoints?: {
    mobile?: string
    tablet?: string
    desktop?: string
    wide?: string
  }
}

export function ResponsiveImage({
  breakpoints = {
    mobile: '100vw',
    tablet: '50vw',
    desktop: '33vw',
    wide: '25vw'
  },
  ...props
}: ResponsiveImageProps) {
  const sizes = `
    (max-width: 640px) ${breakpoints.mobile},
    (max-width: 1024px) ${breakpoints.tablet},
    (max-width: 1280px) ${breakpoints.desktop},
    ${breakpoints.wide}
  `.replace(/\s+/g, ' ').trim()

  return <OptimizedImage {...props} sizes={sizes} />
}

// Avatar component with optimized loading
interface AvatarImageProps {
  src?: string
  alt: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  className?: string
  fallback?: string
}

export function AvatarImage({
  src,
  alt,
  size = 'md',
  className,
  fallback
}: AvatarImageProps) {
  const sizeMap = {
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64,
    '2xl': 80
  }

  const dimension = sizeMap[size]

  const initials = alt
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  if (!src) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-gray-500 text-white font-medium rounded-full',
          className
        )}
        style={{ width: dimension, height: dimension }}
      >
        {fallback || initials}
      </div>
    )
  }

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={dimension}
      height={dimension}
      className={cn('rounded-full', className)}
      priority={false}
      quality={90}
      placeholder="blur"
      fallbackSrc={undefined}
    />
  )
}

// Hero image component with optimized loading
interface HeroImageProps extends OptimizedImageProps {
  overlay?: boolean
  overlayOpacity?: number
}

export function HeroImage({
  overlay = false,
  overlayOpacity = 0.4,
  className,
  ...props
}: HeroImageProps) {
  return (
    <div className="relative w-full h-full">
      <OptimizedImage
        {...props}
        fill
        priority
        quality={95}
        className={cn('object-cover', className)}
      />
      {overlay && (
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        />
      )}
    </div>
  )
}

// Gallery image component with lazy loading
interface GalleryImageProps extends OptimizedImageProps {
  index?: number
  onClick?: () => void
}

export function GalleryImage({
  index = 0,
  onClick,
  className,
  ...props
}: GalleryImageProps) {
  return (
    <div
      className={cn(
        'relative cursor-pointer group overflow-hidden rounded-lg',
        className
      )}
      onClick={onClick}
    >
      <OptimizedImage
        {...props}
        priority={index < 4} // Prioritize first 4 images
        loading={index < 4 ? 'eager' : 'lazy'}
        className="transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
    </div>
  )
}
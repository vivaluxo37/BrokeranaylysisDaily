'use client'

// Service Worker registration and management

interface ServiceWorkerConfig {
  onUpdate?: (registration: ServiceWorkerRegistration) => void
  onSuccess?: (registration: ServiceWorkerRegistration) => void
  onError?: (error: Error) => void
}

class ServiceWorkerManager {
  private registration: ServiceWorkerRegistration | null = null
  private config: ServiceWorkerConfig

  constructor(config: ServiceWorkerConfig = {}) {
    this.config = config
  }

  async register(): Promise<ServiceWorkerRegistration | null> {
    if (typeof window === 'undefined') {
      console.log('Service Worker: Not available in SSR')
      return null
    }

    if (!('serviceWorker' in navigator)) {
      console.log('Service Worker: Not supported in this browser')
      return null
    }

    try {
      console.log('Service Worker: Registering...')
      
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      })

      this.registration = registration

      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (!newWorker) return

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New content is available
            console.log('Service Worker: New content available')
            this.config.onUpdate?.(registration)
          }
        })
      })

      // Handle successful registration
      if (registration.waiting) {
        this.config.onUpdate?.(registration)
      } else if (registration.active) {
        this.config.onSuccess?.(registration)
      }

      console.log('Service Worker: Registered successfully')
      return registration
    } catch (error) {
      console.error('Service Worker: Registration failed', error)
      this.config.onError?.(error as Error)
      return null
    }
  }

  async unregister(): Promise<boolean> {
    if (!this.registration) {
      console.log('Service Worker: No registration to unregister')
      return false
    }

    try {
      const result = await this.registration.unregister()
      console.log('Service Worker: Unregistered successfully')
      this.registration = null
      return result
    } catch (error) {
      console.error('Service Worker: Unregistration failed', error)
      return false
    }
  }

  async update(): Promise<void> {
    if (!this.registration) {
      console.log('Service Worker: No registration to update')
      return
    }

    try {
      await this.registration.update()
      console.log('Service Worker: Update check completed')
    } catch (error) {
      console.error('Service Worker: Update failed', error)
    }
  }

  skipWaiting(): void {
    if (!this.registration?.waiting) {
      console.log('Service Worker: No waiting worker to skip')
      return
    }

    this.registration.waiting.postMessage({ type: 'SKIP_WAITING' })
  }

  async getVersion(): Promise<string | null> {
    if (!this.registration?.active) {
      return null
    }

    return new Promise((resolve) => {
      const messageChannel = new MessageChannel()
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data.version || null)
      }

      this.registration!.active!.postMessage(
        { type: 'GET_VERSION' },
        [messageChannel.port2]
      )

      // Timeout after 5 seconds
      setTimeout(() => resolve(null), 5000)
    })
  }

  isSupported(): boolean {
    return typeof window !== 'undefined' && 'serviceWorker' in navigator
  }

  isRegistered(): boolean {
    return this.registration !== null
  }

  getRegistration(): ServiceWorkerRegistration | null {
    return this.registration
  }
}

// Singleton instance
export const serviceWorkerManager = new ServiceWorkerManager()

// Auto-register service worker
export const registerServiceWorker = (config?: ServiceWorkerConfig) => {
  if (typeof window === 'undefined') return

  const manager = new ServiceWorkerManager(config)
  
  // Register when the page loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      manager.register()
    })
  } else {
    manager.register()
  }

  return manager
}

// Cache management utilities
export const cacheManager = {
  async clear(cacheName?: string): Promise<boolean> {
    if (typeof window === 'undefined' || !('caches' in window)) {
      return false
    }

    try {
      if (cacheName) {
        return await caches.delete(cacheName)
      } else {
        const cacheNames = await caches.keys()
        const deletePromises = cacheNames.map(name => caches.delete(name))
        await Promise.all(deletePromises)
        return true
      }
    } catch (error) {
      console.error('Cache Manager: Failed to clear cache', error)
      return false
    }
  },

  async getSize(): Promise<number> {
    if (typeof window === 'undefined' || !('caches' in window)) {
      return 0
    }

    try {
      const cacheNames = await caches.keys()
      let totalSize = 0

      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName)
        const requests = await cache.keys()
        
        for (const request of requests) {
          const response = await cache.match(request)
          if (response) {
            const blob = await response.blob()
            totalSize += blob.size
          }
        }
      }

      return totalSize
    } catch (error) {
      console.error('Cache Manager: Failed to calculate cache size', error)
      return 0
    }
  },

  async list(): Promise<string[]> {
    if (typeof window === 'undefined' || !('caches' in window)) {
      return []
    }

    try {
      return await caches.keys()
    } catch (error) {
      console.error('Cache Manager: Failed to list caches', error)
      return []
    }
  }
}

// Network status utilities
export const networkStatus = {
  isOnline(): boolean {
    return typeof window !== 'undefined' ? navigator.onLine : true
  },

  onStatusChange(callback: (isOnline: boolean) => void): () => void {
    if (typeof window === 'undefined') {
      return () => {}
    }

    const handleOnline = () => callback(true)
    const handleOffline = () => callback(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  },

  async checkConnectivity(): Promise<boolean> {
    if (typeof window === 'undefined') {
      return true
    }

    try {
      const response = await fetch('/favicon.ico', {
        method: 'HEAD',
        cache: 'no-cache'
      })
      return response.ok
    } catch {
      return false
    }
  }
}

// Push notification utilities
export const pushNotifications = {
  async requestPermission(): Promise<NotificationPermission> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'denied'
    }

    if (Notification.permission === 'granted') {
      return 'granted'
    }

    if (Notification.permission === 'denied') {
      return 'denied'
    }

    return await Notification.requestPermission()
  },

  async subscribe(registration: ServiceWorkerRegistration): Promise<PushSubscription | null> {
    if (!registration) {
      console.error('Push Notifications: No service worker registration')
      return null
    }

    try {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      })

      console.log('Push Notifications: Subscribed successfully')
      return subscription
    } catch (error) {
      console.error('Push Notifications: Subscription failed', error)
      return null
    }
  },

  async unsubscribe(registration: ServiceWorkerRegistration): Promise<boolean> {
    if (!registration) {
      return false
    }

    try {
      const subscription = await registration.pushManager.getSubscription()
      if (subscription) {
        await subscription.unsubscribe()
        console.log('Push Notifications: Unsubscribed successfully')
        return true
      }
      return false
    } catch (error) {
      console.error('Push Notifications: Unsubscription failed', error)
      return false
    }
  }
}

export type { ServiceWorkerConfig }
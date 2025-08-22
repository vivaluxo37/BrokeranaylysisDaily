'use client'

import { useEffect, useState } from 'react'
import { registerServiceWorker, serviceWorkerManager, networkStatus } from '@/lib/service-worker'

interface ServiceWorkerState {
  isRegistered: boolean
  isOnline: boolean
  hasUpdate: boolean
  isInstalling: boolean
}

export function ServiceWorkerRegistration() {
  const [state, setState] = useState<ServiceWorkerState>({
    isRegistered: false,
    isOnline: true,
    hasUpdate: false,
    isInstalling: false
  })

  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false)

  useEffect(() => {
    // Register service worker
    const manager = registerServiceWorker({
      onSuccess: (registration) => {
        console.log('Service Worker registered successfully')
        setState(prev => ({ ...prev, isRegistered: true }))
      },
      onUpdate: (registration) => {
        console.log('Service Worker update available')
        setState(prev => ({ ...prev, hasUpdate: true }))
        setShowUpdatePrompt(true)
      },
      onError: (error) => {
        console.error('Service Worker registration failed:', error)
      }
    })

    // Monitor network status
    const unsubscribeNetwork = networkStatus.onStatusChange((isOnline) => {
      setState(prev => ({ ...prev, isOnline }))
      
      if (isOnline) {
        // Check for updates when coming back online
        serviceWorkerManager.update()
      }
    })

    // Initial network status
    setState(prev => ({ ...prev, isOnline: networkStatus.isOnline() }))

    return () => {
      unsubscribeNetwork()
    }
  }, [])

  const handleUpdate = () => {
    serviceWorkerManager.skipWaiting()
    setShowUpdatePrompt(false)
    // Reload the page to activate the new service worker
    window.location.reload()
  }

  const handleDismissUpdate = () => {
    setShowUpdatePrompt(false)
  }

  // Don't render anything in development
  if (process.env.NODE_ENV === 'development') {
    return null
  }

  return (
    <>
      {/* Update Prompt */}
      {showUpdatePrompt && (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900">
                Update Available
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                A new version of the app is available. Refresh to get the latest features.
              </p>
              <div className="flex space-x-2 mt-3">
                <button
                  onClick={handleUpdate}
                  className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                >
                  Update
                </button>
                <button
                  onClick={handleDismissUpdate}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Later
                </button>
              </div>
            </div>
            <button
              onClick={handleDismissUpdate}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Offline Indicator */}
      {!state.isOnline && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-white text-center py-2 text-sm">
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>You're currently offline. Some features may be limited.</span>
          </div>
        </div>
      )}
    </>
  )
}

// Hook for components to access service worker state
export function useServiceWorker() {
  const [state, setState] = useState<ServiceWorkerState>({
    isRegistered: false,
    isOnline: true,
    hasUpdate: false,
    isInstalling: false
  })

  useEffect(() => {
    setState(prev => ({
      ...prev,
      isRegistered: serviceWorkerManager.isRegistered(),
      isOnline: networkStatus.isOnline()
    }))

    const unsubscribeNetwork = networkStatus.onStatusChange((isOnline) => {
      setState(prev => ({ ...prev, isOnline }))
    })

    return unsubscribeNetwork
  }, [])

  return {
    ...state,
    update: () => serviceWorkerManager.update(),
    unregister: () => serviceWorkerManager.unregister(),
    skipWaiting: () => serviceWorkerManager.skipWaiting()
  }
}

// Cache management hook
export function useCacheManager() {
  const [cacheSize, setCacheSize] = useState<number>(0)
  const [cacheNames, setCacheNames] = useState<string[]>([])

  const refreshCacheInfo = async () => {
    const { cacheManager } = await import('@/lib/service-worker')
    const [size, names] = await Promise.all([
      cacheManager.getSize(),
      cacheManager.list()
    ])
    setCacheSize(size)
    setCacheNames(names)
  }

  useEffect(() => {
    refreshCacheInfo()
  }, [])

  const clearCache = async (cacheName?: string) => {
    const { cacheManager } = await import('@/lib/service-worker')
    const success = await cacheManager.clear(cacheName)
    if (success) {
      await refreshCacheInfo()
    }
    return success
  }

  return {
    cacheSize,
    cacheNames,
    clearCache,
    refreshCacheInfo,
    formatSize: (bytes: number) => {
      const units = ['B', 'KB', 'MB', 'GB']
      let size = bytes
      let unitIndex = 0
      
      while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024
        unitIndex++
      }
      
      return `${size.toFixed(1)} ${units[unitIndex]}`
    }
  }
}
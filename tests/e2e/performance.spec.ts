import { test, expect } from '@playwright/test'

test.describe('Performance Testing', () => {
  
  test.describe('Core Web Vitals', () => {
    const testPages = [
      { path: '/', name: 'Homepage' },
      { path: '/brokers', name: 'Brokers Listing' },
      { path: '/calculator', name: 'Trading Calculator' },
      { path: '/ai', name: 'AI Assistant' },
      { path: '/scalping/brokers/us', name: 'Programmatic SEO Page' },
      { path: '/brokers/country/uk', name: 'Country Page' },
      { path: '/brokers/platform/mt4', name: 'Platform Page' }
    ]

    testPages.forEach(({ path, name }) => {
      test(`should have good Core Web Vitals for ${name}`, async ({ page }) => {
        await page.goto(path)
        
        // Wait for page to fully load
        await page.waitForLoadState('networkidle')
        
        // Measure Core Web Vitals
        const vitals = await page.evaluate(() => {
          return new Promise((resolve) => {
            const vitals: any = {}
            
            // Largest Contentful Paint (LCP)
            new PerformanceObserver((list) => {
              const entries = list.getEntries()
              const lastEntry = entries[entries.length - 1]
              vitals.lcp = lastEntry.startTime
            }).observe({ entryTypes: ['largest-contentful-paint'] })
            
            // First Input Delay (FID) - can't measure without real user interaction
            // Cumulative Layout Shift (CLS)
            new PerformanceObserver((list) => {
              let clsValue = 0
              for (const entry of list.getEntries()) {
                if (!(entry as any).hadRecentInput) {
                  clsValue += (entry as any).value
                }
              }
              vitals.cls = clsValue
            }).observe({ entryTypes: ['layout-shift'] })
            
            // First Contentful Paint (FCP)
            new PerformanceObserver((list) => {
              const entries = list.getEntries()
              vitals.fcp = entries[0].startTime
            }).observe({ entryTypes: ['paint'] })
            
            // Time to First Byte (TTFB)
            const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
            vitals.ttfb = navigation.responseStart - navigation.requestStart
            
            setTimeout(() => resolve(vitals), 2000)
          })
        })
        
        // Assert Core Web Vitals thresholds
        expect(vitals.lcp).toBeLessThan(2500) // LCP should be < 2.5s
        expect(vitals.fcp).toBeLessThan(1800) // FCP should be < 1.8s
        expect(vitals.cls).toBeLessThan(0.1)  // CLS should be < 0.1
        expect(vitals.ttfb).toBeLessThan(600) // TTFB should be < 600ms
        
        console.log(`${name} Core Web Vitals:`, vitals)
      })
    })
  })

  test.describe('Loading Performance', () => {
    test('should load homepage quickly', async ({ page }) => {
      const startTime = Date.now()
      
      await page.goto('/')
      await page.waitForLoadState('domcontentloaded')
      
      const domLoadTime = Date.now() - startTime
      expect(domLoadTime).toBeLessThan(3000) // DOM should load within 3 seconds
      
      await page.waitForLoadState('networkidle')
      const fullLoadTime = Date.now() - startTime
      expect(fullLoadTime).toBeLessThan(5000) // Full load within 5 seconds
    })

    test('should load programmatic SEO pages quickly', async ({ page }) => {
      const testPages = [
        '/scalping/brokers/us',
        '/day-trading/brokers/uk',
        '/brokers/country/au',
        '/brokers/platform/mt4',
        '/brokers/account-type/ecn'
      ]

      for (const testPage of testPages) {
        const startTime = Date.now()
        
        await page.goto(testPage)
        await page.waitForLoadState('networkidle')
        
        const loadTime = Date.now() - startTime
        expect(loadTime).toBeLessThan(4000) // Should load within 4 seconds
        
        console.log(`${testPage} loaded in ${loadTime}ms`)
      }
    })

    test('should handle concurrent page loads', async ({ browser }) => {
      const pages = [
        '/',
        '/calculator',
        '/ai',
        '/scalping/brokers/us',
        '/brokers/country/uk'
      ]

      const contexts = await Promise.all(
        pages.map(() => browser.newContext())
      )

      const loadPromises = contexts.map(async (context, index) => {
        const page = await context.newPage()
        const startTime = Date.now()
        
        await page.goto(pages[index])
        await page.waitForLoadState('networkidle')
        
        const loadTime = Date.now() - startTime
        await context.close()
        
        return { page: pages[index], loadTime }
      })

      const results = await Promise.all(loadPromises)
      
      results.forEach(({ page, loadTime }) => {
        expect(loadTime).toBeLessThan(6000) // Allow slightly more time for concurrent loads
        console.log(`Concurrent load: ${page} - ${loadTime}ms`)
      })
    })
  })

  test.describe('Resource Loading', () => {
    test('should load images efficiently', async ({ page }) => {
      await page.goto('/')
      
      // Wait for images to load
      await page.waitForLoadState('networkidle')
      
      // Check for broken images
      const images = page.locator('img')
      const imageCount = await images.count()
      
      for (let i = 0; i < Math.min(imageCount, 10); i++) {
        const img = images.nth(i)
        const src = await img.getAttribute('src')
        
        if (src && !src.startsWith('data:')) {
          // Check if image loaded successfully
          const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth)
          expect(naturalWidth).toBeGreaterThan(0)
        }
      }
    })

    test('should not have excessive network requests', async ({ page }) => {
      const requests: string[] = []
      
      page.on('request', request => {
        requests.push(request.url())
      })
      
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      // Filter out external requests (analytics, fonts, etc.)
      const internalRequests = requests.filter(url => 
        url.includes('localhost:3001') || url.startsWith('/')
      )
      
      // Should not have excessive internal requests
      expect(internalRequests.length).toBeLessThan(50)
      
      console.log(`Total requests: ${requests.length}, Internal: ${internalRequests.length}`)
    })

    test('should load CSS and JS efficiently', async ({ page }) => {
      const resourceSizes: { [key: string]: number } = {}
      
      page.on('response', async response => {
        const url = response.url()
        const contentType = response.headers()['content-type'] || ''
        
        if (contentType.includes('css') || contentType.includes('javascript')) {
          try {
            const body = await response.body()
            resourceSizes[url] = body.length
          } catch (error) {
            // Ignore errors for external resources
          }
        }
      })
      
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      // Check that no single resource is excessively large
      Object.entries(resourceSizes).forEach(([url, size]) => {
        if (url.includes('localhost')) {
          expect(size).toBeLessThan(1024 * 1024) // 1MB limit for individual resources
        }
      })
    })
  })

  test.describe('Interactive Performance', () => {
    test('should respond quickly to user interactions', async ({ page }) => {
      await page.goto('/calculator')
      
      // Test input responsiveness
      const lotSizeInput = page.locator('input[type="number"]').first()
      
      const startTime = Date.now()
      await lotSizeInput.fill('2.5')
      
      // Wait for calculation update
      await page.waitForTimeout(100)
      
      const responseTime = Date.now() - startTime
      expect(responseTime).toBeLessThan(500) // Should respond within 500ms
    })

    test('should handle rapid interactions smoothly', async ({ page }) => {
      await page.goto('/ai')
      
      // Rapidly click through questionnaire
      const startTime = Date.now()
      
      // Select first answer
      const firstOption = page.locator('input[type="radio"]').first()
      await firstOption.click()
      
      // Click Next rapidly
      for (let i = 0; i < 3; i++) {
        const nextButton = page.locator('button:has-text("Next")')
        if (await nextButton.isEnabled()) {
          await nextButton.click()
          await page.waitForTimeout(50) // Small delay between clicks
          
          // Select an option on new question
          const option = page.locator('input[type="radio"], input[type="checkbox"]').first()
          if (await option.count() > 0) {
            await option.click()
          }
        }
      }
      
      const totalTime = Date.now() - startTime
      expect(totalTime).toBeLessThan(2000) // Should handle rapid interactions smoothly
    })
  })

  test.describe('Memory and Resource Usage', () => {
    test('should not have memory leaks during navigation', async ({ page }) => {
      const pages = [
        '/',
        '/calculator',
        '/ai',
        '/scalping/brokers/us',
        '/brokers/country/uk',
        '/brokers/platform/mt4'
      ]

      // Navigate through pages multiple times
      for (let round = 0; round < 2; round++) {
        for (const testPage of pages) {
          await page.goto(testPage)
          await page.waitForLoadState('networkidle')
          
          // Force garbage collection if available
          await page.evaluate(() => {
            if (window.gc) {
              window.gc()
            }
          })
        }
      }
      
      // Check for JavaScript errors that might indicate memory issues
      const errors: string[] = []
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text())
        }
      })
      
      await page.goto('/')
      await page.waitForTimeout(1000)
      
      const memoryErrors = errors.filter(error => 
        error.includes('memory') || error.includes('heap')
      )
      
      expect(memoryErrors).toHaveLength(0)
    })
  })

  test.describe('Mobile Performance', () => {
    test('should perform well on mobile devices', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 })
      
      const startTime = Date.now()
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      const loadTime = Date.now() - startTime
      
      // Mobile should load within reasonable time
      expect(loadTime).toBeLessThan(6000)
      
      // Test mobile interactions
      const mobileStartTime = Date.now()
      
      // Try to find and interact with mobile menu or navigation
      const navElements = await page.locator('nav a, button').count()
      if (navElements > 0) {
        const firstNav = page.locator('nav a, button').first()
        await firstNav.click()
        
        const interactionTime = Date.now() - mobileStartTime
        expect(interactionTime).toBeLessThan(1000)
      }
    })
  })

  test.describe('Error Handling Performance', () => {
    test('should handle 404 pages quickly', async ({ page }) => {
      const startTime = Date.now()
      
      const response = await page.goto('/non-existent-page')
      expect(response?.status()).toBe(404)
      
      await page.waitForLoadState('domcontentloaded')
      const loadTime = Date.now() - startTime
      
      // 404 pages should load quickly
      expect(loadTime).toBeLessThan(2000)
    })

    test('should handle invalid programmatic routes quickly', async ({ page }) => {
      const invalidRoutes = [
        '/invalid-strategy/brokers/us',
        '/scalping/brokers/invalid-country',
        '/brokers/platform/invalid-platform'
      ]

      for (const route of invalidRoutes) {
        const startTime = Date.now()
        
        const response = await page.goto(route)
        expect(response?.status()).toBe(404)
        
        const loadTime = Date.now() - startTime
        expect(loadTime).toBeLessThan(3000)
      }
    })
  })
})

import { test, expect } from '@playwright/test'

test.describe('Homepage and Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should load homepage successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/BrokeranalysisDaily/i)
    await expect(page.locator('h1')).toBeVisible()
  })

  test('should have working navigation menu', async ({ page }) => {
    // Look for navigation menu
    const navSelectors = [
      'nav',
      '[data-testid="navigation"]',
      '.navigation',
      '.nav-menu',
      'header nav'
    ]

    let navFound = false
    for (const selector of navSelectors) {
      const nav = page.locator(selector)
      if (await nav.count() > 0) {
        navFound = true
        
        // Check for common navigation links
        const navLinks = nav.locator('a')
        await expect(navLinks.first()).toBeVisible()
        
        // Test navigation to brokers page
        const brokersLink = nav.locator('a[href*="/brokers"], a:has-text("Brokers")')
        if (await brokersLink.count() > 0) {
          await brokersLink.first().click()
          await page.waitForLoadState('networkidle')
          
          const currentUrl = page.url()
          expect(currentUrl).toContain('/brokers')
          
          // Navigate back to homepage
          await page.goto('/')
        }
        break
      }
    }

    expect(navFound).toBe(true)
  })

  test('should have working mobile navigation', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.reload()
    
    // Look for mobile menu toggle
    const mobileMenuSelectors = [
      '[data-testid="mobile-menu-toggle"]',
      '.mobile-menu-toggle',
      'button[aria-label*="menu" i]',
      '.hamburger',
      'button:has-text("☰")'
    ]

    let mobileMenuFound = false
    for (const selector of mobileMenuSelectors) {
      const mobileMenuToggle = page.locator(selector)
      if (await mobileMenuToggle.count() > 0) {
        mobileMenuFound = true
        
        // Click to open menu
        await mobileMenuToggle.click()
        
        // Check if menu opened
        const openMenuSelectors = [
          '.menu-open',
          '.nav-open',
          '[aria-expanded="true"]',
          '.mobile-menu.open'
        ]
        
        let menuOpened = false
        for (const openSelector of openMenuSelectors) {
          if (await page.locator(openSelector).count() > 0) {
            menuOpened = true
            break
          }
        }
        
        expect(menuOpened).toBe(true)
        break
      }
    }

    if (!mobileMenuFound) {
      // Check if navigation is always visible on mobile
      const nav = page.locator('nav a')
      if (await nav.count() > 0) {
        await expect(nav.first()).toBeVisible()
      }
    }
  })

  test('should display hero section', async ({ page }) => {
    // Look for hero section
    const heroSelectors = [
      '[data-testid="hero"]',
      '.hero',
      '.hero-section',
      '.banner',
      '.jumbotron'
    ]

    let heroFound = false
    for (const selector of heroSelectors) {
      const hero = page.locator(selector)
      if (await hero.count() > 0) {
        await expect(hero).toBeVisible()
        
        // Check for hero content
        const heroTitle = hero.locator('h1, h2, .hero-title, .title')
        if (await heroTitle.count() > 0) {
          await expect(heroTitle.first()).toBeVisible()
        }
        
        heroFound = true
        break
      }
    }

    if (!heroFound) {
      // Fallback: check for main heading
      await expect(page.locator('h1')).toBeVisible()
    }
  })

  test('should display featured brokers section', async ({ page }) => {
    // Look for featured brokers
    const featuredSelectors = [
      '[data-testid="featured-brokers"]',
      '.featured-brokers',
      '.top-brokers',
      '.broker-list',
      '.brokers-section'
    ]

    let featuredFound = false
    for (const selector of featuredSelectors) {
      const featured = page.locator(selector)
      if (await featured.count() > 0) {
        await expect(featured).toBeVisible()
        
        // Check for broker cards
        const brokerCards = featured.locator('.broker-card, .broker-item, .card')
        if (await brokerCards.count() > 0) {
          await expect(brokerCards.first()).toBeVisible()
        }
        
        featuredFound = true
        break
      }
    }

    if (!featuredFound) {
      console.log('Featured brokers section not found on homepage')
    }
  })

  test('should have working CTA buttons', async ({ page }) => {
    // Look for call-to-action buttons
    const ctaSelectors = [
      '[data-testid="cta-button"]',
      '.cta-button',
      '.btn-primary',
      'button:has-text("Get Started")',
      'a:has-text("View Brokers")',
      'a:has-text("Compare")'
    ]

    let ctaFound = false
    for (const selector of ctaSelectors) {
      const ctaButton = page.locator(selector)
      if (await ctaButton.count() > 0) {
        await expect(ctaButton.first()).toBeVisible()
        
        // Test CTA functionality
        const href = await ctaButton.first().getAttribute('href')
        if (href) {
          await ctaButton.first().click()
          await page.waitForLoadState('networkidle')
          
          const currentUrl = page.url()
          expect(currentUrl).toContain(href)
          
          // Navigate back
          await page.goto('/')
        }
        
        ctaFound = true
        break
      }
    }

    if (!ctaFound) {
      console.log('CTA buttons not found on homepage')
    }
  })

  test('should display footer with links', async ({ page }) => {
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    
    // Look for footer
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
    
    // Check for footer links
    const footerLinks = footer.locator('a')
    await expect(footerLinks.first()).toBeVisible()
    
    // Test a footer link
    const firstLink = footerLinks.first()
    const href = await firstLink.getAttribute('href')
    
    if (href && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
      await firstLink.click()
      await page.waitForLoadState('networkidle')
      
      // Should navigate somewhere
      const currentUrl = page.url()
      expect(currentUrl).not.toBe('/')
    }
  })

  test('should have proper SEO elements', async ({ page }) => {
    // Check title
    const title = await page.title()
    expect(title).toBeTruthy()
    expect(title.length).toBeGreaterThan(10)
    expect(title.length).toBeLessThan(60)
    
    // Check meta description
    const metaDescription = page.locator('meta[name="description"]')
    await expect(metaDescription).toHaveAttribute('content', /.+/)
    
    const description = await metaDescription.getAttribute('content')
    expect(description!.length).toBeGreaterThan(50)
    expect(description!.length).toBeLessThan(160)
    
    // Check for Open Graph tags
    const ogTitle = page.locator('meta[property="og:title"]')
    if (await ogTitle.count() > 0) {
      await expect(ogTitle).toHaveAttribute('content', /.+/)
    }
    
    // Check heading hierarchy
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBe(1) // Should have exactly one H1
  })

  test('should load without JavaScript errors', async ({ page }) => {
    const errors: string[] = []
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })
    
    page.on('pageerror', error => {
      errors.push(error.message)
    })
    
    await page.reload()
    await page.waitForLoadState('networkidle')
    
    // Filter out known non-critical errors
    const criticalErrors = errors.filter(error => 
      !error.includes('favicon') && 
      !error.includes('analytics') &&
      !error.includes('third-party') &&
      !error.includes('google') &&
      !error.includes('facebook')
    )
    
    expect(criticalErrors).toHaveLength(0)
  })

  test('should have fast loading performance', async ({ page }) => {
    const startTime = Date.now()
    
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    const loadTime = Date.now() - startTime
    
    // Should load within reasonable time (5 seconds)
    expect(loadTime).toBeLessThan(5000)
    
    // Check for performance metrics
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart
      }
    })
    
    expect(performanceMetrics.domContentLoaded).toBeLessThan(3000)
  })

  test('should be accessible', async ({ page }) => {
    // Check for alt text on images
    const images = page.locator('img')
    const imageCount = await images.count()
    
    for (let i = 0; i < Math.min(imageCount, 5); i++) {
      const img = images.nth(i)
      const alt = await img.getAttribute('alt')
      const src = await img.getAttribute('src')
      
      if (src && !src.includes('data:') && !src.includes('placeholder')) {
        expect(alt).toBeTruthy()
      }
    }
    
    // Check for proper heading structure
    const headings = page.locator('h1, h2, h3, h4, h5, h6')
    const headingCount = await headings.count()
    expect(headingCount).toBeGreaterThan(0)
    
    // Check for form labels
    const inputs = page.locator('input[type="text"], input[type="email"], input[type="search"], textarea')
    const inputCount = await inputs.count()
    
    for (let i = 0; i < Math.min(inputCount, 3); i++) {
      const input = inputs.nth(i)
      const id = await input.getAttribute('id')
      const ariaLabel = await input.getAttribute('aria-label')
      const placeholder = await input.getAttribute('placeholder')
      
      if (id) {
        const label = page.locator(`label[for="${id}"]`)
        const hasLabel = await label.count() > 0
        expect(hasLabel || ariaLabel || placeholder).toBeTruthy()
      }
    }
  })
})

import { test, expect } from '@playwright/test'

test.describe('Programmatic SEO Pages', () => {
  
  test.describe('Strategy × Country Pages', () => {
    const strategies = ['scalping', 'day-trading', 'swing-trading', 'long-term', 'algorithmic']
    const countries = ['us', 'uk', 'au', 'ca', 'de', 'ph']
    
    // Test a representative sample of strategy × country combinations
    const testCombinations = [
      { strategy: 'scalping', country: 'us' },
      { strategy: 'day-trading', country: 'uk' },
      { strategy: 'swing-trading', country: 'au' },
      { strategy: 'algorithmic', country: 'ca' }
    ]

    testCombinations.forEach(({ strategy, country }) => {
      test(`should load ${strategy} brokers in ${country} page`, async ({ page }) => {
        await page.goto(`/${strategy}/brokers/${country}`)
        
        // Check page loads successfully
        await expect(page).toHaveTitle(new RegExp(`${strategy}.*${country}`, 'i'))
        
        // Check hero section
        await expect(page.locator('h1')).toBeVisible()
        await expect(page.locator('h1')).toContainText(strategy, { ignoreCase: true })
        
        // Check country flag/name is displayed
        const countryNames = {
          'us': 'United States',
          'uk': 'United Kingdom', 
          'au': 'Australia',
          'ca': 'Canada',
          'de': 'Germany',
          'ph': 'Philippines'
        }
        await expect(page.locator('h1')).toContainText(countryNames[country as keyof typeof countryNames])
        
        // Check broker listings section
        const brokersSection = page.locator('h2:has-text("Top"), h2:has-text("Brokers")')
        await expect(brokersSection).toBeVisible()
        
        // Check for broker cards or "no brokers" message
        const brokerCards = page.locator('.bg-white.rounded-lg.shadow')
        const noBrokersMessage = page.locator('text=No brokers found')
        
        const hasCards = await brokerCards.count() > 0
        const hasNoMessage = await noBrokersMessage.count() > 0
        
        expect(hasCards || hasNoMessage).toBe(true)
        
        // If brokers are displayed, check card structure
        if (hasCards) {
          const firstCard = brokerCards.first()
          await expect(firstCard).toBeVisible()
          
          // Check for broker name
          await expect(firstCard.locator('h3')).toBeVisible()
          
          // Check for action buttons
          await expect(firstCard.locator('a:has-text("View Details")')).toBeVisible()
          await expect(firstCard.locator('a:has-text("Compare")')).toBeVisible()
        }
        
        // Check strategy guide section
        const guideSection = page.locator('h2:has-text("Guide"), h2:has-text("Trading")')
        await expect(guideSection).toBeVisible()
      })
    })

    test('should have proper SEO metadata for strategy pages', async ({ page }) => {
      await page.goto('/scalping/brokers/us')
      
      // Check title
      const title = await page.title()
      expect(title).toContain('Scalping')
      expect(title).toContain('United States')
      expect(title).toContain('Brokers')
      
      // Check meta description
      const metaDescription = await page.locator('meta[name="description"]').getAttribute('content')
      expect(metaDescription).toBeTruthy()
      expect(metaDescription!.length).toBeGreaterThan(50)
      expect(metaDescription!.length).toBeLessThan(160)
      
      // Check Open Graph tags
      const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content')
      expect(ogTitle).toContain('Scalping')
      expect(ogTitle).toContain('United States')
    })
  })

  test.describe('Country-Specific Broker Pages', () => {
    const countries = [
      { code: 'us', name: 'United States', flag: '🇺🇸' },
      { code: 'uk', name: 'United Kingdom', flag: '🇬🇧' },
      { code: 'au', name: 'Australia', flag: '🇦🇺' }
    ]

    countries.forEach(({ code, name, flag }) => {
      test(`should load ${name} brokers page`, async ({ page }) => {
        await page.goto(`/brokers/country/${code}`)
        
        // Check page loads successfully
        await expect(page).toHaveTitle(new RegExp(name, 'i'))
        
        // Check hero section with country info
        await expect(page.locator('h1')).toBeVisible()
        await expect(page.locator('h1')).toContainText(name)
        
        // Check for country flag (emoji)
        await expect(page.locator(`text=${flag}`)).toBeVisible()
        
        // Check broker listings
        const brokersSection = page.locator('h2:has-text("Top"), h2:has-text("Forex Brokers")')
        await expect(brokersSection).toBeVisible()
        
        // Check country information section
        const countryInfoSection = page.locator('h2:has-text("Forex Trading")')
        await expect(countryInfoSection).toBeVisible()
        
        // Check regulatory framework section
        const regulatorySection = page.locator('h3:has-text("Regulatory")')
        await expect(regulatorySection).toBeVisible()
      })
    })
  })

  test.describe('Platform-Specific Broker Pages', () => {
    const platforms = [
      { code: 'mt4', name: 'MetaTrader 4' },
      { code: 'mt5', name: 'MetaTrader 5' },
      { code: 'ctrader', name: 'cTrader' },
      { code: 'tradingview', name: 'TradingView' }
    ]

    platforms.forEach(({ code, name }) => {
      test(`should load ${name} brokers page`, async ({ page }) => {
        await page.goto(`/brokers/platform/${code}`)
        
        // Check page loads successfully
        await expect(page).toHaveTitle(new RegExp(name, 'i'))
        
        // Check hero section
        await expect(page.locator('h1')).toBeVisible()
        await expect(page.locator('h1')).toContainText(name)
        
        // Check broker listings
        const brokersSection = page.locator('h2:has-text("Top"), h2:has-text("Brokers")')
        await expect(brokersSection).toBeVisible()
        
        // Check platform information section
        const platformInfoSection = page.locator('h2:has-text("About")')
        await expect(platformInfoSection).toBeVisible()
        
        // Check features section
        const featuresSection = page.locator('h3:has-text("Key Features")')
        await expect(featuresSection).toBeVisible()
        
        // Check pros & cons section
        const prosConsSection = page.locator('h3:has-text("Pros & Cons")')
        await expect(prosConsSection).toBeVisible()
      })
    })
  })

  test.describe('Account Type-Specific Broker Pages', () => {
    const accountTypes = [
      { code: 'ecn', name: 'ECN Accounts' },
      { code: 'islamic', name: 'Islamic Accounts' },
      { code: 'micro', name: 'Micro Accounts' },
      { code: 'demo', name: 'Demo Accounts' }
    ]

    accountTypes.forEach(({ code, name }) => {
      test(`should load ${name} brokers page`, async ({ page }) => {
        await page.goto(`/brokers/account-type/${code}`)
        
        // Check page loads successfully
        await expect(page).toHaveTitle(new RegExp(name, 'i'))
        
        // Check hero section
        await expect(page.locator('h1')).toBeVisible()
        await expect(page.locator('h1')).toContainText(name)
        
        // Check broker listings
        const brokersSection = page.locator('h2:has-text("Top"), h2:has-text("Brokers")')
        await expect(brokersSection).toBeVisible()
        
        // Check account type information section
        const accountInfoSection = page.locator('h2:has-text("About")')
        await expect(accountInfoSection).toBeVisible()
        
        // Check features section
        const featuresSection = page.locator('h3:has-text("Key Features")')
        await expect(featuresSection).toBeVisible()
      })
    })
  })

  test.describe('SEO and Performance', () => {
    test('should have proper URL structure', async ({ page }) => {
      // Test strategy × country URL
      await page.goto('/scalping/brokers/us')
      expect(page.url()).toContain('/scalping/brokers/us')
      
      // Test country URL
      await page.goto('/brokers/country/uk')
      expect(page.url()).toContain('/brokers/country/uk')
      
      // Test platform URL
      await page.goto('/brokers/platform/mt4')
      expect(page.url()).toContain('/brokers/platform/mt4')
      
      // Test account type URL
      await page.goto('/brokers/account-type/ecn')
      expect(page.url()).toContain('/brokers/account-type/ecn')
    })

    test('should have unique content across pages', async ({ page }) => {
      // Get content from different pages
      await page.goto('/scalping/brokers/us')
      const scalpingContent = await page.locator('h1').textContent()
      
      await page.goto('/day-trading/brokers/uk')
      const dayTradingContent = await page.locator('h1').textContent()
      
      await page.goto('/brokers/country/au')
      const countryContent = await page.locator('h1').textContent()
      
      // Ensure content is different
      expect(scalpingContent).not.toBe(dayTradingContent)
      expect(scalpingContent).not.toBe(countryContent)
      expect(dayTradingContent).not.toBe(countryContent)
    })

    test('should load programmatic pages quickly', async ({ page }) => {
      const testPages = [
        '/scalping/brokers/us',
        '/brokers/country/uk',
        '/brokers/platform/mt4',
        '/brokers/account-type/ecn'
      ]

      for (const testPage of testPages) {
        const startTime = Date.now()
        await page.goto(testPage)
        await page.waitForLoadState('networkidle')
        const loadTime = Date.now() - startTime
        
        expect(loadTime).toBeLessThan(5000) // Should load within 5 seconds
      }
    })

    test('should have proper heading hierarchy', async ({ page }) => {
      await page.goto('/scalping/brokers/us')
      
      // Should have exactly one H1
      const h1Count = await page.locator('h1').count()
      expect(h1Count).toBe(1)
      
      // Should have H2s for main sections
      const h2Count = await page.locator('h2').count()
      expect(h2Count).toBeGreaterThan(0)
      
      // Check heading order
      const headings = await page.locator('h1, h2, h3').allTextContents()
      expect(headings.length).toBeGreaterThan(2)
    })

    test('should handle 404 for invalid combinations', async ({ page }) => {
      // Test invalid strategy
      const response1 = await page.goto('/invalid-strategy/brokers/us')
      expect(response1?.status()).toBe(404)
      
      // Test invalid country
      const response2 = await page.goto('/scalping/brokers/invalid-country')
      expect(response2?.status()).toBe(404)
      
      // Test invalid platform
      const response3 = await page.goto('/brokers/platform/invalid-platform')
      expect(response3?.status()).toBe(404)
      
      // Test invalid account type
      const response4 = await page.goto('/brokers/account-type/invalid-type')
      expect(response4?.status()).toBe(404)
    })
  })

  test.describe('Internal Linking', () => {
    test('should have working internal links', async ({ page }) => {
      await page.goto('/scalping/brokers/us')
      
      // Check for links to broker details
      const brokerLinks = page.locator('a:has-text("View Details")')
      if (await brokerLinks.count() > 0) {
        const firstLink = brokerLinks.first()
        const href = await firstLink.getAttribute('href')
        expect(href).toMatch(/\/brokers\/[a-z0-9-]+/)
      }
      
      // Check for comparison links
      const compareLinks = page.locator('a:has-text("Compare")')
      if (await compareLinks.count() > 0) {
        const firstCompareLink = compareLinks.first()
        const href = await firstCompareLink.getAttribute('href')
        expect(href).toContain('/compare')
      }
      
      // Check for "View all brokers" fallback link
      const viewAllLink = page.locator('a:has-text("View all brokers")')
      if (await viewAllLink.count() > 0) {
        const href = await viewAllLink.getAttribute('href')
        expect(href).toBe('/brokers')
      }
    })
  })
})

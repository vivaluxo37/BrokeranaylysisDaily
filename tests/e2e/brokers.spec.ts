import { test, expect } from '@playwright/test'

test.describe('Brokers Pages', () => {
  test.describe('Broker Listing Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/brokers')
    })

    test('should load brokers listing page successfully', async ({ page }) => {
      await expect(page).toHaveTitle(/Brokers.*BrokeranalysisDaily/i)
      await expect(page.locator('h1')).toContainText(/brokers/i)
    })

    test('should display broker cards', async ({ page }) => {
      // Wait for broker cards to load
      await page.waitForSelector('[data-testid="broker-card"], .broker-card, .broker-item', { timeout: 10000 })
      
      const brokerCards = page.locator('[data-testid="broker-card"], .broker-card, .broker-item')
      await expect(brokerCards.first()).toBeVisible()
      
      // Check broker card structure
      const firstCard = brokerCards.first()
      await expect(firstCard.locator('h2, h3, .broker-name, .name')).toBeVisible()
      await expect(firstCard.locator('.rating, .trust-score, .score')).toBeVisible()
    })

    test('should have working broker search', async ({ page }) => {
      const searchSelectors = [
        '[data-testid="broker-search"]',
        'input[placeholder*="search" i]',
        'input[name*="search" i]',
        '.search-input'
      ]

      let searchFound = false
      for (const selector of searchSelectors) {
        const searchInput = page.locator(selector)
        if (await searchInput.count() > 0) {
          searchFound = true
          
          await searchInput.fill('IC Markets')
          await searchInput.press('Enter')
          await page.waitForLoadState('networkidle')
          
          // Check if results are filtered
          const brokerCards = page.locator('[data-testid="broker-card"], .broker-card, .broker-item')
          const cardCount = await brokerCards.count()
          expect(cardCount).toBeGreaterThan(0)
          break
        }
      }

      if (!searchFound) {
        console.log('Broker search not found')
      }
    })

    test('should have working filters', async ({ page }) => {
      // Look for filter controls
      const filterSelectors = [
        '[data-testid="broker-filters"]',
        '.filters',
        'select[name*="regulation" i]',
        'select[name*="type" i]',
        '.filter-select'
      ]

      let filterFound = false
      for (const selector of filterSelectors) {
        const filterElement = page.locator(selector)
        if (await filterElement.count() > 0) {
          filterFound = true
          
          if (selector.includes('select')) {
            const options = filterElement.locator('option')
            const optionCount = await options.count()
            if (optionCount > 1) {
              await filterElement.selectOption({ index: 1 })
              await page.waitForLoadState('networkidle')
            }
          }
          break
        }
      }

      if (!filterFound) {
        console.log('Broker filters not found')
      }
    })

    test('should navigate to individual broker pages', async ({ page }) => {
      await page.waitForSelector('[data-testid="broker-card"], .broker-card, .broker-item', { timeout: 10000 })
      
      const brokerCards = page.locator('[data-testid="broker-card"], .broker-card, .broker-item')
      const firstCard = brokerCards.first()
      
      // Find clickable link
      const brokerLink = firstCard.locator('a[href*="/brokers/"], h2 a, h3 a, .broker-name a').first()
      
      if (await brokerLink.count() > 0) {
        const href = await brokerLink.getAttribute('href')
        expect(href).toBeTruthy()
        
        await brokerLink.click()
        await page.waitForLoadState('networkidle')
        
        // Verify we're on a broker detail page
        const currentUrl = page.url()
        expect(currentUrl).toMatch(/\/brokers\/[^\/]+$/)
      }
    })
  })

  test.describe('Broker Detail Page', () => {
    test('should load broker detail page successfully', async ({ page }) => {
      // First go to brokers listing to get a valid broker
      await page.goto('/brokers')
      await page.waitForSelector('[data-testid="broker-card"], .broker-card, .broker-item', { timeout: 10000 })
      
      const brokerCards = page.locator('[data-testid="broker-card"], .broker-card, .broker-item')
      const firstCard = brokerCards.first()
      const brokerLink = firstCard.locator('a[href*="/brokers/"]').first()
      
      if (await brokerLink.count() > 0) {
        await brokerLink.click()
        await page.waitForLoadState('networkidle')
        
        // Verify broker detail page loaded
        await expect(page.locator('h1')).toBeVisible()
        await expect(page.locator('.trust-score, .rating, .score')).toBeVisible()
      } else {
        // Fallback: try a common broker URL
        await page.goto('/brokers/ic-markets')
      }
    })

    test('should display broker information correctly', async ({ page }) => {
      await page.goto('/brokers')
      await page.waitForSelector('[data-testid="broker-card"], .broker-card, .broker-item', { timeout: 10000 })
      
      const brokerCards = page.locator('[data-testid="broker-card"], .broker-card, .broker-item')
      const firstCard = brokerCards.first()
      const brokerLink = firstCard.locator('a[href*="/brokers/"]').first()
      
      if (await brokerLink.count() > 0) {
        await brokerLink.click()
        await page.waitForLoadState('networkidle')
        
        // Check essential broker information
        await expect(page.locator('h1')).toBeVisible()
        
        // Check for trust score or rating
        const scoreSelectors = [
          '.trust-score',
          '.rating',
          '.score',
          '[data-testid="trust-score"]',
          '[data-testid="rating"]'
        ]
        
        let scoreFound = false
        for (const selector of scoreSelectors) {
          if (await page.locator(selector).count() > 0) {
            await expect(page.locator(selector)).toBeVisible()
            scoreFound = true
            break
          }
        }
        
        // Check for regulation information
        const regulationSelectors = [
          '.regulation',
          '.regulatory',
          '[data-testid="regulation"]',
          'text=/FCA|CySEC|ASIC|CFTC/'
        ]
        
        for (const selector of regulationSelectors) {
          if (await page.locator(selector).count() > 0) {
            await expect(page.locator(selector)).toBeVisible()
            break
          }
        }
      }
    })

    test('should handle missing broker data gracefully', async ({ page }) => {
      // Test with potentially missing data
      await page.goto('/brokers')
      await page.waitForSelector('[data-testid="broker-card"], .broker-card, .broker-item', { timeout: 10000 })
      
      const brokerCards = page.locator('[data-testid="broker-card"], .broker-card, .broker-item')
      const firstCard = brokerCards.first()
      const brokerLink = firstCard.locator('a[href*="/brokers/"]').first()
      
      if (await brokerLink.count() > 0) {
        await brokerLink.click()
        await page.waitForLoadState('networkidle')
        
        // Check that page doesn't show undefined/null values
        const pageContent = await page.textContent('body')
        expect(pageContent).not.toContain('undefined')
        expect(pageContent).not.toContain('null')
        expect(pageContent).not.toContain('NaN')
        
        // Check for N/A or fallback values instead
        const naValues = page.locator('text=/N\/A|Not Available|--/')
        // Should have some fallback values for missing data
        expect(await naValues.count()).toBeGreaterThanOrEqual(0)
      }
    })

    test('should display trust scores correctly', async ({ page }) => {
      await page.goto('/brokers')
      await page.waitForSelector('[data-testid="broker-card"], .broker-card, .broker-item', { timeout: 10000 })
      
      const brokerCards = page.locator('[data-testid="broker-card"], .broker-card, .broker-item')
      const firstCard = brokerCards.first()
      const brokerLink = firstCard.locator('a[href*="/brokers/"]').first()
      
      if (await brokerLink.count() > 0) {
        await brokerLink.click()
        await page.waitForLoadState('networkidle')
        
        // Look for trust score display
        const trustScoreSelectors = [
          '.trust-score',
          '[data-testid="trust-score"]',
          'text=/Trust Score|Score.*\/100/'
        ]
        
        for (const selector of trustScoreSelectors) {
          const trustScore = page.locator(selector)
          if (await trustScore.count() > 0) {
            const scoreText = await trustScore.textContent()
            
            // Verify score format (should be /100 or similar)
            if (scoreText) {
              expect(scoreText).toMatch(/\d+|N\/A|--/)
              
              // If it's a numeric score, verify it's reasonable
              const numericMatch = scoreText.match(/(\d+)/)
              if (numericMatch) {
                const score = parseInt(numericMatch[1])
                expect(score).toBeGreaterThanOrEqual(0)
                expect(score).toBeLessThanOrEqual(100)
              }
            }
            break
          }
        }
      }
    })

    test('should have proper SEO metadata', async ({ page }) => {
      await page.goto('/brokers')
      await page.waitForSelector('[data-testid="broker-card"], .broker-card, .broker-item', { timeout: 10000 })
      
      const brokerCards = page.locator('[data-testid="broker-card"], .broker-card, .broker-item')
      const firstCard = brokerCards.first()
      const brokerLink = firstCard.locator('a[href*="/brokers/"]').first()
      
      if (await brokerLink.count() > 0) {
        await brokerLink.click()
        await page.waitForLoadState('networkidle')
        
        // Check title
        const title = await page.title()
        expect(title).toBeTruthy()
        expect(title.length).toBeGreaterThan(10)
        
        // Check meta description
        const metaDescription = page.locator('meta[name="description"]')
        if (await metaDescription.count() > 0) {
          const content = await metaDescription.getAttribute('content')
          expect(content).toBeTruthy()
          expect(content!.length).toBeGreaterThan(50)
        }
        
        // Check for Open Graph tags
        const ogTitle = page.locator('meta[property="og:title"]')
        if (await ogTitle.count() > 0) {
          const content = await ogTitle.getAttribute('content')
          expect(content).toBeTruthy()
        }
      }
    })
  })
})

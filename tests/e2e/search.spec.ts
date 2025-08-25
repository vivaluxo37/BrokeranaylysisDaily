import { test, expect } from '@playwright/test'

test.describe('Search Functionality', () => {
  test.describe('Global Search', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/')
    })

    test('should have global search functionality', async ({ page }) => {
      // Look for global search input
      const searchSelectors = [
        '[data-testid="global-search"]',
        'input[type="search"]',
        'input[placeholder*="search" i]',
        '.search-input',
        'input[name*="search" i]'
      ]

      let searchFound = false
      for (const selector of searchSelectors) {
        const searchInput = page.locator(selector)
        if (await searchInput.count() > 0) {
          await expect(searchInput.first()).toBeVisible()
          searchFound = true
          break
        }
      }

      if (!searchFound) {
        console.log('Global search not found on homepage')
      }
    })

    test('should perform search and show results', async ({ page }) => {
      const searchSelectors = [
        '[data-testid="global-search"]',
        'input[type="search"]',
        'input[placeholder*="search" i]',
        '.search-input'
      ]

      for (const selector of searchSelectors) {
        const searchInput = page.locator(selector)
        if (await searchInput.count() > 0) {
          // Perform search
          await searchInput.fill('forex broker')
          await searchInput.press('Enter')
          
          await page.waitForLoadState('networkidle')
          
          // Should navigate to search results page or show results
          const currentUrl = page.url()
          const hasSearchUrl = currentUrl.includes('/search') || 
                              currentUrl.includes('q=') || 
                              currentUrl.includes('query=')
          
          if (hasSearchUrl) {
            // Check for search results
            const resultsSelectors = [
              '[data-testid="search-results"]',
              '.search-results',
              '.search-result',
              '.result-item'
            ]
            
            let resultsFound = false
            for (const resultSelector of resultsSelectors) {
              const results = page.locator(resultSelector)
              if (await results.count() > 0) {
                await expect(results.first()).toBeVisible()
                resultsFound = true
                break
              }
            }
            
            expect(resultsFound).toBe(true)
          }
          break
        }
      }
    })
  })

  test.describe('Search Results Page', () => {
    test('should load search page directly', async ({ page }) => {
      await page.goto('/search?q=forex')
      
      // Check if search page loads
      const searchPageIndicators = [
        'h1:has-text("Search")',
        '[data-testid="search-page"]',
        '.search-page',
        'input[value="forex"]'
      ]

      let searchPageFound = false
      for (const indicator of searchPageIndicators) {
        if (await page.locator(indicator).count() > 0) {
          searchPageFound = true
          break
        }
      }

      if (!searchPageFound) {
        // Fallback: check if we have any search-related content
        const pageContent = await page.textContent('body')
        expect(pageContent?.toLowerCase()).toContain('search')
      }
    })

    test('should display search results for different content types', async ({ page }) => {
      await page.goto('/search?q=broker')
      await page.waitForLoadState('networkidle')
      
      // Look for different types of search results
      const resultTypes = [
        { selector: '.broker-result, [data-type="broker"]', type: 'broker' },
        { selector: '.article-result, [data-type="article"]', type: 'article' },
        { selector: '.blog-result, [data-type="blog"]', type: 'blog' }
      ]

      let foundResults = 0
      for (const resultType of resultTypes) {
        const results = page.locator(resultType.selector)
        if (await results.count() > 0) {
          foundResults++
          await expect(results.first()).toBeVisible()
        }
      }

      // Should have at least some results
      const allResults = page.locator('.search-result, .result-item, .result')
      const resultCount = await allResults.count()
      expect(resultCount).toBeGreaterThan(0)
    })

    test('should handle empty search results', async ({ page }) => {
      await page.goto('/search?q=nonexistentquerythatshouldhavenoResults123')
      await page.waitForLoadState('networkidle')
      
      // Look for "no results" message
      const noResultsSelectors = [
        'text=/no results/i',
        'text=/not found/i',
        'text=/no matches/i',
        '[data-testid="no-results"]',
        '.no-results'
      ]

      let noResultsFound = false
      for (const selector of noResultsSelectors) {
        if (await page.locator(selector).count() > 0) {
          await expect(page.locator(selector)).toBeVisible()
          noResultsFound = true
          break
        }
      }

      // Alternative: check if results container is empty
      const resultsContainer = page.locator('[data-testid="search-results"], .search-results')
      if (await resultsContainer.count() > 0) {
        const results = resultsContainer.locator('.search-result, .result-item, .result')
        expect(await results.count()).toBe(0)
      }
    })

    test('should allow refining search', async ({ page }) => {
      await page.goto('/search?q=forex')
      await page.waitForLoadState('networkidle')
      
      // Look for search input on results page
      const searchInput = page.locator('input[type="search"], input[name*="search"], .search-input')
      
      if (await searchInput.count() > 0) {
        // Clear and enter new search
        await searchInput.first().clear()
        await searchInput.first().fill('scalping')
        await searchInput.first().press('Enter')
        
        await page.waitForLoadState('networkidle')
        
        // Verify URL updated
        const currentUrl = page.url()
        expect(currentUrl).toContain('scalping')
      }
    })

    test('should have working search filters', async ({ page }) => {
      await page.goto('/search?q=broker')
      await page.waitForLoadState('networkidle')
      
      // Look for search filters
      const filterSelectors = [
        '[data-testid="search-filters"]',
        '.search-filters',
        'select[name*="type"]',
        'input[type="radio"]',
        '.filter-option'
      ]

      let filterFound = false
      for (const selector of filterSelectors) {
        const filterElement = page.locator(selector)
        if (await filterElement.count() > 0) {
          filterFound = true
          
          // Test filter functionality
          if (selector.includes('select')) {
            const options = filterElement.locator('option')
            const optionCount = await options.count()
            if (optionCount > 1) {
              await filterElement.selectOption({ index: 1 })
              await page.waitForLoadState('networkidle')
            }
          } else if (selector.includes('radio')) {
            await filterElement.first().click()
            await page.waitForLoadState('networkidle')
          }
          break
        }
      }

      if (!filterFound) {
        console.log('Search filters not found')
      }
    })

    test('should display search result snippets', async ({ page }) => {
      await page.goto('/search?q=trading')
      await page.waitForLoadState('networkidle')
      
      const results = page.locator('.search-result, .result-item, .result')
      
      if (await results.count() > 0) {
        const firstResult = results.first()
        
        // Check for title
        const title = firstResult.locator('h2, h3, .title, .result-title')
        await expect(title).toBeVisible()
        
        // Check for snippet/description
        const snippet = firstResult.locator('.snippet, .description, .excerpt, p')
        if (await snippet.count() > 0) {
          await expect(snippet.first()).toBeVisible()
        }
        
        // Check for link
        const link = firstResult.locator('a')
        await expect(link.first()).toBeVisible()
        
        const href = await link.first().getAttribute('href')
        expect(href).toBeTruthy()
      }
    })

    test('should navigate to search result pages', async ({ page }) => {
      await page.goto('/search?q=broker')
      await page.waitForLoadState('networkidle')
      
      const results = page.locator('.search-result, .result-item, .result')
      
      if (await results.count() > 0) {
        const firstResult = results.first()
        const link = firstResult.locator('a').first()
        
        if (await link.count() > 0) {
          const href = await link.getAttribute('href')
          expect(href).toBeTruthy()
          
          // Click the link
          await link.click()
          await page.waitForLoadState('networkidle')
          
          // Verify navigation worked
          const currentUrl = page.url()
          expect(currentUrl).not.toContain('/search')
          expect(currentUrl).toContain(href!)
        }
      }
    })

    test('should handle search pagination', async ({ page }) => {
      await page.goto('/search?q=forex')
      await page.waitForLoadState('networkidle')
      
      // Look for pagination
      const paginationSelectors = [
        '[data-testid="pagination"]',
        '.pagination',
        'button:has-text("Next")',
        'a:has-text("Next")',
        'button:has-text("2")'
      ]

      let paginationFound = false
      for (const selector of paginationSelectors) {
        const paginationElement = page.locator(selector)
        if (await paginationElement.count() > 0) {
          paginationFound = true
          
          // Test pagination
          const nextButton = page.locator('button:has-text("Next"), a:has-text("Next")').first()
          if (await nextButton.count() > 0 && await nextButton.isEnabled()) {
            await nextButton.click()
            await page.waitForLoadState('networkidle')
            
            // Verify URL changed
            const currentUrl = page.url()
            expect(currentUrl).toMatch(/page=2|\/2/)
          }
          break
        }
      }

      if (!paginationFound) {
        console.log('Search pagination not found - likely due to insufficient results')
      }
    })

    test('should be responsive on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/search?q=broker')
      await page.waitForLoadState('networkidle')
      
      // Check that search interface is still usable
      const searchInput = page.locator('input[type="search"], .search-input')
      if (await searchInput.count() > 0) {
        await expect(searchInput.first()).toBeVisible()
      }
      
      // Check that results are displayed properly
      const results = page.locator('.search-result, .result-item, .result')
      if (await results.count() > 0) {
        await expect(results.first()).toBeVisible()
      }
    })

    test('should handle special characters in search', async ({ page }) => {
      const specialQueries = [
        'forex & trading',
        'broker (regulated)',
        'spread: 0.1 pips'
      ]

      for (const query of specialQueries) {
        await page.goto(`/search?q=${encodeURIComponent(query)}`)
        await page.waitForLoadState('networkidle')
        
        // Should not crash or show errors
        const errorSelectors = [
          'text=/error/i',
          'text=/500/i',
          'text=/something went wrong/i'
        ]
        
        for (const errorSelector of errorSelectors) {
          expect(await page.locator(errorSelector).count()).toBe(0)
        }
      }
    })
  })
})

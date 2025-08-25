import { test, expect } from '@playwright/test'

test.describe('Blog Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog')
  })

  test('should load blog page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Blog.*BrokeranalysisDaily/i)
    await expect(page.locator('h1')).toContainText('Blog')
  })

  test('should display blog articles', async ({ page }) => {
    // Wait for articles to load
    await page.waitForSelector('[data-testid="blog-article"], .blog-article, article', { timeout: 10000 })
    
    // Check that articles are displayed
    const articles = page.locator('[data-testid="blog-article"], .blog-article, article')
    await expect(articles.first()).toBeVisible()
    
    // Check article structure
    const firstArticle = articles.first()
    await expect(firstArticle.locator('h2, h3, .title')).toBeVisible()
    await expect(firstArticle.locator('a, [href]')).toBeVisible()
  })

  test('should have working pagination', async ({ page }) => {
    // Look for pagination controls
    const paginationSelectors = [
      '[data-testid="pagination"]',
      '.pagination',
      'nav[aria-label*="pagination" i]',
      'button:has-text("Next")',
      'a:has-text("Next")',
      'button:has-text("2")',
      'a:has-text("2")'
    ]

    let paginationFound = false
    for (const selector of paginationSelectors) {
      const element = page.locator(selector)
      if (await element.count() > 0) {
        paginationFound = true
        
        // Test pagination functionality
        const nextButton = page.locator('button:has-text("Next"), a:has-text("Next")').first()
        if (await nextButton.count() > 0 && await nextButton.isEnabled()) {
          await nextButton.click()
          await page.waitForLoadState('networkidle')
          
          // Verify URL changed or content updated
          const currentUrl = page.url()
          expect(currentUrl).toMatch(/page=2|\/2/)
        }
        break
      }
    }

    // If no pagination found, check if there are enough articles to warrant pagination
    const articles = page.locator('[data-testid="blog-article"], .blog-article, article')
    const articleCount = await articles.count()
    
    if (articleCount < 10) {
      console.log('Pagination not found - likely due to insufficient articles')
    } else {
      expect(paginationFound).toBe(true)
    }
  })

  test('should have working search functionality', async ({ page }) => {
    // Look for search input
    const searchSelectors = [
      '[data-testid="search-input"]',
      'input[type="search"]',
      'input[placeholder*="search" i]',
      'input[name*="search" i]',
      '.search-input'
    ]

    let searchFound = false
    for (const selector of searchSelectors) {
      const searchInput = page.locator(selector)
      if (await searchInput.count() > 0) {
        searchFound = true
        
        // Test search functionality
        await searchInput.fill('forex')
        await searchInput.press('Enter')
        
        // Wait for search results
        await page.waitForLoadState('networkidle')
        
        // Verify search results or URL change
        const currentUrl = page.url()
        expect(currentUrl).toMatch(/search|q=|query=/)
        break
      }
    }

    if (!searchFound) {
      console.log('Search functionality not found on blog page')
    }
  })

  test('should have working category filters', async ({ page }) => {
    // Look for category filters
    const categorySelectors = [
      '[data-testid="category-filter"]',
      '.category-filter',
      'select[name*="category" i]',
      'button:has-text("Education")',
      'a:has-text("Analysis")',
      '.filter-button'
    ]

    let categoryFound = false
    for (const selector of categorySelectors) {
      const categoryElement = page.locator(selector)
      if (await categoryElement.count() > 0) {
        categoryFound = true
        
        // Test category filtering
        if (selector.includes('select')) {
          await categoryElement.selectOption({ label: /education|analysis/i })
        } else {
          await categoryElement.first().click()
        }
        
        await page.waitForLoadState('networkidle')
        
        // Verify filtering worked
        const currentUrl = page.url()
        expect(currentUrl).toMatch(/category|filter/)
        break
      }
    }

    if (!categoryFound) {
      console.log('Category filters not found on blog page')
    }
  })

  test('should navigate to individual blog posts', async ({ page }) => {
    // Wait for articles to load
    await page.waitForSelector('[data-testid="blog-article"], .blog-article, article', { timeout: 10000 })
    
    const articles = page.locator('[data-testid="blog-article"], .blog-article, article')
    const firstArticle = articles.first()
    
    // Find clickable link in the article
    const articleLink = firstArticle.locator('a[href*="/blog/"], a[href*="/articles/"], h2 a, h3 a, .title a').first()
    
    if (await articleLink.count() > 0) {
      const href = await articleLink.getAttribute('href')
      expect(href).toBeTruthy()
      
      // Click the article link
      await articleLink.click()
      await page.waitForLoadState('networkidle')
      
      // Verify we're on an article page
      const currentUrl = page.url()
      expect(currentUrl).toMatch(/\/blog\/|\/articles\//)
      
      // Verify article content is displayed
      await expect(page.locator('h1, .article-title, .post-title')).toBeVisible()
      await expect(page.locator('.article-content, .post-content, .content')).toBeVisible()
    }
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.reload()
    
    // Check that content is still accessible
    await expect(page.locator('h1')).toBeVisible()
    
    // Check for mobile navigation if present
    const mobileMenuSelectors = [
      '[data-testid="mobile-menu"]',
      '.mobile-menu',
      'button[aria-label*="menu" i]',
      '.hamburger'
    ]

    for (const selector of mobileMenuSelectors) {
      const mobileMenu = page.locator(selector)
      if (await mobileMenu.count() > 0) {
        await mobileMenu.click()
        // Verify menu opened
        await expect(page.locator('.menu-open, .nav-open, [aria-expanded="true"]')).toBeVisible()
        break
      }
    }
  })

  test('should have proper SEO elements', async ({ page }) => {
    // Check meta tags
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.+/)
    
    // Check for structured data
    const structuredData = page.locator('script[type="application/ld+json"]')
    if (await structuredData.count() > 0) {
      const jsonContent = await structuredData.textContent()
      expect(jsonContent).toBeTruthy()
      expect(() => JSON.parse(jsonContent!)).not.toThrow()
    }
    
    // Check heading hierarchy
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBeGreaterThanOrEqual(1)
    expect(h1Count).toBeLessThanOrEqual(1) // Should have exactly one H1
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
      !error.includes('third-party')
    )
    
    expect(criticalErrors).toHaveLength(0)
  })
})

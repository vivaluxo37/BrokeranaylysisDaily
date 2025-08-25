import { Page, expect, Locator } from '@playwright/test'
import { selectors, viewports } from '../fixtures/test-data'

/**
 * Helper functions for Playwright tests
 */

export class TestHelpers {
  constructor(private page: Page) {}

  /**
   * Wait for any of the given selectors to be visible
   */
  async waitForAnySelector(selectors: string[], timeout = 10000): Promise<Locator | null> {
    for (const selector of selectors) {
      try {
        const element = this.page.locator(selector)
        await element.waitFor({ state: 'visible', timeout: timeout / selectors.length })
        return element
      } catch {
        continue
      }
    }
    return null
  }

  /**
   * Find the first visible element from a list of selectors
   */
  async findFirstVisible(selectors: string[]): Promise<Locator | null> {
    for (const selector of selectors) {
      const element = this.page.locator(selector)
      if (await element.count() > 0 && await element.first().isVisible()) {
        return element.first()
      }
    }
    return null
  }

  /**
   * Check if page has any JavaScript errors
   */
  async checkForJavaScriptErrors(): Promise<string[]> {
    const errors: string[] = []
    
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })
    
    this.page.on('pageerror', error => {
      errors.push(error.message)
    })
    
    return errors.filter(error => 
      !error.includes('favicon') && 
      !error.includes('analytics') &&
      !error.includes('third-party') &&
      !error.includes('google') &&
      !error.includes('facebook')
    )
  }

  /**
   * Verify page doesn't contain undefined/null values
   */
  async checkForUndefinedValues(): Promise<void> {
    const pageContent = await this.page.textContent('body')
    expect(pageContent).not.toContain('undefined')
    expect(pageContent).not.toContain('null')
    expect(pageContent).not.toContain('NaN')
  }

  /**
   * Test search functionality
   */
  async testSearch(query: string, expectedResultsSelector?: string): Promise<boolean> {
    const searchInput = await this.findFirstVisible(selectors.search.input)
    
    if (!searchInput) {
      return false
    }

    await searchInput.fill(query)
    await searchInput.press('Enter')
    await this.page.waitForLoadState('networkidle')

    // Check if we navigated to search results or have results on page
    const currentUrl = this.page.url()
    const hasSearchUrl = currentUrl.includes('/search') || 
                        currentUrl.includes('q=') || 
                        currentUrl.includes('query=')

    if (hasSearchUrl && expectedResultsSelector) {
      const results = this.page.locator(expectedResultsSelector)
      return await results.count() > 0
    }

    return hasSearchUrl
  }

  /**
   * Test pagination functionality
   */
  async testPagination(): Promise<boolean> {
    const paginationSelectors = [
      '[data-testid="pagination"]',
      '.pagination',
      'button:has-text("Next")',
      'a:has-text("Next")',
      'button:has-text("2")'
    ]

    const pagination = await this.findFirstVisible(paginationSelectors)
    if (!pagination) {
      return false
    }

    const nextButton = this.page.locator('button:has-text("Next"), a:has-text("Next")').first()
    if (await nextButton.count() > 0 && await nextButton.isEnabled()) {
      const currentUrl = this.page.url()
      await nextButton.click()
      await this.page.waitForLoadState('networkidle')
      
      const newUrl = this.page.url()
      return newUrl !== currentUrl
    }

    return false
  }

  /**
   * Test mobile navigation
   */
  async testMobileNavigation(): Promise<boolean> {
    await this.page.setViewportSize(viewports.mobile)
    await this.page.reload()

    const mobileMenuToggle = await this.findFirstVisible(selectors.navigation.mobile)
    if (!mobileMenuToggle) {
      // Check if navigation is always visible
      const navLinks = await this.findFirstVisible(selectors.navigation.links)
      return navLinks !== null
    }

    await mobileMenuToggle.click()

    // Check if menu opened
    const openMenuSelectors = [
      '.menu-open',
      '.nav-open',
      '[aria-expanded="true"]',
      '.mobile-menu.open'
    ]

    const openMenu = await this.findFirstVisible(openMenuSelectors)
    return openMenu !== null
  }

  /**
   * Check SEO elements
   */
  async checkSEOElements(): Promise<{ title: string; description: string; h1Count: number }> {
    const title = await this.page.title()
    expect(title).toBeTruthy()
    expect(title.length).toBeGreaterThan(10)
    expect(title.length).toBeLessThan(60)

    const metaDescription = this.page.locator('meta[name="description"]')
    const description = await metaDescription.getAttribute('content') || ''
    expect(description.length).toBeGreaterThan(50)
    expect(description.length).toBeLessThan(160)

    const h1Count = await this.page.locator('h1').count()
    expect(h1Count).toBe(1)

    return { title, description, h1Count }
  }

  /**
   * Check accessibility basics
   */
  async checkAccessibility(): Promise<void> {
    // Check images have alt text
    const images = this.page.locator('img')
    const imageCount = await images.count()
    
    for (let i = 0; i < Math.min(imageCount, 5); i++) {
      const img = images.nth(i)
      const alt = await img.getAttribute('alt')
      const src = await img.getAttribute('src')
      
      if (src && !src.includes('data:') && !src.includes('placeholder')) {
        expect(alt).toBeTruthy()
      }
    }

    // Check form inputs have labels
    const inputs = this.page.locator('input[type="text"], input[type="email"], input[type="search"], textarea')
    const inputCount = await inputs.count()
    
    for (let i = 0; i < Math.min(inputCount, 3); i++) {
      const input = inputs.nth(i)
      const id = await input.getAttribute('id')
      const ariaLabel = await input.getAttribute('aria-label')
      const placeholder = await input.getAttribute('placeholder')
      
      if (id) {
        const label = this.page.locator(`label[for="${id}"]`)
        const hasLabel = await label.count() > 0
        expect(hasLabel || ariaLabel || placeholder).toBeTruthy()
      }
    }
  }

  /**
   * Measure page performance
   */
  async measurePerformance(): Promise<{ loadTime: number; domContentLoaded: number }> {
    const performanceMetrics = await this.page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      return {
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart
      }
    })

    return performanceMetrics
  }

  /**
   * Test broker card functionality
   */
  async testBrokerCard(card: Locator): Promise<void> {
    // Check card structure
    await expect(card.locator('h2, h3, .broker-name, .name')).toBeVisible()
    
    // Check for trust score or rating
    const scoreElement = await this.findFirstVisible([
      '.trust-score',
      '.rating',
      '.score',
      '[data-testid="trust-score"]',
      '[data-testid="rating"]'
    ])
    
    if (scoreElement) {
      await expect(scoreElement).toBeVisible()
    }

    // Check for clickable link
    const link = card.locator('a').first()
    if (await link.count() > 0) {
      const href = await link.getAttribute('href')
      expect(href).toBeTruthy()
    }
  }

  /**
   * Test comparison table functionality
   */
  async testComparisonTable(): Promise<void> {
    const table = await this.findFirstVisible([
      'table',
      '.comparison-table',
      '[data-testid="comparison-table"]'
    ])

    if (!table) {
      throw new Error('Comparison table not found')
    }

    await expect(table).toBeVisible()

    // Check headers
    const headers = table.locator('th, .table-header, .header-cell')
    await expect(headers.first()).toBeVisible()

    // Check for data cells
    const cells = table.locator('td, .table-cell, .data-cell')
    await expect(cells.first()).toBeVisible()
  }

  /**
   * Navigate and verify page load
   */
  async navigateAndVerify(url: string, expectedTitle: RegExp): Promise<void> {
    await this.page.goto(url)
    await this.page.waitForLoadState('networkidle')
    await expect(this.page).toHaveTitle(expectedTitle)
  }

  /**
   * Test filter functionality
   */
  async testFilters(filterSelectors: string[]): Promise<boolean> {
    const filterElement = await this.findFirstVisible(filterSelectors)
    if (!filterElement) {
      return false
    }

    const tagName = await filterElement.evaluate(el => el.tagName.toLowerCase())
    
    if (tagName === 'select') {
      const options = filterElement.locator('option')
      const optionCount = await options.count()
      if (optionCount > 1) {
        await filterElement.selectOption({ index: 1 })
        await this.page.waitForLoadState('networkidle')
        return true
      }
    } else if (tagName === 'input') {
      const type = await filterElement.getAttribute('type')
      if (type === 'checkbox' || type === 'radio') {
        await filterElement.click()
        await this.page.waitForLoadState('networkidle')
        return true
      }
    } else {
      // Assume it's a clickable filter button
      await filterElement.click()
      await this.page.waitForLoadState('networkidle')
      return true
    }

    return false
  }
}

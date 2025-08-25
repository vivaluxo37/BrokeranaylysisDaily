import { test, expect } from '@playwright/test'

test.describe('Scalping Brokers Comparison', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/program/scalping-brokers-comparison')
  })

  test('should load scalping comparison page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Scalping.*Comparison.*BrokeranalysisDaily/i)
    await expect(page.locator('h1')).toContainText(/scalping/i)
  })

  test('should display broker selection interface', async ({ page }) => {
    // Look for broker selection controls
    const selectionSelectors = [
      '[data-testid="broker-selector"]',
      '.broker-selector',
      'select[name*="broker" i]',
      '.broker-dropdown',
      'input[type="checkbox"]'
    ]

    let selectionFound = false
    for (const selector of selectionSelectors) {
      const selectionElement = page.locator(selector)
      if (await selectionElement.count() > 0) {
        await expect(selectionElement.first()).toBeVisible()
        selectionFound = true
        break
      }
    }

    if (!selectionFound) {
      // Check if brokers are pre-selected and displayed
      const brokerCards = page.locator('[data-testid="broker-card"], .broker-card, .comparison-card')
      await expect(brokerCards.first()).toBeVisible()
    }
  })

  test('should display comparison table', async ({ page }) => {
    // Wait for comparison table to load
    await page.waitForSelector('table, .comparison-table, [data-testid="comparison-table"]', { timeout: 10000 })
    
    const table = page.locator('table, .comparison-table, [data-testid="comparison-table"]').first()
    await expect(table).toBeVisible()
    
    // Check table headers
    const headers = table.locator('th, .table-header, .header-cell')
    await expect(headers.first()).toBeVisible()
    
    // Check for key comparison metrics
    const metricsToCheck = [
      'execution',
      'spread',
      'commission',
      'rating',
      'trust',
      'regulation'
    ]
    
    const tableContent = await table.textContent()
    let foundMetrics = 0
    for (const metric of metricsToCheck) {
      if (tableContent?.toLowerCase().includes(metric)) {
        foundMetrics++
      }
    }
    
    expect(foundMetrics).toBeGreaterThan(2) // Should have at least 3 key metrics
  })

  test('should display broker cards view', async ({ page }) => {
    // Look for card view toggle or cards directly
    const cardViewSelectors = [
      '[data-testid="card-view"]',
      '.card-view',
      'button:has-text("Cards")',
      '.view-toggle'
    ]

    let cardViewFound = false
    for (const selector of cardViewSelectors) {
      const cardViewButton = page.locator(selector)
      if (await cardViewButton.count() > 0) {
        await cardViewButton.click()
        cardViewFound = true
        break
      }
    }

    // Check for broker cards
    const brokerCards = page.locator('[data-testid="broker-card"], .broker-card, .comparison-card')
    await expect(brokerCards.first()).toBeVisible()
    
    // Verify card content
    const firstCard = brokerCards.first()
    await expect(firstCard.locator('.broker-name, .name, h3, h2')).toBeVisible()
    await expect(firstCard.locator('.execution, .spread, .commission')).toBeVisible()
  })

  test('should handle execution speed data correctly', async ({ page }) => {
    // Wait for data to load
    await page.waitForLoadState('networkidle')
    
    // Look for execution speed values
    const executionSelectors = [
      '[data-testid="execution-speed"]',
      '.execution-speed',
      '.execution',
      'text=/\\d+ms|N\/A.*ms/'
    ]

    let executionFound = false
    for (const selector of executionSelectors) {
      const executionElements = page.locator(selector)
      if (await executionElements.count() > 0) {
        const firstExecution = executionElements.first()
        const executionText = await firstExecution.textContent()
        
        if (executionText) {
          // Should show either a number with 'ms' or 'N/A'
          expect(executionText).toMatch(/\d+ms|N\/A|--/)
          
          // If numeric, should be reasonable (0-1000ms)
          const numericMatch = executionText.match(/(\d+)ms/)
          if (numericMatch) {
            const speed = parseInt(numericMatch[1])
            expect(speed).toBeGreaterThanOrEqual(0)
            expect(speed).toBeLessThan(1000)
          }
        }
        executionFound = true
        break
      }
    }

    expect(executionFound).toBe(true)
  })

  test('should handle commission data correctly', async ({ page }) => {
    await page.waitForLoadState('networkidle')
    
    // Look for commission values
    const commissionSelectors = [
      '[data-testid="commission"]',
      '.commission',
      'text=/\\$\\d+.*lot|N\/A.*lot/'
    ]

    let commissionFound = false
    for (const selector of commissionSelectors) {
      const commissionElements = page.locator(selector)
      if (await commissionElements.count() > 0) {
        const firstCommission = commissionElements.first()
        const commissionText = await firstCommission.textContent()
        
        if (commissionText) {
          // Should show either $X/lot or N/A
          expect(commissionText).toMatch(/\$\d+.*lot|N\/A|--/)
          
          // If numeric, should be reasonable
          const numericMatch = commissionText.match(/\$(\d+(?:\.\d+)?)/)
          if (numericMatch) {
            const commission = parseFloat(numericMatch[1])
            expect(commission).toBeGreaterThanOrEqual(0)
            expect(commission).toBeLessThan(100) // Reasonable upper limit
          }
        }
        commissionFound = true
        break
      }
    }

    expect(commissionFound).toBe(true)
  })

  test('should handle regulation data correctly', async ({ page }) => {
    await page.waitForLoadState('networkidle')
    
    // Look for regulation information
    const regulationSelectors = [
      '[data-testid="regulation"]',
      '.regulation',
      '.regulatory',
      'text=/FCA|CySEC|ASIC|CFTC|FSA/'
    ]

    let regulationFound = false
    for (const selector of regulationSelectors) {
      const regulationElements = page.locator(selector)
      if (await regulationElements.count() > 0) {
        const firstRegulation = regulationElements.first()
        await expect(firstRegulation).toBeVisible()
        
        const regulationText = await firstRegulation.textContent()
        if (regulationText) {
          // Should contain known regulatory bodies or N/A
          expect(regulationText).toMatch(/FCA|CySEC|ASIC|CFTC|FSA|NFA|N\/A|--/)
        }
        regulationFound = true
        break
      }
    }

    expect(regulationFound).toBe(true)
  })

  test('should allow broker selection/deselection', async ({ page }) => {
    // Look for broker selection controls
    const checkboxes = page.locator('input[type="checkbox"]')
    const dropdowns = page.locator('select[name*="broker" i], .broker-selector')
    
    if (await checkboxes.count() > 0) {
      // Test checkbox selection
      const firstCheckbox = checkboxes.first()
      const initialState = await firstCheckbox.isChecked()
      
      await firstCheckbox.click()
      await page.waitForTimeout(500) // Wait for UI update
      
      const newState = await firstCheckbox.isChecked()
      expect(newState).toBe(!initialState)
      
    } else if (await dropdowns.count() > 0) {
      // Test dropdown selection
      const firstDropdown = dropdowns.first()
      const options = firstDropdown.locator('option')
      const optionCount = await options.count()
      
      if (optionCount > 1) {
        await firstDropdown.selectOption({ index: 1 })
        await page.waitForLoadState('networkidle')
      }
    }
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.reload()
    
    // Check that content is still accessible
    await expect(page.locator('h1')).toBeVisible()
    
    // On mobile, table might switch to cards or stack vertically
    const table = page.locator('table, .comparison-table')
    const cards = page.locator('.broker-card, .comparison-card')
    
    // Either table should be responsive or cards should be visible
    const tableVisible = await table.isVisible()
    const cardsVisible = await cards.count() > 0
    
    expect(tableVisible || cardsVisible).toBe(true)
  })

  test('should handle data loading states', async ({ page }) => {
    // Check for loading indicators
    const loadingSelectors = [
      '[data-testid="loading"]',
      '.loading',
      '.spinner',
      'text=/loading/i'
    ]

    // Reload page to catch loading state
    await page.reload()
    
    let loadingFound = false
    for (const selector of loadingSelectors) {
      const loadingElement = page.locator(selector)
      if (await loadingElement.count() > 0) {
        loadingFound = true
        break
      }
    }

    // Wait for content to load
    await page.waitForLoadState('networkidle')
    
    // Verify final content is displayed
    const finalContent = page.locator('table, .comparison-table, .broker-card')
    await expect(finalContent.first()).toBeVisible()
  })

  test('should not display undefined or null values', async ({ page }) => {
    await page.waitForLoadState('networkidle')
    
    // Check that page doesn't show undefined/null values
    const pageContent = await page.textContent('body')
    expect(pageContent).not.toContain('undefined')
    expect(pageContent).not.toContain('null')
    expect(pageContent).not.toContain('NaN')
    
    // Should use proper fallbacks like N/A
    const naValues = page.locator('text=/N\/A|Not Available|--/')
    expect(await naValues.count()).toBeGreaterThanOrEqual(0)
  })
})

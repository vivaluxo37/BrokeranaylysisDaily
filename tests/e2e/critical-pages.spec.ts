import { test, expect } from '@playwright/test'

test.describe('Critical Pages', () => {
  
  test.describe('Calculator Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/calculator')
    })

    test('should load calculator page successfully', async ({ page }) => {
      await expect(page).toHaveTitle(/Trading Cost Calculator/i)
      await expect(page.locator('h1')).toContainText('Trading Cost Calculator')
    })

    test('should display trading calculator component', async ({ page }) => {
      // Check for calculator component
      const calculator = page.locator('[data-testid="trading-calculator"], .bg-white.rounded-lg.shadow-lg')
      await expect(calculator).toBeVisible()
      
      // Check for calculator title
      await expect(page.locator('h2:has-text("Trading Calculator")')).toBeVisible()
    })

    test('should have working calculator inputs', async ({ page }) => {
      // Check for currency pair dropdown
      const currencyPairSelect = page.locator('select').first()
      await expect(currencyPairSelect).toBeVisible()
      
      // Check for position type radio buttons
      const buyRadio = page.locator('input[type="radio"][value="buy"]')
      const sellRadio = page.locator('input[type="radio"][value="sell"]')
      await expect(buyRadio).toBeVisible()
      await expect(sellRadio).toBeVisible()
      
      // Check for lot size input
      const lotSizeInput = page.locator('input[type="number"]').first()
      await expect(lotSizeInput).toBeVisible()
      
      // Test input interaction
      await lotSizeInput.fill('0.5')
      await expect(lotSizeInput).toHaveValue('0.5')
    })

    test('should display calculation results', async ({ page }) => {
      // Wait for initial calculation
      await page.waitForTimeout(1000)
      
      // Check for results section
      const resultsSection = page.locator('h3:has-text("Calculation Results")')
      await expect(resultsSection).toBeVisible()
      
      // Check for pip value display
      const pipValueSection = page.locator('h4:has-text("Pip Value")')
      await expect(pipValueSection).toBeVisible()
      
      // Check for trading costs display
      const costsSection = page.locator('h4:has-text("Trading Costs")')
      await expect(costsSection).toBeVisible()
      
      // Check for profit/loss display
      const profitLossSection = page.locator('h4:has-text("Profit/Loss")')
      await expect(profitLossSection).toBeVisible()
    })

    test('should update calculations when inputs change', async ({ page }) => {
      // Get initial pip value
      await page.waitForTimeout(1000)
      const initialPipValue = await page.locator('h4:has-text("Pip Value")').locator('..').locator('p').first().textContent()
      
      // Change lot size
      const lotSizeInput = page.locator('input[type="number"]').first()
      await lotSizeInput.fill('2.0')
      
      // Wait for calculation update
      await page.waitForTimeout(500)
      
      // Check that pip value changed
      const newPipValue = await page.locator('h4:has-text("Pip Value")').locator('..').locator('p').first().textContent()
      expect(newPipValue).not.toBe(initialPipValue)
    })

    test('should have educational content', async ({ page }) => {
      // Check for educational sections
      await expect(page.locator('h2:has-text("Understanding Trading Costs")')).toBeVisible()
      
      // Check for tips section
      await expect(page.locator('h3:has-text("Trading Cost Optimization Tips")')).toBeVisible()
      
      // Scroll to see all content
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
      
      // Check for educational cards
      const educationalCards = page.locator('.bg-gray-50.rounded-lg.p-6')
      expect(await educationalCards.count()).toBeGreaterThan(3)
    })
  })

  test.describe('AI Assistant Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/ai')
    })

    test('should load AI assistant page successfully', async ({ page }) => {
      await expect(page).toHaveTitle(/AI Trading Assistant/i)
      await expect(page.locator('h1')).toContainText('AI Trading Assistant')
    })

    test('should display AI assistant component', async ({ page }) => {
      // Check for AI assistant component
      const aiAssistant = page.locator('[data-testid="ai-assistant"], .bg-white.rounded-lg.shadow-lg')
      await expect(aiAssistant).toBeVisible()
      
      // Check for AI assistant title
      await expect(page.locator('h2:has-text("AI Broker Recommendation")')).toBeVisible()
    })

    test('should have working questionnaire', async ({ page }) => {
      // Check for progress bar
      const progressBar = page.locator('.bg-purple-600.h-2.rounded-full')
      await expect(progressBar).toBeVisible()
      
      // Check for first question
      const firstQuestion = page.locator('h3').first()
      await expect(firstQuestion).toBeVisible()
      
      // Check for answer options
      const answerOptions = page.locator('input[type="radio"], input[type="checkbox"]')
      expect(await answerOptions.count()).toBeGreaterThan(0)
      
      // Test selecting an answer
      const firstOption = answerOptions.first()
      await firstOption.click()
      
      // Check that Next button becomes enabled
      const nextButton = page.locator('button:has-text("Next")')
      await expect(nextButton).toBeEnabled()
    })

    test('should progress through questionnaire', async ({ page }) => {
      // Answer first question
      const firstOption = page.locator('input[type="radio"]').first()
      await firstOption.click()
      
      // Click Next
      const nextButton = page.locator('button:has-text("Next")')
      await nextButton.click()
      
      // Check that we moved to next question
      const progressText = page.locator('text=Question 2 of')
      await expect(progressText).toBeVisible()
      
      // Check that Previous button is now visible
      const prevButton = page.locator('button:has-text("Previous")')
      await expect(prevButton).toBeVisible()
    })

    test('should show how it works section', async ({ page }) => {
      // Check for how it works section
      await expect(page.locator('h2:has-text("How Our AI Assistant Works")')).toBeVisible()
      
      // Check for step indicators
      const stepNumbers = page.locator('.text-2xl.font-bold.text-purple-600, .text-2xl.font-bold.text-blue-600, .text-2xl.font-bold.text-green-600')
      expect(await stepNumbers.count()).toBe(3)
      
      // Check step descriptions
      await expect(page.locator('h3:has-text("Answer Questions")')).toBeVisible()
      await expect(page.locator('h3:has-text("AI Analysis")')).toBeVisible()
      await expect(page.locator('h3:has-text("Get Recommendations")')).toBeVisible()
    })

    test('should have features section', async ({ page }) => {
      // Scroll to features section
      await page.locator('h2:has-text("AI Assistant Features")').scrollIntoViewIfNeeded()
      
      // Check for features section
      await expect(page.locator('h2:has-text("AI Assistant Features")')).toBeVisible()
      
      // Check for feature cards
      const featureCards = page.locator('.bg-white.rounded-lg.p-6.shadow-md')
      expect(await featureCards.count()).toBeGreaterThan(4)
      
      // Check for specific features
      await expect(page.locator('h3:has-text("Regulation Analysis")')).toBeVisible()
      await expect(page.locator('h3:has-text("Cost Optimization")')).toBeVisible()
    })

    test('should have FAQ section', async ({ page }) => {
      // Scroll to FAQ section
      await page.locator('h2:has-text("Frequently Asked Questions")').scrollIntoViewIfNeeded()
      
      // Check for FAQ section
      await expect(page.locator('h2:has-text("Frequently Asked Questions")')).toBeVisible()
      
      // Check for FAQ items
      const faqItems = page.locator('h3').filter({ hasText: /Is the AI assistant|How accurate|Can I get|What if/ })
      expect(await faqItems.count()).toBeGreaterThan(3)
    })
  })

  test.describe('Broker Category Overview Pages', () => {
    test('should load broker reviews page', async ({ page }) => {
      await page.goto('/brokers/reviews')
      
      await expect(page).toHaveTitle(/Broker Reviews/i)
      await expect(page.locator('h1')).toContainText('Broker Reviews')
      
      // Check for review methodology section
      await expect(page.locator('h2:has-text("Review Methodology")')).toBeVisible()
      
      // Check for performance statistics
      await expect(page.locator('h2:has-text("Review Performance")')).toBeVisible()
    })

    test('should load countries overview page', async ({ page }) => {
      await page.goto('/brokers/countries')
      
      await expect(page).toHaveTitle(/Countries/i)
      await expect(page.locator('h1')).toContainText('Countries')
      
      // Check for popular countries section
      await expect(page.locator('h2:has-text("Popular Countries")')).toBeVisible()
      
      // Check for regulation guide
      await expect(page.locator('h2:has-text("Regulation Guide")')).toBeVisible()
      
      // Check for country cards
      const countryCards = page.locator('.bg-white.rounded-lg.shadow-md')
      expect(await countryCards.count()).toBeGreaterThan(6)
    })

    test('should load platforms overview page', async ({ page }) => {
      await page.goto('/brokers/platforms')
      
      await expect(page).toHaveTitle(/Platforms/i)
      await expect(page.locator('h1')).toContainText('Platforms')
      
      // Check for platform comparison section
      await expect(page.locator('h2:has-text("Platform Comparison")')).toBeVisible()
      
      // Check for platform selection guide
      await expect(page.locator('h2:has-text("Platform Selection Guide")')).toBeVisible()
      
      // Check for platform cards
      const platformCards = page.locator('.bg-white.rounded-lg.shadow-md')
      expect(await platformCards.count()).toBeGreaterThan(6)
    })

    test('should load account types overview page', async ({ page }) => {
      await page.goto('/brokers/account-types')
      
      await expect(page).toHaveTitle(/Account Types/i)
      await expect(page.locator('h1')).toContainText('Account Types')
      
      // Check for account comparison section
      await expect(page.locator('h2:has-text("Account Type Comparison")')).toBeVisible()
      
      // Check for selection guide
      await expect(page.locator('h2:has-text("Account Selection Guide")')).toBeVisible()
      
      // Check for account type cards
      const accountCards = page.locator('.bg-white.rounded-lg.shadow-md')
      expect(await accountCards.count()).toBeGreaterThan(6)
    })
  })

  test.describe('Navigation Integration', () => {
    test('should have working navigation to critical pages', async ({ page }) => {
      await page.goto('/')
      
      // Test navigation to calculator
      const calculatorLink = page.locator('a[href="/calculator"]')
      if (await calculatorLink.count() > 0) {
        await calculatorLink.click()
        await expect(page).toHaveURL(/\/calculator/)
        await page.goBack()
      }
      
      // Test navigation to AI assistant
      const aiLink = page.locator('a[href="/ai"]')
      if (await aiLink.count() > 0) {
        await aiLink.click()
        await expect(page).toHaveURL(/\/ai/)
        await page.goBack()
      }
    })

    test('should have working footer links to tools', async ({ page }) => {
      await page.goto('/')
      
      // Scroll to footer
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
      
      // Check for tools section in footer
      const toolsSection = page.locator('footer').locator('text=Tools')
      if (await toolsSection.count() > 0) {
        // Check for calculator link
        const calculatorLink = page.locator('footer a[href="/calculator"]')
        await expect(calculatorLink).toBeVisible()
        
        // Check for AI assistant link
        const aiLink = page.locator('footer a[href="/ai"]')
        await expect(aiLink).toBeVisible()
      }
    })
  })

  test.describe('SEO and Performance', () => {
    const criticalPages = [
      '/calculator',
      '/ai',
      '/brokers/reviews',
      '/brokers/countries',
      '/brokers/platforms',
      '/brokers/account-types'
    ]

    criticalPages.forEach(pagePath => {
      test(`should have proper SEO for ${pagePath}`, async ({ page }) => {
        await page.goto(pagePath)
        
        // Check title
        const title = await page.title()
        expect(title).toBeTruthy()
        expect(title.length).toBeGreaterThan(10)
        expect(title.length).toBeLessThan(70)
        
        // Check meta description
        const metaDescription = await page.locator('meta[name="description"]').getAttribute('content')
        expect(metaDescription).toBeTruthy()
        expect(metaDescription!.length).toBeGreaterThan(50)
        expect(metaDescription!.length).toBeLessThan(160)
        
        // Check H1
        const h1Count = await page.locator('h1').count()
        expect(h1Count).toBe(1)
      })
    })

    test('should load critical pages quickly', async ({ page }) => {
      for (const pagePath of criticalPages) {
        const startTime = Date.now()
        await page.goto(pagePath)
        await page.waitForLoadState('networkidle')
        const loadTime = Date.now() - startTime
        
        expect(loadTime).toBeLessThan(5000)
      }
    })
  })
})

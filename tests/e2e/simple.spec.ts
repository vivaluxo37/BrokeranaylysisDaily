import { test, expect } from '@playwright/test'

test.describe('Simple Test', () => {
  test('should be able to navigate to Google', async ({ page }) => {
    await page.goto('https://www.google.com')
    await expect(page).toHaveTitle(/Google/)
  })

  test('should be able to test basic functionality', async ({ page }) => {
    await page.goto('https://example.com')
    await expect(page.locator('h1')).toContainText('Example Domain')
  })
})

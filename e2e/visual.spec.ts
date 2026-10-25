import { expect, test } from '@playwright/test'

const WIDTHS = [320, 375, 768, 1024, 1440] as const
const SHEETS = [
  { path: '/#/sheet/1/1', name: 'g1h1' },
  { path: '/#/sheet/4/2', name: 'g4h2' },
] as const

test.describe('visual regression', () => {
  test.beforeEach(({ browserName }) => {
    test.skip(browserName !== 'chromium', 'Baselines are captured on Chromium only')
  })

  for (const width of WIDTHS) {
    for (const sheet of SHEETS) {
      test(`${sheet.name} at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: Math.round(width * 1.8) })
        await page.goto(sheet.path)
        await page.evaluate(() => document.fonts.ready)
        await expect(page.locator('.formation .marker')).toHaveCount(7)
        await expect(page).toHaveScreenshot(`${sheet.name}-${width}.png`, { fullPage: true })
      })
    }
  }

  for (const tactic of ['attack', 'defend-1', 'defend-2']) {
    test(`tactics ${tactic} at 375px`, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 })
      await page.goto(`/#/tactics/${tactic}`)
      await page.evaluate(() => document.fonts.ready)
      await expect(page.locator('.tactics .marker')).toHaveCount(7)
      await expect(page).toHaveScreenshot(`tactics-${tactic}-375.png`, { fullPage: true })
    })
  }

  test('attacking pattern 1 first step at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/#/tactics/attacking-1')
    await page.evaluate(() => document.fonts.ready)
    await expect(page.getByTestId('ball')).toBeVisible()
    await expect(page).toHaveScreenshot('tactics-attacking-1-375.png', { fullPage: true })
  })

  test('summary page at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 })
    await page.goto('/#/summary')
    await page.evaluate(() => document.fonts.ready)
    await expect(page).toHaveScreenshot('summary-375.png', { fullPage: true })
  })
})

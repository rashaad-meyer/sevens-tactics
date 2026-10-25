import { expect, test } from '@playwright/test'

const WIDTHS = [320, 375, 768, 1024, 1440, 1920] as const

test.describe('responsive layout', () => {
  for (const width of WIDTHS) {
    test(`no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 })
      await page.goto('/#/sheet/1/1')
      await expect(page.locator('.formation .marker')).toHaveCount(7)
      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }))
      expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth)
    })
  }

  test('the whole pitch fits on a small phone screen without scrolling', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/#/sheet/1/1')
    const box = await page.locator('.team-sheet__pitch .pitch').boundingBox()
    expect(box).not.toBeNull()
    expect(box!.y + box!.height).toBeLessThanOrEqual(667)
    expect(box!.width).toBeGreaterThan(280)
  })

  test('name plates stay inside the pitch at 320px', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 })
    await page.goto('/#/sheet/3/2')
    const pitch = await page.locator('.team-sheet__pitch .pitch').boundingBox()
    const plates = await page.locator('[data-testid="name-plate"] rect').all()
    for (const plate of plates) {
      const box = await plate.boundingBox()
      expect(box!.x).toBeGreaterThanOrEqual(pitch!.x)
      expect(box!.x + box!.width).toBeLessThanOrEqual(pitch!.x + pitch!.width)
      expect(box!.y + box!.height).toBeLessThanOrEqual(pitch!.y + pitch!.height)
    }
  })
})

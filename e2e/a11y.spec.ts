import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const ROUTES = ['/#/sheet/1/1', '/#/sheet/4/2', '/#/summary', '/#/tactics/attack', '/#/tactics/defend-2', '/#/tactics/attacking-1', '/#/tactics/attacking-2', '/#/tactics/attacking-2?side=right']

test.describe('accessibility', () => {
  for (const route of ROUTES) {
    test(`${route} has no axe violations`, async ({ page }) => {
      await page.goto(route)
      await expect(page.getByRole('combobox').first()).toBeVisible()
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze()
      expect(results.violations).toEqual([])
    })
  }

  test('each player marker is exposed in the accessibility tree', async ({ page }) => {
    await page.goto('/#/sheet/1/1')
    const snapshot = await page.locator('.team-sheet__pitch').ariaSnapshot()
    expect(snapshot).toContain('group "Game 1, half 1 line-up, attacking towards the top"')
    for (const label of [
      'Striker: Adam',
      'Left midfield: Cass',
      'Centre midfield: Rashaad',
      'Right midfield: Laurie Ann',
      'Left defender: Josh',
      'Right defender: Angelo',
      'Goalkeeper: Jayden',
    ]) {
      expect(snapshot).toContain(`img "${label}"`)
    }
  })

  test('respects reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/#/sheet/1/1')
    const durationSeconds = await page
      .locator('.formation .marker__body')
      .first()
      .evaluate((el) => parseFloat(getComputedStyle(el).animationDuration))
    // Browsers report "0.01ms" as 1e-05s; anything under a millisecond is effectively off.
    expect(durationSeconds).toBeLessThan(0.001)
  })
})

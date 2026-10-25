import { expect, test } from '@playwright/test'

test.describe('tactics', () => {
  test('opens on Attack with the tactic dropdown in the header', async ({ page }) => {
    await page.goto('/#/tactics')
    await expect(page).toHaveURL(/#\/tactics\/attack$/)
    const select = page.getByRole('combobox', { name: 'Tactic' })
    await expect(select).toHaveValue('attack')
    await expect(page.getByRole('combobox', { name: 'Team sheet' })).toHaveCount(0)
    await expect(page.locator('.tactics .marker')).toHaveCount(7)
  })

  test('switching tactic moves the same markers into the new shape', async ({ page }) => {
    await page.goto('/#/tactics/attack')
    const lm = page.getByRole('img', { name: 'Left midfield' })
    await expect(lm).toHaveAttribute('style', /translate\(20px, 64px\)/)

    await page.getByRole('combobox', { name: 'Tactic' }).selectOption('Defend 1 · 4-2-0')
    await expect(page).toHaveURL(/#\/tactics\/defend-1$/)
    await expect(lm).toHaveAttribute('style', /translate\(15px, 104px\)/)
    await expect(page.getByRole('img', { name: 'Striker' })).toHaveAttribute(
      'style',
      /translate\(36px, 76px\)/,
    )

    await page.getByRole('combobox', { name: 'Tactic' }).selectOption('Defend 2 · 3-3-0')
    await expect(page).toHaveURL(/#\/tactics\/defend-2$/)
    await expect(page.getByRole('img', { name: 'Centre midfield' })).toHaveAttribute(
      'style',
      /translate\(50px, 111px\)/,
    )
  })

  test('markers have a transform transition so the move animates', async ({ page }) => {
    await page.goto('/#/tactics/attack')
    const property = await page
      .getByRole('img', { name: 'Left midfield' })
      .evaluate((el) => getComputedStyle(el).transitionProperty)
    expect(property).toContain('transform')
  })

  test('the pitch still fits a small phone screen', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/#/tactics/defend-1')
    const box = await page.locator('.tactics__pitch .pitch').boundingBox()
    expect(box!.y + box!.height).toBeLessThanOrEqual(667)
  })

  test('going back to Sheets restores the team sheet dropdown', async ({ page }) => {
    await page.goto('/#/tactics/defend-2')
    await page.getByRole('link', { name: 'Sheets' }).click()
    await expect(page).toHaveURL(/#\/sheet\/1\/1$/)
    await expect(page.getByRole('combobox', { name: 'Team sheet' })).toBeVisible()
  })
})

import { expect, test } from '@playwright/test'

test.describe('attacking pattern 1', () => {
  test('is in the tactics dropdown under Patterns', async ({ page }) => {
    await page.goto('/#/tactics')
    const select = page.getByRole('combobox', { name: 'Tactic' })
    await expect(select.locator('optgroup[label="Patterns"] option')).toHaveText(['Attacking Pattern 1'])
    await select.selectOption('Attacking Pattern 1')
    await expect(page).toHaveURL(/#\/tactics\/attacking-1$/)
    await expect(page.getByText('Step 1/9')).toBeVisible()
    await expect(page.getByTestId('ball')).toBeVisible()
  })

  test('stepping moves the ball and the players', async ({ page }) => {
    await page.goto('/#/tactics/attacking-1')
    const ball = page.getByTestId('ball')
    const lm = page.getByRole('img', { name: /Left midfield/ })
    await expect(ball).toHaveAttribute('style', /translate\(56px, 135px\)/)

    await page.getByRole('button', { name: 'Next' }).click()
    await expect(page.getByText('Step 2/9')).toBeVisible()
    await expect(ball).toHaveAttribute('style', /translate\(33px, 128px\)/)

    await page.getByRole('button', { name: 'Next' }).click()
    await expect(lm).toHaveAttribute('style', /translate\(19px, 86px\)/)

    await page.getByRole('button', { name: 'Go to step 9' }).click()
    await expect(page.getByText('Shot on goal.')).toBeVisible()
    await expect(ball).toHaveAttribute('style', /translate\(47px, 2\.5px\)/)
    await expect(page.getByRole('button', { name: 'Next' })).toBeDisabled()
  })

  test('play runs through to the end and offers replay', async ({ page }) => {
    await page.goto('/#/tactics/attacking-1')
    await page.getByRole('button', { name: 'Play' }).click()
    await expect(page.getByRole('button', { name: 'Pause' })).toBeVisible()
    await expect(page.getByText('Shot on goal.')).toBeVisible({ timeout: 20_000 })
    await expect(page.getByRole('button', { name: 'Replay' })).toBeVisible()
  })

  test('ball and players transition on transform for the step duration', async ({ page }) => {
    await page.goto('/#/tactics/attacking-1')
    await page.getByRole('button', { name: 'Next' }).click()
    const ballTransition = await page
      .getByTestId('ball')
      .evaluate((el) => [getComputedStyle(el).transitionProperty, getComputedStyle(el).transitionDuration])
    expect(ballTransition[0]).toContain('transform')
    expect(ballTransition[1]).toBe('0.9s')
    const markerDuration = await page
      .getByRole('img', { name: /Left defender/ })
      .evaluate((el) => getComputedStyle(el).transitionDuration)
    expect(markerDuration).toBe('0.9s')
  })

  test('fits a small phone including the controls', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/#/tactics/attacking-1')
    const pitch = await page.locator('.drill__pitch .pitch').boundingBox()
    expect(pitch!.y + pitch!.height).toBeLessThanOrEqual(667)
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)
    expect(overflow).toBe(true)
  })
})

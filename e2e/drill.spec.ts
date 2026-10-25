import { expect, test, type Page } from '@playwright/test'

/** Drills autoplay on open; park on step 1 so position assertions are stable. */
async function openPaused(page: Page) {
  await page.goto('/#/tactics/attacking-1')
  await page.getByRole('button', { name: 'Go to step 1' }).click()
  await expect(page.getByText('Step 1/8')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Play' })).toBeVisible()
}

test.describe('attacking pattern 1', () => {
  test('is in the tactics dropdown under Patterns and starts playing on its own', async ({ page }) => {
    await page.goto('/#/tactics')
    const select = page.getByRole('combobox', { name: 'Tactic' })
    await expect(select.locator('optgroup[label="Patterns"] option')).toHaveText(['Attacking Pattern 1', 'Attacking Pattern 2'])
    await select.selectOption('Attacking Pattern 1')
    await expect(page).toHaveURL(/#\/tactics\/attacking-1$/)
    await expect(page.getByRole('button', { name: 'Pause' })).toBeVisible()
    await expect(page.getByTestId('ball')).toBeVisible()
    // It advances without any click.
    await expect(page.getByText('Step 2/8')).toBeVisible({ timeout: 5_000 })
  })

  test('stepping manually pauses and moves the ball and the players', async ({ page }) => {
    await openPaused(page)
    const ball = page.getByTestId('ball')
    const lm = page.getByRole('img', { name: /Left midfield/ })
    await expect(ball).toHaveAttribute('style', /translate\(56px, 135px\)/)

    await page.getByRole('button', { name: 'Next' }).click()
    await expect(page.getByText('Step 2/8')).toBeVisible()
    await expect(ball).toHaveAttribute('style', /translate\(33px, 128px\)/)

    await page.getByRole('button', { name: 'Next' }).click()
    await expect(lm).toHaveAttribute('style', /translate\(19px, 86px\)/)

    await page.getByRole('button', { name: 'Go to step 8' }).click()
    await expect(page.getByText('Shot on goal.')).toBeVisible()
    await expect(ball).toHaveAttribute('style', /translate\(51px, 2\.5px\)/)
    await expect(page.getByRole('button', { name: 'Next' })).toBeDisabled()
  })

  test('autoplay runs to the shot and loops back to the start', async ({ page }) => {
    await page.goto('/#/tactics/attacking-1')
    await expect(page.getByText('Shot on goal.')).toBeVisible({ timeout: 20_000 })
    await expect(page.getByText('Step 1/8')).toBeVisible({ timeout: 5_000 })
    await expect(page.getByRole('button', { name: 'Pause' })).toBeVisible()
  })

  test('pause stops it and play resumes', async ({ page }) => {
    await page.goto('/#/tactics/attacking-1')
    await page.getByRole('button', { name: 'Pause' }).click()
    const step = await page.locator('.drill__step').textContent()
    await page.waitForTimeout(2_500)
    await expect(page.locator('.drill__step')).toHaveText(step!)
    await page.getByRole('button', { name: 'Play' }).click()
    await expect(page.locator('.drill__step')).not.toHaveText(step!, { timeout: 5_000 })
  })

  test('ball and players transition on transform for the step duration', async ({ page }) => {
    await openPaused(page)
    await page.getByRole('button', { name: 'Next' }).click()
    const ballTransition = await page
      .getByTestId('ball')
      .evaluate((el) => [getComputedStyle(el).transitionProperty, getComputedStyle(el).transitionDuration])
    expect(ballTransition[0]).toContain('transform')
    expect(ballTransition[1]).toBe('0.6s')
    const markerDuration = await page
      .getByRole('img', { name: /Left defender/ })
      .evaluate((el) => getComputedStyle(el).transitionDuration)
    expect(markerDuration).toBe('0.6s')
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

test.describe('attacking pattern 2', () => {
  test('runs GK to CM, through ball to LM, cross, goal', async ({ page }) => {
    await page.goto('/#/tactics/attacking-2')
    await page.getByRole('button', { name: 'Go to step 1' }).click()
    await expect(page.getByText('Step 1/8')).toBeVisible()
    await page.getByRole('button', { name: 'Go to step 3' }).click()
    await expect(page.getByRole('img', { name: 'Centre midfield (on the ball)' })).toBeVisible()
    await page.getByRole('button', { name: 'Go to step 5' }).click()
    await expect(page.getByRole('img', { name: 'Left midfield (on the ball)' })).toBeVisible()
    await page.getByRole('button', { name: 'Go to step 8' }).click()
    await expect(page.getByText('Goal.')).toBeVisible()
    await expect(page.getByTestId('ball')).toHaveAttribute('style', /translate\(50px, 2\.5px\)/)
  })
})

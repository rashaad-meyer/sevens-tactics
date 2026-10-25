import { expect, test } from '@playwright/test'

test.describe('team sheet viewer', () => {
  test('loads the first sheet with seven markers', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/#\/sheet\/1\/1$/)
    await expect(page.getByRole('heading', { name: 'Game 1, half 1 team sheet' })).toBeAttached()
    await expect(page.locator('.formation .marker')).toHaveCount(7)
    await expect(page.getByRole('img', { name: 'Striker: Hannah' })).toBeVisible()
  })

  test('selecting a game and half updates the URL and the sheet', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('combobox', { name: 'Team sheet' }).selectOption('Game 4 | Half 2')
    await expect(page).toHaveURL(/#\/sheet\/4\/2$/)
    await expect(page.getByRole('img', { name: 'Goalkeeper: Declan' })).toBeVisible()
    await expect(page.getByRole('img', { name: 'Striker: Laurie Ann' })).toContainText('LA')
  })

  test('back button returns to the previous sheet', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('combobox', { name: 'Team sheet' }).selectOption('Game 2 | Half 1')
    await expect(page).toHaveURL(/#\/sheet\/2\/1$/)
    await page.goBack()
    await expect(page).toHaveURL(/#\/sheet\/1\/1$/)
    await expect(page.getByRole('img', { name: 'Striker: Hannah' })).toBeVisible()
  })

  test('deep links and prev/next work', async ({ page }) => {
    await page.goto('/#/sheet/3/1')
    await expect(page.getByRole('img', { name: 'Striker: Maria' })).toBeVisible()
    await page.getByRole('link', { name: 'Next: Game 3 | Half 2' }).click()
    await expect(page).toHaveURL(/#\/sheet\/3\/2$/)
    await page.getByRole('link', { name: 'Previous: Game 3 | Half 1' }).click()
    await expect(page).toHaveURL(/#\/sheet\/3\/1$/)
  })

  test('invalid deep link falls back to the first sheet', async ({ page }) => {
    await page.goto('/#/sheet/7/3')
    await expect(page).toHaveURL(/#\/sheet\/1\/1$/)
  })

  test('bench is collapsed by default and expands on tap', async ({ page }) => {
    await page.goto('/')
    const list = page.getByRole('list', { name: 'Players off the pitch' })
    await expect(list).toBeHidden()
    await page.getByText('Off', { exact: true }).click()
    await expect(list).toBeVisible()
    await expect(list.getByRole('listitem')).toHaveCount(7)
  })

  test('keyboard: the select is reachable by Tab and operable', async ({ page, browserName }) => {
    await page.goto('/')
    const select = page.getByRole('combobox', { name: 'Team sheet' })
    // Tab through the three nav links to the select.
    for (let i = 0; i < 4; i += 1) await page.keyboard.press('Tab')
    await expect(select).toBeFocused()

    // macOS and WebKit open a native picker on ArrowDown instead of changing the value,
    // so the keyboard value change is only asserted where it is deterministic.
    test.skip(
      process.platform === 'darwin' || browserName === 'webkit',
      'Native picker intercepts arrow keys on this platform',
    )
    await page.keyboard.press('ArrowDown')
    await expect(page).toHaveURL(/#\/sheet\/1\/2$/)
  })
})

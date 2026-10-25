import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import { routes } from '../routes'

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  render(<RouterProvider router={router} />)
  return router
}

const select = () => screen.getByRole('combobox', { name: 'Team sheet' })

describe('app routing', () => {
  it('redirects / to the first team sheet', async () => {
    const router = renderAt('/')
    expect(await screen.findByRole('heading', { name: 'Game 1, half 1 team sheet' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/sheet/1/1')
    expect(select()).toHaveValue('g1h1')
  })

  it('renders a deep-linked sheet', async () => {
    renderAt('/sheet/3/2')
    expect(await screen.findByRole('heading', { name: 'Game 3, half 2 team sheet' })).toBeInTheDocument()
    expect(select()).toHaveValue('g3h2')
  })

  it('falls back to the default sheet for invalid params', async () => {
    const router = renderAt('/sheet/9/9')
    expect(await screen.findByRole('heading', { name: 'Game 1, half 1 team sheet' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/sheet/1/1')
  })

  it('changes the route when a different game and half is selected', async () => {
    const user = userEvent.setup()
    const router = renderAt('/sheet/1/1')
    await screen.findByRole('heading', { name: 'Game 1, half 1 team sheet' })
    await user.selectOptions(select(), 'Game 2 | Half 1')
    expect(router.state.location.pathname).toBe('/sheet/2/1')
    expect(await screen.findByRole('img', { name: 'Goalkeeper: Declan' })).toBeInTheDocument()
  })

  it('offers previous and next links below the sheet', async () => {
    const user = userEvent.setup()
    const router = renderAt('/sheet/1/2')
    const nav = await screen.findByRole('navigation', { name: 'Previous and next team sheet' })
    expect(within(nav).getByRole('link', { name: 'Previous: Game 1 | Half 1' })).toBeInTheDocument()
    await user.click(within(nav).getByRole('link', { name: 'Next: Game 2 | Half 1' }))
    expect(router.state.location.pathname).toBe('/sheet/2/1')
  })

  it('disables previous on the first sheet and next on the last', async () => {
    renderAt('/sheet/1/1')
    const nav = await screen.findByRole('navigation', { name: 'Previous and next team sheet' })
    expect(within(nav).queryByRole('link', { name: /Previous/ })).toBeNull()
    expect(within(nav).getByRole('link', { name: 'Next: Game 1 | Half 2' })).toBeInTheDocument()
  })

  it('renders the summary page with derived halves', async () => {
    renderAt('/summary')
    expect(await screen.findByRole('heading', { name: 'Summary' })).toBeInTheDocument()
    const jayden = screen.getByText('Jayden').closest('tr')!
    expect(jayden.textContent).toContain('1 (+6 in goal)')
    expect(screen.getByText(/Minimum 2 girls/)).toBeInTheDocument()
  })

  it('redirects /tactics to the Attack shape and swaps the header select', async () => {
    const router = renderAt('/tactics')
    expect(await screen.findByRole('heading', { name: 'Attack 2-3-1' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/tactics/attack')
    const tacticSelect = screen.getByRole('combobox', { name: 'Tactic' })
    expect(tacticSelect).toHaveValue('attack')
    expect(screen.queryByRole('combobox', { name: 'Team sheet' })).toBeNull()
    const gk = await screen.findByRole('img', { name: 'Goalkeeper' })
    expect(gk).toHaveClass('marker--neutral')
  })

  it('moves the markers when a defensive tactic is chosen', async () => {
    const user = userEvent.setup()
    const router = renderAt('/tactics/attack')
    const lm = await screen.findByRole('img', { name: 'Left midfield' })
    expect(lm).toHaveStyle({ transform: 'translate(20px, 64px)' })
    await user.selectOptions(screen.getByRole('combobox', { name: 'Tactic' }), 'Defend 1 · 4-2-0')
    expect(router.state.location.pathname).toBe('/tactics/defend-1')
    expect(await screen.findByRole('heading', { name: 'Defend 1 4-2-0' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Left midfield' })).toHaveStyle({
      transform: 'translate(15px, 104px)',
    })
    expect(screen.getByRole('img', { name: 'Striker' })).toHaveStyle({
      transform: 'translate(36px, 76px)',
    })
  })

  it('plays Attacking Pattern 1 with a ball that moves between steps', async () => {
    const user = userEvent.setup()
    const router = renderAt('/tactics/attack')
    await screen.findByRole('heading', { name: 'Attack 2-3-1' })
    await user.selectOptions(screen.getByRole('combobox', { name: 'Tactic' }), 'Attacking Pattern 1')
    expect(router.state.location.pathname).toBe('/tactics/attacking-1')
    expect(await screen.findByRole('heading', { name: 'Attacking Pattern 1 Pattern' })).toBeInTheDocument()
    // Drills autoplay; pause so the assertions below are deterministic.
    await user.click(screen.getByRole('button', { name: 'Pause' }))
    await user.click(screen.getByRole('button', { name: 'Go to step 1' }))
    expect(screen.getByText(/Step 1\/9/)).toBeInTheDocument()
    const ball = screen.getByTestId('ball')
    expect(ball).toHaveStyle({ transform: 'translate(56px, 135px)' })
    expect(screen.getByRole('img', { name: 'Goalkeeper (on the ball)' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Next' }))
    expect(screen.getByText(/Step 2\/9/)).toBeInTheDocument()
    expect(ball).toHaveStyle({ transform: 'translate(33px, 128px)' })
    expect(screen.getByRole('img', { name: 'Left defender (on the ball)' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Go to step 9' }))
    expect(screen.getByText('Shot on goal.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Replay' })).toBeInTheDocument()
  })

  it('falls back to Attack for an unknown tactic', async () => {
    const router = renderAt('/tactics/park-the-bus')
    expect(await screen.findByRole('heading', { name: 'Attack 2-3-1' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/tactics/attack')
  })

  it('shows not found for unknown routes', async () => {
    renderAt('/nope')
    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
  })

  it('still shows the select on the summary page and navigates from it', async () => {
    const user = userEvent.setup()
    const router = renderAt('/summary')
    await screen.findByRole('heading', { name: 'Summary' })
    await user.selectOptions(select(), 'Game 2 | Half 2')
    expect(router.state.location.pathname).toBe('/sheet/2/2')
  })
})

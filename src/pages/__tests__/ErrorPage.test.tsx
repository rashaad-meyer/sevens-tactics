import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ErrorPage } from '../ErrorPage'

function Thrower(): never {
  throw new Error('Boom from a route')
}

describe('ErrorPage', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('catches a render error and offers a way back', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const router = createMemoryRouter(
      [{ path: '/', element: <Thrower />, errorElement: <ErrorPage /> }],
      { initialEntries: ['/'] },
    )
    render(<RouterProvider router={router} />)
    expect(await screen.findByRole('heading', { name: 'Something broke' })).toBeInTheDocument()
    expect(screen.getByText('Boom from a route')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Reload the team sheets' })).toHaveAttribute(
      'href',
      '/sheet/1/1',
    )
  })
})

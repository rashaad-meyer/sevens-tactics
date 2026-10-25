import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { getBench, getSheet } from '../../../data/selectors'
import { Bench } from '../Bench'
import { Legend } from '../Legend'

describe('Bench', () => {
  it('is collapsed by default and lists the bench in squad order', () => {
    const { container } = render(<Bench players={getBench(getSheet('g1h1')!)} />)
    const details = container.querySelector('details')
    expect(details).not.toHaveAttribute('open')
    expect(screen.getByText('7 players')).toBeInTheDocument()
    const names = screen.getAllByRole('listitem').map((li) => li.textContent)
    expect(names).toEqual(['Hannah', 'Laura', 'Maria', 'Declan', 'Alex', 'Tumelo', 'James'])
  })

  it('colour-codes chips by gender', () => {
    render(<Bench players={getBench(getSheet('g1h1')!)} />)
    expect(screen.getByText('Laura')).toHaveClass('bench__chip--f')
    expect(screen.getByText('Declan')).toHaveClass('bench__chip--m')
  })
})

describe('Legend', () => {
  it('shows the three marker types', () => {
    render(<Legend />)
    const items = screen.getAllByRole('listitem').map((li) => li.textContent)
    expect(items).toEqual(['Girls', 'Boys', 'Goalkeeper'])
  })
})

import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { getSheet } from '../../../data/selectors'
import { TeamSheet } from '../../team-sheet/TeamSheet'
import { PositionMarker } from '../PositionMarker'

describe('TeamSheet markers', () => {
  it('renders seven markers with position codes and name plates', () => {
    render(<TeamSheet sheet={getSheet('g1h1')!} />)
    const layer = screen.getByTestId('formation-layer')
    const markers = layer.querySelectorAll('.marker')
    expect(markers).toHaveLength(7)
    expect(within(layer).getAllByTestId('name-plate')).toHaveLength(7)
    expect(screen.getByRole('img', { name: 'Striker: Adam' })).toHaveClass('marker--boy')
    expect(screen.getByRole('img', { name: 'Left midfield: Cass' })).toHaveClass('marker--girl')
    expect(screen.getByRole('img', { name: 'Goalkeeper: Jayden' })).toHaveClass('marker--gk')
    expect(layer.textContent).toContain('ST')
    expect(layer.textContent).toContain('Rashaad')
  })

  it('positions markers with a CSS transform in pitch units', () => {
    render(<TeamSheet sheet={getSheet('g1h1')!} />)
    const striker = screen.getByRole('img', { name: 'Striker: Adam' })
    expect(striker).toHaveStyle({ transform: 'translate(50px, 30px)' })
  })

  it('uses the gk variant by slot, not by player', () => {
    render(<TeamSheet sheet={getSheet('g2h1')!} />)
    expect(screen.getByRole('img', { name: 'Goalkeeper: Declan' })).toHaveClass('marker--gk')
    expect(screen.getByRole('img', { name: 'Right defender: Jayden' })).toHaveClass('marker--boy')
  })

  it('shows the short name LA for Laurie Ann on the pitch', () => {
    render(<TeamSheet sheet={getSheet('g4h1')!} />)
    const marker = screen.getByRole('img', { name: 'Left midfield: Laurie Ann' })
    expect(within(marker).getByTestId('name-plate').textContent).toBe('LA')
    expect(marker).toHaveClass('marker--girl')
  })
})

describe('PositionMarker', () => {
  it('renders a nameless disc for tactics use', () => {
    render(
      <svg>
        <PositionMarker x={10} y={20} position="CM" variant="neutral" label="Centre midfield" />
      </svg>,
    )
    const marker = screen.getByRole('img', { name: 'Centre midfield' })
    expect(marker).toHaveClass('marker--neutral')
    expect(marker.textContent).toBe('CM')
    expect(marker.querySelector('[data-testid="name-plate"]')).toBeNull()
  })
})

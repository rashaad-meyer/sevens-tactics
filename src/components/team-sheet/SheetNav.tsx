import { Link } from 'react-router'
import { formatSheetLabel } from '../../data/selectors'
import type { TeamSheet } from '../../data/types'
import { sheetPath } from '../../hooks/useSelectedSheet'

interface SheetNavProps {
  previous: TeamSheet | undefined
  next: TeamSheet | undefined
}

/** Previous / next buttons shown below the team sheet. */
export function SheetNav({ previous, next }: SheetNavProps) {
  return (
    <nav className="sheet-nav" aria-label="Previous and next team sheet">
      <NavButton sheet={previous} direction="prev" />
      <NavButton sheet={next} direction="next" />
    </nav>
  )
}

function NavButton({ sheet, direction }: { sheet: TeamSheet | undefined; direction: 'prev' | 'next' }) {
  const kicker = direction === 'prev' ? 'Previous' : 'Next'
  if (!sheet) {
    return (
      <span className={`sheet-nav__button sheet-nav__button--${direction} is-disabled`} aria-disabled="true">
        <span className="sheet-nav__kicker">{kicker}</span>
        <span className="sheet-nav__label display">—</span>
      </span>
    )
  }
  return (
    <Link
      to={sheetPath(sheet)}
      className={`sheet-nav__button sheet-nav__button--${direction}`}
      aria-label={`${kicker}: ${formatSheetLabel(sheet)}`}
    >
      <span className="sheet-nav__kicker">{kicker}</span>
      <span className="sheet-nav__label display">{formatSheetLabel(sheet)}</span>
    </Link>
  )
}

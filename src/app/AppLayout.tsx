import { NavLink, Outlet } from 'react-router'
import { GameHalfSelect } from '../components/game-half-select/GameHalfSelect'
import { useSelectedSheet } from '../hooks/useSelectedSheet'
import './app.css'

const NAV_LINKS = [
  { to: '/sheet/1/1', label: 'Sheets', matchPrefix: '/sheet' },
  { to: '/summary', label: 'Summary', matchPrefix: '/summary' },
  { to: '/tactics', label: 'Tactics', matchPrefix: '/tactics' },
] as const

export function AppLayout() {
  const { sheet, selectSheet, onSheetRoute } = useSelectedSheet()
  const isLinkActive = (isActive: boolean, prefix: string) =>
    isActive || (prefix === '/sheet' && onSheetRoute)
  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__row">
          <p className="app-brand">
            <span className="app-brand__kicker">Mixed 7s</span>
            <span className="app-brand__name display">Team Sheets</span>
          </p>
          <nav className="app-nav" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `app-nav__link${isLinkActive(isActive, link.matchPrefix) ? ' is-active' : ''}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <GameHalfSelect value={sheet.key} onChange={selectSheet} />
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}

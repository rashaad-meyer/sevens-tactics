import { NavLink, Outlet, useLocation } from 'react-router'
import { GameHalfSelect } from '../components/game-half-select/GameHalfSelect'
import { TacticSelect } from '../components/tactic-select/TacticSelect'
import { useSelectedSheet } from '../hooks/useSelectedSheet'
import { useSelectedTactic } from '../hooks/useSelectedTactic'
import './app.css'

const NAV_LINKS = [
  { to: '/sheet/1/1', label: 'Sheets', prefix: '/sheet' },
  { to: '/summary', label: 'Summary', prefix: '/summary' },
  { to: '/tactics', label: 'Tactics', prefix: '/tactics' },
] as const

export function AppLayout() {
  const { pathname } = useLocation()
  const sheets = useSelectedSheet()
  const tactics = useSelectedTactic()
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
                className={`app-nav__link${pathname.startsWith(link.prefix) ? ' is-active' : ''}`}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
        {tactics.onTacticsRoute ? (
          <TacticSelect value={tactics.tactic.id} onChange={tactics.selectTactic} />
        ) : (
          <GameHalfSelect value={sheets.sheet.key} onChange={sheets.selectSheet} />
        )}
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}

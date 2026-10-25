/* oxlint-disable react/only-export-components -- route config, not a component module */
import { lazy, Suspense } from 'react'
import { createHashRouter, Navigate, type RouteObject } from 'react-router'
import { DEFAULT_SHEET_KEY } from '../data/selectors'
import { DEFAULT_TACTIC } from '../data/tactics'
import { SHEET_ROUTE, sheetPathForKey } from '../hooks/useSelectedSheet'
import { TACTICS_ROUTE, tacticPath } from '../hooks/useSelectedTactic'
import { ErrorPage } from '../pages/ErrorPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { SummaryPage } from '../pages/SummaryPage'
import { TeamSheetPage } from '../pages/TeamSheetPage'
import { AppLayout } from './AppLayout'

// Code-split so future animation code never lands in the team-sheet bundle.
const TacticsPage = lazy(() =>
  import('../pages/TacticsPage').then((m) => ({ default: m.TacticsPage })),
)

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Navigate to={sheetPathForKey(DEFAULT_SHEET_KEY)} replace /> },
      { path: SHEET_ROUTE, element: <TeamSheetPage /> },
      { path: '/summary', element: <SummaryPage /> },
      { path: '/tactics', element: <Navigate to={tacticPath(DEFAULT_TACTIC.id)} replace /> },
      {
        path: TACTICS_ROUTE,
        element: (
          <Suspense fallback={<p className="page-loading">Loading…</p>}>
            <TacticsPage />
          </Suspense>
        ),
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]

/**
 * Hash routing: the app is served from an S3 bucket, where there is no server
 * to rewrite deep links back to index.html. Hash URLs always resolve.
 */
export function createAppRouter() {
  return createHashRouter(routes)
}

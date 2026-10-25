import { isRouteErrorResponse, Link, useRouteError } from 'react-router'
import { DEFAULT_SHEET_KEY } from '../data/selectors'
import { sheetPathForKey } from '../hooks/useSelectedSheet'

function describe(error: unknown): string {
  if (isRouteErrorResponse(error)) return `${error.status} ${error.statusText}`
  if (error instanceof Error) return error.message
  return 'Something went wrong.'
}

/** Route-level error boundary so a render error never white-screens the app. */
export function ErrorPage() {
  const error = useRouteError()
  return (
    <section className="app-main" aria-labelledby="error-heading">
      <h1 id="error-heading" className="page-title display">
        Something broke
      </h1>
      <p className="page-copy">{describe(error)}</p>
      <p className="page-copy">
        <Link to={sheetPathForKey(DEFAULT_SHEET_KEY)} reloadDocument>
          Reload the team sheets
        </Link>
      </p>
    </section>
  )
}

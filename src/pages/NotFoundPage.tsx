import { Link } from 'react-router'
import { DEFAULT_SHEET_KEY } from '../data/selectors'
import { sheetPathForKey } from '../hooks/useSelectedSheet'

export function NotFoundPage() {
  return (
    <section aria-labelledby="not-found-heading">
      <h1 id="not-found-heading" className="page-title display">
        Page not found
      </h1>
      <p className="page-copy">
        <Link to={sheetPathForKey(DEFAULT_SHEET_KEY)}>Back to the team sheets</Link>
      </p>
    </section>
  )
}

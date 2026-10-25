import { Navigate } from 'react-router'
import { SheetNav } from '../components/team-sheet/SheetNav'
import { TeamSheet } from '../components/team-sheet/TeamSheet'
import { DEFAULT_SHEET_KEY } from '../data/selectors'
import { sheetPathForKey, useSelectedSheet } from '../hooks/useSelectedSheet'

export function TeamSheetPage() {
  const { sheet, previous, next, invalid } = useSelectedSheet()
  if (invalid) {
    return <Navigate to={sheetPathForKey(DEFAULT_SHEET_KEY)} replace />
  }
  return (
    <>
      <TeamSheet sheet={sheet} />
      <SheetNav previous={previous} next={next} />
    </>
  )
}

import type { ChangeEvent } from 'react'
import { getSheetOptions } from '../../data/selectors'
import type { SheetKey } from '../../data/types'
import './game-half-select.css'

interface GameHalfSelectProps {
  value: SheetKey
  onChange: (key: SheetKey) => void
}

const OPTIONS = getSheetOptions()

/** Native select for best keyboard, screen reader and phone picker support. */
export function GameHalfSelect({ value, onChange }: GameHalfSelectProps) {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value as SheetKey)
  }
  return (
    <div className="game-half-select">
      <label htmlFor="game-half" className="game-half-select__label">
        Team sheet
      </label>
      <div className="game-half-select__control">
        <select
          id="game-half"
          className="game-half-select__select display"
          value={value}
          onChange={handleChange}
        >
          {OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="game-half-select__chevron" aria-hidden="true" />
      </div>
    </div>
  )
}

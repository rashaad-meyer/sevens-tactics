import type { ChangeEvent } from 'react'
import './header-select.css'

export interface HeaderSelectOption<T extends string> {
  readonly value: T
  readonly label: string
}

interface HeaderSelectProps<T extends string> {
  id: string
  label: string
  value: T
  options: readonly HeaderSelectOption<T>[]
  onChange: (value: T) => void
}

/** Big native select used at the top of the screen. Native for keyboard, screen readers and phone pickers. */
export function HeaderSelect<T extends string>({ id, label, value, options, onChange }: HeaderSelectProps<T>) {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const next = options.find((option) => option.value === event.target.value)
    if (next) onChange(next.value)
  }
  return (
    <div className="header-select">
      <label htmlFor={id} className="header-select__label">
        {label}
      </label>
      <div className="header-select__control">
        <select id={id} className="header-select__select display" value={value} onChange={handleChange}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="header-select__chevron" aria-hidden="true" />
      </div>
    </div>
  )
}

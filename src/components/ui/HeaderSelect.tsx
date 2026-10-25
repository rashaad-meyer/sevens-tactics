import type { ChangeEvent } from 'react'
import './header-select.css'

export interface HeaderSelectOption<T extends string> {
  readonly value: T
  readonly label: string
}

export interface HeaderSelectGroup<T extends string> {
  readonly label: string
  readonly options: readonly HeaderSelectOption<T>[]
}

interface HeaderSelectProps<T extends string> {
  id: string
  label: string
  value: T
  options?: readonly HeaderSelectOption<T>[]
  groups?: readonly HeaderSelectGroup<T>[]
  onChange: (value: T) => void
}

function renderOption<T extends string>(option: HeaderSelectOption<T>) {
  return (
    <option key={option.value} value={option.value}>
      {option.label}
    </option>
  )
}

/** Big native select used at the top of the screen. Native for keyboard, screen readers and phone pickers. */
export function HeaderSelect<T extends string>({
  id,
  label,
  value,
  options = [],
  groups = [],
  onChange,
}: HeaderSelectProps<T>) {
  const allOptions = [...options, ...groups.flatMap((group) => group.options)]
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const next = allOptions.find((option) => option.value === event.target.value)
    if (next) onChange(next.value)
  }
  return (
    <div className="header-select">
      <label htmlFor={id} className="header-select__label">
        {label}
      </label>
      <div className="header-select__control">
        <select id={id} className="header-select__select display" value={value} onChange={handleChange}>
          {options.map(renderOption)}
          {groups.map((group) => (
            <optgroup key={group.label} label={group.label}>
              {group.options.map(renderOption)}
            </optgroup>
          ))}
        </select>
        <span className="header-select__chevron" aria-hidden="true" />
      </div>
    </div>
  )
}

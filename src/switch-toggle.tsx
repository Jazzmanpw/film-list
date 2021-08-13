import React, { ChangeEvent } from 'react'
import { joinTruthy } from './utils'

type Props = {
  checked?: boolean
  className?: string
  id: string
  label: string | ((checked?: boolean) => string)
  onChange: (checked: boolean) => void
}

export default function SwitchToggle({
  checked,
  className,
  id,
  label,
  onChange,
}: Props) {
  const onChangeInternal = (e: ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()
    onChange(e.target.checked)
  }

  return (
    <label
      htmlFor={id}
      className={`${joinTruthy([
        'flex items-center cursor-pointer w-max',
        className,
      ])}`}
    >
      <div className="relative">
        <input
          type="checkbox"
          id={id}
          className="sr-only"
          checked={checked}
          onChange={onChangeInternal}
        />
        <div className="block bg-red-100 w-7 h-4 rounded-full" />
        <div
          className={joinTruthy([
            `absolute left-0.5 top-0.5 bg-white w-3 h-3 rounded-full`,
            !checked && 'bg-red-300',
            checked && 'bg-red-600 transform translate-x-full',
          ])}
        />
      </div>
      <div className="ml-1 text-gray-700 text-sm font-medium">
        {typeof label === 'string' ? label : label(checked)}
      </div>
    </label>
  )
}

import { faFlag } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'
import Flags from 'country-flag-icons/react/3x2'
import React from 'react'
import type { CountryDataWithCode } from './model'

type Props = {
  compact?: boolean
  country: CountryDataWithCode
  iconClass?: string
}

export default function CountryLabel({
  compact,
  country: { code, name },
  iconClass,
}: Props) {
  const Flag = Flags[code]
  return (
    <>
      {Flag ? (
        <Flag title={name} className={clsx('h-4', iconClass)} />
      ) : compact ? (
        <FontAwesomeIcon
          icon={faFlag}
          title={name}
          className={clsx('h-4', iconClass)}
        />
      ) : null}
      {compact ? null : <span className="ml-1">{name}</span>}
    </>
  )
}

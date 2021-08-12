import React, { InputHTMLAttributes } from 'react'
import { joinTruthy } from './utils'

type Props = InputHTMLAttributes<HTMLInputElement>

export default function Input({ className: extraClassName, ...props }: Props) {
  const baseClassName =
    'px-2 py-0.5 w-full border-2 border-red-200 rounded-sm outline-none focus:border-red-300'
  return (
    <input
      className={joinTruthy([baseClassName, extraClassName])}
      autoComplete="off"
      {...props}
    />
  )
}

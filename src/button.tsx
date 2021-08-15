import React, { ButtonHTMLAttributes, ForwardedRef, forwardRef } from 'react'
import { joinTruthy } from './utils'

const baseClassName =
  'rounded-sm font-semibold disabled:opacity-70 ' +
  'focus:outline-none focus:ring-2 focus:ring-offset-1'

const sizeClassNames = {
  small: 'text-xs px-2 py-1',
  normal: 'px-4 py-2',
}

const primaryClassName = 'bg-red-400 hover:bg-red-200 focus:ring-red-400'
const secondaryClassName = 'bg-gray-100 hover:bg-gray-300 focus:ring-gray-300'

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
  size?: keyof typeof sizeClassNames
  secondary?: boolean
  submits?: boolean
}

function Button(
  {
    size = 'normal',
    secondary,
    submits,
    className: extraClassName,
    ...props
  }: Props,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  return (
    <button
      className={joinTruthy([
        baseClassName,
        sizeClassNames[size],
        secondary ? secondaryClassName : primaryClassName,
        extraClassName,
      ])}
      {...props}
      type={submits ? 'submit' : 'button'}
      ref={ref}
    />
  )
}

export default forwardRef(Button)

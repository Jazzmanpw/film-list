import React, { ButtonHTMLAttributes, ForwardedRef, forwardRef } from 'react'
import { joinTruthy } from './utils'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: keyof typeof sizeClassNames
}

const sizeClassNames = {
  small: 'text-xs px-2 py-1.5 leading-none',
  normal: 'px-4 py-2',
}

function Button(
  { size = 'normal', className: extraClassName, ...props }: Props,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  const baseClassName =
    'bg-red-400 rounded-sm font-semibold hover:bg-red-200 ' +
    'focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1'
  return (
    <button
      className={joinTruthy([
        baseClassName,
        sizeClassNames[size],
        extraClassName,
        props.disabled && 'opacity-70',
      ])}
      {...props}
      ref={ref}
    />
  )
}

export default forwardRef(Button)

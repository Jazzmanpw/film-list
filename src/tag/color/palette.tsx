import { useField } from 'formik'
import { not } from 'ramda'
import React, { useRef, useState } from 'react'
import { joinTruthy, onFocusOut } from '../../utils'
import Color from './model'

type Props = {
  name: string
  label: string
}
export default function Palette({ label, name }: Props) {
  const rootRef = useRef<HTMLElement>(null)
  const [expanded, setExpanded] = useState(false)
  const [, { value }, { setValue }] = useField(name)
  const onBlur = expanded
    ? onFocusOut(
        () => rootRef.current,
        () => setExpanded(false),
      )
    : undefined

  return (
    <section
      className="flex-1 text-center"
      tabIndex={-1}
      ref={rootRef}
      onBlur={onBlur}
    >
      <header className="font-medium lg:flex align-middle gap-2">
        {label}{' '}
        <button
          type="button"
          className={`bg-${Color.toClass(
            value,
          )} h-6 w-6 appearance-none focus:outline-none hidden lg:inline`}
          onClick={() => setExpanded(not)}
        />
      </header>
      <main className="relative">
        <section
          className={joinTruthy([
            'grid gap-1 w-36 px-1 m-auto bg-gray-50 z-10',
            'top-2 left-0 lg:absolute lg:p-2 lg:border-black lg:border-gray-300',
            `grid-cols-${Color.palette.cols}`,
            !expanded && 'lg:hidden',
          ])}
        >
          {Color.palette.colors.map((color) => (
            <button
              className={joinTruthy([
                `bg-${Color.toClass(
                  color,
                )} h-6 appearance-none focus:outline-none`,
                value === color && 'rounded-full',
              ])}
              key={Color.toClass(color)}
              onClick={() => setValue(color)}
              type="button"
            />
          ))}
        </section>
      </main>
    </section>
  )
}

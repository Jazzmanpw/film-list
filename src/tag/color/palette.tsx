import { useField } from 'formik'
import { not, pipe, prop } from 'ramda'
import React, { useRef, useState } from 'react'
import { SketchPicker } from 'react-color'
import Button from '../../button'
import { onFocusOut } from '../../utils'

type Props = {
  name: string
  label: string
}
export default function Palette({ label, name }: Props) {
  const rootRef = useRef<HTMLElement>(null)
  const [expanded, setExpanded] = useState(false)
  const [, { value }, { setValue }] = useField<string>(name)
  const onBlur = expanded
    ? onFocusOut(
        () => rootRef.current,
        () => setExpanded(false),
      )
    : undefined

  return (
    <section className="relative" tabIndex={-1} ref={rootRef} onBlur={onBlur}>
      <header>
        <Button
          size="small"
          secondary
          onClick={() => setExpanded(not)}
          className="block"
        >
          {label}
        </Button>
      </header>
      {expanded ? (
        <main
          className="absolute -left-8 top-8 z-10"
          style={{ touchAction: 'none' }}
        >
          <SketchPicker
            disableAlpha
            color={value}
            onChange={pipe(prop('hex'), setValue)}
          />
        </main>
      ) : null}
    </section>
  )
}

import { join, pipe, props, xprod, zipObj } from 'ramda'

const colorIntensities = [
  '900' as const,
  '700' as const,
  '500' as const,
  '300' as const,
  '100' as const,
]
const colorNames = [
  'gray' as const,
  'red' as const,
  'yellow' as const,
  'green' as const,
  'blue' as const,
  'indigo' as const,
  'purple' as const,
  'pink' as const,
]

const paletteColors = xprod(colorNames, colorIntensities).map(
  zipObj(['name', 'intensity']),
)

export type TagColor = typeof paletteColors[number]

export default {
  palette: {
    colors: paletteColors,
    cols: colorIntensities.length,
  },
  toClass: pipe(
    props(['name', 'intensity']) as (
      c: TagColor,
    ) => [typeof colorNames[number], typeof colorIntensities[number]],
    join('-'),
  ),
}

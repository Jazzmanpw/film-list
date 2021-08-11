import { identity } from 'ramda'
import React, { ReactElement } from 'react'
import { useTagsByFilter } from './atoms'
import type { TagData } from './model'
import type { TagFilter } from './model'
import TagChip from './tag-chip'

const extraChildKey = '__extra_child_key__\\O*O//'

type Props = {
  extraChild?: ReactElement
  filter: TagFilter
  chipWrapper?: (chip: JSX.Element, tag: TagData) => JSX.Element
}
export default function TagList({
  extraChild,
  filter,
  chipWrapper = identity,
}: Props) {
  const tags = useTagsByFilter(filter)
  return (
    <ul className="flex flex-wrap justify-start gap-1">
      {tags.map((tag) => (
        <li className="flex-none" key={tag.value}>
          {chipWrapper(<TagChip data={tag} />, tag)}
        </li>
      ))}
      {extraChild ? (
        <li className="flex-none" key={extraChildKey}>
          {extraChild}
        </li>
      ) : null}
    </ul>
  )
}

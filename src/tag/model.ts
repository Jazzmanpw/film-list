import { normalize, schema } from 'normalizr'
import Color, { TagColor } from './color/model'

export type TagData = {
  value: string
  textColor: TagColor
  backgroundColor: TagColor
}

export type TagWithFilms = TagData & { films: string[] }

export type TagFilter = { keyword: string; ignoreId?: string } | { id: string }

export default {
  normalizeTags,
  toColorClass: ({ textColor, backgroundColor }: TagData) =>
    `bg-${Color.toClass(backgroundColor)} text-${Color.toClass(textColor)}`,
}

const tag = new schema.Entity('tags', {}, { idAttribute: 'value' })

function normalizeTags(tags: TagWithFilms[]) {
  return normalize<
    TagWithFilms[],
    { tags: { [value: string]: TagWithFilms } },
    string[]
  >(tags, [tag])
}

export type NormalizedTags = ReturnType<typeof normalizeTags>

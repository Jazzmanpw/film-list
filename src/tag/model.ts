import { normalize, schema } from 'normalizr'

export type TagData = {
  value: string
  textColor: string
  backgroundColor: string
}

export type TagWithFilms = TagData & { films: string[] }

export type TagFilter = { keyword: string; ignoreId?: string } | { id: string }

export default {
  normalizeTags,
  toColorStyle: (tag: TagData) => ({
    backgroundColor: tag.backgroundColor,
    color: tag.textColor,
  }),
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

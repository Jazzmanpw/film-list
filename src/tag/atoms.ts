import {
  __,
  always,
  append,
  defaultTo,
  identity,
  ifElse,
  includes,
  lensPath,
  lensProp,
  not,
  over,
  pipe,
  prop,
  view,
} from 'ramda'
import { atom, selectorFamily, useRecoilValue, useSetRecoilState } from 'recoil'
import type { FilmData } from '../film/model'
import { createStorageEffect, storageKeys } from '../storage'
import { fromRecoilValue } from '../utils'
import Tag, { NormalizedTags, TagData, TagFilter, TagWithFilms } from './model'

const normalizedTags = atom<NormalizedTags>({
  default: Tag.normalizeTags([]),
  key: 'tags/normalized',
  effects_UNSTABLE: [createStorageEffect(storageKeys.tags, 0)],
})

const fromNormalizedTags = fromRecoilValue(normalizedTags)

const tagsByKeyword = selectorFamily<
  TagWithFilms[],
  { keyword: string; ignoreId?: string }
>({
  key: 'tags/by-keyword',
  get: ({ keyword, ignoreId }) =>
    fromNormalizedTags(({ entities: { tags }, result: values }) =>
      values
        .filter(
          ignoreId
            ? pipe(prop(__, tags), prop('films'), includes(ignoreId), not)
            : always(true),
        )
        .filter(keyword ? includes(keyword) : always(true))
        .map(prop(__, tags)),
    ),
})

const tagsByFilm = selectorFamily<TagWithFilms[], string>({
  key: 'tags/by-film',
  get: (id) =>
    fromNormalizedTags(({ entities: { tags }, result: values }) =>
      values
        .filter(pipe(prop(__, tags), prop('films'), includes(id)))
        .map(prop(__, tags)),
    ),
})

const tagsByFilter = selectorFamily<TagWithFilms[], TagFilter>({
  key: 'tags/by-filter',
  get:
    (filter) =>
    ({ get }) =>
      get('keyword' in filter ? tagsByKeyword(filter) : tagsByFilm(filter.id)),
})

export const useTagsByFilter = pipe(tagsByFilter, useRecoilValue)

export function useAddTagToFilm(film: FilmData) {
  const setTags = useSetRecoilState(normalizedTags)
  return (tag: TagData) =>
    setTags(
      pipe(
        over(
          lensPath(['entities', 'tags', tag.value]),
          pipe(
            defaultTo<TagWithFilms>({ ...tag, films: [] }),
            ifElse(
              pipe<TagWithFilms, string[], boolean>(
                view(lensProp('films')),
                includes(film.id),
              ),
              identity,
              over<TagWithFilms, string[]>(lensProp('films'), append(film.id)),
            ),
          ),
        ),
        over(
          lensProp('result'),
          ifElse(includes(tag.value), identity, append(tag.value)),
        ),
      ),
    )
}

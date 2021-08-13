import {
  __,
  always,
  append,
  assoc,
  concat,
  contains,
  dissocPath,
  drop,
  equals,
  filter,
  identity,
  inc,
  map,
  max,
  not,
  over,
  pipe,
  prop,
  propOr,
  propSatisfies,
  reduce,
  reject,
  set,
  startsWith,
  toString,
  unless,
  view,
} from 'ramda'
import { useRef } from 'react'
import {
  atom,
  selector,
  selectorFamily,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil'
import Film, {
  EditableFilmData,
  FilmData,
  NormalizedFilms,
  Status,
} from '../film/model'
import { createStorageEffect, storageKeys } from '../storage'
import { useUndo } from '../undo-modal'
import {
  Editor,
  fromRecoilValue,
  WhenTruthy,
  whenTruthy,
  whenTruthyOr,
} from '../utils'

const normalizedFilms = atom({
  default: null as NormalizedFilms | null,
  key: 'films/normalized',
  effects_UNSTABLE: [createStorageEffect(storageKeys.films, 1)],
})

export const fromNormalizedFilms = fromRecoilValue(normalizedFilms)

const films = selectorFamily<FilmData[], { status?: Status }>({
  key: 'films',
  get: ({ status }) =>
    fromNormalizedFilms(
      whenTruthyOr<NormalizedFilms, null, FilmData[], FilmData[]>(
        ({ entities: { films }, result: ids }) =>
          pipe(
            map(prop(__, films)),
            status
              ? filter<FilmData, 'array'>(
                  propSatisfies<boolean | undefined, FilmData>(
                    pipe(not, equals(status === Status.new)),
                    'seen',
                  ),
                )
              : identity,
          )(ids),
        [],
      ),
    ),
})

const customPrefix = 'custom-'
const nextCustomIdSelector = selector<string>({
  key: 'films/nextCustomId',
  get: fromNormalizedFilms(
    pipe(
      propOr([], 'result'),
      filter<string, 'array'>(startsWith(customPrefix)),
      map(pipe<string, string, number>(drop(customPrefix.length), Number)),
      reduce<number, number>(max, 0),
      inc,
      toString,
      concat(customPrefix),
    ),
  ),
})

export const useFilms = pipe(films, useRecoilValue)

export function useAddFilm() {
  return useUndo(
    'добавление фильма',
    useAddFilmInternal(),
    useRemoveFilmInternal(),
  )
}

export function useAddCustomFilm() {
  return pipe<EditableFilmData, FilmData, void>(
    assoc('id', useRecoilValue(nextCustomIdSelector)),
    useAddFilm(),
  )
}

export function useRemoveFilm() {
  return useUndo(
    'удаление фильма',
    useRemoveFilmInternal(),
    useAddFilmInternal(),
  )
}

export function useEditFilm<T>(
  editor: (arg: T) => Editor<FilmData>,
  filmId: string,
) {
  const editorMemoRef = useRef<FilmData | null>(null)
  const memoizedEditor: typeof editor = (arg) => (film) => {
    editorMemoRef.current = film
    return editor(arg)(film)
  }
  return useUndo(
    'редактирование фильма',
    pipe(memoizedEditor, useReplaceFilmInternal(filmId)),
    pipe(
      always((film: FilmData) => editorMemoRef.current || film),
      useReplaceFilmInternal(filmId),
    ),
  )
}

function useAddFilmInternal() {
  const setFilms = useSetRecoilState(normalizedFilms)
  return pipe<FilmData, Editor<NormalizedFilms | null>, void>(
    (film: FilmData) =>
      whenTruthyOr<NormalizedFilms, null, NormalizedFilms, NormalizedFilms>(
        unless(
          pipe(view(Film.lenses.result), contains<string>(film.id)),
          pipe(
            set(Film.lenses.film(film.id), film),
            over(Film.lenses.result, append(film.id)),
          ),
        ),
        Film.normalizeFilms([film]),
      ),
    setFilms,
  )
}

function useReplaceFilmInternal(filmId: string) {
  const setFilms = useSetRecoilState(normalizedFilms)
  return pipe(
    over(Film.lenses.film(filmId)) as unknown as (
      fn: Editor<FilmData>,
    ) => Editor<NormalizedFilms>,
    whenTruthy as WhenTruthy<NormalizedFilms, null>,
    setFilms,
  )
}

function useRemoveFilmInternal() {
  const setFilms = useSetRecoilState(normalizedFilms)
  return pipe(
    (film: FilmData) =>
      whenTruthy<NormalizedFilms, null>(
        pipe(
          dissocPath<NormalizedFilms>(['entities', 'films', film.id]),
          over(Film.lenses.result, reject(equals(film.id))),
        ),
      ),
    setFilms,
  )
}

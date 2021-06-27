import {
  __,
  always,
  append,
  assoc,
  contains,
  dec,
  defaultTo,
  dissocPath,
  equals,
  filter,
  identity,
  map,
  min,
  not,
  over,
  pipe,
  prop,
  propSatisfies,
  reduce,
  reject,
  set,
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
import Film, { FilmData, lenses, NormalizedFilms, Status } from '../model/film'
import { createStorageEffect, storageKeys } from '../storage'
import { useUndo } from '../undo-modal'
import { Editor, ifTruthy, WhenTruthy, whenTruthy } from '../utils'

export const normalizedFilms = atom({
  default: null as NormalizedFilms | null,
  key: 'normalizedFilms',
  effects_UNSTABLE: [createStorageEffect(storageKeys.films, 0)],
})

export const films = selectorFamily<FilmData[], { status?: Status }>({
  key: 'films',
  get:
    ({ status }) =>
    ({ get }) => {
      const normFilms = get(normalizedFilms)
      if (!normFilms) {
        return []
      }

      const process = pipe(
        prop('result') as (films: typeof normFilms) => number[],
        map(prop(__, normFilms.entities.films)),
        status
          ? filter<FilmData, 'array'>(
              propSatisfies<boolean | undefined, FilmData>(
                pipe(not, equals(status === Status.new)),
                'seen',
              ),
            )
          : identity,
      )
      return process(normFilms)
    },
})

const nextCustomIdSelector = selector<string>({
  key: 'nextCustomId',
  get({ get }) {
    return pipe<
      string[] | undefined,
      string[],
      number[],
      number,
      number,
      string
    >(
      defaultTo([]),
      map(Number),
      reduce<number, number>(min, 0),
      dec,
      toString,
    )(get(normalizedFilms)?.result)
  },
})

export function useAddFilm(): (film: FilmData) => void {
  return useUndo(
    'добавление фильма',
    useAddFilmInternal(),
    useRemoveFilmInternal(),
  )
}

export function useAddCustomFilm() {
  return pipe<ReturnType<typeof Film.createCustom>, FilmData, void>(
    assoc('filmId', useRecoilValue(nextCustomIdSelector)),
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
      ifTruthy<NormalizedFilms, null, NormalizedFilms | null>(
        unless(
          pipe(view(lenses.result), contains<string>(film.filmId)),
          pipe(
            set(lenses.film(film.filmId), film),
            over(lenses.result, append(film.filmId)),
          ),
        ),
        always(Film.normalizeFilms([film])),
      ),
    setFilms,
  )
}

function useReplaceFilmInternal(filmId: string) {
  const setFilms = useSetRecoilState(normalizedFilms)
  return pipe(
    over(lenses.film(filmId)) as unknown as (
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
          dissocPath<NormalizedFilms>(['entities', 'films', film.filmId]),
          over(lenses.result, reject(equals(film.filmId))),
        ),
      ),
    setFilms,
  )
}

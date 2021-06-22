import {
  __,
  append,
  contains,
  dec,
  defaultTo,
  dissocPath,
  equals,
  filter,
  identity,
  map,
  merge,
  min,
  not,
  over,
  pipe,
  prop,
  propSatisfies,
  reduce,
  reject,
  set,
  unless,
  view,
} from 'ramda'
import {
  atom,
  selector,
  selectorFamily,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil'
import Film, { FilmData, lenses, NormalizedFilms, Status } from '../model/film'
import { createStorageEffect, storageKeys } from '../storage'

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

const nextCustomIdSelector = selector<number>({
  key: 'nextCustomId',
  get({ get }) {
    return pipe<number[] | undefined, number[], number, number>(
      defaultTo([]),
      reduce<number, number>(min, 0),
      dec,
    )(get(normalizedFilms)?.result)
  },
})

export function useAddFilm() {
  const setFilms = useSetRecoilState(normalizedFilms)
  return pipe(addFilm, setFilms)
}

export function useAddCustomFilm() {
  const nextCustomId = useRecoilValue(nextCustomIdSelector)
  const setFilms = useSetRecoilState(normalizedFilms)
  return pipe(
    merge({ filmId: nextCustomId }) as (
      customFilm: ReturnType<typeof Film.createCustom>,
    ) => FilmData,
    addFilm,
    setFilms,
  )
}

function addFilm(film: FilmData) {
  return (films: NormalizedFilms | null) =>
    films
      ? unless(
          pipe(view(lenses.result), contains(film.filmId)),
          pipe(
            set(lenses.film(film.filmId), film),
            over(lenses.result, append(film.filmId)),
          ),
        )(films)
      : Film.normalizeFilms([film])
}

export function useRemoveFilm() {
  const setFilms = useSetRecoilState(normalizedFilms)
  return (film: FilmData) => {
    setFilms(
      (films) =>
        films &&
        pipe(
          dissocPath<NormalizedFilms>(['entities', 'films', film.filmId]),
          over(lenses.result, reject(equals(film.filmId))),
        )(films),
    )
  }
}

export function useEditFilm<T>(
  editor: (arg: T) => (film: FilmData) => FilmData,
  filmId: number,
) {
  const setFilms = useSetRecoilState(normalizedFilms)
  return (arg: T) => {
    setFilms((films) => films && over(lenses.film(filmId), editor(arg), films))
  }
}

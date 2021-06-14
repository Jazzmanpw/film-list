import produce from 'immer'
import {
  atom,
  selector,
  selectorFamily,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil'
import Film, { FilmData, NormalizedFilms, Status } from '../model/film'
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
      const filmDataList = normFilms.result.map(
        (id) => normFilms.entities.films[id],
      )

      return status
        ? filmDataList.filter((f) => (status === Status.new) === !f.seen)
        : filmDataList
    },
})

const nextCustomIdSelector = selector<number>({
  key: 'nextCustomId',
  get({ get }) {
    const ids = get(normalizedFilms)?.result
    if (ids?.length) {
      const minId = Math.min(...ids)
      return minId >= 0 ? -1 : minId - 1
    }
    return -1
  },
})

export function useAddFilm() {
  const setFilms = useSetRecoilState(normalizedFilms)
  return (film: FilmData) => setFilms(addFilm(film))
}

export function useAddCustomFilm() {
  const nextCustomId = useRecoilValue(nextCustomIdSelector)
  const setFilms = useSetRecoilState(normalizedFilms)
  return (customFilm: ReturnType<typeof Film.createCustom>) =>
    setFilms(addFilm({ filmId: nextCustomId, ...customFilm }))
}

function addFilm(film: FilmData) {
  return (films: NormalizedFilms | null) =>
    films
      ? produce(films, (films) => {
          films.entities.films[film.filmId] = film
          films.result.push(film.filmId)
        })
      : Film.normalizeFilms([film])
}

export function useRemoveFilm() {
  const setFilms = useSetRecoilState(normalizedFilms)
  return (film: FilmData) => {
    setFilms(
      (films) =>
        films &&
        produce(films, (films) => {
          delete films.entities.films[film.filmId]
          films.result = films.result.filter((id) => id !== film.filmId)
        }),
    )
  }
}

export function useEditFilm<T>(
  editor: (film: FilmData, arg: T) => FilmData,
  filmId: number,
) {
  const setFilms = useSetRecoilState(normalizedFilms)
  return (arg: T) => {
    setFilms(
      (films) =>
        films &&
        produce(films, (films) => {
          films.entities.films[filmId] = editor(
            films.entities.films[filmId],
            arg,
          )
        }),
    )
  }
}

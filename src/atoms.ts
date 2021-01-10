import produce from 'immer'
import { atom, selector, useSetRecoilState } from 'recoil'
import { Film, NormalizedFilms, normalizeFilms } from './normalization'
import { createStorageEffect, storageKeys } from './storage'

export const normalizedFilms = atom({
  default: null as NormalizedFilms | null,
  key: 'normalizedFilms',
  effects_UNSTABLE: [createStorageEffect(storageKeys.films)],
})

export const films = selector<Film[]>({
  key: 'films',
  get: ({ get }) => {
    const normFilms = get(normalizedFilms)
    return normFilms
      ? normFilms.result.map((id) => normFilms.entities.films[id])
      : []
  },
})

export function useAddFilm() {
  const setFilms = useSetRecoilState(normalizedFilms)
  return (film: Film) => {
    setFilms((films) =>
      films
        ? produce(films, (films) => {
            films.entities.films[film.filmId] = film
            films.result.push(film.filmId)
          })
        : normalizeFilms([film]),
    )
  }
}

export function useRemoveFilm() {
  const setFilms = useSetRecoilState(normalizedFilms)
  return (film: Film) => {
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

import produce from 'immer'
import { atom, selector, useSetRecoilState } from 'recoil'
import Film, { FilmData, NormalizedFilms } from './model/film'
import { createStorageEffect, storageKeys } from './storage'

export const normalizedFilms = atom({
  default: null as NormalizedFilms | null,
  key: 'normalizedFilms',
  effects_UNSTABLE: [createStorageEffect(storageKeys.films)],
})

export const films = selector<FilmData[]>({
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
  return (film: FilmData) => {
    setFilms((films) =>
      films
        ? produce(films, (films) => {
            films.entities.films[film.filmId] = film
            films.result.push(film.filmId)
          })
        : Film.normalizeFilms([film]),
    )
  }
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

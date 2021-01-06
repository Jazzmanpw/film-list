import { atom, selector } from 'recoil'
import type { NormalizedFilms } from './normalization'

export const normalizedFilms = atom({
  default: null as NormalizedFilms | null,
  key: 'normalizedFilms',
})

export const films = selector({
  key: 'films',
  get: ({ get }) => {
    const normFilms = get(normalizedFilms)
    return normFilms
      ? normFilms.result.map((id) => normFilms.entities.films[id])
      : []
  },
})

import { normalize, schema } from 'normalizr'
import { lensPath, lensProp } from 'ramda'

export default {
  normalizeFilms,
}

export enum Status {
  seen = 'seen',
  new = 'new',
}

export type FilmData = {
  genres: string[]
  href?: string
  id: string
  name: string
  originalName?: string
  seen?: boolean
  thumbnailUrl: string
}

export type CustomFilm = FilmData & { id?: string }

const film = new schema.Entity('films', {}, { idAttribute: 'id' })

export function normalizeFilms(films: FilmData[]) {
  return normalize<FilmData[], { films: { [id: string]: FilmData } }, string[]>(
    films,
    [film],
  )
}

export type NormalizedFilms = ReturnType<typeof normalizeFilms>

export const lenses = {
  film: (filmId: string) =>
    lensPath<NormalizedFilms, FilmData>(['entities', 'films', filmId]),
  result: lensProp<NormalizedFilms, 'result'>('result'),
}

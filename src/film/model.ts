import { normalize, schema } from 'normalizr'
import { lensPath, lensProp } from 'ramda'
import { joinTruthy } from '../utils'

const lenses = {
  film: (filmId: string) =>
    lensPath<NormalizedFilms, FilmData>(['entities', 'films', filmId]),
  result: lensProp<NormalizedFilms, 'result'>('result'),
}

export default {
  lenses,
  normalizeFilms,
  toString: (film: FilmData) =>
    joinTruthy([film.name, film.originalName && `(${film.originalName})`]),
}

export enum Status {
  seen = 'seen',
  new = 'new',
}

export type FilmData = {
  countries?: string[]
  genres?: string[]
  href?: string
  id: string
  name: string
  originalName?: string
  seen?: boolean
  source: 'kp' | 'custom'
  thumbnailUrl: string
  year?: string
}

export type EditableFilmData = Omit<FilmData, 'id'>

const film = new schema.Entity('films', {}, { idAttribute: 'id' })

function normalizeFilms(films: FilmData[]) {
  return normalize<FilmData[], { films: { [id: string]: FilmData } }, string[]>(
    films,
    [film],
  )
}

export type NormalizedFilms = ReturnType<typeof normalizeFilms>

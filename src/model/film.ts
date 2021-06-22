import { normalize, schema } from 'normalizr'
import { lensPath, lensProp } from 'ramda'

export default {
  createCustom,
  normalizeFilms,
}

export enum Status {
  seen = 'seen',
  new = 'new',
}

type RawFilm = {
  filmId: number
  nameRu: string
  nameEn: string
  type: string
  year: string
  description: string
  filmLength: string
  countries: ({ country: string } | string)[]
  genres: ({ genre: string } | string)[]
  rating: string
  ratingVoteCount: number
  posterUrl: string
  posterUrlPreview: string
}

const film = new schema.Entity(
  'films',
  {},
  {
    idAttribute: 'filmId',
    processStrategy: (rawFilm: RawFilm) => ({
      ...rawFilm,
      countries: rawFilm.countries.map((c) =>
        typeof c === 'string' ? c : c.country,
      ),
      genres: rawFilm.genres.map((g) => (typeof g === 'string' ? g : g.genre)),
    }),
  },
)

export type FilmData = typeof film extends schema.Entity<infer T>
  ? T & { seen?: boolean }
  : never
export function normalizeFilms(rawFilms: RawFilm[]) {
  return normalize<RawFilm[], { films: { [id: number]: FilmData } }, number[]>(
    rawFilms,
    [film],
  )
}

export type NormalizedFilms = ReturnType<typeof normalizeFilms>

export const lenses = {
  film: (filmId: number) =>
    lensPath<NormalizedFilms, FilmData>(['entities', 'films', filmId]),
  result: lensProp<NormalizedFilms, 'result'>('result'),
}

export type CustomFilm = Partial<FilmData> &
  Pick<FilmData, 'nameRu' | 'nameEn' | 'posterUrl' | 'posterUrlPreview'>
function createCustom(film: CustomFilm): Omit<FilmData, 'filmId'> {
  return {
    type: '',
    year: '',
    description: '',
    filmLength: '',
    countries: [],
    genres: [],
    rating: '',
    ratingVoteCount: 0,
    ...film,
  }
}

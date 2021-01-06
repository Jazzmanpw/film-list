import { normalize, schema } from 'normalizr'

type RawFilm = {
  filmId: number
  nameRu: string
  nameEn: string
  type: string
  year: string
  description: string
  filmLength: string
  countries: { country: string }[]
  genres: { genre: string }[]
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
      countries: rawFilm.countries.map((c) => c.country),
      genres: rawFilm.genres.map((g) => g.genre),
    }),
  },
)

export type Film = typeof film extends schema.Entity<infer T> ? T : never
export function normalizeFilms(rawFilms: Film[]) {
  return normalize<Film[], { films: { [id: number]: Film } }, number[]>(
    rawFilms,
    [film],
  )
}

export type NormalizedFilms = ReturnType<typeof normalizeFilms>

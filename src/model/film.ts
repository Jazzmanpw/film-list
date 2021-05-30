import { normalize, schema } from 'normalizr'

export default {
  normalizeFilms,
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

export type FilmData = typeof film extends schema.Entity<infer T> ? T : never
export function normalizeFilms(rawFilms: RawFilm[]) {
  return normalize<RawFilm[], { films: { [id: number]: FilmData } }, number[]>(
    rawFilms,
    [film],
  )
}

export type NormalizedFilms = ReturnType<typeof normalizeFilms>

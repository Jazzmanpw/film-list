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

type Film = typeof film extends schema.Entity<infer T> ? T : never

const headers = new Headers({
  'X-API-KEY': localStorage.getItem('kpapi-token') as string,
})
const baseUrl = 'https://kinopoiskapiunofficial.tech/api/v2.1'

export async function fetchFilmsByKeyword(
  keyword: string,
  signal: AbortSignal,
) {
  try {
    const response = await fetch(
      `${baseUrl}/films/search-by-keyword?keyword=${keyword}`,
      { headers, signal },
    )
    const data = await response.json()
    return normalize<Film, { films: { [id: number]: Film } }, number[]>(
      data.films,
      [film],
    )
  } catch (err) {
    if (!err.message.includes('The user aborted a request')) {
      throw err
    }
  }
}

export type NormalizedFilms = ReturnType<
  typeof fetchFilmsByKeyword
> extends Promise<infer R>
  ? R
  : never

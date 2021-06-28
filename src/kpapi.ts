import { map, pipe, prop } from 'ramda'
import type { FilmData } from './film/model'
import { tryFetch, whenTruthyOr } from './utils'

type KpApiFilm = {
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

type KeywordResponseData = { films: KpApiFilm[] }

const headers = new Headers({
  'X-API-KEY': localStorage.getItem('kpapi-token') as string,
})
const baseUrl = 'https://kinopoiskapiunofficial.tech/api/v2.1'

const idPrefix = 'kp-'

export async function fetchFilmsByKeyword(
  keyword: string,
  signal: AbortSignal,
) {
  return whenTruthyOr<KeywordResponseData, null, FilmData[], null>(
    pipe(prop('films'), map(normalize)),
    null,
  )(
    await tryFetch<KeywordResponseData>(
      `${baseUrl}/films/search-by-keyword?keyword=${keyword}`,
      { headers, signal },
    ),
  )
}

function normalize(film: KpApiFilm): FilmData {
  return {
    id: `${idPrefix}${film.filmId}`,
    genres: film.genres.map((g) => (typeof g === 'string' ? g : g.genre)),
    name: film.nameRu,
    originalName: film.nameEn,
    thumbnailUrl: film.posterUrlPreview,
    href: `https://www.kinopoisk.ru/film/${film.filmId}/`,
  }
}

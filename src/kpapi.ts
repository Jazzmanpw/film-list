import {
  always,
  applySpec,
  concat,
  equals,
  identity,
  ifElse,
  map,
  pipe,
  prop,
  toString,
  type,
} from 'ramda'
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

export const fetchFilmsByKeyword =
  (keyword: string) => async (signal: AbortSignal) =>
    whenTruthyOr<KeywordResponseData, null, FilmData[], null>(
      pipe(prop('films'), map(normalize)),
      null,
    )(
      await tryFetch<KeywordResponseData>(
        `${baseUrl}/films/search-by-keyword?keyword=${keyword}`,
        { headers, signal },
      ),
    )

const normalize = applySpec({
  countries: pipe<KpApiFilm, KpApiFilm['countries'], string[]>(
    prop('countries'),
    map(ifElse(pipe(type, equals('String')), identity, prop('country'))),
  ),
  genres: pipe<KpApiFilm, KpApiFilm['genres'], string[]>(
    prop('genres'),
    map(ifElse(pipe(type, equals('String')), identity, prop('genre'))),
  ),
  href: (film: KpApiFilm) => `https://www.kinopoisk.ru/film/${film.filmId}/`,
  id: pipe<KpApiFilm, number, string, string>(
    prop('filmId'),
    toString,
    concat(idPrefix),
  ),
  name: prop('nameRu'),
  originalName: prop('nameEn'),
  source: always('kp'),
  thumbnailUrl: prop('posterUrlPreview'),
  year: prop('year'),
}) as (film: KpApiFilm) => FilmData

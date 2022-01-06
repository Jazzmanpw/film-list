import ruToCode from 'Generated/ruToCode.json'
import {
  always,
  andThen,
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
import type { QueryFunctionContext } from 'react-query'
import Country, { CountryData } from './country/model'
import type { FilmData } from './film/model'
import { fetchOrThrow } from './utils'

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

const source = 'kp'

// noinspection NonAsciiCharacters
const ruToCountry = Country.fromName(ruToCode, {
  США: 'Соединенные Штаты',
  'Корея Южная': 'Республика Корея',
})

const normalize = applySpec({
  countries: pipe<KpApiFilm, KpApiFilm['countries'], CountryData[]>(
    prop('countries'),
    map(
      pipe(
        ifElse(pipe(type, equals('String')), identity, prop('country')),
        ruToCountry,
      ),
    ),
  ),
  genres: pipe<KpApiFilm, KpApiFilm['genres'], string[]>(
    prop('genres'),
    map(ifElse(pipe(type, equals('String')), identity, prop('genre'))),
  ),
  href: (film: KpApiFilm) => `https://www.kinopoisk.ru/film/${film.filmId}/`,
  id: pipe<KpApiFilm, number, string, string>(
    prop('filmId'),
    toString,
    concat(`${source}-`),
  ),
  name: prop('nameRu'),
  originalName: prop('nameEn'),
  source: always(source),
  thumbnailUrl: prop('posterUrlPreview'),
  year: prop('year'),
}) as (film: KpApiFilm) => FilmData

export const fetchFilmsByKeyword = pipe<
  QueryFunctionContext<[string, string]>,
  Promise<KeywordResponseData>,
  Promise<FilmData[]>
>(
  fetchOrThrow(
    (keyword) => `${baseUrl}/films/search-by-keyword?keyword=${keyword}`,
    { headers },
  ),
  andThen(pipe(prop('films'), map(normalize))),
)

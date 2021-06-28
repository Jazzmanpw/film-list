import type { FilmData } from './film/model'

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

export async function fetchFilmsByKeyword(
  keyword: string,
  signal: AbortSignal,
) {
  try {
    const response = await fetch(
      `${baseUrl}/films/search-by-keyword?keyword=${keyword}`,
      { headers, signal },
    )
    const data: KeywordResponseData = await response.json()
    return data.films.map(normalize)
  } catch (err) {
    if (!err.message.includes('The user aborted a request')) {
      throw err
    }
  }
  return null
}

function normalize(film: KpApiFilm): FilmData {
  return {
    id: `kp-${film.filmId}`,
    genres: film.genres.map((g) => (typeof g === 'string' ? g : g.genre)),
    name: film.nameRu,
    originalName: film.nameEn,
    thumbnailUrl: film.posterUrlPreview,
    href: `https://www.kinopoisk.ru/film/${film.filmId}/`,
  }
}

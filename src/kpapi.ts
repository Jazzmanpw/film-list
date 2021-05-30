import Film from './model/film'

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
    return Film.normalizeFilms(data.films)
  } catch (err) {
    if (!err.message.includes('The user aborted a request')) {
      throw err
    }
  }
  return null
}

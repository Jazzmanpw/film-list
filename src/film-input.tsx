import produce from 'immer'
import React, { useEffect, useRef, useState } from 'react'
import { useSetRecoilState } from 'recoil'
import { normalizedFilms } from './atoms'
import { fetchFilmsByKeyword } from './kpapi'
import { Film, NormalizedFilms, normalizeFilms } from './normalization'

const FilmInput: React.FC = () => {
  const [keyword, setValue] = useState('')
  const setFilms = useSetRecoilState(normalizedFilms)
  const suggestedFilms = useFetchedFilms(keyword)

  const onChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => setValue(value)
  const onFilmClick = (film: Film) => () =>
    setFilms((films) =>
      films
        ? produce(films, (films) => {
            films.entities.films[film.filmId] = film
            films.result.push(film.filmId)
          })
        : normalizeFilms([film]),
    )
  return (
    <div>
      <input type="text" onChange={onChange} />
      {suggestedFilms ? (
        <div>
          {suggestedFilms.result.map((id) => {
            const film = suggestedFilms.entities.films[id]
            return (
              <div key={id} onClick={onFilmClick(film)}>
                <span>{film.nameRu}</span>
                <span>({film.nameEn})</span>
              </div>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

export default FilmInput

function useFetchedFilms(value: string) {
  const abortControllerRef = useRef<AbortController>()
  const [films, setFilms] = useState<NormalizedFilms | null>(null)

  useEffect(
    function fetchFilms() {
      abortControllerRef.current?.abort()
      abortControllerRef.current = new AbortController()
      if (value) {
        fetchFilmsByKeyword(value, abortControllerRef.current.signal).then(
          setFilms,
        )
      } else {
        setFilms(null)
      }
    },
    [value],
  )

  return films
}

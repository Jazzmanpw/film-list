import produce from 'immer'
import React, { useEffect, useRef, useState } from 'react'
import { useSetRecoilState } from 'recoil'
import { normalizedFilms } from './atoms'
import { fetchFilmsByKeyword } from './kpapi'
import { Film, NormalizedFilms, normalizeFilms } from './normalization'
import filmInput from './film-input.module.sass'
import filmList from './list.module.sass'

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
      <input className={filmInput.input} type="text" onChange={onChange} />
      {suggestedFilms ? (
        <div className={filmInput.list}>
          {suggestedFilms.result.map((id) => {
            const film = suggestedFilms.entities.films[id]
            return (
              <div
                className={filmInput.item}
                key={id}
                onClick={onFilmClick(film)}
              >
                <span className={filmList.primaryTitle}>{film.nameRu} </span>
                {film.nameEn ? (
                  <span className={filmList.secondaryTitle}>{film.nameEn}</span>
                ) : null}
                <a
                  className={filmList.sourceLink}
                  href={`https://www.kinopoisk.ru/film/${film.filmId}/`}
                  target="_blank"
                >
                  {/* no content for now, just the icon */}
                </a>
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

import React, { useEffect, useRef, useState } from 'react'
import CustomFilmButton from './custom-film-button'
import { useAddFilm } from './atoms'
import ExternalLink from '../external-link'
import { fetchFilmsByKeyword } from '../kpapi'
import type { NormalizedFilms } from '../model/film'

const FilmInput: React.FC = () => {
  const [keyword, setValue] = useState('')
  const addFilm = useAddFilm()
  const suggestedFilms = useFetchedFilms(keyword)

  const onChange: React.ChangeEventHandler<HTMLInputElement> = ({
    target: { value },
  }) => setValue(value)

  return (
    <div className="flex-shrink-0 lg:w-1/3 lg:overflow-y-auto 2xl:w-1/4">
      <input
        className="input lg:sticky lg:top-0"
        type="text"
        placeholder="Ищите фильмы по названию"
        onChange={onChange}
      />
      {suggestedFilms ? (
        <ul className="w-full lg:overflow-auto">
          {suggestedFilms.result.map((id) => {
            const film = suggestedFilms.entities.films[id]
            return (
              <li
                className="p-0.5 align-middle cursor-pointer hover:bg-red-100"
                key={id}
                onClick={() => addFilm(film)}
              >
                <span className="font-semibold">{film.nameRu} </span>
                {film.nameEn ? (
                  <span className="text-gray-500">{film.nameEn}</span>
                ) : null}
                <ExternalLink
                  href={`https://www.kinopoisk.ru/film/${film.filmId}/`}
                  target="_blank"
                />
              </li>
            )
          })}
          <li className="p-1" key="add-custom-film">
            <CustomFilmButton />
          </li>
        </ul>
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

import React, { useEffect, useRef, useState } from 'react'
import { useSetRecoilState } from 'recoil'
import { fetchFilmsByKeyword, NormalizedFilms } from './kpapi'
import { films } from './atoms'

const FilmInput: React.FC = () => {
  const [keyword, setValue] = useState('')
  const setFilms = useSetRecoilState(films)
  const suggestedFilms = useFetchedFilms(keyword)

  const onChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => setValue(value)
  const onFilmClick = (name: string) => () =>
    setFilms((films) => [...films, name])
  return (
    <div>
      <input type="text" onChange={onChange} />
      {suggestedFilms ? (
        <div>
          {suggestedFilms.result.map((id) => {
            const film = suggestedFilms.entities.films[id]
            return (
              <div
                key={id}
                onClick={onFilmClick(`${film.nameRu} (${film.nameEn})`)}
              >
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
  const [films, setFilms] = useState<NormalizedFilms>()

  useEffect(
    function fetchFilms() {
      abortControllerRef.current?.abort()
      abortControllerRef.current = new AbortController()
      if (value) {
        fetchFilmsByKeyword(value, abortControllerRef.current.signal).then(
          setFilms,
        )
      }
    },
    [value],
  )

  return films
}

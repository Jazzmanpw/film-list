import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { useRecoilValue } from 'recoil'
import { films as filmsAtom, useRemoveFilm } from './atoms'
import type { FilmData } from './model/film'

const List: React.FC = () => {
  const films = useRecoilValue(filmsAtom)
  const removeFilm = useRemoveFilm()

  return (
    <div className="lg:overflow-y-auto">
      <ul className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {films.map((film) => (
          <li
            className="relative flex gap-4 lg:overflow-auto"
            key={film.filmId}
          >
            <img
              className="w-1/4 object-cover object-center sm:w-1/6 md:w-1/4 xl:w-1/6 2xl:w-1/4"
              src={film.posterUrlPreview}
              alt={filmToString(film)}
            />
            <div className="flex-1">
              <div className="font-semibold pr-4">{film.nameRu}</div>
              <div className="text-gray-500">{film.nameEn}</div>
              <FontAwesomeIcon
                icon={faTimes}
                className="absolute top-0 right-1 cursor-pointer hover:text-gray-600"
                onClick={() => removeFilm(film)}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default List

function filmToString(film: FilmData): string {
  return [film.nameRu, film.nameEn && `(${film.nameEn})`]
    .filter(Boolean)
    .join(' ')
}

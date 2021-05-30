import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { useRecoilValue } from 'recoil'
import { films as filmsAtom, useRemoveFilm } from './atoms'
import filmList from './list.module.sass'
import type { FilmData } from './model/film'

const List: React.FC = () => {
  const films = useRecoilValue(filmsAtom)
  const removeFilm = useRemoveFilm()

  return (
    <div className={filmList.container}>
      {films.map((film) => (
        <div className={filmList.item} key={film.filmId}>
          <img
            className={filmList.image}
            src={film.posterUrlPreview}
            alt={filmToString(film)}
          />
          <div className={filmList.description}>
            <div className={filmList.primaryTitle}>{film.nameRu}</div>
            <div className={filmList.secondaryTitle}>{film.nameEn}</div>
            <FontAwesomeIcon
              icon={faTimes}
              className={filmList.times}
              onClick={() => removeFilm(film)}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default List

function filmToString(film: FilmData): string {
  return [film.nameRu, film.nameEn && `(${film.nameEn})`]
    .filter(Boolean)
    .join(' ')
}

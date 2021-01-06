import React from 'react'
import { useRecoilValue } from 'recoil'
import { films as filmsAtom } from './atoms'
import filmList from './list.module.sass'
import type { Film } from './normalization'

const List: React.FC = () => {
  const films = useRecoilValue(filmsAtom)
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
          </div>
        </div>
      ))}
    </div>
  )
}

export default List

function filmToString(film: Film): string {
  return [film.nameRu, film.nameEn && `(${film.nameEn})`]
    .filter(Boolean)
    .join(' ')
}

import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { always, lensProp, not, over } from 'ramda'
import React from 'react'
import type { FilmData } from '../model/film'
import SwitchToggle from '../switch-toggle'
import { joinTruthy } from '../utils'
import { useEditFilm, useRemoveFilm } from './atoms'

type Props = {
  film: FilmData
}

const getSeenLabel = (seen?: boolean) => (seen ? 'Уже смотрел' : 'К просмотру')

export default function ListItem({ film }: Props) {
  const remove = useRemoveFilm()
  const toggleSeen = useEditFilm<boolean>(
    always(over(lensProp('seen'), not)),
    film.filmId,
  )

  return (
    <li>
      <article
        className="group relative flex gap-4 lg:overflow-auto"
        key={film.filmId}
      >
        <img
          className="w-1/4 object-cover object-center sm:w-1/6 md:w-1/4 xl:w-1/6 2xl:w-1/4"
          src={film.posterUrlPreview}
          alt={joinTruthy([film.nameRu, film.nameEn && `(${film.nameEn})`])}
        />
        <div className="flex-1">
          <h1 className="font-semibold pr-4">{film.nameRu}</h1>
          <h2 className="text-gray-500">{film.nameEn}</h2>
          <SwitchToggle
            label={getSeenLabel}
            checked={film.seen}
            onChange={toggleSeen}
            className="h-6"
            id={`film-${film.filmId}`}
            key={film.filmId}
          />
          <FontAwesomeIcon
            icon={faTimes}
            className="absolute top-1 right-1 cursor-pointer hover:text-red-600 lg:text-red-500 lg:opacity-0 lg:group-hover:opacity-100"
            onClick={() => remove(film)}
          />
        </div>
      </article>
    </li>
  )
}

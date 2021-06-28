import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { always, lensProp, not, over } from 'ramda'
import React from 'react'
import { Link } from 'react-router-dom'
import Film, { FilmData } from '../film/model'
import SwitchToggle from '../switch-toggle'
import { useEditFilm, useRemoveFilm } from './atoms'

type Props = {
  film: FilmData
}

const getSeenLabel = (seen?: boolean) => (seen ? 'Уже смотрел' : 'К просмотру')

export default function ListItem({ film }: Props) {
  const remove = useRemoveFilm()
  const toggleSeen = useEditFilm<boolean>(
    always(over(lensProp('seen'), not)),
    film.id,
  )

  return (
    <li>
      <Link to={`/film/${film.id}`}>
        <article
          className="group relative flex gap-4 lg:overflow-auto"
          key={film.id}
        >
          <img
            className="w-1/4 object-cover object-center sm:w-1/6 md:w-1/4 xl:w-1/6 2xl:w-1/4"
            src={film.thumbnailUrl}
            alt={Film.toString(film)}
          />
          <div className="flex-1">
            <h1 className="font-semibold pr-4">{film.name}</h1>
            <h2 className="text-gray-500">{film.originalName}</h2>
            <SwitchToggle
              label={getSeenLabel}
              checked={film.seen}
              onChange={toggleSeen}
              className="h-6"
              id={`film-${film.id}`}
              key={film.id}
            />
            <FontAwesomeIcon
              icon={faTimes}
              className="absolute top-1 right-1 cursor-pointer hover:text-red-600 lg:text-red-500 lg:opacity-0 lg:group-hover:opacity-100"
              onClick={() => remove(film)}
            />
          </div>
        </article>
      </Link>
    </li>
  )
}

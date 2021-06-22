import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { assoc, prop } from 'ramda'
import React, { PropsWithChildren, useMemo } from 'react'
import type { FilmData } from '../model/film'
import SwitchButton from '../switch-button'
import { joinTruthy } from '../utils'
import { useEditFilm, useRemoveFilm } from './atoms'

type Props = {
  film: FilmData
}

export default function ListItem({ film }: Props) {
  const remove = useRemoveFilm()
  const setSeen = useEditFilm<boolean>(assoc('seen'), film.filmId)
  const seenSwitchData = useMemo(
    () => [
      {
        children: 'К просмотру',
        active: !film.seen,
        onClick: () => setSeen(false),
      },
      {
        children: 'Уже видел',
        active: film.seen,
        onClick: () => setSeen(true),
      },
    ],
    [film.seen],
  )

  return (
    <li
      className="group relative flex gap-4 lg:overflow-auto"
      key={film.filmId}
    >
      <img
        className="w-1/4 object-cover object-center sm:w-1/6 md:w-1/4 xl:w-1/6 2xl:w-1/4"
        src={film.posterUrlPreview}
        alt={joinTruthy([film.nameRu, film.nameEn && `(${film.nameEn})`])}
      />
      <div className="flex-1">
        <div className="font-semibold pr-4">{film.nameRu}</div>
        <div className="text-gray-500">{film.nameEn}</div>
        <SwitchButton
          propsArr={seenSwitchData}
          childComponent={Button}
          createKey={prop('children')}
        />
        <FontAwesomeIcon
          icon={faTimes}
          className="absolute top-1 right-1 cursor-pointer hover:text-red-600 lg:text-red-500 lg:opacity-0 lg:group-hover:opacity-100"
          onClick={() => remove(film)}
        />
      </div>
    </li>
  )
}

type ButtonProps = {
  activeClassName: string
  active?: boolean
  className: string
  onClick?: () => void
}

function Button({
  activeClassName,
  active,
  className,
  onClick,
  children,
}: PropsWithChildren<ButtonProps>) {
  return (
    <button
      role="button"
      className={joinTruthy([className, active && activeClassName])}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

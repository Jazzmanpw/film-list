import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { PropsWithChildren, useMemo } from 'react'
import type { FilmData } from '../model/film'
import SwitchButton from '../switch-button'
import { useEditFilm, useRemoveFilm } from './atoms'

type Props = {
  film: FilmData
}

export default function ListItem({ film }: Props) {
  const remove = useRemoveFilm()
  const setSeen = useEditFilm<boolean>(
    (film, seen) => ({ ...film, seen }),
    film.filmId,
  )
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
        alt={filmToString(film)}
      />
      <div className="flex-1">
        <div className="font-semibold pr-4">{film.nameRu}</div>
        <div className="text-gray-500">{film.nameEn}</div>
        <SwitchButton
          propsArr={seenSwitchData}
          childComponent={Button}
          createKey={(p) => p.children}
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

function filmToString(film: FilmData): string {
  return [film.nameRu, film.nameEn && `(${film.nameEn})`]
    .filter(Boolean)
    .join(' ')
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
      className={[className, active && activeClassName]
        .filter(Boolean)
        .join(' ')}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

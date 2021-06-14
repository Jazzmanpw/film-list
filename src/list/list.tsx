import React from 'react'
import { useParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import type { Status } from '../model/film'
import { films as filmsAtom } from './atoms'
import ListItem from './list-item'

export default function List() {
  const { status } = useParams<{ status?: Status }>()
  const films = useRecoilValue(filmsAtom({ status }))

  return (
    <div className="lg:overflow-y-auto">
      <ul className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {films.map((film) => (
          <ListItem film={film} key={film.filmId} />
        ))}
      </ul>
    </div>
  )
}

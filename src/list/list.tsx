import React from 'react'
import { useParams } from 'react-router-dom'
import type { Status } from '../film/model'
import { useFilms } from './atoms'
import ListItem from './list-item'

export default function List() {
  const films = useFilms(useParams<{ status?: Status }>())

  return (
    <div className="col-span-8 lg:overflow-y-auto 2xl:col-span-9">
      <ul className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {films.map((film) => (
          <ListItem film={film} key={film.id} />
        ))}
      </ul>
    </div>
  )
}

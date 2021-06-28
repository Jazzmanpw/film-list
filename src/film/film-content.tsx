import React from 'react'
import { useParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import ExternalLink from '../external-link'
import { film as filmAtom } from '../list/atoms'
import Film from './model'

export default function FilmContent() {
  const { id } = useParams<{ id: string }>()
  const film = useRecoilValue(filmAtom(id))
  return film ? (
    <article className="flex flex-col gap-2">
      <h1 className="text-xl font-bold">
        {film.name}
        <ExternalLink href={film.href} size="md" target={'_blank'} />
      </h1>
      <h2 className="text-l text-gray-500">{film.originalName}</h2>
      <img src={film.thumbnailUrl} alt={Film.toString(film)} />
    </article>
  ) : null
}

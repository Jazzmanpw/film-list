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
    <article className="flex flex-col gap-2 md:flex-row">
      <img
        src={film.thumbnailUrl}
        alt={Film.toString(film)}
        className="w-1/3 object-cover object-center lg:w-1/4 xl:w-1/5 2xl:w-1/6"
      />
      <section className="flex flex-col gap-2">
        <h1 className="text-xl font-bold lg:text-3xl">
          {film.name}
          <ExternalLink href={film.href} size="md" target={'_blank'} />
        </h1>
        <h2 className="text-l text-gray-500 lg:text-xl">{film.originalName}</h2>
        {film.year ? (
          <p>
            <b className="font-bold">Год:</b> {film.year}
          </p>
        ) : null}
        {film.countries?.length ? (
          <p>
            <b className="font-bold">Страны:</b> {film.countries.join(', ')}
          </p>
        ) : null}
        {film.genres?.length ? (
          <p>
            <b className="font-bold">Жанры:</b> {film.genres.join(', ')}
          </p>
        ) : null}
      </section>
    </article>
  ) : null
}

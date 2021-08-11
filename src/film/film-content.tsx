import React from 'react'
import { useParams } from 'react-router-dom'
import ExternalLink from '../external-link'
import TagsContent from '../tag/tags-content'
import { useFilm } from './atoms'
import Film from './model'

export default function FilmContent() {
  const film = useFilm(useParams<{ id: string }>())

  return film ? (
    <article className="flex flex-col gap-2 md:flex-row">
      <img
        src={film.thumbnailUrl}
        alt={Film.toString(film)}
        className="w-1/3 object-cover object-center self-start lg:w-1/4 xl:w-1/5 2xl:w-1/6"
      />
      <section className="flex flex-col gap-2">
        <h1 className="text-xl font-bold lg:text-3xl">
          {film.name}
          <ExternalLink href={film.href} size="md" target={'_blank'} />
        </h1>
        <h2 className="text-l text-gray-500 lg:text-xl">{film.originalName}</h2>
        <Label title="Год" value={film.year} />
        <Label title="Страны" value={film.countries} />
        <Label title="Жанры" value={film.genres} />
        <TagsContent film={film} />
      </section>
    </article>
  ) : null
}

type LabelProps = { title: string; value?: string | string[] }

function Label({ title, value }: LabelProps) {
  return value ? (
    <p>
      <b className="font-bold">{title}:</b>{' '}
      {typeof value === 'string' ? value : value.join(', ')}
    </p>
  ) : null
}

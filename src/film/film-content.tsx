import React, { ComponentType } from 'react'
import { useParams } from 'react-router-dom'
import CountryLabel from '../country/country-label'
import Country, { CountryData } from '../country/model'
import ExternalLink from '../external-link'
import TagsContent from '../tag/tags-content'
import { useFilm } from './atoms'
import FilmEditor from './film-editor'
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
      <section className="flex-1 flex flex-col gap-2">
        <h1 className="text-xl font-bold lg:text-3xl">
          {film.name}
          <ExternalLink href={film.href} size="md" target={'_blank'} />
          <FilmEditor film={film} />
        </h1>
        <h2 className="text-l text-gray-500 lg:text-xl">{film.originalName}</h2>
        <Label title="Год" value={film.year} valueComponent={YearLabelValue} />
        <Label
          title="Страны"
          value={film.countries}
          valueComponent={CountryLabelValue}
        />
        <Label
          title="Жанры"
          value={film.genres}
          valueComponent={GenreLabelValue}
        />
        <TagsContent film={film} />
      </section>
    </article>
  ) : null
}

type LabelProps<T> = {
  title: string
  value?: T
  valueComponent: ComponentType<{ value: T }>
}

function Label<T>({
  title,
  value,
  valueComponent: ValueComponent,
}: LabelProps<T>) {
  return value ? (
    <p className="flex gap-2">
      <b className="font-bold">{title}:</b>
      <ValueComponent value={value} />
    </p>
  ) : null
}

function YearLabelValue({ value }: { value: string }) {
  return <>{value}</>
}

function CountryLabelValue({ value: countries }: { value: CountryData[] }) {
  return (
    <>
      {countries.filter(Country.hasCode).map((country) => {
        return (
          <span
            className="self-center after:content-[','] last-of-type:after:content-['']"
            key={country.code}
          >
            <CountryLabel country={country} iconClass="inline" />
          </span>
        )
      })}
    </>
  )
}

function GenreLabelValue({ value: genres }: { value: string[] }) {
  return <>{genres.join(', ')}</>
}

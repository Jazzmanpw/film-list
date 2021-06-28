import { always, andThen, ifElse, path, pipe } from 'ramda'
import React, { ChangeEvent, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDebouncedCallback } from 'use-debounce'
import ExternalLink from '../external-link'
import Film, { FilmData, NormalizedFilms, Status } from '../film/model'
import { fetchFilmsByKeyword } from '../kpapi'
import { useFetchOne, whenTruthyOr } from '../utils'
import { useAddFilm } from './atoms'
import CustomFilmButton from './custom-film-button'

const FilmInput: React.FC = () => {
  const [keyword, setValue] = useState('')
  const addFilm = useAddFilm()
  const suggestedFilms = useFetchedFilms(keyword)
  const { status } = useParams<{ status?: Status }>()

  const onChange: React.ChangeEventHandler<HTMLInputElement> =
    useDebouncedCallback(
      pipe(
        path(['target', 'value']) as (
          e: ChangeEvent<HTMLInputElement>,
        ) => string,
        setValue,
      ),
      300,
    )

  return (
    <form className="col-span-4 col-start-1 row-span-full 2xl:col-span-3 lg:overflow-y-auto">
      <input
        className="input lg:sticky lg:top-0"
        type="text"
        placeholder="Ищите фильмы по названию"
        onChange={onChange}
      />
      {suggestedFilms ? (
        <ul className="w-full lg:overflow-auto">
          {suggestedFilms.result.map((id) => {
            const film = suggestedFilms.entities.films[id]
            return (
              <li
                className="p-0.5 align-middle cursor-pointer hover:bg-red-100"
                key={id}
                onClick={() =>
                  addFilm({ ...film, seen: status === Status.seen })
                }
              >
                <span className="font-semibold">{film.name}</span>
                {film.originalName ? (
                  <span className="text-gray-500"> {film.originalName}</span>
                ) : null}
                <ExternalLink href={film.href} size="sm" target="_blank" />
              </li>
            )
          })}
          <li className="p-1" key="add-custom-film">
            <CustomFilmButton />
          </li>
        </ul>
      ) : null}
    </form>
  )
}

export default FilmInput

function useFetchedFilms(value: string) {
  return useFetchOne<NormalizedFilms>(
    useMemo(
      () =>
        ifElse(
          always(!!value),
          pipe(
            fetchFilmsByKeyword(value),
            andThen(
              whenTruthyOr<FilmData[], null, NormalizedFilms, null>(
                Film.normalizeFilms,
                null,
              ),
            ),
          ),
          always(Promise.resolve(null)),
        ),
      [value],
    ),
  )
}

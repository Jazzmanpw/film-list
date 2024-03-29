import { always, andThen, assoc, ifElse, pathOr, pipe } from 'ramda'
import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import { useDebouncedCallback } from 'use-debounce'
import Film, { FilmData, NormalizedFilms, Status } from '../film/model'
import Input from '../input'
import { fetchFilmsByKeyword } from '../kpapi'
import { useAddFilm } from './atoms'
import CustomFilmButton from './custom-film-button'
import Suggestion from './suggestion'

export default function FilmInput() {
  const [keyword, setKeyword] = useState('')
  const addFilm = useAddFilm()
  const { data: suggestedFilms, isLoading } = useQuery<NormalizedFilms>(
    ['films/by-keyword', keyword],
    ifElse(
      always(!!keyword),
      pipe(fetchFilmsByKeyword, andThen(Film.normalizeFilms)),
      always(Promise.resolve(null)),
    ),
    { keepPreviousData: true },
  )
  const { status } = useParams<{ status?: Status }>()

  const onChange: React.ChangeEventHandler<HTMLInputElement> =
    useDebouncedCallback(pipe(pathOr('', ['target', 'value']), setKeyword), 200)

  return (
    <form
      className="col-span-4 col-start-1 row-span-full 2xl:col-span-3 lg:overflow-y-auto"
      onSubmit={(e) => e.preventDefault()}
    >
      <Input
        className="lg:sticky lg:top-0"
        type="text"
        placeholder="Ищите фильмы по названию"
        onChange={onChange}
      />
      {suggestedFilms ? (
        <ul className="w-full lg:overflow-auto">
          {suggestedFilms.result.map((id) => (
            <Suggestion
              film={suggestedFilms.entities.films[id]}
              onSelect={pipe<FilmData, FilmData, void>(
                assoc('seen', status === Status.seen),
                addFilm,
              )}
              key={id}
            />
          ))}
          <li className="p-1" key="add-custom-film">
            <CustomFilmButton />
          </li>
        </ul>
      ) : isLoading ? (
        'Loading...'
      ) : null}
    </form>
  )
}

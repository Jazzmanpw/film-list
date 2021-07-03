import { applyTo, path, pipe, prop } from 'ramda'
import { GetRecoilValue, selectorFamily, useRecoilValue } from 'recoil'
import { normalizedFilms } from '../list/atoms'
import { whenTruthyOr } from '../utils'
import type { FilmData, NormalizedFilms } from './model'

const film = selectorFamily<FilmData | undefined, { id: string }>({
  key: 'film',
  get: ({ id }) =>
    pipe<
      { get: GetRecoilValue },
      GetRecoilValue,
      NormalizedFilms | null,
      FilmData | undefined
    >(
      prop('get'),
      applyTo(normalizedFilms) as (
        fn: GetRecoilValue,
      ) => NormalizedFilms | null,
      whenTruthyOr<NormalizedFilms, null, FilmData, undefined>(
        path<FilmData>(['entities', 'films', id]),
        undefined,
      ),
    ),
})

export const useFilm = pipe(film, useRecoilValue)

import { pathOr, pipe } from 'ramda'
import { selectorFamily, useRecoilValue } from 'recoil'
import { fromNormalizedFilms } from '../list/atoms'
import { whenTruthyOr } from '../utils'
import type { FilmData, NormalizedFilms } from './model'

const film = selectorFamily<FilmData | null, { id: string }>({
  key: 'film',
  get: ({ id }) =>
    fromNormalizedFilms(
      whenTruthyOr<NormalizedFilms, null, FilmData, null>(
        pathOr<FilmData | null>(null, ['entities', 'films', id]),
        null,
      ),
    ),
})

export const useFilm = pipe(film, useRecoilValue)

import { assoc, pipe } from 'ramda'
import React from 'react'
import Popup from 'reactjs-popup'
import ExternalLink from '../external-link'
import EditFilmForm from '../film/edit-film-form'
import type { FilmData } from '../film/model'

type Props = {
  film: FilmData
  onSelect: (film: FilmData) => void
}

export default function Suggestion({ film, onSelect }: Props) {
  return (
    <Popup
      modal
      trigger={
        <li className="p-0.5 align-middle cursor-pointer hover:bg-red-100">
          <span className="font-semibold">{film.name}</span>
          {film.originalName ? (
            <span className="text-gray-500"> {film.originalName}</span>
          ) : null}
          <ExternalLink href={film.href} size="sm" target="_blank" />
        </li>
      }
      closeOnDocumentClick={false}
      className="film-editor-form"
    >
      {(close: () => void) => (
        <EditFilmForm
          film={film}
          onSubmit={pipe(assoc('id', film.id), onSelect, close)}
          onCancel={close}
        />
      )}
    </Popup>
  )
}

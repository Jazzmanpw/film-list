import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { mergeLeft, pipe } from 'ramda'
import React from 'react'
import Popup from 'reactjs-popup'
import EditFilmForm from './edit-film-form'
import type { EditableFilmData, FilmData } from './model'
import { useEditFilm } from '../list/atoms'

type Props = {
  film: FilmData
}

export default function FilmEditor({ film }: Props) {
  const editFilm = useEditFilm<EditableFilmData>(mergeLeft, film.id)

  return (
    <Popup
      modal
      trigger={
        <button type="button" className="ml-2">
          <FontAwesomeIcon
            icon={faEdit}
            className="text-red-500 text-xl hover:text-red-600"
          />
        </button>
      }
      closeOnDocumentClick={false}
      className="film-editor-form"
    >
      {(close: () => void) => (
        <EditFilmForm
          film={film}
          onSubmit={pipe(editFilm, close)}
          onCancel={close}
        />
      )}
    </Popup>
  )
}

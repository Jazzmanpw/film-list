import { pipe } from 'ramda'
import React from 'react'
import Popup from 'reactjs-popup'
import Button from '../button'
import EditFilmForm from '../film/edit-film-form'
import { useAddCustomFilm } from './atoms'

export default function CustomFilmButton() {
  const addCustomFilm = useAddCustomFilm()

  return (
    <Popup
      modal
      trigger={<Button>Не нашли фильм?</Button>}
      closeOnDocumentClick={false}
      className="film-editor-form"
    >
      {(close: () => void) => (
        <EditFilmForm
          film={{
            countries: [],
            genres: [],
            name: '',
            seen: false,
            source: 'custom',
            thumbnailUrl: '',
          }}
          onSubmit={pipe(addCustomFilm, close)}
          onCancel={close}
        />
      )}
    </Popup>
  )
}

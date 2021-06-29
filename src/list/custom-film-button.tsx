import { Field, Form, Formik } from 'formik'
import { pipe } from 'ramda'
import React from 'react'
import Popup from 'reactjs-popup'
import type { CustomFilm } from '../film/model'
import { useAddCustomFilm } from './atoms'

const attrs = {
  name: 'Русское название',
  originalName: 'Оригинальное название',
  thumbnailUrl: 'Ссылка на маленькую версию постера',
}

export default function CustomFilmButton() {
  const addCustomFilm = useAddCustomFilm()

  return (
    <Popup
      modal
      trigger={
        <button className="btn" type="button">
          Не нашли фильм?
        </button>
      }
      className="custom-film"
    >
      {(close: () => void) => (
        <Formik<CustomFilm>
          initialValues={{
            source: 'custom',
            name: '',
            originalName: '',
            thumbnailUrl: '',
            seen: false,
          }}
          onSubmit={pipe(addCustomFilm, close)}
        >
          <Form className="grid sm:p-2 sm:grid-cols-popup-content">
            <h1 className="font-medium text-2xl" key="title">
              Введите данные о фильме
            </h1>
            <ul className="sm:col-span-2 sm:row-start-2">
              {Object.entries(attrs).map(([key, text]) => (
                <li key={key}>
                  <label htmlFor={key} key={`${key}-label`}>
                    {text}
                  </label>
                  <Field
                    id={key}
                    className="input"
                    name={key}
                    type="text"
                    required
                    autoComplete="off"
                    key="name-input"
                  />
                </li>
              ))}
              <li key="seen">
                <label htmlFor="seen">
                  <Field id="seen" type="checkbox" name="seen" /> Уже видел
                </label>
              </li>
            </ul>
            <button className="btn block mt-2 w-full sm:m-0">Готово</button>
          </Form>
        </Formik>
      )}
    </Popup>
  )
}

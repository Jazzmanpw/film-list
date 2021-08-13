import { Field, Form, Formik } from 'formik'
import { pipe } from 'ramda'
import React from 'react'
import Popup from 'reactjs-popup'
import Button from '../button'
import type { CustomFilm } from '../film/model'
import Input from '../input'
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
      trigger={<Button type="button">Не нашли фильм?</Button>}
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
          <Form className="grid sm:p-2 sm:grid-cols-[1fr,auto]">
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
                    as={Input}
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
            <Button className="block mt-2 w-full sm:m-0">Готово</Button>
          </Form>
        </Formik>
      )}
    </Popup>
  )
}

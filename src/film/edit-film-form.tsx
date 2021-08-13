import { Field, Form, Formik } from 'formik'
import React from 'react'
import Button from '../button'
import Input from '../input'
import type { EditableFilmData } from './model'

const attrs = {
  name: 'Русское название',
  originalName: 'Оригинальное название',
  thumbnailUrl: 'Ссылка на маленькую версию постера',
}

type Props = {
  film: EditableFilmData
  onCancel: () => void
  onSubmit: (film: EditableFilmData) => void
}

export default function EditFilmForm({ film, onCancel, onSubmit }: Props) {
  return (
    <Formik<EditableFilmData> initialValues={film} onSubmit={onSubmit}>
      <Form className="grid sm:p-2 md:grid-cols-[1fr,auto]">
        <h1 className="font-medium text-2xl" key="title">
          Введите данные о фильме
        </h1>
        <ul className="md:col-span-2 md:row-start-2">
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
        <section className="flex gap-2 mt-2 w-full md:m-0">
          <Button className="flex-1" type="button" secondary onClick={onCancel}>
            Отмена
          </Button>
          <Button className="flex-1" type="submit">
            Готово
          </Button>
        </section>
      </Form>
    </Formik>
  )
}

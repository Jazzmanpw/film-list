import { Field, Form, Formik } from 'formik'
import { not } from 'ramda'
import React, { ComponentType, useState } from 'react'
import Button from '../button'
import Input from '../input'
import type { EditableFilmData, FilmData } from './model'

type AttributeBase = { field: keyof FilmData; text: string; required?: boolean }
type Attribute = AttributeBase & { component?: ComponentType<AttributeBase> }

const mainAttributes: Attribute[] = [
  { field: 'name', text: 'Русское название' },
  { field: 'originalName', text: 'Оригинальное название' },
  { field: 'thumbnailUrl', text: 'Ссылка на маленькую версию постера' },
]

const extraAttributes: Attribute[] = [
  { field: 'href', text: 'Ссылка' },
  { field: 'year', text: 'Год' },
]

type Props = {
  film: EditableFilmData
  onCancel: () => void
  onSubmit: (film: EditableFilmData) => void
}

export default function EditFilmForm({ film, onCancel, onSubmit }: Props) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Formik<EditableFilmData> initialValues={film} onSubmit={onSubmit}>
      <Form className="grid sm:p-2 md:grid-cols-[1fr,auto]">
        <h1 className="font-medium text-2xl" key="title">
          Введите данные о фильме
        </h1>
        <ul className="md:col-span-2 md:row-start-2">
          {mainAttributes.map(
            ({ component: Component = TextField, ...props }) => (
              <li key={props.field}>
                <Component {...props} required />
              </li>
            ),
          )}
          <li key="seen" className="flex">
            <label htmlFor="seen" className="flex-1">
              <Field id="seen" type="checkbox" name="seen" /> Уже видел
            </label>
            <button
              className="underline text-blue-500"
              onClick={() => setExpanded(not)}
              type="button"
            >{`Показать ${expanded ? 'меньше' : 'больше'}`}</button>
          </li>
          {expanded
            ? extraAttributes.map(
                ({ component: Component = TextField, ...props }) => (
                  <li key={props.field}>
                    <Component {...props} required />
                  </li>
                ),
              )
            : null}
        </ul>
        <section className="flex gap-2 mt-2 w-full md:m-0">
          <Button className="flex-1" secondary onClick={onCancel}>
            Отмена
          </Button>
          <Button className="flex-1" submits>
            Готово
          </Button>
        </section>
      </Form>
    </Formik>
  )
}

function TextField({ field, required, text }: AttributeBase) {
  return (
    <>
      <label htmlFor={field}>{text}</label>
      <Field
        id={field}
        as={Input}
        name={field}
        type="text"
        required={required}
        autoComplete="off"
      />
    </>
  )
}

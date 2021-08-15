import { Field, Form, Formik } from 'formik'
import { lensProp, over } from 'ramda'
import React from 'react'
import Button from '../button'
import type { FilmData } from '../film/model'
import Input from '../input'
import Palette from './color/palette'
import TagChip from './tag-chip'
import TagList from './tag-list'
import type { TagData } from './model'

type Props = {
  addTag: (tag: TagData) => void
  film: FilmData
}

export default function TagSelector({ addTag, film }: Props) {
  return (
    <Formik<TagData>
      initialValues={{
        value: '',
        textColor: '#111827',
        backgroundColor: '#f87171',
      }}
      onSubmit={addTag}
    >
      {({ values: newTag }) => (
        <Form className="grid grid-cols-2 gap-2 border-t-2 border-gray-300 pt-4">
          <Field
            name="value"
            as={Input}
            placeholder="Найти или создать метку..."
            autoComplete="off"
            className="col-span-full lg:col-span-1"
          />
          <section className="col-span-full">
            <TagList
              filter={{ keyword: newTag.value, ignoreId: film.id }}
              chipWrapper={(chip, data) => (
                <button
                  className="appearance-none"
                  type="button"
                  onClick={() => addTag(data)}
                >
                  {chip}
                </button>
              )}
            />
          </section>
          <section className="col-span-full flex gap-2 items-center border-t-2 border-gray-100 pt-2 lg:p-0 lg:border-0 lg:col-start-2 lg:row-start-1">
            <TagChip
              data={over(lensProp('value'), (v) => v || 'Новая метка', newTag)}
            />
            <Palette name="backgroundColor" label="Фон" />
            <Palette name="textColor" label="Текст" />
            {/* TODO: add a warning if a user tries to create a tag with a name that already exists */}
            <Button submits size="small" disabled={!newTag.value}>
              Сохранить и добавить
            </Button>
          </section>
        </Form>
      )}
    </Formik>
  )
}

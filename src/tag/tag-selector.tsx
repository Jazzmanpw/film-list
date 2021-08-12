import { Field, Form, Formik } from 'formik'
import { lensProp, over } from 'ramda'
import React from 'react'
import Button from '../button'
import type { FilmData } from '../film/model'
import Palette from './color/palette'
import TagChip from './tag-chip'
import TagList from './tag-list'
import type { TagData } from './model'
import Color from './color/model'

type Props = {
  addTag: (tag: TagData) => void
  film: FilmData
}

export default function TagSelector({ addTag, film }: Props) {
  return (
    <Formik<TagData>
      initialValues={{
        value: '',
        textColor: Color.palette.colors[0],
        backgroundColor: Color.palette.colors[0],
      }}
      onSubmit={addTag}
    >
      {({ values: newTag }) => (
        <Form className="flex flex-col gap-2 border-t-2 border-gray-300 pt-4 lg:flex-row">
          <section className="flex-1">
            <Field
              name="value"
              className="input"
              placeholder="Найти или создать метку..."
              autoComplete="off"
            />
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
          <fieldset className="flex gap-4 w-48">
            <Palette name="backgroundColor" label="Фон" />
            <Palette name="textColor" label="Текст" />
          </fieldset>
          <section>
            <TagChip
              data={over(lensProp('value'), (v) => v || 'Новая метка', newTag)}
              className="w-max self-center block mb-1"
            />
            {/* TODO: add a warning if a user tries to create a tag with a name that already exists */}
            <Button type="submit" disabled={!newTag.value}>
              Сохранить и добавить
            </Button>
          </section>
        </Form>
      )}
    </Formik>
  )
}

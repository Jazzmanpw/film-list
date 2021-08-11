import { not } from 'ramda'
import React, { useState } from 'react'
import type { FilmData } from '../film/model'
import { useAddTagToFilm } from './atoms'
import TagList from './tag-list'
import TagSelector from './tag-selector'

type Props = {
  film: FilmData
}
export default function TagsContent({ film }: Props) {
  const [tagSelectorVisible, setTagSelectorVisible] = useState(false)
  const addTag = useAddTagToFilm(film)

  return (
    <section className="flex flex-col gap-4">
      <TagList
        filter={film}
        extraChild={
          <button
            className="btn text-xs px-2 py-1.5 leading-none"
            type="button"
            onClick={() => setTagSelectorVisible(not)}
          >
            {tagSelectorVisible ? (
              <>Скрыть</>
            ) : (
              <>
                <strong className="font-bold text-sm leading-none">+ </strong>
                Добавить метку
              </>
            )}
          </button>
        }
      />
      {tagSelectorVisible ? <TagSelector addTag={addTag} film={film} /> : null}
    </section>
  )
}

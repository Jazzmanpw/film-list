import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { not } from 'ramda'
import React, { useState } from 'react'
import Button from '../button'
import type { FilmData } from '../film/model'
import { useAddTagToFilm, useRemoveTagFromFilm } from './atoms'
import TagList from './tag-list'
import TagSelector from './tag-selector'

type Props = {
  film: FilmData
}
export default function TagsContent({ film }: Props) {
  const [tagSelectorVisible, setTagSelectorVisible] = useState(false)
  const addTag = useAddTagToFilm(film)
  const removeTag = useRemoveTagFromFilm(film)

  return (
    <section className="flex flex-col gap-4">
      <TagList
        filter={film}
        extraChild={
          <Button size="small" onClick={() => setTagSelectorVisible(not)}>
            {tagSelectorVisible ? (
              <>Скрыть</>
            ) : (
              <>
                <strong className="font-bold text-sm leading-none">+ </strong>
                Добавить метку
              </>
            )}
          </Button>
        }
        chipWrapper={
          tagSelectorVisible
            ? (chip, data) => (
                <>
                  <button
                    className="appearance-none mx-0.5"
                    type="button"
                    onClick={() => removeTag(data)}
                  >
                    <FontAwesomeIcon
                      icon={faTimes}
                      style={{ color: data.backgroundColor }}
                    />
                  </button>
                  {chip}
                </>
              )
            : undefined
        }
      />
      {tagSelectorVisible ? <TagSelector addTag={addTag} film={film} /> : null}
    </section>
  )
}

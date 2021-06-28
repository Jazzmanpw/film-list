import React from 'react'
import { useForm } from 'react-hook-form'
import Popup from 'reactjs-popup'
import type { CustomFilm } from '../model/film'
import { useAddCustomFilm } from './atoms'

const customFilmAttributes = [
  { key: 'name' as const, text: 'Русское название', required: true },
  {
    key: 'originalName' as const,
    text: 'Оригинальное название',
    required: true,
  },
  {
    key: 'thumbnailUrl' as const,
    text: 'Ссылка на маленькую версию постера',
    required: true,
  },
]

export default function CustomFilmButton() {
  const { handleSubmit, register, reset } = useForm<CustomFilm>()
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
      onClose={reset}
    >
      {(close: () => void) => (
        <form
          className="grid sm:p-2 sm:grid-cols-popup-content"
          key="form"
          onSubmit={(e) => {
            handleSubmit(addCustomFilm)(e)
            close()
          }}
        >
          <h1 className="font-medium text-2xl" key="title">
            Введите данные о фильме
          </h1>
          <ul className="sm:col-span-2 sm:row-start-2">
            {customFilmAttributes.map(({ key, text, required }) => (
              <li key={key}>
                <label htmlFor={key}>{text}</label>
                <input
                  className="input"
                  type="text"
                  required
                  {...register(key, { required })}
                  autoComplete="off"
                  key={`${key}-input`}
                />
              </li>
            ))}
            <li key="seen">
              <label htmlFor="seen">
                <input type="checkbox" {...register('seen')} /> Уже видел
              </label>
            </li>
          </ul>
          <button className="btn block mt-2 w-full sm:m-0">Готово</button>
        </form>
      )}
    </Popup>
  )
}

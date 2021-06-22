import { pipe } from 'ramda'
import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import Popup from 'reactjs-popup'
import { useAddCustomFilm } from './atoms'
import Film, { CustomFilm } from '../model/film'

const customFilmAttributes = [
  { key: 'nameRu' as const, text: 'Русское название', required: true },
  { key: 'nameEn' as const, text: 'Оригинальное название', required: true },
  { key: 'posterUrl' as const, text: 'Ссылка на постер', required: true },
  {
    key: 'posterUrlPreview' as const,
    text: 'Ссылка на маленькую версию постера',
    required: true,
  },
]

export default function CustomFilmButton() {
  const { handleSubmit, register, reset } = useForm<CustomFilm>()
  const addCustomFilm = useAddCustomFilm()

  const onSubmit: SubmitHandler<CustomFilm> = pipe(
    Film.createCustom,
    addCustomFilm,
  )

  return (
    <Popup
      modal
      trigger={<button className="btn">Не нашли фильм?</button>}
      className="custom-film"
      onClose={reset}
    >
      {(close: () => void) => (
        <form
          className="grid sm:p-2 sm:grid-cols-popup-content"
          key="form"
          onSubmit={(e) => {
            handleSubmit(onSubmit)(e)
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

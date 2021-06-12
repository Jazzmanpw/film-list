import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import Popup from 'reactjs-popup'
import { useAddCustomFilm } from './atoms'
import Film, { CustomFilm } from '../model/film'

const customFilmAttributes = [
  { key: 'nameRu' as const, text: 'Русское название' },
  { key: 'nameEn' as const, text: 'Оригинальное название' },
  { key: 'posterUrl' as const, text: 'Ссылка на постер' },
  {
    key: 'posterUrlPreview' as const,
    text: 'Ссылка на маленькую версию постера',
  },
]

export default function CustomFilmButton() {
  const { register, handleSubmit } = useForm<CustomFilm>()
  const addCustomFilm = useAddCustomFilm()

  const onSubmit: SubmitHandler<CustomFilm> = (customFilm) => {
    addCustomFilm(Film.createCustom(customFilm))
  }

  return (
    <Popup
      modal
      trigger={<button className="btn">Не нашли фильм?</button>}
      className="custom-film"
    >
      <form
        className="grid sm:p-2 sm:grid-cols-popup-content"
        key="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="font-medium text-2xl" key="title">
          Введите данные о фильме
        </h1>
        <ul className="sm:col-span-2 sm:row-start-2">
          {customFilmAttributes.map(({ key, text }) => (
            <li key={key}>
              <label htmlFor={key}>{text}</label>
              <input
                className="input"
                type="text"
                required
                {...register(key)}
                autoComplete="off"
                key={`${key}-input`}
              />
            </li>
          ))}
        </ul>
        <button className="btn block mt-2 w-full sm:m-0">Готово</button>
      </form>
    </Popup>
  )
}

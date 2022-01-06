import { faEdit, faPlus, faQuestion } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ErrorMessage, Field, Form, Formik, useField } from 'formik'
import { join, map, partition, pipe, prop, reject } from 'ramda'
import React, { ComponentType } from 'react'
import Popup from 'reactjs-popup'
import Button from '../button'
import CountryLabel from '../country/country-label'
import CountryInput from '../country/country-input'
import Country, { CountryData, CountryDataWithCode } from '../country/model'
import Input from '../input'
import type { EditableFilmData, FilmData } from './model'

type AttributeBase = { field: keyof FilmData; text: string; required?: boolean }
type Attribute = AttributeBase & { component?: ComponentType<AttributeBase> }

const mainAttributes: Attribute[] = [
  { field: 'name', text: 'Русское название', required: true },
  { field: 'originalName', text: 'Оригинальное название' },
  {
    field: 'thumbnailUrl',
    text: 'Ссылка на маленькую версию постера',
    required: true,
  },
  { field: 'countries', text: 'Страны', component: CountryField },
  { field: 'href', text: 'Ссылка' },
  { field: 'year', text: 'Год' },
]

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
          {mainAttributes.map(
            ({ component: Component = TextField, ...props }) => (
              <li key={props.field}>
                <Component {...props} />
              </li>
            ),
          )}
          <li key="seen" className="flex">
            <label htmlFor="seen" className="flex-1">
              <Field id="seen" type="checkbox" name="seen" /> Уже видел
            </label>
          </li>
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

function CountryField({ field: name, required, text }: AttributeBase) {
  const [{ value: countries }, , { setValue }] = useField<CountryData[]>({
    name,
    multiple: true,
    required,
    validate: (countries: CountryData[]) => {
      const unrecognizedCountries = reject(Country.hasCode, countries)
      if (unrecognizedCountries.length) {
        return `Мы не смогли распознать следующие страны: ${unrecognizedCountries
          .map(prop('name'))
          .join(
            ', ',
          )}. Выберите подходящую страну в списке или удалите её вручную.`
      }
    },
  })

  const [countriesWithCode, countriesWithoutCode] = partition(
    Country.hasCode,
    countries,
  ) as [CountryDataWithCode[], CountryData[]]

  return (
    <>
      <label>{text}</label>
      <ul className="flex gap-2">
        {countriesWithCode.map((country) => (
          <li
            key={country.code}
            className="inline-flex items-center justify-center w-6"
          >
            <CountryLabel country={country} compact />
          </li>
        ))}
        <Popup
          modal
          trigger={
            <li className="cursor-pointer">
              {countriesWithoutCode.length ? (
                <FontAwesomeIcon icon={faQuestion} className="h-4 w-6 mr-2" />
              ) : null}
              <FontAwesomeIcon
                icon={countries.length ? faEdit : faPlus}
                className="h-4 w-6 text-red-500 hover:text-red-600"
              />
            </li>
          }
          closeOnDocumentClick={false}
          className="country-select"
          key="add-country"
        >
          {(close: () => void) => (
            <CountryInput
              onSubmit={(newValue) => {
                setValue(newValue)
                close()
              }}
              onCancel={close}
              selected={countriesWithCode}
              helperText={
                countriesWithoutCode.length
                  ? `Мы не смогли распознать следующие страны: ${pipe(
                      map(prop('name')),
                      join(', '),
                    )(
                      countriesWithoutCode,
                    )}.\nПри сохранении эти страны будут удалены.`
                  : undefined
              }
            />
          )}
        </Popup>
      </ul>
      <span className="text-red-600">
        <ErrorMessage name={name} />
      </span>
    </>
  )
}

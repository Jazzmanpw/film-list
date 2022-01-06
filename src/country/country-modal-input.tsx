import clsx from 'clsx'
import codeToRu from 'Generated/codeToRu.json'
import ruCountryCodes from 'Generated/ruCountryCodes.json'
import {
  __,
  assoc,
  dissoc,
  has,
  ifElse,
  includes,
  pathOr,
  pipe,
  prop,
  toLower,
} from 'ramda'
import React, { useState } from 'react'
import Button from '../button'
import Input from '../input'
import Country, { CountryDataWithCode } from './model'

type Props = {
  helperText?: string
  onCancel: () => void
  onSubmit: (country: CountryDataWithCode[]) => void
  selected: CountryDataWithCode[]
}

const fromRuCode = Country.fromCode(codeToRu)

export default function CountryInput({
  helperText,
  onCancel,
  onSubmit,
  selected,
}: Props) {
  const [inputValue, setInputValue] = useState('')
  const [selectedOnly, setSelectedOnly] = useState(false)
  const [value, setValue] = useState(
    Object.fromEntries(selected.map((s) => [s.code, true])),
  )
  const codes = selectedOnly
    ? ruCountryCodes.filter(has(__, value))
    : ruCountryCodes
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    const code = (e.target as HTMLElement).dataset.flCode || ''
    setValue(ifElse(prop(code), dissoc(code), assoc(code, true)))
  }
  return (
    <main className="grid h-full grid-rows-[auto,auto,auto,1fr,auto] sm:p-2">
      <Input
        className="sticky top-0"
        type="text"
        value={inputValue}
        onChange={pipe(pathOr('', ['target', 'value']), setInputValue)}
      />
      <span className="text-gray-500 text-sm whitespace-pre-line">
        {helperText}
      </span>
      <label htmlFor="selected">
        <input
          type="checkbox"
          id="selected"
          checked={selectedOnly}
          onChange={pipe(pathOr(false, ['target', 'checked']), setSelectedOnly)}
        />
        Показать только выбранные
      </label>
      <ul className="overflow-auto border-2 px-1">
        {codes
          .filter(
            pipe(
              prop(__, codeToRu),
              toLower,
              includes(inputValue.toLowerCase()),
            ),
          )
          .map((code) => (
            <li
              key={code}
              data-fl-code={code}
              onClick={handleClick}
              className={clsx(
                'cursor-pointer hover:bg-red-50',
                value[code] && 'text-red-600',
              )}
            >
              {codeToRu[code]}
            </li>
          ))}
      </ul>
      <section className="flex gap-2 mt-2 w-full">
        <Button secondary onClick={onCancel} className="flex-1">
          Отмена
        </Button>
        <Button
          onClick={() =>
            onSubmit(ruCountryCodes.filter(prop(__, value)).map(fromRuCode))
          }
          className="flex-1"
        >
          Готово
        </Button>
      </section>
    </main>
  )
}

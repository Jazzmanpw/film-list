import React from 'react'
import FilmInput from './film-input'
import List from './list'

export default function ListContent() {
  return (
    <section className="flex flex-col gap-4 lg:max-h-full lg:flex-row">
      <FilmInput />
      <List />
    </section>
  )
}

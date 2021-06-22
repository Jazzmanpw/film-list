import { prop } from 'ramda'
import React from 'react'
import { NavLink, Route, Switch, useRouteMatch } from 'react-router-dom'
import SwitchButton from '../switch-button'
import FilmInput from './film-input'
import List from './list'

const lists = [
  { url: '', title: 'Все фильмы', exact: true },
  { url: '/new', title: 'К просмотру' },
  { url: '/seen', title: 'Уже смотрел' },
]

export default function ListContent() {
  const { path: rootPath, url: rootUrl } = useRouteMatch()
  return (
    <section className="flex flex-col gap-4 lg:max-h-full lg:flex-row">
      <header>
        <SwitchButton
          propsArr={lists.map((l) => ({
            ...l,
            to: `${rootUrl}${l.url}`,
            children: l.title,
          }))}
          childComponent={NavLink}
          createKey={prop('to')}
        />
      </header>
      <Switch>
        <Route path={`${rootPath}/:status?`}>
          <FilmInput />
          <List />
        </Route>
      </Switch>
    </section>
  )
}

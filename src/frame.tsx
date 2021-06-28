import React from 'react'
import {
  BrowserRouter as Router,
  NavLink,
  Route,
  Switch,
} from 'react-router-dom'
import FilmContent from './film/film-content'
import HomeContent from './home/content'
import ListContent from './list/content'
import UndoModal from './undo-modal'

const pages = [
  { url: '/', title: 'Главная', exact: true },
  { url: '/list', title: 'Список' },
]

export default function Frame() {
  return (
    <Router>
      <header>
        <nav>
          <ul className="flex gap-4">
            {pages.map(({ url, title, exact }) => (
              <li key={url}>
                <NavLink
                  className="block text-red-700 font-semibold"
                  activeClassName="font-bold"
                  to={url}
                  exact={exact}
                >
                  {title}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      {/* h-0 makes the <main /> to fit the screen-height */}
      <main className="lg:h-0 lg:flex-1">
        <Switch>
          <Route path="/" exact>
            <HomeContent />
          </Route>
          <Route path="/list">
            <ListContent />
          </Route>
          <Route path="/film/:id">
            <FilmContent />
          </Route>
        </Switch>
        <UndoModal />
      </main>
    </Router>
  )
}

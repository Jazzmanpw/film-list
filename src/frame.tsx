import React from 'react'
import {
  BrowserRouter as Router,
  NavLink,
  Route,
  Switch,
} from 'react-router-dom'
import HomeContent from './home/content'
import ListContent from './list/content'

const pages = [
  { pathname: '/', title: 'Главная', exact: true },
  { pathname: '/list', title: 'Список' },
]

export default function Frame() {
  return (
    <Router>
      <header>
        <nav>
          <ul className="flex gap-4">
            {pages.map(({ pathname, title, exact }) => (
              <li key={pathname}>
                <NavLink
                  className="block text-red-700 font-semibold"
                  activeClassName="font-bold"
                  to={pathname}
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
        </Switch>
      </main>
    </Router>
  )
}

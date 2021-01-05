import React from 'react'
import { useRecoilValue } from 'recoil'
import { films as filmsAtom } from './atoms'

const List: React.FC = () => {
  const films = useRecoilValue(filmsAtom)
  return (
    <div>
      {films.map((film) => (
        <div key={film}>{film}</div>
      ))}
    </div>
  )
}

export default List

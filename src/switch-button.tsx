import React, { FC, Key } from 'react'

type Props<P extends Record<string, unknown>> = {
  propsArr: P[]
  childComponent: FC<P & { className: string; activeClassName: string }>
  createKey: (props: P) => Key
}

export default function SwitchButton<P extends Record<string, unknown>>({
  propsArr,
  childComponent: Child,
  createKey,
}: Props<P>) {
  return (
    <ul className="bg-red-100 flex gap-1 p-1 rounded-md">
      {propsArr.map((props) => (
        <li className="flex-1" key={createKey(props)}>
          <Child
            {...props}
            className="block p-1 w-full text-center leading-none font-semibold transition-colors ease-out rounded-md"
            activeClassName="bg-red-500 text-red-50"
          />
        </li>
      ))}
    </ul>
  )
}

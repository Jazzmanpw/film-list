import React from 'react'

export default function HomeContent() {
  return (
    <article className="flex flex-col gap-2">
      <h1 className="text-red-600 font-bold text-xl sm:text-2xl">
        Добро пожаловать в Фильмотеку!
      </h1>
      <p>
        Приложение находится в разработке, проектируется для личного
        использования и вообще не факт, что когда-нибудь станет общедоступным
      </p>
    </article>
  )
}

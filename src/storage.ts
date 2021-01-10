import { AtomEffect, DefaultValue } from 'recoil'

export const storageKeys = {
  films: 'film-list_films' as const,
}

type StorageKey = typeof storageKeys[keyof typeof storageKeys]

export function createStorageEffect<T>(key: StorageKey): AtomEffect<T> {
  return ({ onSet, setSelf }) => {
    const prevValue = localStorage.getItem(key)
    if (prevValue) {
      try {
        setSelf(JSON.parse(prevValue) as T)
      } catch (e) {
        console.error(`failed to parse storage data by ${key} key`, e)
      }
    }
    onSet((newValue) => {
      if (newValue instanceof DefaultValue) {
        localStorage.removeItem(key)
      } else {
        localStorage.setItem(key, JSON.stringify(newValue))
      }
    })
  }
}

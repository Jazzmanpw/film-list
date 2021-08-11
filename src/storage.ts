import { AtomEffect, DefaultValue } from 'recoil'

export const storageKeys = {
  films: 'film-list_films' as const,
  tags: 'film-list_tags' as const,
}

type StorageKey = typeof storageKeys[keyof typeof storageKeys]

export function createStorageEffect<T>(
  key: StorageKey,
  version: number,
): AtomEffect<T> {
  const storage = createStorage<T>(key, version)
  return ({ onSet, setSelf }) => {
    const prevValue = storage.get()
    if (prevValue) {
      setSelf(prevValue)
    }
    onSet((newValue) => {
      if (newValue instanceof DefaultValue) {
        storage.remove()
      } else {
        storage.set(newValue)
      }
    })
  }
}

function createStorage<T>(key: string, version: number) {
  validateStorage(key, version)
  return {
    get() {
      try {
        const raw = localStorage.getItem(key)
        return raw && ((JSON.parse(raw)?.[version] as T) ?? null)
      } catch (e) {
        console.error(`failed to parse storage data by ${key} key`, e)
        localStorage.removeItem(key)
        return null
      }
    },
    set(value: T) {
      localStorage.setItem(key, JSON.stringify({ [version]: value }))
    },
    remove() {
      localStorage.removeItem(key)
    },
  }
}

function validateStorage(key: string, version: number) {
  const initRawValue = localStorage.getItem(key)
  if (initRawValue) {
    try {
      const initValue = JSON.parse(initRawValue)
      if (version in initValue) {
        return
      }
    } catch (e) {
      console.warn(`failed to parse initial ${key} value`, e)
    }
    localStorage.removeItem(key)
  }
}

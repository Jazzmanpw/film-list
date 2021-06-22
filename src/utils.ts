import { filter, join, pipe } from 'ramda'

// noinspection JSUnusedGlobalSymbols
export function log<T>(v: T) {
  console.log(v)
  return v
}

export const joinTruthy = pipe(filter<unknown, 'array'>(Boolean), join(' '))

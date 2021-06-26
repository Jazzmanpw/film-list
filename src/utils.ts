import { filter, identity, join, pipe } from 'ramda'

// noinspection JSUnusedGlobalSymbols
export function log<T>(v: T) {
  console.log(v)
  return v
}

export const joinTruthy = pipe(filter<unknown, 'array'>(Boolean), join(' '))

type Falsy = '' | 0 | 0n | false | null | undefined

export const ifTruthy =
  <T, N extends Falsy, R>(onTrue: (v: T) => R, onFalse: (v: N) => R) =>
  (v: T | N): R =>
    ifGuard<T, N>(v) ? onTrue(v) : onFalse(v)

export const whenTruthy = <T, N extends Falsy>(onTrue: Editor<T>) =>
  ifTruthy<T, N, T | N>(onTrue, identity)

function ifGuard<T, N extends Falsy>(v: T | N): v is T {
  return !!v
}

export type Editor<T> = (v: T) => T

export type WhenTruthy<T, N> = (onTrue: Editor<T>) => Editor<T | N>

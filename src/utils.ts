import { always, filter, identity, join, pipe } from 'ramda'
import type { QueryFunctionContext } from 'react-query'
import type { AtomEffect } from 'recoil'

// noinspection JSUnusedGlobalSymbols
export function log<T>(v: T) {
  console.log(v)
  return v
}

// noinspection JSUnusedGlobalSymbols
export function logLabel(label: string) {
  return <T>(v: T) => {
    console.log(label, v)
    return v
  }
}

// noinspection JSUnusedGlobalSymbols
export function createLoggingEffect<T>(label?: string): AtomEffect<T> {
  return ({ onSet }) => {
    onSet((next, prev) => console.log(label, next, prev))
  }
}

export const joinTruthy = pipe(filter<unknown, 'array'>(Boolean), join(' '))

type Falsy = '' | 0 | 0n | false | null | undefined

const ifTruthy =
  <T, N extends Falsy, R>(onTrue: (v: T) => R, onFalse: (v: N) => R) =>
  (v: T | N): R =>
    ifGuard<T, N>(v) ? onTrue(v) : onFalse(v)

export const whenTruthy = <T, N extends Falsy>(onTrue: Editor<T>) =>
  ifTruthy<T, N, T | N>(onTrue, identity)

export const whenTruthyOr = <T, N extends Falsy, R, D>(
  onTrue: (v: T) => R | D,
  defaultValue: D,
) => ifTruthy<T, N, R | D>(onTrue, always(defaultValue))

function ifGuard<T, N extends Falsy>(v: T | N): v is T {
  return !!v
}

export type Editor<T> = (v: T) => T

export type WhenTruthy<T, N> = (onTrue: Editor<T>) => Editor<T | N>

export function fetchOrThrow<P, R>(
  buildRequest: (params: P) => RequestInfo,
  init?: RequestInit,
) {
  return async ({
    queryKey: [, params],
  }: QueryFunctionContext<[string, P]>) => {
    const response = await fetch(buildRequest(params), init)
    if (!response.ok) {
      throw new Error(
        `${response.statusText} (${response.status}): ${await response.text()}`,
      )
    }
    return await response.json()
  }
}

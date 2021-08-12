import React, { FormEvent } from 'react'
import {
  atom,
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil'
import Button from './button'

const undoPopupLifetime = 3000

const undoTimeoutId = atom<number | null>({
  key: 'undo/timeout-id',
  default: null,
})

const lastActionAtom = atom<{ label: string; undo: () => void } | null>({
  key: 'undo/callback',
  default: null,
})

export function useUndo<T>(
  label: string,
  act: (arg: T) => void,
  undo: (arg: T) => void,
): typeof act {
  const setLastAction = useSetRecoilState(lastActionAtom)
  const resetLastAction = useResetRecoilState(lastActionAtom)
  const [timeoutId, setTimeoutId] = useRecoilState(undoTimeoutId)
  return (arg) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    setLastAction({
      label,
      undo: () => {
        undo(arg)
        resetLastAction()
      },
    })
    setTimeoutId(window.setTimeout(resetLastAction, undoPopupLifetime))
    return act(arg)
  }
}

export default function UndoModal() {
  const lastAction = useRecoilValue(lastActionAtom)
  if (!lastAction) {
    return null
  }
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    lastAction.undo()
    e.preventDefault()
    e.stopPropagation()
  }
  return (
    <div className="relative flex justify-center">
      <form
        onSubmit={onSubmit}
        className="fixed bottom-4 mx-auto p-4 bg-red-100 flex flex-col w-80 gap-4"
      >
        <label className="font-medium">Отменить {lastAction.label}?</label>
        <Button className="self-end">Отменить</Button>
      </form>
    </div>
  )
}

import { atom } from 'recoil'

export const films = atom({
  default: [] as string[],
  key: 'list',
})

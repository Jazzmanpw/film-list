import React, { ButtonHTMLAttributes } from 'react'
import { joinTruthy } from '../utils'
import Tag, { TagData } from './model'

type Props = {
  buttonType?: ButtonHTMLAttributes<HTMLButtonElement>['type']
  data: TagData
  disabled?: boolean
  className?: string
}
export default function TagChip({ data, className: extraClass }: Props) {
  const className = joinTruthy([
    'text-xs px-2 py-1 leading-none font-semibold rounded-r-full',
    Tag.toColorClass(data),
    extraClass,
  ])
  return <span className={className}>{data.value}</span>
}

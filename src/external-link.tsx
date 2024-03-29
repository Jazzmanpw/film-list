import React from 'react'

const sizeClasses = {
  sm: { a: 'h-4 ml-1', svg: 'w-3 h-3' },
  md: { a: 'h-8 ml-2', svg: 'w-6 h-6' },
}

type Props = {
  href?: string
  size: keyof typeof sizeClasses
  target?: '_blank'
}

export default function ExternalLink({ href, size, target }: Props) {
  return href ? (
    <a
      className={`inline-block ${sizeClasses[size].a} align-middle`}
      href={href}
      target={target}
      onClick={(e) => e.stopPropagation()}
    >
      <svg
        className={`text-red-500 inline ${sizeClasses[size].svg} align-top hover:text-red-600`}
        viewBox="0 0 1024 768"
        height="1024"
        width="768"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="currentColor"
          d="M640 768H128V257.90599999999995L256 256V128H0v768h768V576H640V768zM384 128l128 128L320 448l128 128 192-192 128 128V128H384z"
        />
      </svg>
      {/* no content for now, just the icon */}
    </a>
  ) : null
}

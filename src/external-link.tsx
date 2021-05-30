import React from 'react'

type Props = {
  href: string
  target?: '_blank'
}

export default function ExternalLink({ href, target }: Props) {
  return (
    <a
      className="inline-block h-4 ml-1 align-middle hover:bg-gray-300"
      href={href}
      target={target}
    >
      <img
        className="inline w-3 align-top object-cover object-center"
        src="/assets/img/link.svg"
        alt="External link"
      />
      {/* no content for now, just the icon */}
    </a>
  )
}

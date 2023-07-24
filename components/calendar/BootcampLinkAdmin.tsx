import React from 'react'

import {Bootcamp} from '@/@types/apiResponseTypes'

export function BootcampLinkAdmin({
  onClick,
  bootcamp,
}: {
  onClick: (event: React.MouseEvent | React.KeyboardEvent) => void
  bootcamp: Bootcamp
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={onClick}
      onClick={onClick}
      className="my-1 block w-full rounded bg-yellow-400 text-xs font-bold text-white lg:text-base"
      id={bootcamp?.id}
    >
      {bootcamp?.name}
    </div>
  )
}

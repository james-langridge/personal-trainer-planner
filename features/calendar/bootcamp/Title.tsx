import Link from 'next/link'
import React from 'react'

import {Bootcamp} from '@/@types/apiResponseTypes'

export function Title({
  bootcamp,
  isAdmin,
  onClick,
}: {
  bootcamp: Bootcamp
  isAdmin: boolean
  onClick: (event: React.MouseEvent | React.KeyboardEvent) => void
}) {
  if (isAdmin) {
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

  return (
    <Link
      href={`/app/(restricted)/bootcamps/${bootcamp?.id}`}
      className="my-1 block w-full rounded bg-yellow-400 text-xs font-bold text-white lg:text-base"
      data-testid={`${bootcamp?.id}`}
    >
      {bootcamp?.name}
    </Link>
  )
}

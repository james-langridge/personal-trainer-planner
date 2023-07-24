import Link from 'next/link'
import React from 'react'

import {Bootcamp} from '@/@types/apiResponseTypes'

export function BootcampLinkUser({bootcamp}: {bootcamp: Bootcamp}) {
  return (
    <Link
      href={`/workout/${bootcamp?.id}`}
      className="my-1 block w-full rounded bg-yellow-400 text-xs font-bold text-white lg:text-base"
      data-testid={`${bootcamp?.id}`}
    >
      {bootcamp?.name}
    </Link>
  )
}

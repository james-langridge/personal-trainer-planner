import Link from 'next/link'
import React from 'react'

import {Workout} from '@/@types/apiResponseTypes'

export function WorkoutLinkUser({workout}: {workout: Workout}) {
  return (
    <Link
      href={`/workout/${workout?.id}`}
      className="my-1 block w-full rounded bg-emerald-400 text-xs font-bold text-white lg:text-base"
      data-testid={`${workout?.id}`}
    >
      {workout?.name}
    </Link>
  )
}

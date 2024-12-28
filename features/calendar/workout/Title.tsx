import Link from 'next/link'
import React from 'react'

import {Workout} from '@/@types/apiResponseTypes'

export function Title({
  isAdmin,
  onClick,
  workout,
}: {
  isAdmin: boolean
  onClick: (event: React.MouseEvent | React.KeyboardEvent) => void
  workout: Workout
}) {
  if (isAdmin) {
    return (
      <div
        role="button"
        tabIndex={0}
        onKeyDown={onClick}
        onClick={onClick}
        className="my-1 block w-full rounded bg-emerald-400 text-xs font-bold text-white lg:text-base"
        id={workout?.id}
      >
        {workout?.name}
      </div>
    )
  }

  return (
    <Link
      href={`/app/(restricted)/workouts/${workout?.id}`}
      className="my-1 block w-full rounded bg-emerald-400 text-xs font-bold text-white lg:text-base"
      data-testid={`${workout?.id}`}
    >
      {workout?.name}
    </Link>
  )
}

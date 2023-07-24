import React from 'react'

import {Workout} from '@/@types/apiResponseTypes'

export function WorkoutLinkAdmin({
  onClick,
  workout,
}: {
  onClick: (event: React.MouseEvent | React.KeyboardEvent) => void
  workout: Workout
}) {
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

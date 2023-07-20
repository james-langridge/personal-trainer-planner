import clsx from 'clsx'
import React from 'react'

import {Workout} from '@/@types/apiResponseTypes'

export function WorkoutLinkAdmin({
  onClick,
  workout,
}: {
  onClick: (event: React.MouseEvent | React.KeyboardEvent) => void
  workout: Workout
}) {
  const isTrainingWorkout = workout.type === 'TRAINING'
  const isAppointment = workout.type === 'APPOINTMENT'
  const isBootcamp = workout.type === 'BOOTCAMP'

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={onClick}
      onClick={onClick}
      className={clsx(
        'my-1 block w-full rounded text-xs font-bold text-white lg:text-base',
        {
          'bg-emerald-400': isTrainingWorkout,
          'bg-blue-400': isAppointment,
          'bg-yellow-400': isBootcamp,
        },
      )}
      id={workout?.id}
    >
      {workout?.name}
    </div>
  )
}

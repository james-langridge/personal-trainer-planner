import clsx from 'clsx'
import Link from 'next/link'
import React from 'react'

import {Workout} from '@/@types/apiResponseTypes'

export function WorkoutLinkUser({workout}: {workout: Workout}) {
  const isTrainingWorkout = workout.type === 'TRAINING'
  const isAppointment = workout.type === 'APPOINTMENT'
  const isBootcamp = workout.type === 'BOOTCAMP'

  return (
    <Link
      href={`/workout/${workout?.id}`}
      className={clsx(
        'my-1 block w-full rounded text-xs font-bold text-white lg:text-base',
        {
          'bg-emerald-400': isTrainingWorkout,
          'bg-blue-400': isAppointment,
          'bg-yellow-400': isBootcamp,
        },
      )}
      data-testid={`${workout?.id}`}
    >
      {workout?.name}
    </Link>
  )
}

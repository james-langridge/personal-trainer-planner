import {WORKOUT_STATUS} from '@prisma/client'
import clsx from 'clsx'
import Link from 'next/link'

import {Workout} from '@/@types/apiResponseTypes'

import {useWorkoutStatus} from '.'

export function WorkoutItemMobile({workout}: {workout: Workout}) {
  const {status, toggleStatus} = useWorkoutStatus(workout)

  return (
    <div className="flex items-center gap-2 text-lg">
      <input
        type="checkbox"
        checked={status === WORKOUT_STATUS.COMPLETED}
        className="h-7 w-7 rounded"
        onChange={toggleStatus}
      />

      <Link
        href={`/workouts/${workout?.id}`}
        className={clsx(
          'p my-1 block w-full rounded bg-emerald-400 px-2 text-white',
          {
            'line-through': status === WORKOUT_STATUS.COMPLETED,
          },
        )}
      >
        {workout?.name}
      </Link>
    </div>
  )
}

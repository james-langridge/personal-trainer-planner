import {WORKOUT_STATUS} from '@prisma/client'
import clsx from 'clsx'
import Link from 'next/link'

import {SerialisedWorkout} from '@/@types/types'
import {useWorkoutStatus} from '@/hooks'

export function WorkoutItemMobile({workout}: {workout: SerialisedWorkout}) {
  const {status, toggleStatus} = useWorkoutStatus(workout)
  const isTrainingWorkout = workout.type === 'TRAINING'

  return (
    <div className="flex items-center gap-2 text-lg">
      {isTrainingWorkout && (
        <input
          type="checkbox"
          checked={status === WORKOUT_STATUS.COMPLETED}
          className="h-7 w-7 rounded"
          onChange={toggleStatus}
        />
      )}
      <Link
        href={`/workout/${workout?.id}`}
        className={clsx('my-1 block', {
          'line-through':
            status === WORKOUT_STATUS.COMPLETED && isTrainingWorkout,
        })}
      >
        {workout?.name}
      </Link>
    </div>
  )
}

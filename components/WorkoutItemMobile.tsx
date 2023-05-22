import {WORKOUT_STATUS} from '@prisma/client'
import Link from 'next/link'

import {useWorkoutStatus} from '@/hooks'
import {classNames} from '@/lib/misc'
import {SerialisedWorkout} from '@/lib/workouts'

export function WorkoutItemMobile({workout}: {workout: SerialisedWorkout}) {
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
        href={`/workout/${workout?.id}`}
        className={classNames(
          'my-1 block',
          status === WORKOUT_STATUS.COMPLETED ? 'line-through' : '',
        )}
      >
        {workout?.name}
      </Link>
    </div>
  )
}
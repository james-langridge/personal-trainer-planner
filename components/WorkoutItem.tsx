import {WORKOUT_STATUS} from '@prisma/client'
import Link from 'next/link'
import React from 'react'

import {useWorkoutStatus} from '@/hooks'
import {classNames} from '@/lib/misc'
import {SerialisedWorkout} from '@/lib/workouts'
import {useAppDispatch, useAppSelector} from '@/redux/hooks'
import {setWorkoutId} from '@/redux/workoutSlice'

export function WorkoutItem({workout}: {workout: SerialisedWorkout}) {
  const dispatch = useAppDispatch()
  const isAdmin = useAppSelector(state => state.auth.isAdmin)
  const {status, toggleStatus} = useWorkoutStatus(workout)
  const isTrainingWorkout = workout.type === 'TRAINING'
  const isAppointment = workout.type === 'APPOINTMENT'

  function onClick(event: React.MouseEvent | React.KeyboardEvent) {
    event.stopPropagation()

    if (!isAdmin) {
      return
    }

    const workoutId = (event.target as HTMLElement).id

    dispatch(setWorkoutId(workoutId))
  }

  return (
    <div className="ml-2 mr-1 flex items-center gap-2 text-lg">
      {isTrainingWorkout && (
        <input
          type="checkbox"
          checked={status === WORKOUT_STATUS.COMPLETED}
          className="h-7 w-7 rounded"
          onChange={toggleStatus}
        />
      )}

      {isAppointment && isAdmin && (
        <input
          type="checkbox"
          checked={status === WORKOUT_STATUS.COMPLETED}
          className="h-7 w-7 rounded"
          onChange={toggleStatus}
        />
      )}

      {isAdmin && (
        <div
          role="button"
          tabIndex={0}
          onKeyDown={onClick}
          onClick={onClick}
          className={classNames(
            'my-1 block w-full rounded text-xs font-bold text-white lg:text-base',
            isTrainingWorkout ? 'bg-emerald-400' : 'bg-blue-400',
          )}
          id={workout?.id}
        >
          {workout?.name}
        </div>
      )}

      {!isAdmin && (
        <Link
          href={`/workout/${workout?.id}`}
          className={classNames(
            'my-1 block w-full rounded text-xs font-bold text-white lg:text-base',
            isTrainingWorkout ? 'bg-emerald-400' : 'bg-blue-400',
          )}
          data-testid={`${workout?.id}`}
        >
          {workout?.name}
        </Link>
      )}
    </div>
  )
}

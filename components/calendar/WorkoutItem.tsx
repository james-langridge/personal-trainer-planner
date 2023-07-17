import {WORKOUT_STATUS} from '@prisma/client'
import clsx from 'clsx'
import Link from 'next/link'
import React from 'react'

import {Workout} from '@/@types/apiResponseTypes'
import {useWorkoutStatus} from '@/hooks'
import {selectIsAdmin} from '@/redux/authSlice'
import {useAppDispatch, useAppSelector} from '@/redux/hooks'
import {setWorkoutId} from '@/redux/workoutSlice'

export function WorkoutItem({workout}: {workout: Workout}) {
  const dispatch = useAppDispatch()
  const isAdmin = useAppSelector(selectIsAdmin)
  const {status, toggleStatus} = useWorkoutStatus(workout)
  const isTrainingWorkout = workout.type === 'TRAINING'
  const isAppointment = workout.type === 'APPOINTMENT'
  const isBootcamp = workout.type === 'BOOTCAMP'

  function onClick(event: React.MouseEvent | React.KeyboardEvent) {
    if (!isAdmin) {
      return
    }

    const workoutId = (event.target as HTMLElement).id

    dispatch(setWorkoutId(workoutId))
  }

  return (
    <div className="ml-2 mr-1 flex items-center gap-2 text-lg">
      {(isTrainingWorkout || isBootcamp) && (
        <input
          type="checkbox"
          checked={status === WORKOUT_STATUS.COMPLETED}
          className="h-7 w-7 rounded"
          onChange={toggleStatus}
          onClick={e => e.stopPropagation()}
        />
      )}

      {isAppointment && isAdmin && (
        <input
          type="checkbox"
          checked={status === WORKOUT_STATUS.COMPLETED}
          className="h-7 w-7 rounded"
          onChange={toggleStatus}
          onClick={e => e.stopPropagation()}
        />
      )}

      {isAdmin && (
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
      )}

      {!isAdmin && (
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
      )}
    </div>
  )
}

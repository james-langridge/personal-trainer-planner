import React from 'react'

import {Workout} from '@/@types/apiResponseTypes'
import {
  WorkoutCheckbox,
  WorkoutLinkAdmin,
  WorkoutLinkUser,
} from '@/components/calendar'
import {useWorkoutStatus} from '@/hooks'
import {selectIsAdmin} from '@/redux/authSlice'
import {useAppDispatch, useAppSelector} from '@/redux/hooks'
import {setWorkoutId} from '@/redux/workoutSlice'

export function WorkoutItem({workout}: {workout: Workout}) {
  const dispatch = useAppDispatch()
  const isAdmin = useAppSelector(selectIsAdmin)
  const {status, toggleStatus} = useWorkoutStatus(workout)
  const isAppointment = workout.type === 'APPOINTMENT'
  const displayCheckbox = !isAppointment || (isAppointment && isAdmin)

  function onClick(event: React.MouseEvent | React.KeyboardEvent) {
    if (!isAdmin) {
      return
    }

    const workoutId = (event.target as HTMLElement).id

    dispatch(setWorkoutId(workoutId))
  }

  return (
    <div className="ml-2 mr-1 flex items-center gap-2 text-lg">
      {displayCheckbox && (
        <WorkoutCheckbox onChange={toggleStatus} status={status} />
      )}

      {isAdmin && <WorkoutLinkAdmin onClick={onClick} workout={workout} />}

      {!isAdmin && <WorkoutLinkUser workout={workout} />}
    </div>
  )
}

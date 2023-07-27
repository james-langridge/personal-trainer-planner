import React from 'react'

import {Workout} from '@/@types/apiResponseTypes'
import {useWorkoutStatus, Checkbox, Title} from '@/features/calendar/workout/'
import {selectIsAdmin} from '@/redux/authSlice'
import {setEvent} from '@/redux/eventSlice'
import {useAppDispatch, useAppSelector} from '@/redux/hooks'

export function WorkoutItem({workout}: {workout: Workout}) {
  const dispatch = useAppDispatch()
  const isAdmin = useAppSelector(selectIsAdmin)
  const {status, toggleStatus} = useWorkoutStatus(workout)

  function onClick(event: React.MouseEvent | React.KeyboardEvent) {
    if (!isAdmin) {
      return
    }

    const workoutId = (event.target as HTMLElement).id

    dispatch(
      setEvent({
        id: workoutId,
        type: 'WORKOUT',
      }),
    )
  }

  return (
    <div className="ml-2 mr-1 flex items-center gap-2 text-lg">
      <Checkbox onChange={toggleStatus} status={status} />
      <Title isAdmin={isAdmin} onClick={onClick} workout={workout} />
    </div>
  )
}

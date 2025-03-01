'use client'

import {Workout} from '@/lib/calendar'

import {Checkbox, Title, useWorkoutStatus} from '.'
import {Day} from '@/@types/types'

export function WorkoutItem({
  workout,
  day,
  userId,
}: {
  workout: Workout
  day: Day
  userId: string
}) {
  const {status, workoutStatus, toggleStatus} = useWorkoutStatus(workout)

  return (
    <div className="ml-2 mr-1 flex items-center gap-2 text-lg">
      <Checkbox
        onChange={toggleStatus}
        status={status}
        workoutStatus={workoutStatus}
      />
      <Title workout={workout} day={day} userId={userId} />
    </div>
  )
}

import React from 'react'
import {Day} from '@/@types/types'
import {Workout} from '@/lib/calendar'
import {WorkoutItem} from '@/features/calendar/workout'

export function WorkoutsToday({
  day,
  userId,
  workouts,
}: {
  day: Day
  userId: string
  workouts: Workout[] | null
}) {
  if (!workouts) return null

  return (
    <div>
      {workouts.map(workout => {
        return (
          <div key={workout.id}>
            {workout && (
              <WorkoutItem workout={workout} day={day} userId={userId} />
            )}
          </div>
        )
      })}
    </div>
  )
}

import React from 'react'

import {UserWithWorkouts} from '@/@types/apiResponseTypes'
import {Day} from '@/@types/types'
import {WorkoutItem} from '@/components/calendar'

export function WorkoutItems({
  workouts,
  day,
}: {
  workouts?: UserWithWorkouts['workouts'] | undefined | null
  day: Day
}) {
  if (!workouts) {
    return null
  }

  return (
    <>
      {workouts.map((workout, i) => {
        return (
          <div key={day.day * day.year * day.month * i}>
            {workout && <WorkoutItem workout={workout} />}
          </div>
        )
      })}
    </>
  )
}

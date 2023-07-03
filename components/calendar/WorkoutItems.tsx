import React from 'react'

import {Day, SerialisedWorkout} from '@/@types/types'
import {WorkoutItem} from '@/components/calendar'

export function WorkoutItems({
  workouts,
  day,
}: {
  workouts: (SerialisedWorkout | undefined)[] | null | undefined
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

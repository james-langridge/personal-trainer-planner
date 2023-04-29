import {WorkoutItem} from '@/components/WorkoutItem'
import React from 'react'
import {Day} from '@/lib/calendar'
import {SerialisedWorkout} from '@/lib/workouts'

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

import React from 'react'

import {Workout} from '@/@types/apiResponseTypes'

import {WorkoutItem} from '.'

export function WorkoutList({workouts}: {workouts: Workout[]}) {
  return (
    <>
      {workouts.map(workout => {
        return (
          <div key={workout.id}>
            {workout && <WorkoutItem workout={workout} />}
          </div>
        )
      })}
    </>
  )
}

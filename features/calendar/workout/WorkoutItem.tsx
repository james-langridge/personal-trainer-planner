import React from 'react'

import {Workout} from '@/@types/apiResponseTypes'

import {Checkbox, Title} from '.'

export function WorkoutItem({
  workout,
  isAdmin,
}: {
  workout: Workout
  isAdmin: boolean
}) {
  return (
    <div className="ml-2 mr-1 flex items-center gap-2 text-lg">
      <Checkbox workout={workout} />
      <Title isAdmin={isAdmin} workout={workout} />
    </div>
  )
}

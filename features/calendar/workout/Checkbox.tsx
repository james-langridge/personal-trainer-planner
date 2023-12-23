'use client'

import {WORKOUT_STATUS} from '@prisma/client'
import React from 'react'

import {Workout} from '@/@types/apiResponseTypes'
import {useWorkoutStatus} from '@/features/calendar/workout/useWorkoutStatus'

export function Checkbox({workout}: {workout: Workout}) {
  const {status, toggleStatus} = useWorkoutStatus(workout)

  return (
    <input
      type="checkbox"
      checked={status === WORKOUT_STATUS.COMPLETED}
      className="h-7 w-7 rounded"
      onChange={toggleStatus}
      onClick={e => e.stopPropagation()}
    />
  )
}

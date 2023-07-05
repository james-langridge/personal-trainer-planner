import {Workout} from '@prisma/client'

import {SerialisedWorkout, SerialisedWorkoutKey} from '@/@types/types'
import {formatDate} from '@/lib/calendar'
import {workoutKeys} from '@/lib/constants'

export function isValidKey(key: string): key is SerialisedWorkoutKey {
  return workoutKeys.includes(key as SerialisedWorkoutKey)
}

export function serialiseWorkouts(
  workouts: Omit<Workout, 'createdAt' | 'updatedAt' | 'deleted'>[],
) {
  return workouts.map(workout => {
    const {date, ...rest} = workout

    return {
      ...rest,
      date: formatDate(date),
    }
  })
}

export function sortWorkouts(
  key: SerialisedWorkoutKey,
  workouts: SerialisedWorkout[],
  asc = true,
): SerialisedWorkout[] {
  return [...workouts].sort((a, b) => {
    const aValue = a[key] ?? ''
    const bValue = b[key] ?? ''

    if (aValue === '') {
      return asc ? 1 : -1
    }
    if (bValue === '') {
      return asc ? -1 : 1
    }

    const propA = Number.isNaN(Number(aValue))
      ? aValue.toUpperCase()
      : Number(aValue)
    const propB = Number.isNaN(Number(bValue))
      ? bValue.toUpperCase()
      : Number(bValue)

    if (propA < propB) {
      return asc ? -1 : 1
    }
    if (propA > propB) {
      return asc ? 1 : -1
    }
    return 0
  })
}

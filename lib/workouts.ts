import {Workout} from '@prisma/client'

import {SerialisedWorkout, SerialisedWorkoutKey} from '@/@types/types'
import {formatDate} from '@/lib/calendar'
import {validWorkoutKeys} from '@/lib/constants'

export function isValidKey(key: string): key is SerialisedWorkoutKey {
  return validWorkoutKeys.includes(key as SerialisedWorkoutKey)
}

export function sortWorkouts(
  key: SerialisedWorkoutKey,
  workouts: SerialisedWorkout[],
) {
  return [...workouts].sort((a, b) => {
    switch (key) {
      case 'status':
      case 'name':
      case 'date':
      case 'type':
        return a[key].localeCompare(b[key], undefined, {sensitivity: 'base'})
      case 'description':
      case 'videoUrl':
        if (a[key] === null) return 1
        if (b[key] === null) return -1
        return (a[key] as string).localeCompare(b[key] as string) // Change here
      default:
        return 0
    }
  })
}

export function serialiseWorkouts(workouts: Workout[]) {
  return workouts.map(workout => {
    const {createdAt, updatedAt, date, deleted, ...rest} = workout

    return {
      ...rest,
      deleted: deleted.toString(),
      createdAt: formatDate(createdAt),
      updatedAt: formatDate(updatedAt),
      date: formatDate(date),
    }
  })
}

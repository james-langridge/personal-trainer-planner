import {Workout, WORKOUT_STATUS, WORKOUT_TYPE} from '@prisma/client'

import {formatDate} from '@/lib/calendar'

export type SerialisedWorkout = {
  id: string
  createdAt: string
  updatedAt: string
  ownerId: string
  status: WORKOUT_STATUS
  name: string
  date: string
  description: string | null
  videoUrl: string | null
  type: WORKOUT_TYPE
  deleted: string
}

export type SerialisedWorkoutKey = keyof Omit<
  SerialisedWorkout,
  'id' | 'ownerId' | 'createdAt' | 'updatedAt' | 'deleted'
>

export function isValidKey(key: string): key is SerialisedWorkoutKey {
  return validKeys.includes(key as SerialisedWorkoutKey)
}

export const validKeys: SerialisedWorkoutKey[] = [
  'date',
  'name',
  'description',
  'type',
  'status',
  'videoUrl',
]

export const keyMap = {
  date: 'Date',
  name: 'Name',
  description: 'Description',
  type: 'Type',
  status: 'Status',
  videoUrl: 'Video url',
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

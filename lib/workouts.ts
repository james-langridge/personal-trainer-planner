import {UserWithWorkouts, Workout} from '@/@types/apiResponseTypes'
import {WorkoutKey} from '@/@types/types'
import {workoutKeys} from '@/lib/constants'

export function filterByMonth(
  year: number,
  month: number,
  users: UserWithWorkouts[],
) {
  return users.map(user => {
    const filteredWorkouts = user.workouts.filter(workout => {
      const workoutDate = new Date(workout.date)
      const workoutYear = workoutDate.getFullYear()
      const workoutMonth = workoutDate.getMonth()

      return workoutMonth === month && workoutYear === year
    })

    return {...user, workouts: filteredWorkouts}
  })
}

export function isValidKey(key: string): key is WorkoutKey {
  return workoutKeys.includes(key as WorkoutKey)
}

export function sortWorkouts(
  key: WorkoutKey,
  workouts: Workout[],
  asc = true,
): Workout[] {
  return [...workouts].sort((a, b) => {
    const aValue = a[key]
    const bValue = b[key]

    if (aValue === null || aValue === undefined) {
      return asc ? 1 : -1
    }
    if (bValue === null || bValue === undefined) {
      return asc ? -1 : 1
    }

    let propA: string | number = ''
    let propB: string | number = ''

    if (typeof aValue === 'string') {
      propA = aValue.toUpperCase()
    } else if (aValue instanceof Date) {
      propA = aValue.getTime()
    }

    if (typeof bValue === 'string') {
      propB = bValue.toUpperCase()
    } else if (bValue instanceof Date) {
      propB = bValue.getTime()
    }

    if (propA < propB) {
      return asc ? -1 : 1
    }
    if (propA > propB) {
      return asc ? 1 : -1
    }
    return 0
  })
}

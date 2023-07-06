import {UserWithWorkouts} from '@/@types/apiResponseTypes'
import {
  ComputedWorkoutData,
  UserWithWorkoutsKey,
  UserWithWorkoutAndAttendanceKey,
  UserWithWorkoutAndAttendance,
} from '@/@types/types'
import {userKeys} from '@/lib/constants'

export function addAttendanceData(users: UserWithWorkouts[]) {
  return users.map(user => {
    return {...user, ...computeWorkoutData(user.workouts)}
  })
}

export function computeWorkoutData(
  workouts: UserWithWorkouts['workouts'],
): ComputedWorkoutData {
  const workoutsData = {
    appointments: 0,
    appointmentsAttended: 0,
    workoutsAssigned: 0,
    workoutsCompleted: 0,
  }

  return workouts.reduce((acc, cur) => {
    if (cur.type === 'TRAINING') {
      acc.workoutsAssigned++
    }

    if (cur.type === 'TRAINING' && cur.status === 'COMPLETED') {
      acc.workoutsCompleted++
    }

    if (cur.type === 'APPOINTMENT') {
      acc.appointments++
    }

    if (cur.type === 'APPOINTMENT' && cur.status === 'COMPLETED') {
      acc.appointmentsAttended++
    }

    return acc
  }, workoutsData)
}

export function isValidKey(key: string): key is UserWithWorkoutsKey {
  return userKeys.includes(key as UserWithWorkoutsKey)
}

export function sortUsers(
  key: UserWithWorkoutAndAttendanceKey,
  users: UserWithWorkoutAndAttendance[],
  asc = true,
) {
  return [...users].sort((a, b) => {
    const aValue = a[key]
    const bValue = b[key]

    let comparison: number

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const propA = aValue.toUpperCase()
      const propB = bValue.toUpperCase()

      if (propA < propB) comparison = -1
      else if (propA > propB) comparison = 1
      else comparison = 0
    } else if (typeof aValue === 'number' && typeof bValue === 'number') {
      comparison = aValue - bValue
    } else {
      throw new Error(`Cannot sort by key "${key}"`)
    }

    return asc ? comparison : -comparison
  })
}

export function sortByString(
  key: keyof UserWithWorkouts,
  array: UserWithWorkouts[],
): UserWithWorkouts[] {
  return [...array].sort((a, b) => {
    const aValue = a[key]
    const bValue = b[key]

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const propA = aValue.toUpperCase()
      const propB = bValue.toUpperCase()

      if (propA < propB) {
        return -1
      }
      if (propA > propB) {
        return 1
      }
    }
    return 0
  })
}

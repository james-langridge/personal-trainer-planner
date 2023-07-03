import {Workout} from '@prisma/client'

import {
  SerialisedUser,
  SerialisedUserKey,
  UserWithWorkouts,
  WorkoutDataFoo,
} from '@/@types/types'
import {formatDate} from '@/lib/calendar'
import {validUserKeys} from '@/lib/constants'
import {serialiseWorkouts} from '@/lib/workouts'

export function serialiseUsersWithWorkouts(users: UserWithWorkouts[]) {
  return users.map(user => serialiseUserWithWorkouts(user))
}

export function serialiseUserWithWorkouts(
  user?: UserWithWorkouts | null,
): SerialisedUser | undefined {
  if (!user) {
    return
  }

  const {createdAt, workouts, updatedAt, ...rest} = user
  const {
    appointments,
    appointmentsAttended,
    workoutsAssigned,
    workoutsCompleted,
  } = extractWorkoutData(workouts)

  return {
    ...rest,
    appointments: appointments.toString(),
    appointmentsAttended: appointmentsAttended.toString(),
    createdAt: formatDate(createdAt),
    workouts: serialiseWorkouts(workouts),
    workoutsAssigned: workoutsAssigned.toString(),
    workoutsCompleted: workoutsCompleted.toString(),
    updatedAt: formatDate(updatedAt),
  }
}

function extractWorkoutData(workouts: Workout[]): WorkoutDataFoo {
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

export function isValidKey(key: string): key is SerialisedUserKey {
  return validUserKeys.includes(key as SerialisedUserKey)
}

export function sortUsers(key: SerialisedUserKey, users: SerialisedUser[]) {
  return [...users].sort((a, b) => {
    const keyA = a[key]?.toUpperCase()
    const keyB = b[key]?.toUpperCase()

    if (!keyA || !keyB) {
      return 0
    }

    if (keyA < keyB) {
      return -1
    }

    if (keyA > keyB) {
      return 1
    }

    return 0
  })
}

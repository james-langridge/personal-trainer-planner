import {Workout} from '@prisma/client'

import {
  SerialisedUser,
  SerialisedUserKey,
  UserWithWorkouts,
  ComputedWorkoutData,
  SerialisedWorkoutKey,
  SerialisedWorkout,
} from '@/@types/types'
import {userKeys} from '@/lib/constants'
import {serialiseWorkouts} from '@/lib/workouts'

function computeWorkoutData(
  workouts: Omit<Workout, 'createdAt' | 'updatedAt' | 'deleted'>[],
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

export function isValidKey(key: string): key is SerialisedUserKey {
  return userKeys.includes(key as SerialisedUserKey)
}

export function serialiseUserWithWorkouts(
  user?: UserWithWorkouts | null,
): SerialisedUser | undefined {
  if (!user) {
    return
  }

  const {workouts, ...rest} = user
  const {
    appointments,
    appointmentsAttended,
    workoutsAssigned,
    workoutsCompleted,
  } = computeWorkoutData(workouts)

  return {
    ...rest,
    appointments: appointments.toString(),
    appointmentsAttended: appointmentsAttended.toString(),
    workouts: serialiseWorkouts(workouts),
    workoutsAssigned: workoutsAssigned.toString(),
    workoutsCompleted: workoutsCompleted.toString(),
  }
}

export function serialiseUsersWithWorkouts(users: UserWithWorkouts[]) {
  return users.map(user => serialiseUserWithWorkouts(user))
}

export function sortUsers(
  key: SerialisedUserKey,
  users: SerialisedUser[],
  asc = true,
): SerialisedUser[] {
  return [...users].sort((a, b) => {
    const aValue = a[key]
    const bValue = b[key]

    const propA =
      aValue !== null
        ? isNaN(Number(aValue))
          ? aValue.toUpperCase()
          : Number(aValue)
        : ''
    const propB =
      bValue !== null
        ? isNaN(Number(bValue))
          ? bValue.toUpperCase()
          : Number(bValue)
        : ''

    if (propA < propB) {
      return asc ? -1 : 1
    }
    if (propA > propB) {
      return asc ? 1 : -1
    }
    return 0
  })
}

import {User, Workout} from '@prisma/client'
import {SerialisedWorkout, serialiseWorkouts} from '@/lib/workouts'
import {formatDate} from '@/lib/calendar'

export type UserWithWorkouts = Omit<
  User,
  'password' | 'emailVerified' | 'image'
> & {
  workouts: Workout[]
}

export type SerialisedUser = {
  appointments: string
  appointmentsAttended: string
  createdAt: string
  email: string
  id: string
  name: string | null
  role: string | null
  updatedAt: string
  workouts: SerialisedWorkout[]
  workoutsAssigned: string
  workoutsCompleted: string
}

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

type WorkoutData = {
  appointments: number
  appointmentsAttended: number
  workoutsAssigned: number
  workoutsCompleted: number
}

function extractWorkoutData(workouts: Workout[]): WorkoutData {
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

export type SerialisedUserKey = keyof Omit<
  SerialisedUser,
  'role' | 'id' | 'workouts'
>

export function isValidKey(key: string): key is SerialisedUserKey {
  return validKeys.includes(key as SerialisedUserKey)
}

// Changing the order of validKeys will change the display order of the cols on /users
export const validKeys: SerialisedUserKey[] = [
  'name',
  'email',
  'workoutsAssigned',
  'workoutsCompleted',
  'appointments',
  'appointmentsAttended',
  'createdAt',
  'updatedAt',
]

export const keyMap = {
  appointments: 'Appointments',
  appointmentsAttended: 'Appointments attended',
  createdAt: 'Created',
  email: 'Email',
  name: 'Name',
  workoutsAssigned: 'Workouts assigned',
  workoutsCompleted: 'Workouts completed',
  updatedAt: 'Updated',
}

export function sortUsers(key: SerialisedUserKey, users: SerialisedUser[]) {
  return users.sort((a, b) => {
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

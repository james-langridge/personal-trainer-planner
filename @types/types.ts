import {User, Workout, WORKOUT_STATUS, WORKOUT_TYPE} from '@prisma/client'

export type CalendarFormState = {
  date: string
  description?: string
  name: string
  ownerId: string
  selectedDays: Set<number>
  type: WORKOUT_TYPE
  videoUrl?: string
  weeksToRepeat: number
  workoutId: string
}

export type ComputedWorkoutData = {
  appointments: number
  appointmentsAttended: number
  workoutsAssigned: number
  workoutsCompleted: number
}

export type CreateUserBody = {name: string; email: string}

export type CreateWorkoutBody = {
  date: string
  description?: string
  name: string
  ownerId: string
  selectedDays: number[]
  type: WORKOUT_TYPE
  videoUrl?: string
  weeksToRepeat: number
}

export type Day = {
  day: number
  month: number
  weekDay: number
  year: number
}

export type DeleteWorkoutBody = {
  deleted: boolean
  ownerId: string
  workoutId: string
}

export type SerialisedUser = {
  appointments: string
  appointmentsAttended: string
  email: string
  id: string
  name: string | null
  role: string | null
  workouts: SerialisedWorkout[]
  workoutsAssigned: string
  workoutsCompleted: string
}

export type SerialisedUserKey = keyof Omit<
  SerialisedUser,
  'id' | 'role' | 'workouts'
>

export type SerialisedWorkout = {
  date: string
  description: string | null
  id: string
  name: string
  ownerId: string
  status: WORKOUT_STATUS
  type: WORKOUT_TYPE
  videoUrl: string | null
}

export type SerialisedWorkoutKey = keyof Omit<
  SerialisedWorkout,
  'createdAt' | 'deleted' | 'id' | 'ownerId' | 'updatedAt'
>

export type UpdateWorkoutBody = {
  date?: string
  description?: string
  name?: string
  ownerId: string
  status?: WORKOUT_STATUS
  type?: WORKOUT_TYPE
  videoUrl?: string
  workoutId: string
}

export type UserWithWorkouts = Omit<
  User,
  'createdAt' | 'emailVerified' | 'image' | 'password' | 'updatedAt'
> & {
  workouts: Omit<Workout, 'createdAt' | 'deleted' | 'updatedAt'>[]
}

export type WorkoutData = {
  date: string
  description?: string
  name: string
  ownerId: string
  type: WORKOUT_TYPE
  workoutId: string
  videoUrl?: string
}

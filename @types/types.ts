import {User, Workout, WORKOUT_STATUS, WORKOUT_TYPE} from '@prisma/client'

export type createWorkoutBody = {
  date: string
  description?: string
  name: string
  ownerId: string
  type: WORKOUT_TYPE
  videoUrl?: string
  selectedDays: number[]
  weeksToRepeat: number
}
export type updateWorkoutBody = {
  date?: string
  description?: string
  name?: string
  ownerId: string
  status?: WORKOUT_STATUS
  type?: WORKOUT_TYPE
  videoUrl?: string
  workoutId: string
}
export type createUserBody = {name: string; email: string}
export type deleteWorkoutBody = {
  deleted: boolean
  ownerId: string
  workoutId: string
}
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
export type CalendarFormState = {
  date: string
  description?: string
  name: string
  ownerId: string
  workoutId: string
  videoUrl?: string
  type: WORKOUT_TYPE
  selectedDays: Set<number>
  weeksToRepeat: number
}
export type Day = {
  day: number
  weekDay: number
  month: number
  year: number
}
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
export type SerialisedUserKey = keyof Omit<
  SerialisedUser,
  'role' | 'id' | 'workouts'
>

export type WorkoutDataFoo = {
  appointments: number
  appointmentsAttended: number
  workoutsAssigned: number
  workoutsCompleted: number
}
export type WorkoutData = {
  date: string
  description?: string
  name: string
  ownerId: string
  workoutId: string
  videoUrl?: string
  type: WORKOUT_TYPE
}

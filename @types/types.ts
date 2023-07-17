import {WORKOUT_TYPE} from '@prisma/client'

import {UserWithWorkouts, Workout} from '@/@types/apiResponseTypes'

export type CalendarFormState = {
  date: string
  description: string | null
  name: string
  ownerId: string
  selectedDays: Set<number>
  type: WORKOUT_TYPE
  videoUrl: string | null
  weeksToRepeat: number
  id: string
}

export type ComputedWorkoutData = {
  appointments: number
  appointmentsAttended: number
  workoutsAssigned: number
  workoutsCompleted: number
}

export type Day = {
  day: number
  month: number
  weekDay: number
  year: number
}

export type UserWithWorkoutAndAttendance = UserWithWorkouts &
  ComputedWorkoutData

export type UserWithWorkoutAndAttendanceKey = keyof Omit<
  UserWithWorkoutAndAttendance,
  'id' | 'role' | 'type' | 'workouts'
>

export type UserWithWorkoutsKey = keyof Omit<
  UserWithWorkouts,
  'id' | 'role' | 'type' | 'workouts'
>

export type WorkoutKey = keyof Omit<
  Workout,
  'createdAt' | 'deleted' | 'id' | 'ownerId' | 'updatedAt'
>

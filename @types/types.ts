import {UserWithWorkouts, Workout} from '@/@types/apiResponseTypes'

export type EventType = 'APPOINTMENT' | 'BOOTCAMP' | 'WORKOUT'

export type CalendarFormState = {
  date: string
  description: string | null
  fee: string
  id: string
  name: string
  ownerId: string
  selectedDays: Set<number>
  type?: EventType
  videoUrl: string | null
  weeksToRepeat: number
}

export type ComputedWorkoutData = {
  appointmentsAssigned: number
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
  'appointments' | 'bootcamps' | 'id' | 'role' | 'type' | 'workouts'
>

export type UserWithWorkoutsKey = keyof Omit<
  UserWithWorkouts,
  'appointments' | 'bootcamps' | 'id' | 'role' | 'type' | 'workouts'
>

export type WorkoutKey = keyof Omit<
  Workout,
  'createdAt' | 'deleted' | 'id' | 'ownerId' | 'updatedAt'
>

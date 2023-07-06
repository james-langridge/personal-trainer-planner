import {UserWithWorkoutAndAttendanceKey, WorkoutKey} from '@/@types/types'

export const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export const userKeyMap = {
  appointments: 'Appointments',
  appointmentsAttended: 'Appointments attended',
  email: 'Email',
  name: 'Name',
  workoutsAssigned: 'Workouts assigned',
  workoutsCompleted: 'Workouts completed',
}

// Changing the order of userKeys will change the display order of the cols on /users
export const userKeys: UserWithWorkoutAndAttendanceKey[] = [
  'name',
  'email',
  'workoutsAssigned',
  'workoutsCompleted',
  'appointments',
  'appointmentsAttended',
]

export const workoutKeyMap = {
  date: 'Date',
  description: 'Description',
  name: 'Name',
  status: 'Status',
  type: 'Type',
  videoUrl: 'Video url',
}

// Changing the order of workoutKeys will change the display order of the cols on /users/${id}

export const workoutKeys: WorkoutKey[] = [
  'date',
  'name',
  'description',
  'type',
  'status',
  'videoUrl',
]

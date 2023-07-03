import {SerialisedUserKey, SerialisedWorkoutKey} from '@/@types/types'

// Changing the order of validKeys will change the display order of the cols on /users
export const validUserKeys: SerialisedUserKey[] = [
  'name',
  'email',
  'workoutsAssigned',
  'workoutsCompleted',
  'appointments',
  'appointmentsAttended',
  'createdAt',
  'updatedAt',
]
export const userKeyMap = {
  appointments: 'Appointments',
  appointmentsAttended: 'Appointments attended',
  createdAt: 'Created',
  email: 'Email',
  name: 'Name',
  workoutsAssigned: 'Workouts assigned',
  workoutsCompleted: 'Workouts completed',
  updatedAt: 'Updated',
}
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
export const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
export const validWorkoutKeys: SerialisedWorkoutKey[] = [
  'date',
  'name',
  'description',
  'type',
  'status',
  'videoUrl',
]
export const workoutKeyMap = {
  date: 'Date',
  name: 'Name',
  description: 'Description',
  type: 'Type',
  status: 'Status',
  videoUrl: 'Video url',
}

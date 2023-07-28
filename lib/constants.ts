import {WorkoutKey} from '@/@types/types'

export const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

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

export const workoutKeyMap = {
  date: 'Date',
  description: 'Description',
  name: 'Name',
  status: 'Status',
  videoUrl: 'Video url',
}

// Changing the order of workoutKeys will change the display order of the cols on /users/${id}

export const workoutKeys: WorkoutKey[] = [
  'date',
  'name',
  'description',
  'status',
  'videoUrl',
]

import {UserWithWorkoutAndAttendance} from '@/@types/types'
import {padZero} from '@/lib/calendar'

const now = new Date()
export const year = now.getFullYear()
export const month = now.getMonth()
const uiMonth = padZero(month + 1)

export const user: UserWithWorkoutAndAttendance = {
  id: '123',
  role: null,
  email: 'email',
  name: 'Name',
  appointments: 1,
  appointmentsAttended: 1,
  workouts: [
    {
      id: '1',
      ownerId: '123',
      status: 'NOT_STARTED',
      name: 'workout 1',
      description: 'do it!!!',
      videoUrl: 'https://player.vimeo.com/video/756493570?h=6189b49779',
      type: 'TRAINING',
      date: new Date(`${year}-${uiMonth}-1`),
    },
    {
      id: '2',
      ownerId: '123',
      status: 'COMPLETED',
      name: 'workout 2',
      description: 'do it!!!',
      videoUrl: 'https://player.vimeo.com/video/756493570?h=6189b49779',
      type: 'TRAINING',
      date: new Date(`${year}-${uiMonth}-1`),
    },
    {
      id: '3',
      ownerId: '123',
      status: 'NOT_STARTED',
      name: 'workout 3',
      description: 'do it!!!',
      videoUrl: 'https://player.vimeo.com/video/756493570?h=6189b49779',
      type: 'TRAINING',
      date: new Date(`${year}-${uiMonth}-1`),
    },
    {
      id: '4',
      ownerId: '123',
      status: 'COMPLETED',
      name: 'appointment 1',
      description: 'mooooove it',
      videoUrl: '',
      type: 'APPOINTMENT',
      date: new Date(`${year}-${uiMonth}-2`),
    },
  ],
  workoutsAssigned: 1,
  workoutsCompleted: 0,
}

export const session = {
  user: {
    name: user.name,
    email: user.email,
    image: null,
    role: undefined,
    id: user.id,
  },
  expires: '2023-07-15T14:46:39.270Z',
}

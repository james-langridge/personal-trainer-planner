import {
  Appointment as PrismaAppointment,
  Bootcamp as PrismaBootcamp,
  User,
  Workout as PrismaWorkout,
} from '@prisma/client'

export type UserWithWorkouts = Pick<
  User,
  'email' | 'id' | 'name' | 'role' | 'type'
> & {
  appointments: Pick<
    PrismaAppointment,
    'date' | 'description' | 'id' | 'name' | 'ownerId' | 'status' | 'videoUrl'
  >[]
  bootcamps: Pick<
    PrismaBootcamp,
    'date' | 'description' | 'id' | 'name' | 'videoUrl'
  >[]
  workouts: Pick<
    PrismaWorkout,
    'date' | 'description' | 'id' | 'name' | 'ownerId' | 'status' | 'videoUrl'
  >[]
}

export type Appointment = UserWithWorkouts['appointments'][number]
export type Bootcamp = UserWithWorkouts['bootcamps'][number]
export type Workout = UserWithWorkouts['workouts'][number]

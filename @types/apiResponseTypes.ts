import {
  Appointment as PrismaAppointment,
  Bootcamp as PrismaBootcamp,
  Invoice as PrismaInvoice,
  User,
  Workout as PrismaWorkout,
} from '@prisma/client'

// TODO: rename this to User
export type UserWithWorkouts = Pick<
  User,
  'credits' | 'email' | 'fee' | 'id' | 'name' | 'role' | 'type'
> & {
  appointments: Pick<
    PrismaAppointment,
    | 'date'
    | 'description'
    | 'fee'
    | 'id'
    | 'name'
    | 'ownerId'
    | 'status'
    | 'videoUrl'
  >[]
  bootcamps: Pick<
    PrismaBootcamp,
    'date' | 'description' | 'id' | 'name' | 'videoUrl'
  >[]
  invoices: Pick<PrismaInvoice, 'date'>[]
  workouts: Pick<
    PrismaWorkout,
    'date' | 'description' | 'id' | 'name' | 'ownerId' | 'status' | 'videoUrl'
  >[]
}

export type Appointment = UserWithWorkouts['appointments'][number]
export type Bootcamp = UserWithWorkouts['bootcamps'][number] & {
  _count?: {attendees: number}
  attendees?: Pick<User, 'email' | 'id' | 'name' | 'role' | 'type'>[]
}
export type Workout = UserWithWorkouts['workouts'][number]

export type Event = Appointment | Bootcamp | Workout

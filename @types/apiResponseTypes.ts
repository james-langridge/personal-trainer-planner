import {
  Appointment as PrismaAppointment,
  Bootcamp as PrismaBootcamp,
  Invoice as PrismaInvoice,
  User,
  Workout as PrismaWorkout,
} from '@prisma/client'

type SerializedDate<T> = {
  [K in keyof T]: T[K] extends Date ? string : T[K]
}

// TODO: rename this to User
export type UserWithWorkouts = Pick<
  User,
  'billingEmail' | 'credits' | 'email' | 'fee' | 'id' | 'name' | 'role' | 'type'
> & {
  appointments: Array<
    SerializedDate<
      Pick<
        PrismaAppointment,
        | 'date'
        | 'description'
        | 'fee'
        | 'id'
        | 'name'
        | 'ownerId'
        | 'status'
        | 'videoUrl'
      >
    >
  >
  bootcamps: Array<
    SerializedDate<
      Pick<PrismaBootcamp, 'date' | 'description' | 'id' | 'name' | 'videoUrl'>
    >
  >
  invoices: Array<SerializedDate<Pick<PrismaInvoice, 'date'>>>
  workouts: Array<
    SerializedDate<
      Pick<
        PrismaWorkout,
        | 'date'
        | 'description'
        | 'id'
        | 'name'
        | 'ownerId'
        | 'status'
        | 'videoUrl'
      >
    >
  >
}

export type Appointment = UserWithWorkouts['appointments'][number]
export type Bootcamp = UserWithWorkouts['bootcamps'][number] & {
  _count?: {attendees: number}
  attendees?: Pick<User, 'email' | 'id' | 'name' | 'role' | 'type'>[]
}
export type Workout = UserWithWorkouts['workouts'][number]

export type Event = Appointment | Bootcamp | Workout

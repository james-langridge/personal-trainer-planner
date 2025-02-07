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

export type SerialisedUser = Pick<
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

export type PrimsaUser = Pick<
  User,
  'billingEmail' | 'credits' | 'email' | 'fee' | 'id' | 'name' | 'role' | 'type'
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

export type Appointment = SerialisedUser['appointments'][number]
export type Bootcamp = SerialisedUser['bootcamps'][number] & {
  _count?: {attendees: number}
  attendees?: Pick<User, 'email' | 'id' | 'name' | 'role' | 'type'>[]
}
export type Workout = SerialisedUser['workouts'][number]

export type Event = Appointment | Bootcamp | Workout

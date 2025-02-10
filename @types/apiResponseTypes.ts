import {
  Appointment as PrismaAppointment,
  Bootcamp as PrismaBootcamp,
  Invoice as PrismaInvoice,
  User as PrismaUser,
  Workout as PrismaWorkout,
} from '@prisma/client'

export type User = Pick<
  PrismaUser,
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

export type Appointment = User['appointments'][number]
export type Bootcamp = User['bootcamps'][number] & {
  _count?: {attendees: number}
  attendees?: Pick<PrismaUser, 'email' | 'id' | 'name' | 'role' | 'type'>[]
}
export type Workout = User['workouts'][number]

export type Event = Appointment | Bootcamp | Workout

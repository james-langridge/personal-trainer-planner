import {Workout, Bootcamp, User, Appointment} from '@prisma/client'

export type CreateAppointmentBody = Pick<
  Appointment,
  'description' | 'name' | 'ownerId' | 'videoUrl'
> & {
  date: string
  selectedDays: number[]
  weeksToRepeat: number
}

export type CreateBootcampBody = Pick<
  Bootcamp,
  'description' | 'name' | 'videoUrl'
> & {
  date: string
  selectedDays: number[]
  weeksToRepeat: number
}

export type CreateUserBody = Pick<User, 'name' | 'email' | 'type'>

export type CreateWorkoutBody = Pick<
  Workout,
  'description' | 'name' | 'ownerId' | 'videoUrl'
> & {
  date: string
  selectedDays: number[]
  weeksToRepeat: number
}

export type DeleteAppointmentBody = Pick<
  Appointment,
  'deleted' | 'id' | 'ownerId'
>

export type DeleteBootcampBody = Pick<Bootcamp, 'deleted' | 'id'>

export type DeleteWorkoutBody = Pick<Workout, 'deleted' | 'id' | 'ownerId'>

export type UpdateAppointmentBody = Partial<
  Pick<
    Appointment,
    | 'deleted'
    | 'description'
    | 'id'
    | 'name'
    | 'ownerId'
    | 'status'
    | 'videoUrl'
  >
> & {date?: string}

export type UpdateBootcampBody = Partial<
  Pick<Bootcamp, 'deleted' | 'description' | 'id' | 'name' | 'videoUrl'>
> & {date?: string; userId?: string; query?: 'connect' | 'disconnect'}

export type UpdateUserBody = Partial<
  Pick<User, 'id' | 'name' | 'email' | 'type'>
>

export type UpdateWorkoutBody = Partial<
  Pick<
    Workout,
    | 'deleted'
    | 'description'
    | 'id'
    | 'name'
    | 'ownerId'
    | 'status'
    | 'videoUrl'
  >
> & {date?: string}

import {Workout, Bootcamp, User} from '@prisma/client'

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
  'description' | 'name' | 'ownerId' | 'type' | 'videoUrl'
> & {
  date: string
  selectedDays: number[]
  weeksToRepeat: number
}

export type DeleteBootcampBody = Pick<Bootcamp, 'deleted' | 'id'>

export type DeleteWorkoutBody = Pick<Workout, 'deleted' | 'id' | 'ownerId'>

export type UpdateBootcampBody = Partial<
  Pick<Bootcamp, 'deleted' | 'description' | 'id' | 'name' | 'videoUrl'>
> & {date?: string}

export type UpdateWorkoutBody = Partial<
  Pick<
    Workout,
    | 'deleted'
    | 'description'
    | 'id'
    | 'name'
    | 'ownerId'
    | 'status'
    | 'type'
    | 'videoUrl'
  >
> & {date?: string}

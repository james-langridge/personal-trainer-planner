import {USER_TYPE, Workout} from '@prisma/client'

export type CreateUserBody = {name: string; email: string; type: USER_TYPE}

export type CreateWorkoutBody = Pick<
  Workout,
  'description' | 'name' | 'ownerId' | 'type' | 'videoUrl'
> & {
  date: string
  selectedDays: number[]
  weeksToRepeat: number
}

export type DeleteWorkoutBody = Pick<Workout, 'deleted' | 'id' | 'ownerId'>

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

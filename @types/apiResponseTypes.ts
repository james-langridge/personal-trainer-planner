import {
  Bootcamp as PrismaBootcamp,
  User,
  Workout as PrismaWorkout,
} from '@prisma/client'

export type UserWithWorkouts = Pick<
  User,
  'email' | 'id' | 'name' | 'role' | 'type'
> & {
  workouts: Pick<
    PrismaWorkout,
    | 'date'
    | 'description'
    | 'id'
    | 'name'
    | 'ownerId'
    | 'status'
    | 'type'
    | 'videoUrl'
  >[]
  bootcamps: Pick<
    PrismaBootcamp,
    'date' | 'description' | 'id' | 'name' | 'videoUrl'
  >[]
}

export type Workout = UserWithWorkouts['workouts'][number]

export type Bootcamp = UserWithWorkouts['bootcamps'][number]

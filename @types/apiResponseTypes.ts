import {User, Workout as PrismaWorkout} from '@prisma/client'

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
}

export type Workout = UserWithWorkouts['workouts'][number]

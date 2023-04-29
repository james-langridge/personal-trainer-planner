import {Workout, WORKOUT_STATUS, WORKOUT_TYPE} from '@prisma/client'
import {SerialisedUser} from '@/lib/users'

const fetcher = async ({
  url,
  method,
  body,
  json = true,
  cache,
}: {
  url: string
  method: string
  body?: {[key: string]: string}
  json?: boolean
  cache?: 'force-cache' | 'no-store'
}) => {
  const res = await fetch(url, {
    method,
    body: body && JSON.stringify(body),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    cache: cache && cache,
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error)
  }

  if (json) {
    return data.data
  }
}

export const submitForm = (body: Record<string, string>) => {
  return fetcher({
    url: '/api/form',
    method: 'post',
    body,
  })
}

export const getUsersWithWorkouts = async (): Promise<SerialisedUser[]> => {
  return fetcher({
    url: '/api/users',
    method: 'get',
  })
}

export const getUserWithWorkouts = async (
  id: string,
): Promise<SerialisedUser> => {
  return fetcher({
    url: `/api/user/${id}`,
    method: 'get',
  })
}

export const fetchWorkout = async (id: string): Promise<Workout> => {
  return fetcher({
    url: `/api/workout/${id}`,
    method: 'get',
  })
}

export const createWorkout = async (body: {
  ownerId: string
  date: string
  name: string
  description?: string
  type: WORKOUT_TYPE
  videoUrl?: string
}) => {
  return fetcher({
    url: '/api/workout',
    method: 'post',
    body,
    json: false,
  })
}

export const updateWorkout = async (body: {
  workoutId: string
  type?: WORKOUT_TYPE
  date?: string
  deleted?: string
  description?: string
  name?: string
  status?: WORKOUT_STATUS
  videoUrl?: string
}) => {
  return fetcher({
    url: '/api/workout',
    method: 'put',
    body,
    json: false,
  })
}

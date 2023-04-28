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

export const submitContactForm = (body: {
  name: string
  email: string
  message: string
}) => {
  return fetcher({
    url: '/api/contact',
    method: 'post',
    body,
  })
}

export const submitForm = (body: Record<string, string>) => {
  return fetcher({
    url: '/api/form',
    method: 'post',
    body,
  })
}

export const login = async (body: {email: string; password: string}) => {
  return fetcher({
    url: '/api/login',
    method: 'post',
    body,
    json: false,
  })
}

export const logout = async (body: {key: string}) => {
  return fetcher({
    url: '/api/logout',
    method: 'post',
    body,
    json: false,
  })
}

export const register = async (body: {
  firstName: string
  lastName: string
  email: string
  password: string
}) => {
  return fetcher({
    url: '/api/register',
    method: 'post',
    body,
    json: false,
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

export const updatePassword = async (body: {
  id: string
  oldPassword: string
  newPassword: string
  confirmNewPassword: string
}) => {
  return fetcher({
    url: '/api/password',
    method: 'put',
    body,
    json: false,
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

// https://github.com/james-langridge/personal-trainer-planner/blob/aeb892a98028f619e38b710bbc819a227ac1eeee/lib/api.ts

import {
  CreateWorkoutBody,
  DeleteWorkoutBody,
  UpdateWorkoutBody,
} from '@/@types/apiRequestTypes'
import {Workout} from '@/@types/apiResponseTypes'
import {getErrorMessage} from '@/lib/errors'

const baseApi = '/api'
const workoutsApi = `${baseApi}/workouts`

export const createWorkout = async (body: CreateWorkoutBody) => {
  return fetcher({
    url: workoutsApi,
    method: 'POST',
    body,
  })
}

export const deleteWorkout = async (body: DeleteWorkoutBody) => {
  return fetcher({
    url: workoutsApi,
    method: 'PUT',
    body,
  })
}

export const getWorkout = async (id: string): Promise<Workout> => {
  return fetcher({
    url: `${workoutsApi}/${id}`,
    method: 'GET',
  })
}

export const updateWorkout = async (body: UpdateWorkoutBody) => {
  return fetcher({
    url: workoutsApi,
    method: 'PUT',
    body,
  })
}

const fetcher = async ({
  url,
  method,
  body,
  json = true,
  cache,
}: {
  url: string
  method: string
  body?: CreateWorkoutBody | UpdateWorkoutBody | DeleteWorkoutBody
  json?: boolean
  cache?: 'force-cache' | 'no-store'
}) => {
  console.log('***************', url)
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
    console.log('Error!!!!:', getErrorMessage(data))
    throw new Error(data)
  }

  if (json) {
    return data.data
  }
}

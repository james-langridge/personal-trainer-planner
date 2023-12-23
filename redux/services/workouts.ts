import {DeleteWorkoutBody, UpdateWorkoutBody} from '@/@types/apiRequestTypes'
import {Workout} from '@/@types/apiResponseTypes'

import {api} from './api'

export const workoutsApi = api.injectEndpoints({
  endpoints: build => ({
    getWorkout: build.query<Workout, string>({
      query: id => `/workouts/${id}`,
      providesTags: (result, error, id) => [{type: 'Workouts', id}],
    }),
  }),
})

export const {useGetWorkoutQuery} = workoutsApi

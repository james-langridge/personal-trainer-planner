import {
  CreateWorkoutBody,
  DeleteWorkoutBody,
  UpdateWorkoutBody,
} from '@/@types/apiRequestTypes'
import {Workout} from '@/@types/apiResponseTypes'

import {api} from './api'

export const workoutsApi = api.injectEndpoints({
  endpoints: build => ({
    createWorkout: build.mutation({
      query: (body: CreateWorkoutBody) => ({
        url: '/workouts',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: (result, error, {ownerId}) => [
        {type: 'Users', id: ownerId},
      ],
    }),
    deleteWorkout: build.mutation({
      query: (body: DeleteWorkoutBody) => ({
        url: '/workouts',
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: (result, error, {ownerId, id}) => [
        {type: 'Users', id: ownerId},
        {type: 'Workouts', id: id},
      ],
    }),
    getWorkout: build.query<Workout, string>({
      query: id => `/workouts/${id}`,
      providesTags: (result, error, id) => [{type: 'Workouts', id}],
    }),
    updateWorkout: build.mutation({
      query: (body: UpdateWorkoutBody) => ({
        url: '/workouts',
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: (result, error, {ownerId, id}) => [
        {type: 'Users', id: ownerId},
        {type: 'Workouts', id: id},
      ],
    }),
  }),
})

export const {
  useCreateWorkoutMutation,
  useDeleteWorkoutMutation,
  useGetWorkoutQuery,
  useUpdateWorkoutMutation,
} = workoutsApi

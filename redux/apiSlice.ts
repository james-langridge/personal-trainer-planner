import {Workout} from '@prisma/client'
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

import {
  createUserBody,
  createWorkoutBody,
  deleteWorkoutBody,
  SerialisedUser,
  updateWorkoutBody,
} from '@/@types/types'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({baseUrl: '/api'}),
  tagTypes: ['User', 'Workout'],
  endpoints: builder => ({
    createUser: builder.mutation({
      query: (body: createUserBody) => ({
        url: '/user',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['User'],
    }),
    createWorkout: builder.mutation({
      query: (body: createWorkoutBody) => ({
        url: '/workout',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: (result, error, {ownerId}) => [
        {type: 'User', id: ownerId},
      ],
    }),
    deleteWorkout: builder.mutation({
      query: (body: deleteWorkoutBody) => ({
        url: '/workout',
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: (result, error, {ownerId, workoutId}) => [
        {type: 'User', id: ownerId},
        {type: 'Workout', id: workoutId},
      ],
    }),
    getUser: builder.query<SerialisedUser, string>({
      query: id => `/user/${id}`,
      providesTags: (result, error, id) => [{type: 'User', id}],
    }),
    getUsers: builder.query<SerialisedUser[], void>({
      query: () => '/users',
      providesTags: result =>
        result ? result.map(({id}) => ({type: 'User', id})) : [],
    }),
    getWorkout: builder.query<Workout, string>({
      query: id => `/workout/${id}`,
      providesTags: (result, error, id) => [{type: 'Workout', id}],
    }),
    submitForm: builder.mutation({
      query: (body: Record<string, string>) => ({
        url: '/form',
        method: 'POST',
        body: body,
      }),
    }),
    updateWorkout: builder.mutation({
      query: (body: updateWorkoutBody) => ({
        url: '/workout',
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: (result, error, {ownerId, workoutId}) => [
        {type: 'User', id: ownerId},
        {type: 'Workout', id: workoutId},
      ],
    }),
  }),
})

export const {
  useGetUserQuery,
  useGetUsersQuery,
  useDeleteWorkoutMutation,
  useUpdateWorkoutMutation,
  useCreateWorkoutMutation,
  useGetWorkoutQuery,
  useCreateUserMutation,
  useSubmitFormMutation,
} = apiSlice

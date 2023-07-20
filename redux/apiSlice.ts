import {Workout} from '@prisma/client'
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

import {
  CreateBootcampBody,
  CreateUserBody,
  CreateWorkoutBody,
  DeleteBootcampBody,
  DeleteWorkoutBody,
  UpdateBootcampBody,
  UpdateWorkoutBody,
} from '@/@types/apiRequestTypes'
import {Bootcamp, UserWithWorkouts} from '@/@types/apiResponseTypes'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({baseUrl: '/api'}),
  tagTypes: ['Bootcamp', 'User', 'Workout'],
  endpoints: builder => ({
    createBootcamp: builder.mutation({
      query: (body: CreateBootcampBody) => ({
        url: '/bootcamp',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['Bootcamp'],
    }),
    createUser: builder.mutation({
      query: (body: CreateUserBody) => ({
        url: '/user',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['User'],
    }),
    createWorkout: builder.mutation({
      query: (body: CreateWorkoutBody) => ({
        url: '/workout',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: (result, error, {ownerId}) => [
        {type: 'User', id: ownerId},
      ],
    }),
    deleteBootcamp: builder.mutation({
      query: (body: DeleteBootcampBody) => ({
        url: '/bootcamp',
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: (result, error, {id}) => [{type: 'Bootcamp', id: id}],
    }),
    deleteWorkout: builder.mutation({
      query: (body: DeleteWorkoutBody) => ({
        url: '/workout',
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: (result, error, {ownerId, id}) => [
        {type: 'User', id: ownerId},
        {type: 'Workout', id: id},
      ],
    }),
    getBootcamp: builder.query<Bootcamp, string>({
      query: id => `/bootcamp/${id}`,
      providesTags: (result, error, id) => [{type: 'Bootcamp', id}],
    }),
    getBootcamps: builder.query<Bootcamp[], void>({
      query: () => '/bootcamp',
      providesTags: result =>
        result ? result.map(({id}) => ({type: 'Bootcamp', id})) : [],
    }),
    getUser: builder.query<UserWithWorkouts, string>({
      query: id => `/user/${id}`,
      providesTags: (result, error, id) => [{type: 'User', id}],
    }),
    getUsers: builder.query<UserWithWorkouts[], void>({
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
    updateBootcamp: builder.mutation({
      query: (body: UpdateBootcampBody) => ({
        url: '/bootcamp',
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: (result, error, {id}) => [{type: 'Bootcamp', id: id}],
    }),
    updateWorkout: builder.mutation({
      query: (body: UpdateWorkoutBody) => ({
        url: '/workout',
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: (result, error, {ownerId, id}) => [
        {type: 'User', id: ownerId},
        {type: 'Workout', id: id},
      ],
    }),
  }),
})

export const {
  useCreateBootcampMutation,
  useCreateUserMutation,
  useCreateWorkoutMutation,
  useDeleteBootcampMutation,
  useDeleteWorkoutMutation,
  useGetBootcampQuery,
  useGetBootcampsQuery,
  useGetUserQuery,
  useGetUsersQuery,
  useGetWorkoutQuery,
  useSubmitFormMutation,
  useUpdateBootcampMutation,
  useUpdateWorkoutMutation,
} = apiSlice

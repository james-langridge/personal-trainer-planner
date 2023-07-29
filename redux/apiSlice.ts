import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

import {
  CreateAppointmentBody,
  CreateBootcampBody,
  CreateUserBody,
  CreateWorkoutBody,
  DeleteAppointmentBody,
  DeleteBootcampBody,
  DeleteWorkoutBody,
  UpdateAppointmentBody,
  UpdateBootcampBody,
  UpdateWorkoutBody,
} from '@/@types/apiRequestTypes'
import {
  Appointment,
  Bootcamp,
  UserWithWorkouts,
  Workout,
} from '@/@types/apiResponseTypes'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({baseUrl: '/api'}),
  tagTypes: ['Appointment', 'Bootcamp', 'User', 'Workout'],
  endpoints: builder => ({
    createAppointment: builder.mutation({
      query: (body: CreateAppointmentBody) => ({
        url: '/appointments',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: (result, error, {ownerId}) => [
        {type: 'User', id: ownerId},
      ],
    }),
    createBootcamp: builder.mutation({
      query: (body: CreateBootcampBody) => ({
        url: '/bootcamps',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['Bootcamp'],
    }),
    createUser: builder.mutation({
      query: (body: CreateUserBody) => ({
        url: '/users',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['User'],
    }),
    createWorkout: builder.mutation({
      query: (body: CreateWorkoutBody) => ({
        url: '/workouts',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: (result, error, {ownerId}) => [
        {type: 'User', id: ownerId},
      ],
    }),
    deleteAppointment: builder.mutation({
      query: (body: DeleteAppointmentBody) => ({
        url: '/appointments',
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: (result, error, {ownerId, id}) => [
        {type: 'User', id: ownerId},
        {type: 'Appointment', id: id},
      ],
    }),
    deleteBootcamp: builder.mutation({
      query: (body: DeleteBootcampBody) => ({
        url: '/bootcamps',
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: (result, error, {id}) => [{type: 'Bootcamp', id: id}],
    }),
    deleteWorkout: builder.mutation({
      query: (body: DeleteWorkoutBody) => ({
        url: '/workouts',
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: (result, error, {ownerId, id}) => [
        {type: 'User', id: ownerId},
        {type: 'Workout', id: id},
      ],
    }),
    getAppointment: builder.query<Appointment, string>({
      query: id => `/appointments/${id}`,
      providesTags: (result, error, id) => [{type: 'Appointment', id}],
    }),
    getBootcamp: builder.query<Bootcamp, string>({
      query: id => `/bootcamps/${id}`,
      providesTags: (result, error, id) => [{type: 'Bootcamp', id}],
    }),
    getBootcamps: builder.query<Bootcamp[], string>({
      query: () => '/bootcamps',
      providesTags: result =>
        result ? result.map(({id}) => ({type: 'Bootcamp', id})) : [],
    }),
    getUser: builder.query<UserWithWorkouts, string>({
      query: id => `/users/${id}`,
      providesTags: (result, error, id) => [{type: 'User', id}],
    }),
    getUsers: builder.query<UserWithWorkouts[], void>({
      query: () => '/users',
      providesTags: result =>
        result ? result.map(({id}) => ({type: 'User', id})) : [],
    }),
    getWorkout: builder.query<Workout, string>({
      query: id => `/workouts/${id}`,
      providesTags: (result, error, id) => [{type: 'Workout', id}],
    }),
    submitForm: builder.mutation({
      query: (body: Record<string, string>) => ({
        url: '/forms',
        method: 'POST',
        body: body,
      }),
    }),
    updateAppointment: builder.mutation({
      query: (body: UpdateAppointmentBody) => ({
        url: '/appointments',
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: (result, error, {ownerId, id}) => [
        {type: 'User', id: ownerId},
        {type: 'Appointment', id: id},
      ],
    }),
    updateBootcamp: builder.mutation({
      query: (body: UpdateBootcampBody) => ({
        url: '/bootcamps',
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: (result, error, {id, userId}) => [
        {type: 'Bootcamp', id: id},
        {type: 'User', id: userId},
      ],
    }),
    updateWorkout: builder.mutation({
      query: (body: UpdateWorkoutBody) => ({
        url: '/workouts',
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
  useCreateAppointmentMutation,
  useCreateBootcampMutation,
  useCreateUserMutation,
  useCreateWorkoutMutation,
  useDeleteAppointmentMutation,
  useDeleteBootcampMutation,
  useDeleteWorkoutMutation,
  useGetAppointmentQuery,
  useGetBootcampQuery,
  useGetBootcampsQuery,
  useGetUserQuery,
  useGetUsersQuery,
  useGetWorkoutQuery,
  useSubmitFormMutation,
  useUpdateAppointmentMutation,
  useUpdateBootcampMutation,
  useUpdateWorkoutMutation,
} = apiSlice

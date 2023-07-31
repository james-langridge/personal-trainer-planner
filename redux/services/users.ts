import {CreateUserBody} from '@/@types/apiRequestTypes'
import {UserWithWorkouts} from '@/@types/apiResponseTypes'

import {api} from './api'

export const usersApi = api.injectEndpoints({
  endpoints: build => ({
    createUser: build.mutation({
      query: (body: CreateUserBody) => ({
        url: '/users',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['Users'],
    }),
    getUser: build.query<UserWithWorkouts, string>({
      query: id => `/users/${id}`,
      providesTags: (result, error, id) => [{type: 'Users', id}],
    }),
    getUsers: build.query<UserWithWorkouts[], void>({
      query: () => '/users',
      providesTags: result =>
        result ? result.map(({id}) => ({type: 'Users', id})) : [],
    }),
  }),
})

export const {useCreateUserMutation, useGetUserQuery, useGetUsersQuery} =
  usersApi

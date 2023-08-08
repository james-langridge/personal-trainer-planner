import {CreateUserBody, UpdateUserBody} from '@/@types/apiRequestTypes'
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
    getUsers: build.query<UserWithWorkouts[], void | string>({
      query: (arg?: string) => {
        return arg ? `/users/?month=${arg}` : '/users/'
      },
      providesTags: (result = [], error, arg) => {
        return arg
          ? [{type: 'Users', month: arg}]
          : [...result.map(({id}) => ({type: 'Users', id} as const))]
      },
    }),
    updateUser: build.mutation({
      query: (body: UpdateUserBody) => ({
        url: '/users',
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: ['Users'],
    }),
  }),
})

export const {
  useCreateUserMutation,
  useGetUserQuery,
  useGetUsersQuery,
  useUpdateUserMutation,
} = usersApi

import {
  CreateUserBody,
  UpdateBootcampAttendanceBody,
  UpdateUserBody,
} from '@/@types/apiRequestTypes'
import {SerialisedUser} from '@/@types/apiResponseTypes'

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
    getUser: build.query<SerialisedUser, string>({
      query: id => `/users/${id}`,
      providesTags: (result, error, id) => [{type: 'Users', id}],
    }),
    getUsers: build.query<SerialisedUser[], void | string>({
      // date must be in the format `${year}-${month + 1}` (not zero-based).
      query: (date?: string) => {
        return date ? `/users/?date=${date}` : '/users/'
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
      invalidatesTags: (result, error, {id}) => [
        {type: 'Users', id},
        {type: 'Users'},
      ],
    }),
    updateBootcampAttendance: build.mutation({
      query: (body: UpdateBootcampAttendanceBody) => ({
        url: '/users/bootcamps',
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: (result, error, {bootcampId, userId}) => [
        {type: 'Bootcamps', id: bootcampId},
        {type: 'Users', id: userId},
      ],
    }),
  }),
})

export const {
  useCreateUserMutation,
  useGetUserQuery,
  useGetUsersQuery,
  useUpdateBootcampAttendanceMutation,
  useUpdateUserMutation,
} = usersApi

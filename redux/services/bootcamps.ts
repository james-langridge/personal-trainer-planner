import {
  CreateBootcampBody,
  DeleteBootcampBody,
  UpdateBootcampBody,
} from '@/@types/apiRequestTypes'
import {Bootcamp} from '@/@types/apiResponseTypes'

import {api} from './api'

export const bootcampsApi = api.injectEndpoints({
  endpoints: build => ({
    createBootcamp: build.mutation({
      query: (body: CreateBootcampBody) => ({
        url: '/bootcamps',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['Bootcamps'],
    }),
    deleteBootcamp: build.mutation({
      query: (body: DeleteBootcampBody) => ({
        url: '/bootcamps',
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: (result, error, {id}) => [{type: 'Bootcamps', id: id}],
    }),
    getBootcamp: build.query<Bootcamp, string>({
      query: id => `/bootcamps/${id}`,
      providesTags: (result, error, id) => [{type: 'Bootcamps', id}],
    }),
    getBootcamps: build.query<Bootcamp[], void | string>({
      query: () => '/bootcamps',
      providesTags: (result = []) => [
        ...result.map(({id}) => ({type: 'Bootcamps', id} as const)),
      ],
    }),
    updateBootcamp: build.mutation({
      query: (body: UpdateBootcampBody) => ({
        url: '/bootcamps',
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: (result, error, {id, userId}) => [
        {type: 'Bootcamps', id: id},
        {type: 'Users', id: userId},
      ],
    }),
  }),
})

export const {
  useCreateBootcampMutation,
  useDeleteBootcampMutation,
  useGetBootcampQuery,
  useGetBootcampsQuery,
  useUpdateBootcampMutation,
} = bootcampsApi

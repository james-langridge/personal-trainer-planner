import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({baseUrl: '/api'}),
  tagTypes: ['Appointments', 'Bootcamps', 'Users', 'Workouts'],
  endpoints: builder => ({
    submitForm: builder.mutation({
      query: (body: Record<string, string>) => ({
        url: '/forms',
        method: 'POST',
        body: body,
      }),
    }),
  }),
})

export const {useSubmitFormMutation} = api

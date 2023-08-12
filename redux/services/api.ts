import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

import {InvoiceData} from '@/@types/apiRequestTypes'

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
    sendInvoice: builder.mutation({
      query: (body: InvoiceData) => ({
        url: '/invoices',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['Users'],
    }),
  }),
})

export const {useSendInvoiceMutation, useSubmitFormMutation} = api

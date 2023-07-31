import {
  CreateAppointmentBody,
  DeleteAppointmentBody,
  UpdateAppointmentBody,
} from '@/@types/apiRequestTypes'
import {Appointment} from '@/@types/apiResponseTypes'

import {api} from './api'

export const appointmentsApi = api.injectEndpoints({
  endpoints: build => ({
    createAppointment: build.mutation({
      query: (body: CreateAppointmentBody) => ({
        url: '/appointments',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: (result, error, {ownerId}) => [
        {type: 'Users', id: ownerId},
      ],
    }),
    deleteAppointment: build.mutation({
      query: (body: DeleteAppointmentBody) => ({
        url: '/appointments',
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: (result, error, {ownerId, id}) => [
        {type: 'Users', id: ownerId},
        {type: 'Appointments', id: id},
      ],
    }),
    getAppointment: build.query<Appointment, string>({
      query: id => `/appointments/${id}`,
      providesTags: (result, error, id) => [{type: 'Appointments', id}],
    }),
    updateAppointment: build.mutation({
      query: (body: UpdateAppointmentBody) => ({
        url: '/appointments',
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: (result, error, {ownerId, id}) => [
        {type: 'Users', id: ownerId},
        {type: 'Appointments', id: id},
      ],
    }),
  }),
})

export const {
  useCreateAppointmentMutation,
  useDeleteAppointmentMutation,
  useGetAppointmentQuery,
  useUpdateAppointmentMutation,
} = appointmentsApi

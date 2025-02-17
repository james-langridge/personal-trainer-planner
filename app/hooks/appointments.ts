import {
  skipToken,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  createAppointment,
  deleteAppointment,
  getAppointment,
  updateAppointment,
} from '@/app/actions/appointments'
import {EVENT_TYPE} from '@prisma/client'

export function useGetAppointment(eventType?: EVENT_TYPE, id?: string) {
  return useQuery({
    queryKey: ['appointment', id],
    queryFn:
      id && eventType === EVENT_TYPE.APPOINTMENT
        ? () => getAppointment(id)
        : skipToken,
  })
}

export function useCreateAppointment(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['user-events', userId]})
    },
  })
}

export function useUpdateAppointment(userId: string, eventId?: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['user-events', userId]})
      queryClient.invalidateQueries({queryKey: ['appointment', eventId]})
    },
  })
}

export function useDeleteAppointment(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['user-events', userId]})
    },
  })
}

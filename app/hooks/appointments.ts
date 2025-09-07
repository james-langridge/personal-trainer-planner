'use client'

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
  syncAppointmentToGoogleCalendar,
  updateAppointment,
} from '@/app/actions/appointments'
import {EVENT_TYPE} from '@prisma/client'
import {useToast} from '@/components/use-toast'

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
  const {toast} = useToast()

  return useMutation({
    mutationFn: createAppointment,
    onSuccess: result => {
      queryClient.invalidateQueries({queryKey: ['user-events', userId]})

      // Handle sync status
      if (!result.syncStatus.success) {
        toast({
          variant: 'destructive',
          title: 'Partial sync failure',
          description:
            result.syncStatus.message ||
            'Appointments saved but failed to sync with Google Calendar',
        })
      } else {
        toast({
          description: 'Appointments created and synced to Google Calendar',
        })
      }
    },
    onError: error => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to create appointments',
      })
    },
  })
}

export function useUpdateAppointment(userId: string, eventId?: string) {
  const queryClient = useQueryClient()
  const {toast} = useToast()

  return useMutation({
    mutationFn: updateAppointment,
    onSuccess: result => {
      queryClient.invalidateQueries({queryKey: ['user-events', userId]})
      queryClient.invalidateQueries({queryKey: ['appointment', eventId]})

      // Handle sync status
      if (!result.syncStatus.success) {
        toast({
          variant: 'destructive',
          title: 'Partial sync failure',
          description:
            result.syncStatus.message ||
            'Appointment updated but failed to sync with Google Calendar',
        })
      } else {
        toast({
          description: 'Appointment updated and synced to Google Calendar',
        })
      }
    },
    onError: error => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to update appointment',
      })
    },
  })
}

export function useDeleteAppointment(userId: string) {
  const queryClient = useQueryClient()
  const {toast} = useToast()

  return useMutation({
    mutationFn: deleteAppointment,
    onSuccess: result => {
      queryClient.invalidateQueries({queryKey: ['user-events', userId]})

      // Handle sync status
      if (!result.syncStatus.success) {
        toast({
          variant: 'destructive',
          title: 'Partial sync failure',
          description:
            result.syncStatus.message ||
            'Appointment deleted but failed to remove from Google Calendar',
        })
      } else {
        toast({
          description: 'Appointment deleted and removed from Google Calendar',
        })
      }
    },
    onError: error => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to delete appointment',
      })
    },
  })
}

export function useSyncAppointmentToGoogleCalendar() {
  const queryClient = useQueryClient()
  const {toast} = useToast()

  return useMutation({
    mutationFn: syncAppointmentToGoogleCalendar,
    onSuccess: (result, appointmentId) => {
      if (result.success) {
        toast({
          description: result.message || 'Synced to Google Calendar',
        })
        queryClient.invalidateQueries({
          queryKey: ['appointment', appointmentId],
        })
      } else {
        toast({
          variant: 'destructive',
          title: 'Sync failed',
          description: result.message || 'Failed to sync with Google Calendar',
        })
      }
    },
    onError: error => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to sync',
      })
    },
  })
}

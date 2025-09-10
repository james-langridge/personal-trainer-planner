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
    // Optimistic update
    onMutate: async newAppointmentData => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({queryKey: ['user-events', userId]})

      // Snapshot the previous value
      const previousEvents = queryClient.getQueryData(['user-events', userId])

      // Optimistically update with temporary appointments
      const tempAppointments = Array.from(
        {length: newAppointmentData.selectedDays.length},
        (_, i) => ({
          id: `temp-${Date.now()}-${i}`,
          name: newAppointmentData.name,
          date: new Date(newAppointmentData.date),
          fee: newAppointmentData.fee,
          ownerId: newAppointmentData.ownerId,
          type: EVENT_TYPE.APPOINTMENT,
          status: 'NOT_ATTENDED',
          deleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          description: newAppointmentData.description,
          videoUrl: newAppointmentData.videoUrl,
          googleCalendarEventId: null,
        }),
      )

      queryClient.setQueryData(['user-events', userId], (old: any) => {
        if (!old) return {appointments: tempAppointments}
        return {
          ...old,
          appointments: [...(old.appointments || []), ...tempAppointments],
        }
      })

      // Return a context object with the snapshot
      return {previousEvents}
    },
    // On error, rollback
    onError: (err, newAppointmentData, context) => {
      queryClient.setQueryData(['user-events', userId], context?.previousEvents)
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          err instanceof Error ? err.message : 'Failed to create appointments',
      })
    },
    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: ['user-events', userId]})
    },
    onSuccess: result => {
      // Handle sync status
      if (!result.syncStatus.success) {
        toast({
          variant: 'destructive',
          title: 'Appointments saved',
          description:
            result.syncStatus.message ||
            'Saved locally but Google Calendar sync failed. You can retry sync later.',
        })
      } else {
        toast({
          description: 'Appointments created and synced to Google Calendar',
        })
      }
    },
  })
}

export function useUpdateAppointment(userId: string, eventId?: string) {
  const queryClient = useQueryClient()
  const {toast} = useToast()

  return useMutation({
    mutationFn: updateAppointment,
    // Optimistic update
    onMutate: async updatedAppointment => {
      await queryClient.cancelQueries({queryKey: ['user-events', userId]})
      await queryClient.cancelQueries({queryKey: ['appointment', eventId]})

      const previousEvents = queryClient.getQueryData(['user-events', userId])
      const previousAppointment = queryClient.getQueryData([
        'appointment',
        eventId,
      ])

      // Optimistically update the appointment
      queryClient.setQueryData(['appointment', eventId], (old: any) => ({
        ...old,
        ...updatedAppointment,
        date: new Date(updatedAppointment.date),
      }))

      queryClient.setQueryData(['user-events', userId], (old: any) => {
        if (!old?.appointments) return old
        return {
          ...old,
          appointments: old.appointments.map((apt: any) =>
            apt.id === eventId ? {...apt, ...updatedAppointment} : apt,
          ),
        }
      })

      return {previousEvents, previousAppointment}
    },
    onError: (err, updatedAppointment, context) => {
      queryClient.setQueryData(['user-events', userId], context?.previousEvents)
      queryClient.setQueryData(
        ['appointment', eventId],
        context?.previousAppointment,
      )
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          err instanceof Error ? err.message : 'Failed to update appointment',
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: ['user-events', userId]})
      queryClient.invalidateQueries({queryKey: ['appointment', eventId]})
    },
    onSuccess: result => {
      // Handle sync status
      if (!result.syncStatus.success) {
        toast({
          variant: 'destructive',
          title: 'Appointment updated',
          description:
            result.syncStatus.message ||
            'Updated locally but Google Calendar sync failed. You can retry sync later.',
        })
      } else {
        toast({
          description: 'Appointment updated and synced to Google Calendar',
        })
      }
    },
  })
}

export function useDeleteAppointment(userId: string) {
  const queryClient = useQueryClient()
  const {toast} = useToast()

  return useMutation({
    mutationFn: deleteAppointment,
    // Optimistic update
    onMutate: async appointmentToDelete => {
      await queryClient.cancelQueries({queryKey: ['user-events', userId]})

      const previousEvents = queryClient.getQueryData(['user-events', userId])

      // Optimistically remove the appointment
      queryClient.setQueryData(['user-events', userId], (old: any) => {
        if (!old?.appointments) return old
        return {
          ...old,
          appointments: old.appointments.filter(
            (apt: any) => apt.id !== appointmentToDelete.id,
          ),
        }
      })

      return {previousEvents}
    },
    onError: (err, appointmentToDelete, context) => {
      queryClient.setQueryData(['user-events', userId], context?.previousEvents)
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          err instanceof Error ? err.message : 'Failed to delete appointment',
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: ['user-events', userId]})
    },
    onSuccess: result => {
      // Handle sync status
      if (!result.syncStatus.success) {
        toast({
          title: 'Appointment deleted',
          description:
            result.syncStatus.message ||
            'Deleted locally but failed to remove from Google Calendar.',
        })
      } else {
        toast({
          description: 'Appointment deleted and removed from Google Calendar',
        })
      }
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

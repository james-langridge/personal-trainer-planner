'use client'

import {
  skipToken,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  AllbootcampsParams,
  createBootcamp,
  deleteBootcamp,
  getAllBootcamps,
  getBootcamp,
  getBootcamps,
  toggleBootcampAttendance,
  updateBootcamp,
} from '@/app/actions/bootcamps'
import {EVENT_TYPE} from '@prisma/client'
import {toast} from 'react-toastify'

export function useAllBootcamps(params: AllbootcampsParams) {
  return useQuery({
    queryKey: [
      'bootcamps',
      params.dateFilter.gte.toISOString(),
      params.dateFilter.lt.toISOString(),
    ],
    queryFn: () => getAllBootcamps(params),
  })
}

export function useAllBootcampsFull(params: AllbootcampsParams) {
  return useQuery({
    queryKey: [
      'bootcamps',
      params.dateFilter.gte.toISOString(),
      params.dateFilter.lt.toISOString(),
    ],
    queryFn: () => getBootcamps(params),
  })
}

export function useGetBootcamp(eventType?: EVENT_TYPE, id?: string) {
  return useQuery({
    queryKey: ['bootcamp', id],
    queryFn:
      id && eventType === EVENT_TYPE.BOOTCAMP
        ? () => getBootcamp(id)
        : skipToken,
  })
}

export function useCreateBootcamp(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createBootcamp,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['user-events', userId]})
    },
  })
}

export function useUpdateBootcamp(userId: string, eventId?: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateBootcamp,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['user-events', userId]})
      queryClient.invalidateQueries({queryKey: ['bootcamp', eventId]})
    },
  })
}

export function useDeleteBootcamp(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteBootcamp,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['user-events', userId]})
    },
  })
}

export function useToggleBootcampAttendance(userId: string, eventId?: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: toggleBootcampAttendance,
    onSuccess: ({credits, OK}, {isAttending}) => {
      queryClient.invalidateQueries({queryKey: ['user-events', userId]})
      queryClient.invalidateQueries({queryKey: ['bootcamp', eventId]})
      let toastMessage

      if (!OK) {
        toast(
          `No credits remaining! Please contact ${process.env.NEXT_PUBLIC_PT_FIRST_NAME}.`,
        )
        return
      }

      if (isAttending) {
        toastMessage =
          credits !== undefined
            ? `Attendance cancelled. Credits remaining: ${credits}`
            : 'Attendance cancelled.'
      }

      if (!isAttending) {
        toastMessage =
          credits !== undefined
            ? `See you at the bootcamp! Credits remaining: ${credits}`
            : 'See you at the bootcamp!'
      }
      toast.success(toastMessage)
    },
    onError: () => {
      toast.error('Something went wrong...')
    },
  })
}

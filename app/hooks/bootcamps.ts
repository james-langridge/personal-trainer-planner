'use client'

import {EVENT_TYPE} from '@prisma/client'
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

export function useAllBootcamps(params: AllbootcampsParams) {
  return useQuery({
    queryKey: ['bootcamps', params],
    queryFn: () => getAllBootcamps(params),
  })
}

export function useAllBootcampsFull(params: AllbootcampsParams) {
  return useQuery({
    queryKey: ['bootcamps-full', params],
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
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['user-events', userId]})
      queryClient.invalidateQueries({queryKey: ['bootcamp', eventId]})
    },
  })
}

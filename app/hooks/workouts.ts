import {
  skipToken,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  createWorkout,
  deleteWorkout,
  getWorkout,
  updateWorkout,
} from '@/app/actions/workouts'
import {EVENT_TYPE} from '@prisma/client'

export function useCreateWorkout(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createWorkout,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['user-events', userId]})
    },
  })
}

export function useUpdateWorkout(userId: string, eventId?: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateWorkout,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['user-events', userId]})
      queryClient.invalidateQueries({queryKey: ['workout', eventId]})
    },
  })
}

export function useGetWorkout(eventType?: EVENT_TYPE, id?: string) {
  return useQuery({
    queryKey: ['workout', id],
    queryFn:
      id && eventType === EVENT_TYPE.WORKOUT ? () => getWorkout(id) : skipToken,
  })
}

export function useDeleteWorkout(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteWorkout,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['user-events', userId]})
    },
  })
}

'use client'

import {
  skipToken,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  createUser,
  getUser,
  getUserEvents,
  getUserFee,
  getUserIdsAndNames,
  getUsers,
  updateUser,
  UserEventsParams,
  UserFeeParams,
} from '@/app/actions/users'
import {useToast} from '@/components/use-toast'
import {useRouter} from 'next/navigation'

export function useUserEvents(params: UserEventsParams) {
  return useQuery({
    queryKey: [
      'user-events',
      params.id,
      params.dateFilter.gte.toISOString(),
      params.dateFilter.lt.toISOString(),
    ],
    queryFn: () => getUserEvents(params),
    refetchInterval: 1 * 60 * 1000,
  })
}

export function useUserFee(params: UserFeeParams) {
  return useQuery({
    queryKey: ['user-fee', params.id],
    queryFn: () => getUserFee(params),
  })
}

export function useUserIdsAndNames() {
  return useQuery({
    queryKey: ['user-ids'],
    queryFn: () => getUserIdsAndNames(),
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['user-ids']}) // todo all users
    },
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  const {toast} = useToast()
  const router = useRouter()

  return useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      toast({
        description: 'Client updated successfully.',
      })
      queryClient.invalidateQueries({queryKey: ['user-ids']}) // todo all users
      router.back()
    },
    onError: error => {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error.message,
      })
    },
  })
}

export type GetUAllUsersParams = {dateFilter: {gte: Date; lt: Date}}

export function useAllUsers(params: GetUAllUsersParams) {
  return useQuery({
    queryKey: [
      'users',
      params.dateFilter.gte.toISOString(),
      params.dateFilter.lt.toISOString(),
    ],
    queryFn: () => getUsers(params),
  })
}

export function useGetUser(id?: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: id ? () => getUser(id) : skipToken,
  })
}

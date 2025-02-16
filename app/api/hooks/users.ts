'use client'

import {useQuery} from '@tanstack/react-query'
import {
  getUserEvents,
  getUserFee,
  getUserIdsAndNames,
  UserEventsParams,
  UserFeeParams,
} from '@/app/api/client/users'

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

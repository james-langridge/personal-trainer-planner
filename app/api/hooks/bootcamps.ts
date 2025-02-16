'use client'

import {useQuery} from '@tanstack/react-query'
import {AllbootcampsParams, getAllBootcamps} from '@/app/api/client/bootcamps'

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

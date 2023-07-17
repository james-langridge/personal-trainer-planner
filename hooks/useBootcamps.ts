import {USER_TYPE} from '@prisma/client'

import {Workout} from '@/@types/apiResponseTypes'
import {useGetUserQuery} from '@/redux/apiSlice'

export function useBootcamps(type?: USER_TYPE, id = ''): Workout[] {
  const isBootcamper = type === 'BOOTCAMP'
  const {data} = useGetUserQuery(String(process.env.NEXT_PUBLIC_BOOTCAMP_ID), {
    pollingInterval: 60000,
    skip: !isBootcamper || id === String(process.env.NEXT_PUBLIC_BOOTCAMP_ID),
  })

  if (!isBootcamper) {
    return []
  }

  return data?.workouts || []
}

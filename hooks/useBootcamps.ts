import {USER_TYPE} from '@prisma/client'

import {Workout} from '@/@types/apiResponseTypes'
import {useGetUserQuery} from '@/redux/apiSlice'

export function useBootcamps(type?: USER_TYPE, id = ''): Workout[] {
  const bootcampCalendarId = String(process.env.NEXT_PUBLIC_BOOTCAMP_ID)
  const isBootcamper = type === 'BOOTCAMP'
  const {data} = useGetUserQuery(bootcampCalendarId, {
    pollingInterval: 60000,
    skip: !isBootcamper || id === bootcampCalendarId,
  })

  if (!isBootcamper) {
    return []
  }

  return data?.workouts || []
}

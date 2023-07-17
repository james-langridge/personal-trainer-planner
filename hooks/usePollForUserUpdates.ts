import {Workout} from '@/@types/apiResponseTypes'
import {useGetUserQuery} from '@/redux/apiSlice'

export function usePollForUserUpdates(id = ''): Workout[] {
  const {data} = useGetUserQuery(id, {
    pollingInterval: 60000,
    skip: !id,
  })

  return data?.workouts || []
}

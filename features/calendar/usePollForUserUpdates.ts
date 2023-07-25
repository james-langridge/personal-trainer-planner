import {Appointment, Workout} from '@/@types/apiResponseTypes'
import {useIsFirstRender} from '@/hooks/useIsFirstRender'
import {useGetUserQuery} from '@/redux/apiSlice'
import {useAppSelector} from '@/redux/hooks'
import {selectUser} from '@/redux/usersSlice'

export function usePollForUserUpdates(): [Workout[], Appointment[]] {
  const isFirstRender = useIsFirstRender()
  const user = useAppSelector(selectUser)
  const userId = user?.id || ''
  const {data} = useGetUserQuery(userId, {
    pollingInterval: 60000,
    // Skip first render to use ssr data instead of fetching
    skip: !userId || isFirstRender,
  })

  if (isFirstRender) {
    return [user?.workouts || [], user?.appointments || []]
  }

  return [data?.workouts || [], data?.appointments || []]
}

import {Appointment, Workout} from '@/@types/apiResponseTypes'
import {useIsFirstRender} from '@/hooks/useIsFirstRender'
import {useGetUserQuery} from '@/redux/services/users'
import {useAppSelector} from '@/redux/store'
import {selectUser} from '@/redux/usersSlice'

export function usePollForUserUpdates(): [Workout[], Appointment[]] {
  const isFirstRender = useIsFirstRender()
  const user = useAppSelector(selectUser)
  const userId = user?.id
  const {data} = useGetUserQuery(userId!, {
    pollingInterval: 60000,
    skip: !userId || isFirstRender,
  })

  return [
    data?.workouts || user?.workouts || [],
    data?.appointments || user?.appointments || [],
  ]
}

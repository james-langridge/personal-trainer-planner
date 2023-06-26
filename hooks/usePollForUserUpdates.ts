import {useGetUserQuery} from '@/redux/apiSlice'
import {useAppSelector} from '@/redux/hooks'

export function usePollForUserUpdates() {
  const user = useAppSelector(state => state.users.user)
  const {data} = useGetUserQuery(user?.id || '', {
    pollingInterval: 60000,
    skip: !user,
  })

  return data?.workouts
}

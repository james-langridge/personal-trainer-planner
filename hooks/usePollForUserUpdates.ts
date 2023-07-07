import {useGetUserQuery} from '@/redux/apiSlice'
import {useAppSelector} from '@/redux/hooks'
import {selectUser} from '@/redux/usersSlice'

export function usePollForUserUpdates() {
  const user = useAppSelector(selectUser)
  const {data} = useGetUserQuery(user?.id || '', {
    pollingInterval: 60000,
    skip: !user,
  })

  return data?.workouts
}

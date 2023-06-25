import {SerialisedUser} from '@/lib/users'
import {loginSuccess} from '@/redux/authSlice'
import {useAppDispatch, useAppSelector} from '@/redux/hooks'
import {setUser} from '@/redux/usersSlice'

export function useUser(user: SerialisedUser) {
  const {isLoggedIn, isAdmin} = useAppSelector(state => state.auth)
  const dispatch = useAppDispatch()

  if (!isAdmin) {
    dispatch(setUser(user))
  }

  if (!isLoggedIn) {
    dispatch(loginSuccess(user))
  }
}

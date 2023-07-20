import {createSlice, PayloadAction} from '@reduxjs/toolkit'

import {UserWithWorkouts} from '@/@types/apiResponseTypes'
import {RootState} from '@/redux/store'

interface UsersState {
  user: UserWithWorkouts | null
  users: UserWithWorkouts[] | null
}

const initialState: UsersState = {
  user: null,
  users: null,
}

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserWithWorkouts>) => {
      state.user = action.payload
    },
    setUsers: (state, action: PayloadAction<UserWithWorkouts[]>) => {
      state.users = action.payload
    },
  },
})

export const {setUser, setUsers} = usersSlice.actions

export const selectUser = (state: RootState) => state.users.user
export const selectUsers = (state: RootState) => state.users.users

export default usersSlice.reducer

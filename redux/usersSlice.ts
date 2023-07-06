import {createSlice, PayloadAction} from '@reduxjs/toolkit'

import {UserWithWorkouts} from '@/@types/apiResponseTypes'
import {RootState} from '@/redux/store'

interface UsersState {
  user: UserWithWorkouts | null
}

const initialState: UsersState = {
  user: null,
}

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserWithWorkouts>) => {
      state.user = action.payload
    },
  },
})

export const {setUser} = usersSlice.actions

// TODO needed?
export const selectUsers = (state: RootState) => state.users

export default usersSlice.reducer

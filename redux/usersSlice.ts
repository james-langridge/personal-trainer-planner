import {createSlice, PayloadAction} from '@reduxjs/toolkit'

import {SerialisedUser} from '@/@types/types'
import {RootState} from '@/redux/store'

interface UsersState {
  user: SerialisedUser | null
}

const initialState: UsersState = {
  user: null,
}

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<SerialisedUser>) => {
      state.user = action.payload
    },
  },
})

export const {setUser} = usersSlice.actions

// TODO needed?
export const selectUsers = (state: RootState) => state.users

export default usersSlice.reducer

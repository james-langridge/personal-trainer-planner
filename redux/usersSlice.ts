import {createSlice, PayloadAction} from '@reduxjs/toolkit'

import {SerialisedUser} from '@/@types/apiResponseTypes'
import {RootState} from '@/redux/store'

interface UsersState {
  user: SerialisedUser | undefined
}

const initialState: UsersState = {
  user: undefined,
}

export const slice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<SerialisedUser | undefined>) => {
      state.user = action.payload
    },
  },
})

export const {setUser} = slice.actions

export const selectUser = (state: RootState) => state.users.user

export default slice.reducer

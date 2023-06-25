import {createSlice, PayloadAction} from '@reduxjs/toolkit'

import {SerialisedUser} from '@/lib/users'

interface AuthState {
  user: SerialisedUser | null
  isAdmin: boolean
  isLoggedIn: boolean
}

const initialState: AuthState = {
  user: null,
  isAdmin: false,
  isLoggedIn: false,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<SerialisedUser>) => {
      state.user = action.payload
      state.isAdmin = action.payload.role === 'admin'
      state.isLoggedIn = true
    },
  },
})

export const {loginSuccess} = authSlice.actions

export default authSlice.reducer

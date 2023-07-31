import {createSlice, PayloadAction} from '@reduxjs/toolkit'

import {RootState} from '@/redux/store'

interface AuthState {
  isAdmin: boolean
  isLoggedIn: boolean
}

const initialState: AuthState = {
  isAdmin: false,
  isLoggedIn: false,
}

export const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<string | null>) => {
      state.isAdmin = action.payload === 'admin'
      state.isLoggedIn = true
    },
  },
})

export const {loginSuccess} = slice.actions

export const selectIsAdmin = (state: RootState) => state.auth.isAdmin
export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn

export default slice.reducer

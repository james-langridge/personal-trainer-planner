import {createSlice, PayloadAction} from '@reduxjs/toolkit'

interface AuthState {
  isAdmin: boolean
  isLoggedIn: boolean
}

const initialState: AuthState = {
  isAdmin: false,
  isLoggedIn: false,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<string | null>) => {
      state.isAdmin = action.payload === 'admin'
      state.isLoggedIn = true
    },
  },
})

export const {loginSuccess} = authSlice.actions

export default authSlice.reducer

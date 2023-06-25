import {configureStore} from '@reduxjs/toolkit'

import authReducer from './authSlice'
import usersReducer from './usersSlice'
import workoutReducer from './workoutSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    workout: workoutReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

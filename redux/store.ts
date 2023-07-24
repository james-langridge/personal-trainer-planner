import {configureStore} from '@reduxjs/toolkit'

import {apiSlice} from './apiSlice'
import authReducer from './authSlice'
import eventReducer from './eventSlice'
import usersReducer from './usersSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    event: eventReducer,
    users: usersReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(apiSlice.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

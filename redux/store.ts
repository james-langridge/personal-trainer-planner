import {configureStore} from '@reduxjs/toolkit'

import auth from './authSlice'
import events from './eventSlice'
import {api} from './services/api'
import users from './usersSlice'

export const store = configureStore({
  reducer: {
    auth,
    events,
    users,
    [api.reducerPath]: api.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(api.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

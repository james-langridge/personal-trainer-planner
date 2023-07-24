import {createSlice, PayloadAction} from '@reduxjs/toolkit'

import {EventType} from '@/@types/types'
import {RootState} from '@/redux/store'

interface EventState {
  id: string
  type?: EventType
}

const initialState: EventState = {
  id: '',
  type: undefined,
}

export const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    resetEvent: state => {
      state.id = ''
      state.type = undefined
    },
    setEvent: (state, action: PayloadAction<EventState>) => {
      state.id = action.payload.id
      state.type = action.payload.type
    },
  },
})

export const {resetEvent, setEvent} = eventSlice.actions

export const selectEvent = (state: RootState) => state.event

export default eventSlice.reducer

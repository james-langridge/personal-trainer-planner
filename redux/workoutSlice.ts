import {createSlice, PayloadAction} from '@reduxjs/toolkit'

interface WorkoutState {
  id: string
}

const initialState: WorkoutState = {
  id: '',
}

export const workoutSlice = createSlice({
  name: 'workout',
  initialState,
  reducers: {
    resetWorkoutId: state => {
      state.id = ''
    },
    setWorkoutId: (state, action: PayloadAction<string>) => {
      state.id = action.payload
    },
  },
})

export const {resetWorkoutId, setWorkoutId} = workoutSlice.actions

export default workoutSlice.reducer

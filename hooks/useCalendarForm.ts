import {WORKOUT_TYPE} from '@prisma/client'
import React, {useEffect, useState} from 'react'

import {useFetchWorkout} from '@/hooks'
import {useAppDispatch, useAppSelector} from '@/redux/hooks'
import {resetWorkoutId} from '@/redux/workoutSlice'

export type CalendarFormState = {
  date: string
  description?: string
  name: string
  ownerId: string
  workoutId: string
  videoUrl?: string
  type: WORKOUT_TYPE
}

const initialState: CalendarFormState = {
  date: '',
  description: '',
  name: '',
  ownerId: '',
  workoutId: '',
  videoUrl: '',
  type: WORKOUT_TYPE.TRAINING,
}

export const useCalendarForm = ({
  date,
}: {
  date: string
}): [
  CalendarFormState,
  React.Dispatch<React.SetStateAction<CalendarFormState>>,
  () => void,
] => {
  const user = useAppSelector(state => state.users.user)
  const userId = user?.id || ''
  const workoutId = useAppSelector(state => state.workout.id)
  const dispatch = useAppDispatch()
  const [workout, setWorkout] = useState<CalendarFormState>({
    ...initialState,
    date,
    ownerId: userId,
  })

  const workoutData = useFetchWorkout(workoutId)

  useEffect(() => {
    if (workoutData) {
      setWorkout(workoutData)
    }
  }, [workoutData])

  function resetForm() {
    setWorkout({
      ...initialState,
      ownerId: userId,
    })
    dispatch(resetWorkoutId())
  }

  return [workout, setWorkout, resetForm]
}

import React, {useEffect, useState} from 'react'
import {WORKOUT_TYPE} from '@prisma/client'
import {useFetchWorkout} from '@/hooks'
import {
  useWorkoutId,
  useWorkoutIdDispatch,
  useUser,
} from '@/app/(training-app)/Providers'

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

export const useCalendarForm = (): [
  CalendarFormState,
  React.Dispatch<React.SetStateAction<CalendarFormState>>,
  () => void,
] => {
  const userState = useUser()
  const userId = userState?.user?.id ?? ''
  const {workoutId} = useWorkoutId()
  const dispatch = useWorkoutIdDispatch()
  const [workout, setWorkout] = useState<CalendarFormState>({
    ...initialState,
    ownerId: userId,
  })

  const workoutData = useFetchWorkout(workoutId ?? '')

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
    dispatch({type: 'setWorkoutId', workoutId: ''})
  }

  return [workout, setWorkout, resetForm]
}

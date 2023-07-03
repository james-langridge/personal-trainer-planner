import {WORKOUT_TYPE} from '@prisma/client'
import React, {useCallback, useEffect, useState} from 'react'

import {CalendarFormState, Day} from '@/@types/types'
import {useFetchWorkout} from '@/hooks'
import {getWeekday, padZero} from '@/lib/calendar'
import {useAppSelector} from '@/redux/hooks'

const initialState: CalendarFormState = {
  date: '',
  description: '',
  name: '',
  ownerId: '',
  workoutId: '',
  videoUrl: '',
  type: WORKOUT_TYPE.TRAINING,
  selectedDays: new Set<number>(),
  weeksToRepeat: 0,
}

export const useCalendarForm = ({
  day,
}: {
  day: Day
}): [
  CalendarFormState,
  React.Dispatch<React.SetStateAction<CalendarFormState>>,
  (weekday: number) => void,
] => {
  const user = useAppSelector(state => state.users.user)
  const userId = user?.id || ''
  const workoutId = useAppSelector(state => state.workout.id)
  const workoutData = useFetchWorkout(workoutId)
  const [workout, setWorkout] = useState<CalendarFormState>({
    ...initialState,
    date: `${day.year}-${padZero(day.month + 1)}-${padZero(day.day)}`,
    selectedDays: new Set([day.weekDay]),
    ownerId: userId,
  })

  const toggleDay = useCallback(
    (weekday: number) => {
      if (getWeekday(workout.date) === weekday) {
        return
      }

      const newSet = new Set(workout.selectedDays)
      const isDaySelected = newSet.has(weekday)

      if (isDaySelected) {
        newSet.delete(weekday)
      } else {
        newSet.add(weekday)
      }

      setWorkout(workout => ({
        ...workout,
        selectedDays: newSet,
      }))
    },
    [workout.date, workout.selectedDays],
  )

  useEffect(() => {
    const newSet = new Set<number>([getWeekday(workout.date)])

    setWorkout(workout => ({
      ...workout,
      selectedDays: newSet,
    }))
  }, [workout.date])

  useEffect(() => {
    if (workoutData) {
      setWorkout({...workout, ...workoutData})
    }
  }, [workoutData])

  return [workout, setWorkout, toggleDay]
}

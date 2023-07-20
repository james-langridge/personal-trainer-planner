import {WORKOUT_TYPE} from '@prisma/client'
import React, {useCallback, useEffect, useState} from 'react'

import {CalendarFormState, Day} from '@/@types/types'
import {getWeekday, padZero} from '@/lib/calendar'
import {useGetWorkoutQuery} from '@/redux/apiSlice'
import {useAppSelector} from '@/redux/hooks'
import {selectUser} from '@/redux/usersSlice'
import {selectWorkoutId} from '@/redux/workoutSlice'

const initialState: CalendarFormState = {
  date: '',
  description: '',
  id: '',
  name: '',
  ownerId: '',
  selectedDays: new Set<number>(),
  type: WORKOUT_TYPE.TRAINING,
  videoUrl: '',
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
  const user = useAppSelector(selectUser)
  const userId = user?.id || ''
  const workoutId = useAppSelector(selectWorkoutId)
  const {data: workoutData} = useGetWorkoutQuery(workoutId, {skip: !workoutId})
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
      setWorkout({
        ...workout,
        ...workoutData,
        date: String(workoutData.date).split('T')[0],
      })
    }
  }, [workoutData])

  return [workout, setWorkout, toggleDay]
}

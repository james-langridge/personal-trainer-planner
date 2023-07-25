import React, {useCallback, useEffect, useState} from 'react'

import {CalendarFormState, Day} from '@/@types/types'
import {getWeekday, padZero} from '@/lib/calendar'
import {
  useGetAppointmentQuery,
  useGetBootcampQuery,
  useGetWorkoutQuery,
} from '@/redux/apiSlice'
import {selectEvent} from '@/redux/eventSlice'
import {useAppSelector} from '@/redux/hooks'
import {selectUser} from '@/redux/usersSlice'

const initialState: CalendarFormState = {
  date: '',
  description: '',
  id: '',
  name: '',
  ownerId: '',
  selectedDays: new Set<number>(),
  type: 'WORKOUT',
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
  const {id, type} = useAppSelector(selectEvent)
  const {data: appointmentData} = useGetAppointmentQuery(id, {
    skip: !id || type !== 'APPOINTMENT',
  })
  const {data: workoutData} = useGetWorkoutQuery(id, {
    skip: !id || type !== 'WORKOUT',
  })
  const {data: bootcampData} = useGetBootcampQuery(id, {
    skip: !id || type !== 'BOOTCAMP',
  })
  const formData = appointmentData || bootcampData || workoutData
  const [form, setForm] = useState<CalendarFormState>({
    ...initialState,
    date: `${day.year}-${padZero(day.month + 1)}-${padZero(day.day)}`,
    selectedDays: new Set([day.weekDay]),
    ownerId: userId,
  })

  const toggleDay = useCallback(
    (weekday: number) => {
      if (getWeekday(form.date) === weekday) {
        return
      }

      const newSet = new Set(form.selectedDays)
      const isDaySelected = newSet.has(weekday)

      if (isDaySelected) {
        newSet.delete(weekday)
      } else {
        newSet.add(weekday)
      }

      setForm(form => ({
        ...form,
        selectedDays: newSet,
      }))
    },
    [form.date, form.selectedDays],
  )

  useEffect(() => {
    const newSet = new Set<number>([getWeekday(form.date)])

    setForm(form => ({
      ...form,
      selectedDays: newSet,
    }))
  }, [form.date])

  useEffect(() => {
    if (formData) {
      setForm({
        ...form,
        ...formData,
        type,
        date: String(formData.date).split('T')[0],
      })
    }
  }, [formData])

  return [form, setForm, toggleDay]
}

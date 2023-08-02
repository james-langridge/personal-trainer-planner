import React, {useCallback, useEffect, useRef, useState} from 'react'

import {CalendarFormState, Day} from '@/@types/types'
import {getWeekday, padZero} from '@/lib/calendar'
import {selectEvent} from '@/redux/eventSlice'
import {
  useCreateAppointmentMutation,
  useDeleteAppointmentMutation,
  useGetAppointmentQuery,
  useUpdateAppointmentMutation,
} from '@/redux/services/appointments'
import {
  useCreateBootcampMutation,
  useDeleteBootcampMutation,
  useGetBootcampQuery,
  useUpdateBootcampMutation,
} from '@/redux/services/bootcamps'
import {
  useCreateWorkoutMutation,
  useDeleteWorkoutMutation,
  useGetWorkoutQuery,
  useUpdateWorkoutMutation,
} from '@/redux/services/workouts'
import {useAppSelector} from '@/redux/store'
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
  closeModal,
}: {
  day: Day
  closeModal: (e: React.SyntheticEvent) => void
}) => {
  const [error, setError] = useState<Error>()
  const [createAppointment, {isLoading: isCreatingAppointment}] =
    useCreateAppointmentMutation()
  const [updateAppointment, {isLoading: isUpdatingAppointment}] =
    useUpdateAppointmentMutation()
  const [deleteAppointment, {isLoading: isDeletingAppointment}] =
    useDeleteAppointmentMutation()
  const [createWorkout, {isLoading: isCreatingWorkout}] =
    useCreateWorkoutMutation()
  const [updateWorkout, {isLoading: isUpdatingWorkout}] =
    useUpdateWorkoutMutation()
  const [deleteWorkout, {isLoading: isDeletingWorkout}] =
    useDeleteWorkoutMutation()
  const [createBootcamp, {isLoading: isCreatingBootcamp}] =
    useCreateBootcampMutation()
  const [updateBootcamp, {isLoading: isUpdatingBootcamp}] =
    useUpdateBootcampMutation()
  const [deleteBootcamp, {isLoading: isDeletingBootcamp}] =
    useDeleteBootcampMutation()
  const isDeleting =
    isDeletingAppointment || isDeletingWorkout || isDeletingBootcamp
  const isCreating =
    isCreatingWorkout || isCreatingAppointment || isCreatingBootcamp
  const isUpdating =
    isUpdatingWorkout || isUpdatingBootcamp || isUpdatingAppointment
  const user = useAppSelector(selectUser)
  const userId = user?.id || ''
  const isDisabled = isDeleting || isCreating || isUpdating || !userId
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

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()

    if (form.type === 'WORKOUT') {
      try {
        if (form.id) {
          await updateWorkout(form).unwrap()
        } else {
          await createWorkout({
            ...form,
            selectedDays: [...form.selectedDays],
          }).unwrap()
        }

        closeModal(e)
      } catch (error) {
        setError(error as Error)
      }
    }

    if (form.type === 'APPOINTMENT') {
      try {
        if (form.id) {
          await updateAppointment(form).unwrap()
        } else {
          await createAppointment({
            ...form,
            selectedDays: [...form.selectedDays],
          }).unwrap()
        }

        closeModal(e)
      } catch (error) {
        setError(error as Error)
      }
    }

    if (form.type === 'BOOTCAMP') {
      try {
        if (form.id) {
          await updateBootcamp(form).unwrap()
        } else {
          await createBootcamp({
            ...form,
            selectedDays: [...form.selectedDays],
          }).unwrap()
        }

        closeModal(e)
      } catch (error) {
        setError(error as Error)
      }
    }
  }

  async function handleDelete(e: React.SyntheticEvent) {
    if (isDisabled || !form.id) {
      return
    }

    if (form.type === 'APPOINTMENT') {
      try {
        await deleteAppointment({
          deleted: true,
          ownerId: form.ownerId,
          id: form.id,
        }).unwrap()

        closeModal(e)
      } catch (error) {
        setError(error as Error)
      }
    }

    if (form.type === 'WORKOUT') {
      try {
        await deleteWorkout({
          deleted: true,
          ownerId: form.ownerId,
          id: form.id,
        }).unwrap()

        closeModal(e)
      } catch (error) {
        setError(error as Error)
      }
    }

    if (form.type === 'BOOTCAMP') {
      try {
        await deleteBootcamp({
          deleted: true,
          id: form.id,
        }).unwrap()

        closeModal(e)
      } catch (error) {
        setError(error as Error)
      }
    }
  }

  useEffect(() => {
    if (!userId) {
      return
    }

    setForm(form => ({
      ...form,
      ownerId: userId,
    }))
  }, [setForm, userId])

  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return {
    error,
    form,
    handleDelete,
    handleSubmit,
    inputRef,
    isCreating,
    isDeleting,
    isDisabled,
    isUpdating,
    setForm,
    toggleDay,
  }
}

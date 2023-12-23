import React, {useCallback, useEffect, useRef, useState} from 'react'

import {UserWithWorkouts} from '@/@types/apiResponseTypes'
import {CalendarFormState, Day} from '@/@types/types'
import revalidate from '@/features/calendar/form/actions'
import {createWorkout, deleteWorkout, updateWorkout} from '@/lib/api'
import {getWeekday, padZero} from '@/lib/calendar'
import {getErrorMessage} from '@/lib/errors'
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
import {useGetWorkoutQuery} from '@/redux/services/workouts'
import {useAppSelector} from '@/redux/store'

const initialState: CalendarFormState = {
  date: '',
  description: '',
  fee: '0.00',
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
  user,
}: {
  day: Day
  closeModal: (e: React.SyntheticEvent) => void
  user: UserWithWorkouts
}) => {
  const [error, setError] = useState<string>()
  const [createAppointment, {isLoading: isCreatingAppointment}] =
    useCreateAppointmentMutation()
  const [updateAppointment, {isLoading: isUpdatingAppointment}] =
    useUpdateAppointmentMutation()
  const [deleteAppointment, {isLoading: isDeletingAppointment}] =
    useDeleteAppointmentMutation()
  const [createBootcamp, {isLoading: isCreatingBootcamp}] =
    useCreateBootcampMutation()
  const [updateBootcamp, {isLoading: isUpdatingBootcamp}] =
    useUpdateBootcampMutation()
  const [deleteBootcamp, {isLoading: isDeletingBootcamp}] =
    useDeleteBootcampMutation()
  const isDeleting = isDeletingAppointment || isDeletingBootcamp
  const isCreating = isCreatingAppointment || isCreatingBootcamp
  const isUpdating = isUpdatingBootcamp || isUpdatingAppointment
  // const user = useAppSelector(selectUser)
  const userId = user.id
  const isDisabled = isDeleting || isCreating || isUpdating || !userId
  const {id: eventId, type} = useAppSelector(selectEvent)
  const {data: appointmentData} = useGetAppointmentQuery(eventId, {
    skip: !eventId || type !== 'APPOINTMENT',
  })
  const {data: workoutData} = useGetWorkoutQuery(eventId, {
    skip: !eventId || type !== 'WORKOUT',
  })
  const {data: bootcampData} = useGetBootcampQuery(eventId, {
    skip: !eventId || type !== 'BOOTCAMP',
  })
  const eventData = appointmentData || bootcampData || workoutData

  const [form, setForm] = useState<CalendarFormState>({
    ...initialState,
    date: `${day.year}-${padZero(day.month + 1)}-${padZero(day.day)}`,
    selectedDays: new Set([day.weekDay]),
    ownerId: userId,
  })

  console.log({day})

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()

    if (form.type === 'WORKOUT') {
      try {
        if (form.id) {
          await updateWorkout(form)
        } else {
          await createWorkout({
            ...form,
            selectedDays: [...form.selectedDays],
          })
        }

        await revalidate()
        closeModal(e)
      } catch (error) {
        setError(getErrorMessage(error))
      }
    }

    if (form.type === 'APPOINTMENT') {
      const fee = Math.round(parseFloat(form.fee) * 100)

      try {
        if (form.id) {
          await updateAppointment({
            ...form,
            fee,
          }).unwrap()
        } else {
          await createAppointment({
            ...form,
            fee,
            selectedDays: [...form.selectedDays],
          }).unwrap()
        }

        await revalidate()
        closeModal(e)
      } catch (error) {
        setError(getErrorMessage(error))
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

        await revalidate()
        closeModal(e)
      } catch (error) {
        setError(getErrorMessage(error))
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

        await revalidate()
        closeModal(e)
      } catch (error) {
        setError(getErrorMessage(error))
      }
    }

    if (form.type === 'WORKOUT') {
      try {
        await deleteWorkout({
          deleted: true,
          ownerId: form.ownerId,
          id: form.id,
        })

        await revalidate()
        closeModal(e)
      } catch (error) {
        setError(getErrorMessage(error))
      }
    }

    if (form.type === 'BOOTCAMP') {
      try {
        await deleteBootcamp({
          deleted: true,
          id: form.id,
        }).unwrap()

        await revalidate()
        closeModal(e)
      } catch (error) {
        setError(getErrorMessage(error))
      }
    }
  }

  // Create event
  useEffect(() => {
    if (!user || eventId) {
      return
    }

    const formattedFee = (user.fee / 100).toFixed(2)

    setForm(form => ({
      ...form,
      fee: formattedFee,
      ownerId: userId,
    }))
  }, [eventId, user, userId])

  useEffect(() => {
    const newSet = new Set<number>([getWeekday(form.date)])

    setForm(form => ({
      ...form,
      selectedDays: newSet,
    }))
  }, [form.date])

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

  // Edit event
  useEffect(() => {
    if (!eventData) {
      return
    }

    setForm({
      ...form,
      date: String(eventData.date).split('T')[0],
      description: eventData.description,
      ...(appointmentData && {fee: (appointmentData.fee / 100).toFixed(2)}),
      id: eventData.id,
      name: eventData.name,
      ...(appointmentData && {ownerId: appointmentData?.ownerId}),
      ...(workoutData && {ownerId: workoutData?.ownerId}),
      videoUrl: eventData.videoUrl,
      type,
    })
  }, [appointmentData, eventData, type, workoutData])

  // Focus on event name field
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

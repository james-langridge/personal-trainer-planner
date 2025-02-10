'use client'

import {useCallback, useEffect, useRef, useState} from 'react'
import {CalendarFormState, Day} from '@/@types/types'
import {getWeekday, padZero} from '@/lib/calendar'
import {
  createWorkout,
  updateWorkout,
  deleteWorkout,
  getWorkout,
} from '@/app/actions/workouts'
import {
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointment,
} from '@/app/actions/appointments'
import {
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcamp,
} from '@/app/actions/bootcamps'
import {useRouter} from 'next/navigation'

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

export function useCalendarForm({
  day,
  closeModal,
  userId,
  userFee,
  eventId,
  eventType,
}: {
  day: Day
  closeModal: (e: React.SyntheticEvent) => void
  userId: string
  userFee?: number
  eventId?: string
  eventType?: 'WORKOUT' | 'APPOINTMENT' | 'BOOTCAMP'
}) {
  const [error, setError] = useState<Error>()
  const [isLoading, setIsLoading] = useState({
    creating: false,
    updating: false,
    deleting: false,
  })
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState<CalendarFormState>({
    ...initialState,
    date: `${day.year}-${padZero(day.month)}-${padZero(day.day)}`,
    selectedDays: new Set([day.weekDay]),
    ownerId: userId,
  })

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()

    try {
      setIsLoading(prev => ({
        ...prev,
        [form.id ? 'updating' : 'creating']: true,
      }))

      switch (form.type) {
        case 'WORKOUT':
          if (form.id) {
            await updateWorkout(form)
          } else {
            await createWorkout({
              ...form,
              selectedDays: [...form.selectedDays],
            })
          }
          break

        case 'APPOINTMENT':
          const fee = Math.round(parseFloat(form.fee) * 100)
          if (form.id) {
            await updateAppointment({
              ...form,
              fee,
            })
          } else {
            await createAppointment({
              ...form,
              fee,
              selectedDays: [...form.selectedDays],
            })
          }
          break

        case 'BOOTCAMP':
          if (form.id) {
            await updateBootcamp(form)
          } else {
            await createBootcamp({
              ...form,
              selectedDays: [...form.selectedDays],
            })
          }
          break
      }

      router.refresh()
      closeModal(e)
    } catch (error) {
      setError(error as Error)
    } finally {
      setIsLoading(prev => ({
        ...prev,
        [form.id ? 'updating' : 'creating']: false,
      }))
    }
  }

  const handleDelete = async (e: React.SyntheticEvent) => {
    if (!form.id) return

    try {
      setIsLoading(prev => ({...prev, deleting: true}))

      switch (form.type) {
        case 'WORKOUT':
          await deleteWorkout({
            deleted: true,
            ownerId: form.ownerId,
            id: form.id,
          })
          break

        case 'APPOINTMENT':
          await deleteAppointment({
            deleted: true,
            ownerId: form.ownerId,
            id: form.id,
          })
          break

        case 'BOOTCAMP':
          await deleteBootcamp({
            deleted: true,
            id: form.id,
          })
          break
      }

      router.refresh()
      closeModal(e)
    } catch (error) {
      setError(error as Error)
    } finally {
      setIsLoading(prev => ({...prev, deleting: false}))
    }
  }

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

  // Effect to update selected days when date changes
  useEffect(() => {
    const newSet = new Set<number>([getWeekday(form.date)])

    setForm(form => ({
      ...form,
      selectedDays: newSet,
    }))
  }, [form.date])

  // Effect to set default user fee
  useEffect(() => {
    if (form.id || !userFee) {
      return
    }

    const formattedFee = (userFee / 100).toFixed(2)

    setForm(form => ({
      ...form,
      fee: formattedFee,
      ownerId: userId,
    }))
  }, [userId, form.id])

  // Effect to load existing event data
  useEffect(() => {
    const loadEventData = async () => {
      if (!eventId || !eventType) return

      try {
        let eventData
        switch (eventType) {
          case 'BOOTCAMP':
            eventData = await getBootcamp(eventId)
            break
          case 'WORKOUT':
            eventData = await getWorkout(eventId)
            break
          case 'APPOINTMENT':
            eventData = await getAppointment(eventId)
            break
        }

        if (eventData) {
          setForm({
            ...form,
            // date: String(eventData.date).split('T')[0],
            description: eventData.description || '',
            ...(eventType === 'APPOINTMENT' && {
              fee: ((eventData as any).fee / 100).toFixed(2),
            }),
            id: eventData.id,
            name: eventData.name,
            ownerId: (eventData as any).ownerId || '',
            videoUrl: eventData.videoUrl || '',
            type: eventType,
          })
        }
      } catch (error) {
        setError(error as Error)
      }
    }

    loadEventData()
  }, [])

  // Focus on name input when form opens
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return {
    error,
    form,
    handleDelete,
    handleSubmit,
    inputRef,
    isCreating: isLoading.creating,
    isDeleting: isLoading.deleting,
    isDisabled: Object.values(isLoading).some(Boolean),
    isUpdating: isLoading.updating,
    setForm,
    toggleDay,
  }
}

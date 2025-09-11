import {useCallback, useEffect, useRef, useState} from 'react'
import {CalendarFormState, Day} from '@/@types/types'
import {
  getWeekday,
  padZero,
  extractTimeString,
  combineDateAndTime,
  addHours,
} from '@/lib/calendar'
import {useRouter} from 'next/navigation'
import {useUserFee} from '@/app/hooks/users'
import {
  useCreateWorkout,
  useDeleteWorkout,
  useGetWorkout,
  useUpdateWorkout,
} from '@/app/hooks/workouts'
import {
  useCreateBootcamp,
  useDeleteBootcamp,
  useGetBootcamp,
  useUpdateBootcamp,
} from '@/app/hooks/bootcamps'
import {
  useCreateAppointment,
  useDeleteAppointment,
  useGetAppointment,
  useUpdateAppointment,
} from '@/app/hooks/appointments'
import {EVENT_TYPE} from '@prisma/client'

const initialState: CalendarFormState = {
  date: '',
  description: '',
  fee: '0.00',
  id: '',
  name: '',
  ownerId: '',
  selectedDays: new Set<number>(),
  startTime: '',
  endTime: '',
  type: 'WORKOUT',
  videoUrl: '',
  weeksToRepeat: 0,
}

export function useCalendarForm({
  day,
  closeModal,
  userId,
  eventId,
  eventType,
}: {
  day: Day
  closeModal: (e: React.SyntheticEvent) => void
  userId: string
  eventId?: string
  eventType?: EVENT_TYPE
}) {
  console.log({eventType})
  const updateWorkout = useUpdateWorkout(userId, eventId)
  const createWorkout = useCreateWorkout(userId)
  const createAppointment = useCreateAppointment(userId)
  const updateAppointment = useUpdateAppointment(userId, eventId)
  const createBootcamp = useCreateBootcamp(userId)
  const updateBootcamp = useUpdateBootcamp(userId, eventId)
  const deleteBootcamp = useDeleteBootcamp(userId)
  const deleteAppointment = useDeleteAppointment(userId)
  const deleteWorkout = useDeleteWorkout(userId)
  const {data: workout} = useGetWorkout(eventType, eventId)
  const {data: bootcamp} = useGetBootcamp(eventType, eventId)
  const {data: appointment} = useGetAppointment(eventType, eventId)
  const {data} = useUserFee({
    id: userId,
  })
  const userFee = data?.fee
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
    date: `${day.year}-${padZero(day.month + 1)}-${padZero(day.day)}`,
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
            updateWorkout.mutate({
              ...form,
              date: new Date(form.date),
            })
          } else {
            createWorkout.mutate({
              ...form,
              selectedDays: [...form.selectedDays],
            })
          }
          break

        case 'APPOINTMENT':
          const fee = Math.round(parseFloat(form.fee) * 100)
          const startTime = form.startTime
            ? combineDateAndTime(form.date, form.startTime)
            : null
          const endTime = form.endTime
            ? combineDateAndTime(form.date, form.endTime)
            : null

          if (form.id) {
            updateAppointment.mutate({
              ...form,
              date: new Date(form.date),
              fee,
              startTime,
              endTime,
            })
          } else {
            createAppointment.mutate({
              ...form,
              fee,
              startTime,
              endTime,
              selectedDays: [...form.selectedDays],
            })
          }
          break

        case 'BOOTCAMP':
          if (form.id) {
            updateBootcamp.mutate(form)
          } else {
            createBootcamp.mutate({
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
          deleteWorkout.mutate({
            deleted: true,
            ownerId: form.ownerId,
            id: form.id,
            date: new Date(form.date),
          })
          break

        case 'APPOINTMENT':
          deleteAppointment.mutate({
            deleted: true,
            ownerId: form.ownerId,
            id: form.id,
            date: new Date(form.date),
          })
          break

        case 'BOOTCAMP':
          deleteBootcamp.mutate({
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

  const handleStartTimeChange = useCallback((startTime: string) => {
    setForm(prev => {
      const newForm = {...prev, startTime}
      // Auto-set end time to 1 hour after start time if start time is set and end time is empty
      if (startTime && !prev.endTime) {
        const startDateTime = combineDateAndTime(prev.date, startTime)
        if (startDateTime) {
          const endDateTime = addHours(startDateTime, 1)
          newForm.endTime = extractTimeString(endDateTime)
        }
      }
      return newForm
    })
  }, [])

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
  }, [userFee, form.id, userId])

  // Effect to load existing event data
  useEffect(() => {
    const loadEventData = async () => {
      if (!eventId || !eventType) return

      try {
        let eventData
        switch (eventType) {
          case 'BOOTCAMP':
            eventData = bootcamp
            break
          case 'WORKOUT':
            eventData = workout
            break
          case 'APPOINTMENT':
            eventData = appointment
            break
        }

        if (eventData) {
          setForm({
            ...form,
            // date: String(eventData.date).split('T')[0],
            description: eventData.description || '',
            ...(eventType === 'APPOINTMENT' && {
              fee: ((eventData as any).fee / 100).toFixed(2),
              startTime: extractTimeString((eventData as any).startTime ? new Date((eventData as any).startTime) : null),
              endTime: extractTimeString((eventData as any).endTime ? new Date((eventData as any).endTime) : null),
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
  }, [workout, bootcamp, appointment])

  // Focus on name input when form opens
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return {
    error,
    form,
    handleDelete,
    handleStartTimeChange,
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

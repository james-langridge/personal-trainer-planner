'use client'

import {WORKOUT_STATUS} from '@prisma/client'
import {useState, useEffect, useRef} from 'react'

import {Workout} from '@/lib/calendar'
import {useUpdateWorkout} from '@/app/hooks/workouts'
import {Id, toast} from 'react-toastify'

export function useWorkoutStatus(workout: Workout) {
  const {mutate, status} = useUpdateWorkout(workout.ownerId, workout.id)
  const [workoutStatus, setWorkoutStatus] = useState(workout.status)
  const toastId = useRef<Id>(null)

  useEffect(() => {
    let toastMessage
    switch (status) {
      case 'pending':
        toastMessage =
          workoutStatus === WORKOUT_STATUS.NOT_STARTED
            ? 'Great work...'
            : 'Reverting...'
        toastId.current = toast(toastMessage, {type: 'info'})
        setWorkoutStatus(prev => {
          return prev === WORKOUT_STATUS.NOT_STARTED
            ? WORKOUT_STATUS.COMPLETED
            : WORKOUT_STATUS.NOT_STARTED
        })
        break
      case 'success':
        toastMessage =
          workoutStatus === WORKOUT_STATUS.NOT_STARTED
            ? "There's always next time."
            : 'Keep it up!'
        toastId.current = toast(toastMessage, {type: 'success'})
        break
      case 'error':
        toastId.current &&
          toast.update(toastId.current, {
            render: 'Something went wrong...',
            type: 'error',
          })
        setWorkoutStatus(prev => {
          return prev === WORKOUT_STATUS.NOT_STARTED
            ? WORKOUT_STATUS.COMPLETED
            : WORKOUT_STATUS.NOT_STARTED
        })
        break
    }
  }, [status])

  function toggleStatus() {
    mutate({
      ownerId: workout.ownerId,
      status: workoutStatus,
      id: workout.id,
      date: workout.date,
    })
  }

  return {status, workoutStatus, toggleStatus}
}

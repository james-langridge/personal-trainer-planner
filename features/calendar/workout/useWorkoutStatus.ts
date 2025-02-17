'use client'

import {WORKOUT_STATUS} from '@prisma/client'
import {useState, useEffect, useCallback} from 'react'

import {Workout} from '@/lib/calendar'
import {useUpdateWorkout} from '@/app/hooks/workouts'

export function useWorkoutStatus(workout: Workout) {
  const updateWorkout = useUpdateWorkout(workout.ownerId, workout.id)
  const [status, setStatus] = useState(workout.status)

  const updateStatus = useCallback(
    async (status: WORKOUT_STATUS) => {
      updateWorkout.mutate({
        ownerId: workout.ownerId,
        status: status,
        id: workout.id,
        date: workout.date,
      })
    },
    [updateWorkout, workout.id, workout.ownerId],
  )

  useEffect(() => {
    setStatus(workout.status)
  }, [workout.status])

  function toggleStatus() {
    try {
      if (status === WORKOUT_STATUS.NOT_STARTED) {
        void updateStatus(WORKOUT_STATUS.COMPLETED)
        setStatus(WORKOUT_STATUS.COMPLETED)
      } else {
        void updateStatus(WORKOUT_STATUS.NOT_STARTED)
        setStatus(WORKOUT_STATUS.NOT_STARTED)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return {status, toggleStatus}
}

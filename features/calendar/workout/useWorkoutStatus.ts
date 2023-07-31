import {WORKOUT_STATUS} from '@prisma/client'
import {useState, useEffect, useCallback} from 'react'

import {Workout} from '@/@types/apiResponseTypes'
import {useUpdateWorkoutMutation} from '@/redux/services/workouts'

export function useWorkoutStatus(workout: Workout) {
  const [status, setStatus] = useState(workout.status)
  const [updateWorkout] = useUpdateWorkoutMutation()

  const updateStatus = useCallback(
    async (status: WORKOUT_STATUS) => {
      await updateWorkout({
        ownerId: workout.ownerId,
        status: status,
        id: workout.id,
      }).unwrap()
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

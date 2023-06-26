import {WORKOUT_STATUS} from '@prisma/client'
import {useState, useEffect, useCallback} from 'react'

import {SerialisedWorkout} from '@/lib/workouts'
import {useUpdateWorkoutMutation} from '@/redux/apiSlice'

export function useWorkoutStatus(workout: SerialisedWorkout) {
  const [status, setStatus] = useState(workout.status)
  const [updateWorkout] = useUpdateWorkoutMutation()

  const updateStatus = useCallback(
    async (status: WORKOUT_STATUS) => {
      await updateWorkout({
        ownerId: workout.ownerId,
        status: status,
        workoutId: workout.id,
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

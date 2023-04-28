import {useState, useEffect, useCallback} from 'react'
import {updateWorkout} from '@/lib/api'
import {SerialisedWorkout} from '@/lib/workouts'
import {WORKOUT_STATUS} from '@prisma/client'

export function useWorkoutStatus(workout: SerialisedWorkout) {
  const [status, setStatus] = useState(workout.status)

  const updateStatus = useCallback(
    async (status: WORKOUT_STATUS) => {
      await updateWorkout({
        workoutId: workout.id,
        status: status,
      })
    },
    [workout.id],
  )

  useEffect(() => {
    setStatus(workout.status)
  }, [workout.status])

  function toggleStatus() {
    if (status === WORKOUT_STATUS.NOT_STARTED) {
      void updateStatus(WORKOUT_STATUS.COMPLETED)
      setStatus(WORKOUT_STATUS.COMPLETED)
    } else {
      void updateStatus(WORKOUT_STATUS.NOT_STARTED)
      setStatus(WORKOUT_STATUS.NOT_STARTED)
    }
  }

  return {status, toggleStatus}
}

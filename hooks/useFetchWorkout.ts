import {useCallback, useEffect, useState} from 'react'
import {fetchWorkout} from '@/lib/api'
import {WORKOUT_TYPE} from '@prisma/client'

type WorkoutData = {
  date: string
  description?: string
  name: string
  ownerId: string
  workoutId: string
  videoUrl?: string
  type: WORKOUT_TYPE
}

export const useFetchWorkout = (workoutId: string): WorkoutData | null => {
  const [workoutData, setWorkoutData] = useState<WorkoutData | null>(null)

  const fetchWorkoutData = useCallback(async () => {
    const workout = await fetchWorkout(workoutId)
    const date = new Date(workout.date)
    const isoString = date.toISOString()
    const dateString = isoString.substring(0, 10)

    const workoutFormData: WorkoutData = {
      date: dateString,
      description: workout.description ?? undefined,
      name: workout.name,
      ownerId: workout.ownerId,
      workoutId: workout.id,
      videoUrl: workout.videoUrl ?? undefined,
      type: workout.type,
    }

    setWorkoutData(workoutFormData)
  }, [workoutId])

  useEffect(() => {
    if (!workoutId) {
      return
    }

    void fetchWorkoutData()
  }, [fetchWorkoutData, workoutId])

  return workoutData
}

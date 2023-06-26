import {WORKOUT_TYPE} from '@prisma/client'
import {useCallback, useEffect, useState} from 'react'

import {useGetWorkoutQuery} from '@/redux/apiSlice'

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
  const {data: workout} = useGetWorkoutQuery(workoutId, {skip: !workoutId})

  const fetchWorkoutData = useCallback(async () => {
    if (!workout) {
      return
    }

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
  }, [workout])

  useEffect(() => {
    if (!workoutId) {
      return
    }

    void fetchWorkoutData()
  }, [fetchWorkoutData, workoutId])

  return workoutData
}

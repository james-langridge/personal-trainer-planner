'use client'

import {useCallback, useEffect, useState} from 'react'
import {SerialisedUser} from '@/lib/users'
import {
  SerialisedWorkout,
  SerialisedWorkoutKey,
  sortWorkouts,
} from '@/lib/workouts'
import {getUserWithWorkouts} from '@/lib/api'

export function useGetWorkoutsTableData(slug: string) {
  const [sortCol, setSortCol] = useState<SerialisedWorkoutKey>('date')
  const [workouts, setWorkouts] = useState<SerialisedWorkout[] | undefined>()
  const [user, setUser] = useState<SerialisedUser>()

  const getUserWorkouts = useCallback(async () => {
    const fetchedUser = await getUserWithWorkouts(slug)
    const sortedWorkouts = sortWorkouts(sortCol, fetchedUser.workouts)

    setUser(fetchedUser)
    setWorkouts(sortedWorkouts)
  }, [slug, sortCol])

  useEffect(() => {
    void getUserWorkouts()
  }, [])

  useEffect(() => {
    if (!workouts) {
      return
    }

    const sortedWorkouts = sortWorkouts(sortCol, [...workouts])

    setWorkouts(sortedWorkouts)
  }, [sortCol])

  return {workouts, user, setSortCol}
}

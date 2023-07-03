'use client'

import {useCallback, useEffect, useState} from 'react'

import {
  SerialisedUser,
  SerialisedWorkout,
  SerialisedWorkoutKey,
} from '@/@types/types'
import {sortWorkouts} from '@/lib/workouts'
import {useGetUserQuery} from '@/redux/apiSlice'

export function useGetWorkoutsTableData(slug: string) {
  const [sortCol, setSortCol] = useState<SerialisedWorkoutKey>('date')
  const [workouts, setWorkouts] = useState<SerialisedWorkout[] | undefined>()
  const [user, setUser] = useState<SerialisedUser>()
  const {data: fetchedUser} = useGetUserQuery(slug)

  const getUserWorkouts = useCallback(async () => {
    if (!fetchedUser) {
      return
    }

    const sortedWorkouts = sortWorkouts(sortCol, fetchedUser.workouts)

    setUser(fetchedUser)
    setWorkouts(sortedWorkouts)
  }, [fetchedUser, sortCol])

  useEffect(() => {
    void getUserWorkouts()
  }, [getUserWorkouts])

  useEffect(() => {
    if (!workouts) {
      return
    }

    const sortedWorkouts = sortWorkouts(sortCol, [...workouts])

    setWorkouts(sortedWorkouts)
  }, [sortCol])

  return {workouts, user, setSortCol}
}

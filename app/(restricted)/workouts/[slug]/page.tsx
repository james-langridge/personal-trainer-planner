'use client'
import {use} from 'react'

import {EventPage} from '@/components/EventPage'
import {useGetWorkoutQuery} from '@/redux/services/workouts'

export default function Workout(props: {params: Promise<{slug: string}>}) {
  const params = use(props.params)
  const {data} = useGetWorkoutQuery(params.slug)

  if (!data) {
    return null
  }

  return <EventPage event={data} />
}

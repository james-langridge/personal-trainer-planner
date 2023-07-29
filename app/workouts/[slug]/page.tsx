'use client'

import {EventPage} from '@/components/EventPage'
import {useGetWorkoutQuery} from '@/redux/apiSlice'

export default function Workout({params}: {params: {slug: string}}) {
  const {data} = useGetWorkoutQuery(params.slug)

  if (!data) {
    return null
  }

  return <EventPage event={data} />
}

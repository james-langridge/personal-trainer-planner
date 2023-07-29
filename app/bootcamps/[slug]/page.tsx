'use client'

import {EventPage} from '@/components/EventPage'
import {useGetBootcampQuery} from '@/redux/apiSlice'

export default function Bootcamp({params}: {params: {slug: string}}) {
  const {data} = useGetBootcampQuery(params.slug)

  if (!data) {
    return null
  }

  return <EventPage event={data} />
}

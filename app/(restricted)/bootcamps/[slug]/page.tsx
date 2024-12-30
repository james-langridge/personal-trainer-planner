'use client'
import {use} from 'react'

import {EventPage} from '@/components/EventPage'
import {useGetBootcampQuery} from '@/redux/services/bootcamps'

export default function Bootcamp(props: {params: Promise<{slug: string}>}) {
  const params = use(props.params)
  const {data} = useGetBootcampQuery(params.slug)

  if (!data) {
    return null
  }

  return <EventPage event={data} />
}

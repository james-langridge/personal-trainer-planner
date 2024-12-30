'use client'
import {use} from 'react'

import {EventPage} from '@/components/EventPage'
import {useGetAppointmentQuery} from '@/redux/services/appointments'

export default function Appointment(props: {params: Promise<{slug: string}>}) {
  const params = use(props.params)
  const {data} = useGetAppointmentQuery(params.slug)

  if (!data) {
    return null
  }

  return <EventPage event={data} />
}

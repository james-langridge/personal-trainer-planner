'use client'

import {EventPage} from '@/components/EventPage'
import {useGetAppointmentQuery} from '@/redux/services/appointments'

export default function Appointment({params}: {params: {slug: string}}) {
  const {data} = useGetAppointmentQuery(params.slug)

  if (!data) {
    return null
  }

  return <EventPage event={data} />
}

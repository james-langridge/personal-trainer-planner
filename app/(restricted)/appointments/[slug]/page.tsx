import {EventPage} from '@/components/EventPage'
import {getAppointment} from '@/app/actions/appointments'

type Params = Promise<{id: string}>

export default async function Appointment({params}: {params: Params}) {
  const {id} = await params
  const appointment = await getAppointment(id)

  if (!appointment) {
    return null
  }

  return <EventPage event={appointment} />
}

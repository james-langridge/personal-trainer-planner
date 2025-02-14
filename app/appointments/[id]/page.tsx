import {EventPage} from '@/components/EventPage'
import {db} from '@/lib/db'

export const dynamic = 'force-static'

type Params = Promise<{id: string}>

export default async function Appointment({params}: {params: Params}) {
  const {id} = await params
  const appointment = await getAppointment(id)

  if (!appointment) {
    return null
  }

  return <EventPage event={appointment} />
}

async function getAppointment(id: string) {
  return db.appointment.findUnique({
    where: {id},
  })
}

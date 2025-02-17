import {EventPage} from '@/components/EventPage'
import {db} from '@/lib/db'

type Params = Promise<{id: string}>

export default async function Workout({params}: {params: Params}) {
  const {id} = await params
  const workout = await getWorkout(id)

  if (!workout) {
    return null
  }

  return <EventPage event={workout} />
}

async function getWorkout(id: string) {
  return db.workout.findUnique({
    where: {id},
  })
}

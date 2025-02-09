import {EventPage} from '@/components/EventPage'
import {getWorkout} from '@/app/actions/workouts'

type Params = Promise<{id: string}>

export default async function Workout({params}: {params: Params}) {
  const {id} = await params
  const workout = await getWorkout(id)

  if (!workout) {
    return null
  }

  return <EventPage event={workout} />
}

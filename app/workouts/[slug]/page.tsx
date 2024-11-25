import {Workout} from '@/@types/apiResponseTypes'
import {EventPage} from '@/components/EventPage'
import {db} from '@/lib/db'

const getWorkout = async (
  id: string,
): Promise<{
  workout: Workout | null
}> => {
  const workout = await db.workout.findUnique({
    where: {
      id: id,
    },
  })

  return {workout}
}

export default async function Workout({params}: {params: {slug: string}}) {
  console.log('foooooooooooooooo')
  const {workout} = await getWorkout(params.slug)
  console.log('bar***********************')

  console.log({workout})

  if (!workout) {
    return null
  }

  return <EventPage event={workout} />
}

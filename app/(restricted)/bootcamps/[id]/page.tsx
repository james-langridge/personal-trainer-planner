import {EventPage} from '@/components/EventPage'
import {db} from '@/lib/db'

type Params = Promise<{id: string}>

export default async function Bootcamp({params}: {params: Params}) {
  const {id} = await params
  const bootcamp = await getBootcamp(id)

  if (!bootcamp) {
    return null
  }

  return <EventPage event={bootcamp} />
}

async function getBootcamp(id: string) {
  return db.bootcamp.findUnique({
    select: {
      date: true,
      description: true,
      id: true,
      name: true,
      videoUrl: true,
    },
    where: {
      id: id,
    },
  })
}

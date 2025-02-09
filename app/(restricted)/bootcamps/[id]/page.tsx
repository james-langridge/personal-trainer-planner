import {EventPage} from '@/components/EventPage'
import {getBootcamp} from '@/app/actions/bootcamps'

type Params = Promise<{id: string}>

export default async function Bootcamp({params}: {params: Params}) {
  const {id} = await params
  const bootcamp = await getBootcamp(id)

  if (!bootcamp) {
    return null
  }

  return <EventPage event={bootcamp} />
}

import {getUserFromCookie} from '@/lib/auth'
import {cookies} from 'next/headers'
import {db} from '@/lib/db'
import Calendar from '@/components/calendar/Calendar'

const getSessions = async () => {
  const user = await getUserFromCookie(cookies())

  const sessions = await db.session.findMany({
    where: {
      ownerId: user?.id,
      NOT: {
        deleted: true,
      },
    },
  })

  return {sessions}
}

export default async function TrainingStudio() {
  const {sessions} = await getSessions()

  return <Calendar sessions={sessions} />
}

import {getUserFromCookie} from '@/lib/auth'
import {cookies} from 'next/headers'
import {db} from '@/lib/db'
import Calendar from '@/components/calendar/Calendar'

const getSessions = async () => {
  const user = await getUserFromCookie(cookies())

  const sessions = await db.session.findMany({
    where: {
      ownerId: user?.id,
    },
  })

  return {sessions, user}
}

export default async function TrainingStudio() {
  const {sessions, user} = await getSessions()
  const username = `${user?.firstName || ''} ${user?.lastName || ''}`

  return <Calendar username={username} sessions={sessions} />
}

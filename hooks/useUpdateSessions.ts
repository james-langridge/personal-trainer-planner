import {useEffect, useState} from 'react'
import {getSessionsByUserId} from '@/lib/api'
import {SerialisedSession} from '@/app/(training-app)/training-studio/page'
import {Session} from '@prisma/client'

export function useUpdateSessions({
  userId,
  initialSessions,
}: {
  userId?: string
  initialSessions: SerialisedSession[]
}) {
  const [sessions, setSessions] = useState<SerialisedSession[] | Session[]>(
    initialSessions,
  )

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!userId) {
        return
      }

      const data = await getSessionsByUserId(userId)

      setSessions(data)
    }, 60000)

    return () => {
      clearInterval(interval)
    }
  }, [userId])

  return sessions
}

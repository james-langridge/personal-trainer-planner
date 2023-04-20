import {getSessionsByUserId} from '@/lib/api'
import {useCallback, useEffect, useState} from 'react'
import {Session} from '@prisma/client'

export function useUserSessions(userId: string | undefined = '') {
  const [sessions, setSessions] = useState<Session[]>()

  const fetchSessions = useCallback(async () => {
    const sessions = await getSessionsByUserId(userId)

    setSessions(sessions)
  }, [userId])

  useEffect(() => {
    if (userId) {
      void fetchSessions()
    }
  }, [fetchSessions, userId])

  return {sessions, fetchSessions}
}

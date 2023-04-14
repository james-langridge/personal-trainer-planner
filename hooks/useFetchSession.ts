import {useCallback, useEffect, useState} from 'react'
import {fetchSession} from '@/lib/api'
import {SESSION_TYPE} from '@prisma/client'

type SessionData = {
  date: string
  description?: string
  name: string
  ownerId: string
  sessionId: string
  videoUrl?: string
  sessionType: SESSION_TYPE
}

export const useFetchSession = (sessionId: string): SessionData | null => {
  const [sessionData, setSessionData] = useState<SessionData | null>(null)

  const fetchSessionData = useCallback(async () => {
    const session = await fetchSession(sessionId)
    const date = new Date(session.date)
    const isoString = date.toISOString()
    const dateString = isoString.substring(0, 10)

    const sessionFormData: SessionData = {
      date: dateString,
      description: session.description ?? undefined,
      name: session.name,
      ownerId: session.ownerId,
      sessionId: session.id,
      videoUrl: session.videoUrl ?? undefined,
      sessionType: session.sessionType,
    }

    setSessionData(sessionFormData)
  }, [sessionId])

  useEffect(() => {
    if (!sessionId) {
      return
    }

    void fetchSessionData()
  }, [fetchSessionData, sessionId])

  return sessionData
}

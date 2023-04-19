import React, {useEffect, useState} from 'react'
import {SESSION_TYPE} from '@prisma/client'
import {useFetchSession} from '@/hooks'

export type CalendarFormState = {
  date: string
  description?: string
  name: string
  ownerId: string
  sessionId: string
  videoUrl?: string
  sessionType: SESSION_TYPE
}

const initialState: CalendarFormState = {
  date: '',
  description: '',
  name: '',
  ownerId: '',
  sessionId: '',
  videoUrl: '',
  sessionType: SESSION_TYPE.TRAINING,
}

export const useCalendarForm = (
  userId: string,
  sessionId?: string,
): [
  CalendarFormState,
  React.Dispatch<React.SetStateAction<CalendarFormState>>,
  () => void,
] => {
  const [session, setSession] = useState<CalendarFormState>({
    ...initialState,
    ownerId: userId,
  })

  const sessionData = useFetchSession(sessionId ?? '')

  useEffect(() => {
    if (sessionData) {
      setSession(sessionData)
    }
  }, [sessionData])

  function resetForm() {
    setSession({
      ...initialState,
      ownerId: userId,
    })
  }

  return [session, setSession, resetForm]
}

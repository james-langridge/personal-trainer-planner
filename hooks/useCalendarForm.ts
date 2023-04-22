import React, {useEffect, useState} from 'react'
import {SESSION_TYPE} from '@prisma/client'
import {useFetchSession} from '@/hooks'
import {
  useSessionId,
  useSessionIdDispatch,
  useUser,
} from '@/app/(training-app)/training-planner/Providers'

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

export const useCalendarForm = (): [
  CalendarFormState,
  React.Dispatch<React.SetStateAction<CalendarFormState>>,
  () => void,
] => {
  const userState = useUser()
  const userId = userState?.user?.id ?? ''
  const {sessionId} = useSessionId()
  const dispatch = useSessionIdDispatch()
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
    dispatch({type: 'setSessionId', sessionId: ''})
  }

  return [session, setSession, resetForm]
}

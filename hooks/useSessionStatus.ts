import {useState, useEffect} from 'react'
import {SESSION_STATUS} from '.prisma/client'
import {SerialisedSession} from '@/app/(training-app)/training-studio/page'
import {Session} from '@prisma/client'
import {updateSession} from '@/lib/api'
import {useMutation, useQueryClient} from '@tanstack/react-query'

export function useSessionStatus(
  session: Session | SerialisedSession,
  userId?: string,
) {
  const [status, setStatus] = useState(session.status)
  const [isFirstRender, setIsFirstRender] = useState(true)
  const queryClient = useQueryClient()

  const updateMutation = useMutation({
    mutationFn: updateSession,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['users']})
      queryClient.invalidateQueries({queryKey: ['sessions', userId]})
    },
  })

  useEffect(() => {
    // Added this check to avoid making PUT reqs when the checkbox is checked on the first render
    if (isFirstRender) {
      setIsFirstRender(false)

      return
    }

    updateMutation.mutate({
      sessionId: session.id,
      status: status,
    })
  }, [status])

  function toggleStatus() {
    if (status === SESSION_STATUS.NOT_STARTED) {
      setStatus(SESSION_STATUS.COMPLETED)
    } else {
      setStatus(SESSION_STATUS.NOT_STARTED)
    }
  }

  return {status, toggleStatus}
}

import {Session} from '@prisma/client'
import Link from 'next/link'
import React from 'react'
import {SessionSerialisedDate} from '@/app/(training-app)/training-studio/page'
import {SESSION_STATUS} from '.prisma/client'
import {useSessionStatus} from '@/hooks'
import {classNames} from '@/lib/misc'

export function SessionItem({
  session,
  isAdmin,
  setSessionId,
}: {
  session: Session | SessionSerialisedDate
  isAdmin: boolean
  setSessionId?: React.Dispatch<React.SetStateAction<string>>
}) {
  const {status, toggleStatus} = useSessionStatus(session)
  const isTrainingSession = session.sessionType === 'TRAINING'

  function onClick(event: React.MouseEvent | React.KeyboardEvent) {
    event.stopPropagation()

    if (!isAdmin || !setSessionId) {
      return
    }

    const sessionId = (event.target as HTMLElement).id

    setSessionId(sessionId)
  }

  return (
    <div className="ml-2 mr-1 flex items-center gap-2 text-lg">
      {isTrainingSession && (
        <input
          type="checkbox"
          checked={status === SESSION_STATUS.COMPLETED}
          className="h-7 w-7 rounded"
          onChange={toggleStatus}
        />
      )}

      {isAdmin && (
        <div
          role="button"
          tabIndex={0}
          onKeyDown={onClick}
          onClick={onClick}
          className={classNames(
            'my-1 block w-full rounded text-xs font-bold text-white lg:text-base',
            isTrainingSession ? 'bg-emerald-400' : 'bg-blue-400',
          )}
          id={session?.id}
        >
          {session?.name}
        </div>
      )}

      {!isAdmin && (
        <Link
          href={`/session/${session?.id}`}
          className={classNames(
            'my-1 block w-full rounded text-xs font-bold text-white lg:text-base',
            isTrainingSession ? 'bg-emerald-400' : 'bg-blue-400',
          )}
        >
          {session?.name}
        </Link>
      )}
    </div>
  )
}

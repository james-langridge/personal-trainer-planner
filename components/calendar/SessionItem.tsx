import {Session} from '@prisma/client'
import Link from 'next/link'
import React from 'react'
import {SessionSerialisedDate} from '@/app/(training-app)/training-studio/page'
import {SESSION_STATUS} from '.prisma/client'
import {updateSession} from '@/lib/api'
import {useSessionStatus} from '@/lib/useSessionStatus'
import {classNames} from '@/lib/misc'

export default function SessionItem({
  session,
  isAdmin,
  setSessionId,
}: {
  session: Session | SessionSerialisedDate
  isAdmin: boolean
  setSessionId?: React.Dispatch<React.SetStateAction<string>>
}) {
  const {status, toggleStatus} = useSessionStatus(session, updateSession)
  const isAppointment = session.appointment

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
      {!isAppointment && (
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
            isAppointment ? 'bg-blue-400' : 'bg-emerald-400',
          )}
          id={session?.id}
        >
          {session?.name}
        </div>
      )}

      {!isAdmin && (
        <Link
          href={`/session/${session?.id}`}
          className="my-1 block w-full rounded bg-emerald-400 text-xs font-bold text-white lg:text-base"
        >
          {session?.name}
        </Link>
      )}
    </div>
  )
}

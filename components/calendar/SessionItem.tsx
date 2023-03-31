import {Session} from '@prisma/client'
import Link from 'next/link'
import React from 'react'

export default function SessionItem({
  session,
  isAdmin,
  setSessionId,
}: {
  session?: Session
  isAdmin: boolean
  setSessionId?: React.Dispatch<React.SetStateAction<string>>
}) {
  function onClick(event: React.MouseEvent | React.KeyboardEvent) {
    event.stopPropagation()

    if (!isAdmin || !setSessionId) {
      return
    }

    const sessionId = (event.target as HTMLElement).id

    setSessionId(sessionId)
  }

  return (
    <>
      {isAdmin && (
        <div
          role="button"
          tabIndex={0}
          onKeyDown={onClick}
          onClick={onClick}
          className="my-1 mr-2 rounded bg-emerald-400 font-bold text-white"
          id={session?.id}
        >
          {session?.name}
        </div>
      )}

      {!isAdmin && (
        <Link
          href={`/session/${session?.id}`}
          className="m-1 w-5/6 rounded bg-emerald-400 font-bold text-white"
        >
          {session?.name}
        </Link>
      )}
    </>
  )
}

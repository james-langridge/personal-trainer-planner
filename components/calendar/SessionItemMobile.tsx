import Link from 'next/link'
import {Session} from '@prisma/client'
import {updateSession} from '@/lib/api'
import {SessionSerialisedDate} from '@/app/(training-app)/training-studio/page'
import {SESSION_STATUS} from '.prisma/client'
import {classNames} from '@/lib/misc'
import {useState} from 'react'

export default function SessionItemMobile({
  session,
}: {
  session: Session | SessionSerialisedDate
}) {
  const [status, setStatus] = useState(session.status)

  async function onClick() {
    if (status === SESSION_STATUS.NOT_STARTED) {
      setStatus(SESSION_STATUS.COMPLETED)

      await updateSession({
        sessionId: session.id,
        status: SESSION_STATUS.COMPLETED,
      })
    }

    if (status === SESSION_STATUS.COMPLETED) {
      setStatus(SESSION_STATUS.NOT_STARTED)

      await updateSession({
        sessionId: session.id,
        status: SESSION_STATUS.NOT_STARTED,
      })
    }
  }

  return (
    <div className="flex items-center gap-2 text-lg">
      <input
        type="checkbox"
        checked={status === SESSION_STATUS.COMPLETED}
        className="h-7 w-7 rounded"
        onClick={onClick}
      />
      <Link
        href={`/session/${session?.id}`}
        className={classNames(
          'my-1 block',
          status === SESSION_STATUS.COMPLETED ? 'line-through' : '',
        )}
      >
        {session?.name}
      </Link>
    </div>
  )
}

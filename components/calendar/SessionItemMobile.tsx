import Link from 'next/link'
import {Session} from '@prisma/client'
import {updateSession} from '@/lib/api'
import {SessionSerialisedDate} from '@/app/(training-app)/training-studio/page'
import {SESSION_STATUS} from '.prisma/client'
import {classNames} from '@/lib/misc'
import {useSessionStatus} from '@/lib/useSessionStatus'

export default function SessionItemMobile({
  session,
}: {
  session: Session | SessionSerialisedDate
}) {
  const {status, toggleStatus} = useSessionStatus(session, updateSession)

  return (
    <div className="flex items-center gap-2 text-lg">
      <input
        type="checkbox"
        checked={status === SESSION_STATUS.COMPLETED}
        className="h-7 w-7 rounded"
        onClick={toggleStatus}
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

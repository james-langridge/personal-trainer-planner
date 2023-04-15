import Link from 'next/link'
import {Session} from '@prisma/client'
import {SerialisedSession} from '@/app/(training-app)/training-studio/page'
import {SESSION_STATUS} from '.prisma/client'
import {classNames} from '@/lib/misc'
import {useSessionStatus} from '@/hooks'

export function SessionItemMobile({
  session,
}: {
  session: Session | SerialisedSession
}) {
  const {status, toggleStatus} = useSessionStatus(session)

  return (
    <div className="flex items-center gap-2 text-lg">
      <input
        type="checkbox"
        checked={status === SESSION_STATUS.COMPLETED}
        className="h-7 w-7 rounded"
        onChange={toggleStatus}
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
